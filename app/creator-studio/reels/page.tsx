"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "./reels.css";

type Clip = { id: string; file: File; url: string; kind: "video" | "image" };

type Stage = "start" | "edit" | "tools" | "publish";

const filters = [
  { name: "Original", css: "none" },
  { name: "Glow", css: "brightness(1.12) saturate(1.25)" },
  { name: "Neon", css: "saturate(1.55) hue-rotate(12deg) contrast(1.08)" },
  { name: "Vibes", css: "sepia(.2) saturate(1.3) hue-rotate(320deg)" },
  { name: "P&B", css: "grayscale(1)" },
];

export default function CreateReelsPage() {
  const [stage, setStage] = useState<Stage>("start");
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [caption, setCaption] = useState("");
  const [overlay, setOverlay] = useState("");
  const [filter, setFilter] = useState(filters[0]);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(100);
  const [audio, setAudio] = useState<File | null>(null);
  const [coverIndex, setCoverIndex] = useState(0);
  const [audience, setAudience] = useState("Todos");
  const [comments, setComments] = useState(true);
  const [shareStory, setShareStory] = useState(true);
  const [notice, setNotice] = useState("");
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const urlsRef = useRef<string[]>([]);

  const selected = clips.find((clip) => clip.id === selectedId) ?? clips[0] ?? null;

  useEffect(() => () => urlsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const valid = Array.from(files).filter((file) => file.type.startsWith("video/") || file.type.startsWith("image/"));
    if (!valid.length) {
      setNotice("Escolha arquivos de vídeo ou imagem.");
      return;
    }
    const added = valid.map((file) => {
      const url = URL.createObjectURL(file);
      urlsRef.current.push(url);
      return { id: crypto.randomUUID(), file, url, kind: file.type.startsWith("video/") ? "video" as const : "image" as const };
    });
    setClips((current) => [...current, ...added]);
    setSelectedId(added[0].id);
    setNotice(added.length + " mídia(s) adicionada(s) ao projeto.");
    setStage("edit");
  };

  const updateClipOrder = (direction: -1 | 1) => {
    if (!selected) return;
    const index = clips.findIndex((clip) => clip.id === selected.id);
    const target = index + direction;
    if (target < 0 || target >= clips.length) return;
    const next = [...clips];
    [next[index], next[target]] = [next[target], next[index]];
    setClips(next);
  };

  const removeClip = () => {
    if (!selected) return;
    const next = clips.filter((clip) => clip.id !== selected.id);
    setClips(next);
    setSelectedId(next[0]?.id ?? "");
    setNotice("Mídia removida da sequência.");
  };

  const duplicateClip = () => {
    if (!selected) return;
    const url = URL.createObjectURL(selected.file);
    urlsRef.current.push(url);
    const copy = { ...selected, id: crypto.randomUUID(), url };
    const index = clips.findIndex((clip) => clip.id === selected.id);
    setClips((current) => [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]);
    setNotice("Clipe duplicado.");
  };

  const saveDraft = () => {
    const draft = {
      caption,
      audience,
      comments,
      shareStory,
      mediaNames: clips.map((clip) => clip.file.name),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("nexora-reels-draft", JSON.stringify(draft));
      setNotice("Rascunho salvo neste dispositivo. As mídias continuam nesta sessão.");
    } catch {
      setNotice("Não foi possível salvar o rascunho neste navegador.");
    }
  };

  const finishLocally = () => {
    saveDraft();
    setNotice("Seu Reels está preparado. A publicação na conta será conectada na etapa de integração.");
  };

  const steps = [
    { id: "edit" as const, label: "Editar" },
    { id: "tools" as const, label: "Ferramentas" },
    { id: "publish" as const, label: "Publicar" },
  ];

  const previewStyle = useMemo(() => ({ filter: filter.css, objectFit: "cover" as const }), [filter]);

  return (
    <main className="nr-app">
      <header className="nr-header">
        <Link className="nr-brand" href="/creator-studio"><span className="nr-mark">N</span><b>Nexora</b><i>REELS STUDIO</i></Link>
        <div className="nr-header-right"><span className="nr-save-state">● Projeto local</span><Link href="/creator-studio">Sair do editor</Link></div>
      </header>

      {stage === "start" ? (
        <section className="nr-start">
          <div className="nr-start-copy">
            <span className="nr-eyebrow">NEXORA · CRIAÇÃO</span>
            <h1>Crie Reels que<br /><em>conectam.</em></h1>
            <p>Transforme seus momentos em histórias. Grave agora ou escolha vídeos e fotos da sua galeria.</p>
            <div className="nr-start-actions">
              <button className="nr-primary" onClick={() => cameraRef.current?.click()}>▣ <span>Gravar vídeo</span></button>
              <button className="nr-secondary" onClick={() => galleryRef.current?.click()}>▧ <span>Importar da galeria</span></button>
            </div>
            <div className="nr-start-tip"><span>✦</span> Você pode combinar vários vídeos e fotos em um único Reels.</div>
          </div>
          <div className="nr-start-art">
            <div className="nr-orbit nr-orbit-one" /><div className="nr-orbit nr-orbit-two" />
            <div className="nr-reel-symbol"><span>▶</span></div>
            <div className="nr-art-caption"><b>Seu próximo<br />momento começa aqui.</b><small>9:16 · VÍDEO VERTICAL</small></div>
          </div>
          <input ref={galleryRef} hidden type="file" accept="image/*,video/*" multiple onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} />
          <input ref={cameraRef} hidden type="file" accept="video/*" capture="environment" onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} />
        </section>
      ) : (
        <section className="nr-workspace">
          <div className="nr-workspace-heading">
            <div><span className="nr-eyebrow">NEXORA · REELS</span><h1>{stage === "publish" ? "Preparar publicação" : "Editar Reels"}</h1></div>
            <div className="nr-stepper">{steps.map((step, index) => <button key={step.id} className={stage === step.id ? "active" : ""} onClick={() => setStage(step.id)}><span>{index + 1}</span>{step.label}</button>)}</div>
          </div>

          <div className="nr-editor-layout">
            <section className="nr-preview-column">
              <div className="nr-phone-preview">
                <div className="nr-phone-top"><span>9:41</span><span>● ◔ ▰</span></div>
                <div className="nr-preview-media">
                  {selected ? selected.kind === "video" ? <video ref={videoRef} key={selected.id} src={selected.url} controls playsInline style={previewStyle} onLoadedMetadata={(event) => { event.currentTarget.playbackRate = speed; event.currentTarget.volume = volume / 100; }} /> : <img src={selected.url} alt={selected.file.name} style={previewStyle} /> : <div className="nr-empty-preview"><span>＋</span><b>Prévia do seu Reels</b><small>Importe uma mídia para começar</small></div>}
                  {overlay && selected && <div className="nr-overlay-text">{overlay}</div>}
                  <span className="nr-ratio">9:16</span>
                </div>
                <div className="nr-preview-footer"><b>@seu_perfil</b><span>Seu próximo Reels na Nexora ✦</span></div>
                <div className="nr-phone-home" />
              </div>
              <div className="nr-preview-meta"><span>{clips.length} mídia(s) no projeto</span><span>Formato vertical 9:16</span></div>
            </section>

            <section className="nr-edit-panel">
              {stage === "edit" && <>
                <div className="nr-panel-title"><div><h2>Linha do tempo</h2><p>Selecione e organize seus clipes</p></div><button className="nr-add-media" onClick={() => galleryRef.current?.click()}>＋ Adicionar</button></div>
                <div className="nr-clip-list">
                  {clips.length ? clips.map((clip, index) => <button key={clip.id} className={"nr-clip " + (clip.id === selected?.id ? "selected" : "")} onClick={() => setSelectedId(clip.id)}><span className="nr-clip-thumb">{clip.kind === "image" ? <img src={clip.url} alt="" /> : <video src={clip.url} muted />}</span><span className="nr-clip-info"><b>{index + 1}. {clip.file.name}</b><small>{clip.kind === "video" ? "Vídeo" : "Imagem"}</small></span><span className="nr-clip-check">{clip.id === selected?.id ? "✓" : "○"}</span></button>) : <div className="nr-empty-list">Nenhuma mídia adicionada ainda.</div>}
                </div>
                <div className="nr-action-grid">
                  <button disabled={!selected} onClick={duplicateClip}>▣<span>Duplicar</span></button>
                  <button disabled={!selected} onClick={removeClip}>⌫<span>Excluir</span></button>
                  <button disabled={!selected || clips[0]?.id === selected.id} onClick={() => updateClipOrder(-1)}>←<span>Anterior</span></button>
                  <button disabled={!selected || clips[clips.length - 1]?.id === selected.id} onClick={() => updateClipOrder(1)}>→<span>Próximo</span></button>
                </div>
                <div className="nr-panel-bottom"><button className="nr-secondary" onClick={() => setStage("start")}>Adicionar mais mídias</button><button className="nr-primary" onClick={() => setStage("tools")}>Continuar <span>→</span></button></div>
              </>}

              {stage === "tools" && <>
                <div className="nr-panel-title"><div><h2>Ferramentas</h2><p>Personalize seu vídeo</p></div></div>
                <div className="nr-tool-grid">
                  <button onClick={() => document.getElementById("nr-overlay")?.focus()}><strong className="nr-tool-blue">T</strong><span>Texto</span></button>
                  <button onClick={() => audioRef.current?.click()}><strong className="nr-tool-purple">♫</strong><span>Áudio</span></button>
                  <button onClick={() => setFilter(filters[(filters.findIndex((item) => item.name === filter.name) + 1) % filters.length])}><strong className="nr-tool-blue">◉</strong><span>Filtros</span></button>
                  <button onClick={() => { const next = speed >= 2 ? 0.5 : speed + 0.25; setSpeed(next); if (videoRef.current) videoRef.current.playbackRate = next; }}><strong className="nr-tool-purple">◴</strong><span>Velocidade</span></button>
                  <button onClick={() => setNotice("Legendas automáticas serão adicionadas em uma etapa posterior.")}><strong className="nr-tool-blue">CC</strong><span>Legendas</span></button>
                  <button onClick={() => setNotice("Para cortar, selecione a mídia na linha do tempo e ajuste o trecho na próxima etapa.")}><strong className="nr-tool-purple">✂</strong><span>Cortar</span></button>
                  <button onClick={() => setNotice("Transições entre clipes serão configuradas em uma próxima etapa.")}><strong className="nr-tool-blue">▱</strong><span>Transições</span></button>
                  <button onClick={() => setNotice("Sobreposição de mídia será adicionada em uma próxima etapa.")}><strong className="nr-tool-purple">▱</strong><span>Sobreposição</span></button>
                </div>
                <label className="nr-field-label" htmlFor="nr-overlay">Texto sobre o vídeo</label>
                <input id="nr-overlay" className="nr-text-input" value={overlay} onChange={(event) => setOverlay(event.target.value)} placeholder="Escreva algo para aparecer no Reels..." />
                <div className="nr-filter-row"><b>Filtro atual</b><span>{filter.name}</span></div>
                <div className="nr-filter-swatches">{filters.map((item) => <button key={item.name} className={filter.name === item.name ? "active" : ""} onClick={() => setFilter(item)}>{item.name}</button>)}</div>
                <div className="nr-range-row"><label htmlFor="nr-speed">Velocidade <b>{speed.toFixed(2).replace(".", ",")}x</b></label><input id="nr-speed" type="range" min=".5" max="2" step=".25" value={speed} onChange={(event) => { const value = Number(event.target.value); setSpeed(value); if (videoRef.current) videoRef.current.playbackRate = value; }} /></div>
                <div className="nr-range-row"><label htmlFor="nr-volume">Volume <b>{volume}%</b></label><input id="nr-volume" type="range" min="0" max="100" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); if (videoRef.current) videoRef.current.volume = value / 100; }} /></div>
                {audio && <p className="nr-audio-selected">♫ Áudio selecionado: {audio.name}</p>}
                <input ref={audioRef} hidden type="file" accept="audio/*" onChange={(event) => setAudio(event.target.files?.[0] ?? null)} />
                <div className="nr-panel-bottom"><button className="nr-secondary" onClick={() => setStage("edit")}>Voltar</button><button className="nr-primary" onClick={() => setStage("publish")}>Próximo <span>→</span></button></div>
              </>}

              {stage === "publish" && <>
                <div className="nr-panel-title"><div><h2>Publicar</h2><p>Finalize os detalhes do seu Reels</p></div></div>
                <label className="nr-field-label">Escolha uma capa</label>
                <div className="nr-cover-row">{clips.map((clip, index) => <button key={clip.id} className={coverIndex === index ? "active" : ""} onClick={() => { setCoverIndex(index); setSelectedId(clip.id); }}><span>{clip.kind === "image" ? <img src={clip.url} alt="" /> : <video src={clip.url} muted />}</span></button>)}</div>
                <label className="nr-field-label" htmlFor="nr-caption">Legenda</label>
                <textarea id="nr-caption" className="nr-caption-input" maxLength={2200} value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Adicione uma legenda..." />
                <div className="nr-character-count">{caption.length}/2200</div>
                <label className="nr-setting-row"><span><b>◉</b><span>Quem pode ver este Reels?</span></span><select value={audience} onChange={(event) => setAudience(event.target.value)}><option>Todos</option><option>Seguidores</option><option>Somente eu</option></select></label>
                <label className="nr-setting-row"><span><b>♡</b><span>Permitir comentários</span></span><input type="checkbox" checked={comments} onChange={(event) => setComments(event.target.checked)} /></label>
                <label className="nr-setting-row"><span><b>▣</b><span>Compartilhar nos Stories</span></span><input type="checkbox" checked={shareStory} onChange={(event) => setShareStory(event.target.checked)} /></label>
                <div className="nr-panel-bottom nr-publish-actions"><button className="nr-secondary" onClick={saveDraft}>Salvar rascunho</button><button className="nr-primary" onClick={finishLocally}>Preparar publicação <span>→</span></button></div>
              </>}
              {notice && <p className="nr-notice" role="status">{notice}</p>}
            </section>
          </div>
          <input ref={galleryRef} hidden type="file" accept="image/*,video/*" multiple onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} />
        </section>
      )}
    </main>
  );
}
