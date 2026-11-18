"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./reels-studio.css";

type Media = { id: string; file: File; url: string; kind: "Vídeo" | "Foto"; favorite: boolean };
const models = [
  { name: "Cinemático", subtitle: "Atmosfera e movimento", theme: "cinema" },
  { name: "Lifestyle", subtitle: "Momentos espontâneos", theme: "life" },
  { name: "Minimal", subtitle: "Visual essencial", theme: "minimal" },
  { name: "Neon", subtitle: "Cor e energia", theme: "neon" },
];

export default function NexoraReelsStartPage() {
  const [filter, setFilter] = useState<"Tudo" | "Vídeos" | "Fotos" | "Favoritos">("Tudo");
  const [media, setMedia] = useState<Media[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeModel, setActiveModel] = useState("");
  const [message, setMessage] = useState("");
  const galleryInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<Media[]>([]);

  useEffect(() => { mediaRef.current = media; }, [media]);
  useEffect(() => () => mediaRef.current.forEach(item => URL.revokeObjectURL(item.url)), []);

  const visible = useMemo(() => media.filter(item => {
    if (filter === "Vídeos") return item.kind === "Vídeo";
    if (filter === "Fotos") return item.kind === "Foto";
    if (filter === "Favoritos") return item.favorite;
    return true;
  }), [media, filter]);

  function importFiles(list: FileList | null) {
    if (!list?.length) return;
    const accepted = Array.from(list).filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (!accepted.length) { setMessage("Selecione arquivos de foto ou vídeo."); return; }
    const added = accepted.map(file => ({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random(),
      file,
      url: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? "Vídeo" as const : "Foto" as const,
      favorite: false,
    }));
    setMedia(current => [...current, ...added]);
    setSelected(current => [...current, ...added.map(item => item.id)]);
    setMessage(added.length === 1 ? "Mídia adicionada à sua sequência." : added.length + " mídias adicionadas à sua sequência.");
  }

  function toggleSelected(id: string) {
    setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  }

  function toggleFavorite(id: string) {
    setMedia(current => current.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item));
  }

  function continueCreation() {
    if (!selected.length) { setMessage("Escolha pelo menos uma foto ou vídeo para continuar."); return; }
    const ordered = media.filter(item => selected.includes(item.id));
    try {
      sessionStorage.setItem("nexora-reels-draft-selection", JSON.stringify(ordered.map((item, index) => ({
        id: item.id, name: item.file.name, type: item.file.type, size: item.file.size, order: index + 1,
      }))));
    } catch {}
    setMessage("Sua seleção está organizada. A próxima etapa será a montagem da história.");
  }

  return (
    <main className="nrs-page">
      <header className="nrs-header">
        <a href="/creator-studio" className="nrs-brand" aria-label="Voltar ao Creator Studio">
          <span className="nrs-mark">N</span><span><b>NEXORA</b><small>REELS STUDIO</small></span>
        </a>
        <button className="nrs-settings" type="button" aria-label="Configurações" onClick={() => setMessage("As configurações do estúdio serão apresentadas em uma próxima etapa.")}>⚙</button>
      </header>
      <section className="nrs-hero">
        <span className="nrs-kicker">NEXORA CREATOR EXPERIENCE</span>
        <h1>Vamos criar<br /><em>algo incrível.</em></h1>
        <p>Escolha seus momentos. A história começa com você.</p>
      </section>
      <section className="nrs-source" aria-label="Escolher origem da mídia">
        <button type="button" className="nrs-source-card camera" onClick={() => cameraInput.current?.click()}>
          <span className="nrs-source-symbol">◎</span><b>Câmera</b><small>Capture um novo momento</small><span className="nrs-source-arrow">↗</span>
        </button>
        <button type="button" className="nrs-source-card gallery" onClick={() => galleryInput.current?.click()}>
          <span className="nrs-source-symbol">▧</span><b>Galeria</b><small>Explore fotos e vídeos</small><span className="nrs-source-arrow">↗</span>
        </button>
        <input ref={cameraInput} className="nrs-hidden" type="file" accept="image/*,video/*" capture="environment" onChange={event => { importFiles(event.currentTarget.files); event.currentTarget.value = ""; }} />
        <input ref={galleryInput} className="nrs-hidden" type="file" accept="image/*,video/*" multiple onChange={event => { importFiles(event.currentTarget.files); event.currentTarget.value = ""; }} />
      </section>
      <section className="nrs-library">
        <div className="nrs-section-heading"><div><span className="nrs-kicker">SUA BIBLIOTECA</span><h2>Galeria de mídias</h2></div><span className="nrs-total">{media.length} {media.length === 1 ? "arquivo" : "arquivos"}</span></div>
        <div className="nrs-filters" role="tablist" aria-label="Categorias da galeria">
          {(["Tudo", "Vídeos", "Fotos", "Favoritos"] as const).map(item => <button key={item} type="button" role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        {visible.length ? <div className="nrs-grid">
          {visible.map((item, index) => {
            const chosen = selected.includes(item.id);
            return <button key={item.id} type="button" className={"nrs-media" + (chosen ? " chosen" : "")} onClick={() => toggleSelected(item.id)} aria-pressed={chosen} aria-label={(chosen ? "Desmarcar " : "Selecionar ") + item.file.name}>
              {item.kind === "Vídeo" ? <video src={item.url} muted playsInline preload="metadata" /> : <img src={item.url} alt={item.file.name} />}
              <span className="nrs-media-type">{item.kind === "Vídeo" ? "▶" : "▧"}</span>
              <span className="nrs-check">{chosen ? "✓" : ""}</span>
              <span className="nrs-index">{chosen ? selected.indexOf(item.id) + 1 : index + 1}</span>
              <span className="nrs-media-name">{item.file.name}</span>
              <span className={"nrs-fav" + (item.favorite ? " on" : "")} aria-label={item.favorite ? "Favorito" : "Não favorito"} onClick={event => { event.stopPropagation(); toggleFavorite(item.id); }}>★</span>
            </button>;
          })}
        </div> : <div className="nrs-empty">
          <span className="nrs-empty-symbol">▧</span>
          <b>{filter === "Favoritos" ? "Nenhum favorito por enquanto" : "Sua galeria está pronta"}</b>
          <p>{filter === "Favoritos" ? "Toque na estrela de uma mídia para guardá-la aqui." : "Adicione fotos e vídeos pela câmera ou galeria para começar seu Reels."}</p>
          <button type="button" onClick={() => galleryInput.current?.click()}>Escolher mídias <span>↗</span></button>
        </div>}
      </section>
      <section className="nrs-selected">
        <div className="nrs-selected-heading"><div><span className="nrs-kicker">ORGANIZE SUA HISTÓRIA</span><h2>Selecionados <i>{selected.length}</i></h2></div><button type="button" disabled={!selected.length} onClick={() => setSelected([])}>Limpar</button></div>
        <div className="nrs-selected-list">
          {media.filter(item => selected.includes(item.id)).map(item => <button key={item.id} type="button" className="nrs-thumb" title={"Remover " + item.file.name} onClick={() => toggleSelected(item.id)}>
            {item.kind === "Vídeo" ? <video src={item.url} muted playsInline /> : <img src={item.url} alt="" />}<span>×</span>
          </button>)}
          {!selected.length && <span className="nrs-placeholder">As mídias escolhidas aparecerão aqui.</span>}
          <button className="nrs-add" type="button" aria-label="Adicionar mais mídias" onClick={() => galleryInput.current?.click()}>＋</button>
        </div>
        <div className="nrs-continue"><span>{selected.length ? selected.length + " item(ns) na sequência" : "Selecione mídias para continuar"}</span><button type="button" disabled={!selected.length} onClick={continueCreation}>Continuar <b>→</b></button></div>
      </section>
      <section className="nrs-models">
        <div className="nrs-section-heading"><div><span className="nrs-kicker">UM PONTO DE PARTIDA</span><h2>Modelos</h2></div><button type="button" className="nrs-explore" onClick={() => setMessage("A biblioteca completa de modelos será adicionada ao estúdio.")}>Explorar todos ↗</button></div>
        <div className="nrs-model-grid">
          {models.map(model => <button key={model.name} type="button" className={"nrs-model " + model.theme + (activeModel === model.name ? " active" : "")} onClick={() => setActiveModel(model.name)}>
            <span className="nrs-model-art"><i /><i /><i /></span><b>{model.name}</b><small>{model.subtitle}</small>
          </button>)}
        </div>
      </section>
      {message && <div className="nrs-toast" role="status"><span>✦</span>{message}<button type="button" onClick={() => setMessage("")} aria-label="Fechar">×</button></div>}
      <footer className="nrs-footer"><b>NEXORA</b><span>CRIATIVIDADE SEM LIMITES</span><a href="/creator-studio">Voltar ao Creator Studio</a></footer>
    </main>
  );
}
