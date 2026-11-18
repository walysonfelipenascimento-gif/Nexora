"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { renderReels, type ReelsMedia } from "./reels-engine";
import "./reels.css";

type Stage = "start" | "edit" | "timeline" | "tools" | "publish";
type Clip = ReelsMedia;
type FilterOption = { name: string; css: string };
const FILTERS: FilterOption[] = [
  { name: "Original", css: "none" },
  { name: "Glow", css: "brightness(1.12) saturate(1.25)" },
  { name: "Neon", css: "saturate(1.55) hue-rotate(12deg) contrast(1.08)" },
  { name: "Vibes", css: "sepia(.2) saturate(1.3) hue-rotate(320deg)" },
  { name: "P&B", css: "grayscale(1)" },
];
const DB_NAME = "nexora-reels-studio";
const DB_STORE = "drafts";

function openDraftDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) { reject(new Error("O armazenamento local não está disponível.")); return; }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) request.result.createObjectStore(DB_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Não foi possível abrir os rascunhos."));
  });
}

async function persistDraft(value: unknown): Promise<void> {
  const db = await openDraftDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(DB_STORE, "readwrite");
    transaction.objectStore(DB_STORE).put(value, "current");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Falha ao salvar o rascunho."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Salvamento cancelado."));
  });
  db.close();
}

async function readDraft(): Promise<any> {
  const db = await openDraftDb();
  const value = await new Promise<unknown>((resolve, reject) => {
    const request = db.transaction(DB_STORE, "readonly").objectStore(DB_STORE).get("current");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return value;
}

export default function CreateReelsPage() {
  const [stage, setStage] = useState<Stage>("start");
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [caption, setCaption] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [sticker, setSticker] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [filter, setFilter] = useState<FilterOption>(FILTERS[0]);
  const [speed, setSpeed] = useState(1);
  const [originalVolume, setOriginalVolume] = useState(1);
  const [soundtrackVolume, setSoundtrackVolume] = useState(.8);
  const [soundtrack, setSoundtrack] = useState<File | null>(null);
  const [soundtrackUrl, setSoundtrackUrl] = useState("");
  const [overlayFile, setOverlayFile] = useState<File | null>(null);
  const [overlayUrl, setOverlayUrl] = useState("");
  const [transition, setTransition] = useState<"cut" | "fade">("cut");
  const [audience, setAudience] = useState("Todos");
  const [comments, setComments] = useState(true);
  const [shareStory, setShareStory] = useState(true);
  const [coverId, setCoverId] = useState("");
  const [playhead, setPlayhead] = useState(0);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState("");
  const [exportedName, setExportedName] = useState("");
  const [exportedFingerprint, setExportedFingerprint] = useState("");
  const [restored, setRestored] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const urlsRef = useRef(new Set<string>());

  const selected = clips.find((clip) => clip.id === selectedId) ?? clips[0] ?? null;
  const totalDuration = useMemo(() => clips.reduce((sum, clip) => sum + (clip.kind === "image" ? clip.duration : Math.max(0, (clip.end || clip.duration) - clip.start) / speed), 0), [clips, speed]);
  const selectedStyle = useMemo(() => ({ filter: filter.css, objectFit: "cover" as const }), [filter]);
  const projectFingerprint = JSON.stringify({ clips: clips.map((clip) => [clip.id, clip.start, clip.end, clip.duration]), caption, overlayText, sticker, subtitle, filter: filter.name, speed, originalVolume, soundtrackVolume, soundtrack: soundtrack ? [soundtrack.name, soundtrack.size, soundtrack.lastModified] : null, overlay: overlayFile ? [overlayFile.name, overlayFile.size, overlayFile.lastModified] : null, transition });

  const makeUrl = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    urlsRef.current.add(url);
    return url;
  }, []);

  useEffect(() => {
    let alive = true;
    readDraft().then((draft) => {
      if (!alive || !draft || !Array.isArray(draft.clips)) return;
      const restoredClips: Clip[] = draft.clips.map((item: any) => ({ ...item, url: makeUrl(item.file) }));
      setClips(restoredClips);
      setSelectedId(draft.selectedId || restoredClips[0]?.id || "");
      setCaption(draft.caption || "");
      setOverlayText(draft.overlayText || "");
      setSticker(draft.sticker || "");
      setSubtitle(draft.subtitle || "");
      setFilter(FILTERS.find((item) => item.name === draft.filter) || FILTERS[0]);
      setSpeed(draft.speed || 1);
      setOriginalVolume(draft.originalVolume ?? 1);
      setSoundtrackVolume(draft.soundtrackVolume ?? .8);
      setSoundtrack(draft.soundtrack || null);
      setSoundtrackUrl(draft.soundtrack ? makeUrl(draft.soundtrack) : "");
      setOverlayFile(draft.overlayFile || null);
      setOverlayUrl(draft.overlayFile ? makeUrl(draft.overlayFile) : "");
      setTransition(draft.transition || "cut");
      setAudience(draft.audience || "Todos");
      setComments(draft.comments ?? true);
      setShareStory(draft.shareStory ?? true);
      setCoverId(draft.coverId || restoredClips[0]?.id || "");
      if (restoredClips.length) { setStage("edit"); setNotice("Rascunho anterior recuperado deste dispositivo."); }
    }).catch(() => {
      if (alive) setNotice("Não foi possível recuperar um rascunho anterior.");
    }).finally(() => { if (alive) setRestored(true); });
    return () => { alive = false; };
  }, [makeUrl]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    videoRef.current.volume = originalVolume;
  }, [speed, originalVolume, selectedId]);

  useEffect(() => () => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current.clear();
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const accepted = Array.from(files).filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (!accepted.length) { setNotice("Escolha arquivos de imagem ou vídeo compatíveis."); return; }
    const added = accepted.map((file) => {
      const kind = file.type.startsWith("video/") ? "video" as const : "image" as const;
      return { id: crypto.randomUUID(), file, url: makeUrl(file), kind, start: 0, end: 0, duration: kind === "image" ? 3 : 0 };
    });
    added.filter((clip) => clip.kind === "video").forEach((clip) => {
      const probe = document.createElement("video");
      probe.preload = "metadata";
      probe.onloadedmetadata = () => {
        const duration = Number.isFinite(probe.duration) ? probe.duration : 0;
        setClips((current) => current.map((item) => item.id === clip.id ? { ...item, duration, end: duration } : item));
        probe.removeAttribute("src");
        probe.load();
      };
      probe.onerror = () => {
        setNotice("Um dos vídeos não pôde ser lido. Tente outro arquivo de vídeo.");
        probe.removeAttribute("src");
        probe.load();
      };
      probe.src = clip.url;
    });
    setClips((current) => [...current, ...added]);
    setSelectedId(added[0].id);
    setCoverId((current) => current || added[0].id);
    setStage("edit");
    setNotice(accepted.length + " mídia(s) adicionada(s) ao projeto.");
  };

  const updateSelected = (patch: Partial<Clip>) => {
    if (!selected) return;
    setClips((current) => current.map((clip) => clip.id === selected.id ? { ...clip, ...patch } : clip));
  };

  const moveSelected = (direction: -1 | 1) => {
    if (!selected) return;
    const index = clips.findIndex((clip) => clip.id === selected.id);
    const target = index + direction;
    if (target < 0 || target >= clips.length) return;
    const next = [...clips];
    [next[index], next[target]] = [next[target], next[index]];
    setClips(next);
  };

  const removeSelected = () => {
    if (!selected) return;
    const next = clips.filter((clip) => clip.id !== selected.id);
    setClips(next);
    setSelectedId(next[0]?.id || "");
    if (coverId === selected.id) setCoverId(next[0]?.id || "");
    setNotice("Mídia removida da sequência.");
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const copy = { ...selected, id: crypto.randomUUID(), url: makeUrl(selected.file) };
    const index = clips.findIndex((clip) => clip.id === selected.id);
    setClips((current) => [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]);
    setSelectedId(copy.id);
    setNotice("Clipe duplicado.");
  };

  const splitSelected = () => {
    if (!selected || selected.kind !== "video") { setNotice("A divisão está disponível para vídeos."); return; }
    const end = selected.end || selected.duration;
    const point = playhead;
    if (point <= selected.start + .15 || point >= end - .15) {
      setNotice("Posicione o cursor no interior do trecho para dividir.");
      return;
    }
    const left = { ...selected, id: crypto.randomUUID(), end: point };
    const right = { ...selected, id: crypto.randomUUID(), start: point };
    const index = clips.findIndex((clip) => clip.id === selected.id);
    setClips((current) => [...current.slice(0, index), left, right, ...current.slice(index + 1)]);
    setSelectedId(right.id);
    setNotice("Clipe dividido no ponto selecionado.");
  };

  const saveDraft = async () => {
    try {
      await persistDraft({
        clips: clips.map(({ id, file, kind, start, end, duration }) => ({ id, file, kind, start, end, duration })),
        selectedId, caption, overlayText, sticker, subtitle, filter: filter.name, speed,
        originalVolume, soundtrackVolume, soundtrack, overlayFile, transition,
        audience, comments, shareStory, coverId,
        updatedAt: new Date().toISOString(),
      });
      setNotice("Rascunho salvo com as mídias neste dispositivo.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar o rascunho.");
    }
  };

  const exportReady = clips.length > 0 && clips.every((clip) => clip.kind === "image" || clip.duration > 0);

  const exportVideo = async () => {
    if (!exportReady || busy) {
      if (!exportReady) setNotice("Aguarde a leitura da duração de todos os vídeos antes de exportar.");
      return;
    }
    setBusy(true);
    setProgress(0);
    setNotice("Preparando seu Reels. Não feche esta tela durante a exportação.");
    try {
      const result = await renderReels({
        clips, soundtrack, overlayImage: overlayFile, text: overlayText, sticker,
        subtitle, filter: filter.css, originalVolume, soundtrackVolume,
        speed, transition, onProgress: setProgress,
      });
      const url = URL.createObjectURL(result.blob);
      urlsRef.current.add(url);
      setExportedUrl(url);
      setExportedName("nexora-reels-" + new Date().toISOString().replace(/[:.]/g, "-") + "." + result.extension);
      setNotice("Exportação concluída. Seu arquivo está pronto para baixar.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível exportar neste navegador.");
    } finally {
      setBusy(false);
    }
  };

  const steps: { id: Stage; label: string }[] = [
    { id: "edit", label: "Editar" },
    { id: "timeline", label: "Linha do tempo" },
    { id: "tools", label: "Ferramentas" },
    { id: "publish", label: "Publicar" },
  ];

  const mediaPicker = <input ref={galleryRef} hidden type="file" accept="image/*,video/*" multiple onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} />;

  return (
    <main className="nr-app">
      <header className="nr-header">
        <Link className="nr-brand" href="/creator-studio"><span className="nr-mark">N</span><b>Nexora</b><i>REELS STUDIO</i></Link>
        <div className="nr-header-right"><span className="nr-save-state">● {restored ? "Projeto local" : "Carregando rascunho"}</span><Link href="/creator-studio">Sair do editor</Link></div>
      </header>

      {stage === "start" ? (
        <section className="nr-start">
          <div className="nr-start-copy">
            <span className="nr-eyebrow">NEXORA · CRIAÇÃO</span>
            <h1>Crie Reels que<br /><em>conectam.</em></h1>
            <p>Transforme seus momentos em histórias. Grave agora ou escolha vídeos e fotos da sua galeria.</p>
            <div className="nr-start-actions">
              <button className="nr-primary" disabled={!restored} onClick={() => cameraRef.current?.click()}>▣ <span>Gravar vídeo</span></button>
              <button className="nr-secondary" disabled={!restored} onClick={() => galleryRef.current?.click()}>▧ <span>Importar da galeria</span></button>
            </div>
            <div className="nr-start-tip"><span>✦</span> Combine vários vídeos e fotos em um único Reels.</div>
            <nav className="nr-bottom-nav" aria-label="Navegação Nexora">
              <Link href="/"><span>⌂</span>Início</Link><Link href="/creator-studio/reels" className="active"><span>▣</span>Reels</Link><Link href="/creator-studio"><span>＋</span>Criar</Link><Link href="/mensagens"><span>▤</span>Mensagens</Link><Link href="/perfil"><span>◉</span>Perfil</Link>
            </nav>
          </div>
          <div className="nr-start-art"><div className="nr-orbit nr-orbit-one" /><div className="nr-orbit nr-orbit-two" /><div className="nr-reel-symbol"><span>▶</span></div><div className="nr-art-caption"><b>Seu próximo<br />momento começa aqui.</b><small>9:16 · VÍDEO VERTICAL</small></div></div>
          <input ref={cameraRef} hidden type="file" accept="video/*" capture="environment" onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} />
          {mediaPicker}
        </section>
      ) : (
        <section className="nr-workspace">
          <div className="nr-workspace-heading">
            <div><span className="nr-eyebrow">NEXORA · REELS</span><h1>{stage === "publish" ? "Preparar publicação" : stage === "tools" ? "Ferramentas" : "Editar Reels"}</h1></div>
            <div className="nr-heading-actions"><div className="nr-stepper">{steps.map((step, index) => <button key={step.id} className={stage === step.id ? "active" : ""} onClick={() => setStage(step.id)}><span>{index + 1}</span>{step.label}</button>)}</div><button className="nr-export-top" onClick={() => setStage("publish")}>Exportar</button></div>
          </div>

          <div className="nr-editor-layout">
            <section className="nr-preview-column">
              <div className="nr-phone-preview">
                <div className="nr-phone-top"><span>9:41</span><span>● ◔ ▰</span></div>
                <div className="nr-preview-media">
                  {selected ? selected.kind === "video" ? <video ref={videoRef} key={selected.id} src={selected.url} controls playsInline style={selectedStyle} onLoadedMetadata={(event) => {
                    const duration = event.currentTarget.duration;
                    setClips((current) => current.map((clip) => clip.id === selected.id ? { ...clip, duration, end: clip.end || duration } : clip));
                    event.currentTarget.currentTime = selected.start;
                    event.currentTarget.playbackRate = speed;
                    event.currentTarget.volume = originalVolume;
                  }} onTimeUpdate={(event) => { setPlayhead(event.currentTarget.currentTime); if (selected.end && event.currentTarget.currentTime >= selected.end) event.currentTarget.pause(); }} /> : <img src={selected.url} alt={selected.file.name} style={selectedStyle} /> : <div className="nr-empty-preview"><span>＋</span><b>Prévia do seu Reels</b><small>Importe uma mídia para começar</small></div>}
                  {overlayUrl && <img className="nr-preview-overlay-image" src={overlayUrl} alt="Sobreposição" />}
                  {sticker && selected && <div className="nr-preview-sticker">{sticker}</div>}
                  {overlayText && selected && <div className="nr-overlay-text">{overlayText}</div>}
                  {subtitle && selected && <div className="nr-preview-subtitle">{subtitle}</div>}
                  <span className="nr-ratio">9:16</span>
                </div>
                <div className="nr-preview-footer"><b>@seu_perfil</b><span>{caption || "Seu próximo Reels na Nexora ✦"}</span></div>
                <div className="nr-phone-home" />
              </div>
              <div className="nr-preview-meta"><span>{clips.length} mídia(s)</span><span>{totalDuration.toFixed(1)}s de duração</span></div>
            </section>

            <section className="nr-edit-panel">
              {stage === "edit" && <>
                <div className="nr-panel-title"><div><h2>Editar Reels</h2><p>Adicione e organize as mídias do seu vídeo</p></div><button className="nr-add-media" onClick={() => galleryRef.current?.click()}>＋ Adicionar</button></div>
                <div className="nr-clip-list">
                  {clips.length ? clips.map((clip, index) => <button type="button" key={clip.id} className={"nr-clip " + (clip.id === selected?.id ? "selected" : "")} onClick={() => { setSelectedId(clip.id); setPlayhead(clip.start); }}><span className="nr-clip-thumb">{clip.kind === "image" ? <img src={clip.url} alt="" /> : <video src={clip.url} muted />}</span><span className="nr-clip-info"><b>{index + 1}. {clip.file.name}</b><small>{clip.kind === "video" ? "Vídeo" : "Imagem"} · {(clip.kind === "image" ? clip.duration : (clip.end || clip.duration) - clip.start).toFixed(1)}s</small></span><span className="nr-clip-check">{clip.id === selected?.id ? "✓" : "○"}</span></button>) : <div className="nr-empty-list">Nenhuma mídia adicionada ainda.</div>}
                </div>
                <div className="nr-action-grid">
                  <button disabled={!selected || (selected.kind === "video" && !selected.duration)} onClick={duplicateSelected}>▣<span>Duplicar</span></button>
                  <button disabled={!selected} onClick={removeSelected}>⌫<span>Excluir</span></button>
                  <button disabled={!selected || clips[0]?.id === selected.id} onClick={() => moveSelected(-1)}>←<span>Anterior</span></button>
                  <button disabled={!selected || clips[clips.length - 1]?.id === selected.id} onClick={() => moveSelected(1)}>→<span>Próximo</span></button>
                </div>
                <div className="nr-panel-bottom"><button className="nr-secondary" onClick={() => setStage("start")}>Adicionar mídias</button><button className="nr-primary" disabled={!clips.length} onClick={() => setStage("timeline")}>Continuar <span>→</span></button></div>
              </>}

              {stage === "timeline" && <>
                <div className="nr-panel-title"><div><h2>Linha do tempo</h2><p>Selecione o trecho, divida e ajuste a duração</p></div><button className="nr-add-media" onClick={() => galleryRef.current?.click()}>＋ Mídia</button></div>
                <div className="nr-timeline-track">{clips.map((clip, index) => <button type="button" key={clip.id} className={"nr-timeline-clip " + (clip.id === selected?.id ? "selected" : "")} onClick={() => { setSelectedId(clip.id); setPlayhead(clip.start); }}><span>{clip.kind === "image" ? <img src={clip.url} alt="" /> : <video src={clip.url} muted />}</span><b>{index + 1}</b></button>)}</div>
                <div className="nr-playhead-line"><span>◉ {playhead.toFixed(2)}s</span><input aria-label="Posição do cursor" type="range" min={selected?.start ?? 0} max={selected?.end || selected?.duration || 1} step=".05" value={Math.min(playhead, selected?.end || selected?.duration || 1)} onChange={(event) => { const value = Number(event.target.value); setPlayhead(value); if (videoRef.current) videoRef.current.currentTime = value; }} /></div>
                {selected?.kind === "video" ? <>
                  <div className="nr-range-row"><label htmlFor="nr-trim-start">Início do corte <b>{selected.start.toFixed(2)}s</b></label><input id="nr-trim-start" type="range" min="0" max={Math.max(0, selected.duration - .25)} step=".05" value={Math.min(selected.start, Math.max(0, selected.duration - .25))} onChange={(event) => { const start = Number(event.target.value); updateSelected({ start, end: Math.max(start + .2, selected.end || selected.duration) }); setPlayhead(start); if (videoRef.current) videoRef.current.currentTime = start; }} /></div>
                  <div className="nr-range-row"><label htmlFor="nr-trim-end">Fim do corte <b>{(selected.end || selected.duration).toFixed(2)}s</b></label><input id="nr-trim-end" type="range" min={Math.min(selected.start + .2, selected.duration)} max={selected.duration || 1} step=".05" value={Math.max(Math.min(selected.end || selected.duration, selected.duration || 1), Math.min(selected.start + .2, selected.duration))} onChange={(event) => updateSelected({ end: Number(event.target.value) })} /></div>
                </> : selected ? <div className="nr-range-row"><label htmlFor="nr-image-duration">Duração da imagem <b>{selected.duration.toFixed(1)}s</b></label><input id="nr-image-duration" type="range" min="1" max="10" step=".5" value={selected.duration} onChange={(event) => updateSelected({ duration: Number(event.target.value) })} /></div> : null}
                <div className="nr-action-grid"><button disabled={!selected || selected.kind !== "video" || !selected.duration} onClick={splitSelected}>✂<span>Dividir</span></button><button disabled={!selected} onClick={duplicateSelected}>▣<span>Duplicar</span></button><button disabled={!selected} onClick={() => moveSelected(-1)}>←<span>Mover</span></button><button disabled={!selected} onClick={removeSelected}>⌫<span>Excluir</span></button></div>
                <div className="nr-panel-bottom"><button className="nr-secondary" onClick={() => setStage("edit")}>Voltar</button><button className="nr-primary" onClick={() => setStage("tools")}>Ferramentas <span>→</span></button></div>
              </>}

              {stage === "tools" && <>
                <div className="nr-panel-title"><div><h2>Ferramentas</h2><p>Texto, áudio, filtros e acabamento</p></div></div>
                <div className="nr-tool-grid">
                  <button onClick={() => document.getElementById("nr-overlay")?.focus()}><strong className="nr-tool-blue">T</strong><span>Texto</span></button>
                  <button onClick={() => audioRef.current?.click()}><strong className="nr-tool-purple">♫</strong><span>Áudio</span></button>
                  <button onClick={() => setFilter(FILTERS[(FILTERS.findIndex((item) => item.name === filter.name) + 1) % FILTERS.length])}><strong className="nr-tool-blue">◉</strong><span>Filtros</span></button>
                  <button onClick={() => setSpeed((value) => value >= 2 ? .5 : Math.round((value + .25) * 100) / 100)}><strong className="nr-tool-purple">◴</strong><span>Velocidade</span></button>
                  <button onClick={() => document.getElementById("nr-subtitle")?.focus()}><strong className="nr-tool-blue">CC</strong><span>Legendas</span></button>
                  <button onClick={() => document.getElementById("nr-sticker")?.focus()}><strong className="nr-tool-purple">✦</strong><span>Figuras</span></button>
                  <button onClick={() => setTransition((value) => value === "cut" ? "fade" : "cut")}><strong className="nr-tool-purple">✂</strong><span>Transições</span></button>
                  <button onClick={() => overlayRef.current?.click()}><strong className="nr-tool-blue">▱</strong><span>Sobreposição</span></button>
                  <button onClick={() => setStage("timeline")}><strong className="nr-tool-purple">▤</strong><span>Ajustar</span></button>
                </div>
                <label className="nr-field-label" htmlFor="nr-overlay">Texto sobre o vídeo</label>
                <input id="nr-overlay" className="nr-text-input" value={overlayText} onChange={(event) => setOverlayText(event.target.value)} maxLength={180} placeholder="Escreva algo para aparecer no Reels..." />
                <label className="nr-field-label" htmlFor="nr-sticker">Figuras / adesivo</label>
                <input id="nr-sticker" className="nr-text-input" value={sticker} onChange={(event) => setSticker(event.target.value)} maxLength={12} placeholder="Ex.: ✨ ⭐ ❤️" />
                <label className="nr-field-label" htmlFor="nr-subtitle">Legendas / texto inferior</label>
                <textarea id="nr-subtitle" className="nr-text-input" rows={2} maxLength={240} value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Adicione uma legenda..." />
                <div className="nr-filter-row"><b>Efeitos em destaque</b><span>{filter.name}</span></div>
                <div className="nr-filter-swatches">{FILTERS.map((item) => <button type="button" key={item.name} className={filter.name === item.name ? "active" : ""} onClick={() => setFilter(item)}>{item.name}</button>)}</div>
                <div className="nr-range-row"><label htmlFor="nr-speed">Velocidade <b>{speed.toFixed(2).replace(".", ",")}x</b></label><input id="nr-speed" type="range" min=".5" max="2" step=".25" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></div>
                <div className="nr-range-row"><label htmlFor="nr-original-volume">Volume original <b>{Math.round(originalVolume * 100)}%</b></label><input id="nr-original-volume" type="range" min="0" max="1" step=".05" value={originalVolume} onChange={(event) => setOriginalVolume(Number(event.target.value))} /></div>
                <div className="nr-range-row"><label htmlFor="nr-music-volume">Volume da música <b>{Math.round(soundtrackVolume * 100)}%</b></label><input id="nr-music-volume" type="range" min="0" max="1" step=".05" value={soundtrackVolume} onChange={(event) => setSoundtrackVolume(Number(event.target.value))} /></div>
                {soundtrack && <div className="nr-audio-selected">♫ {soundtrack.name} <button onClick={() => { setSoundtrack(null); setSoundtrackUrl(""); }}>Remover</button><audio controls src={soundtrackUrl} /></div>}
                {overlayFile && <div className="nr-audio-selected">▧ Sobreposição: {overlayFile.name} <button onClick={() => { setOverlayFile(null); setOverlayUrl(""); }}>Remover</button></div>}
                <label className="nr-transition-select">Transição entre clipes<select value={transition} onChange={(event) => setTransition(event.target.value as "cut" | "fade")}><option value="cut">Corte direto</option><option value="fade">Desvanecer para preto</option></select></label>
                <input ref={audioRef} hidden type="file" accept="audio/*" onChange={(event) => { const file = event.target.files?.[0] || null; setSoundtrack(file); setSoundtrackUrl(file ? makeUrl(file) : ""); }} />
                <input ref={overlayRef} hidden type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0] || null; setOverlayFile(file); setOverlayUrl(file ? makeUrl(file) : ""); }} />
                <div className="nr-panel-bottom"><button className="nr-secondary" onClick={() => setStage("timeline")}>Voltar</button><button className="nr-primary" onClick={() => setStage("publish")}>Próximo <span>→</span></button></div>
              </>}

              {stage === "publish" && <>
                <div className="nr-panel-title"><div><h2>Publicar</h2><p>Escolha a capa e configure seu Reels</p></div></div>
                <label className="nr-field-label">Escolha uma capa</label>
                <div className="nr-cover-row">{clips.map((clip) => <button type="button" key={clip.id} className={coverId === clip.id ? "active" : ""} onClick={() => { setCoverId(clip.id); setSelectedId(clip.id); }}><span>{clip.kind === "image" ? <img src={clip.url} alt="" /> : <video src={clip.url} muted />}</span></button>)}</div>
                <label className="nr-field-label" htmlFor="nr-caption">Legenda</label>
                <textarea id="nr-caption" className="nr-caption-input" maxLength={2200} value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Adicione uma legenda..." />
                <div className="nr-character-count">{caption.length}/2200</div>
                <label className="nr-setting-row"><span><b>◉</b><span>Quem pode ver este Reels?</span></span><select value={audience} onChange={(event) => setAudience(event.target.value)}><option>Todos</option><option>Seguidores</option><option>Somente eu</option></select></label>
                <label className="nr-setting-row"><span><b>♡</b><span>Permitir comentários</span></span><input type="checkbox" checked={comments} onChange={(event) => setComments(event.target.checked)} /></label>
                <label className="nr-setting-row"><span><b>▣</b><span>Compartilhar nos Stories</span></span><input type="checkbox" checked={shareStory} onChange={(event) => setShareStory(event.target.checked)} /></label>
                <div className="nr-export-box"><div><b>Exportação do vídeo</b><span>Formato vertical 9:16 · {totalDuration.toFixed(1)}s</span></div><button className="nr-secondary" disabled={!exportReady || busy} onClick={exportVideo}>{busy ? "Exportando..." : "Exportar vídeo"}</button>{busy && <div className="nr-export-progress"><span style={{ width: progress + "%" }} /></div>}</div>{exportedUrl && exportedFingerprint === projectFingerprint && <a className="nr-download-export" href={exportedUrl} download={exportedName}>↓ Baixar vídeo exportado ({exportedName.endsWith(".mp4") ? "MP4" : "WebM"})</a>}
                <div className="nr-panel-bottom nr-publish-actions"><button className="nr-secondary" onClick={saveDraft}>Salvar rascunho</button><button className="nr-primary" disabled={!exportReady || busy} onClick={exportVideo}>Exportar Reels <span>→</span></button></div>
                <p className="nr-publish-disclaimer">A exportação gera um arquivo neste dispositivo. A publicação na conta e o compartilhamento com seguidores dependem da integração de servidor, ainda não ativada.</p>
              </>}
              {notice && <p className="nr-notice" role="status">{notice}</p>}
            </section>
          </div>
          {mediaPicker}
        </section>
      )}
    </main>
  );
}
