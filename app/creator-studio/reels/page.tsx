"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./reels-studio.css";

type MediaItem = { id: string; file: File; url: string; kind: "Vídeo" | "Foto"; duration: string };

const modelCards = [
  { title: "Cinemático", detail: "Ritmo e atmosfera", tone: "cinema" },
  { title: "Lifestyle", detail: "Momentos do dia", tone: "life" },
  { title: "Minimal", detail: "Visual limpo", tone: "minimal" },
  { title: "Neon", detail: "Energia e cor", tone: "neon" },
];

export default function NexoraReelsCreationPage() {
  const [tab, setTab] = useState<"Tudo" | "Vídeos" | "Fotos" | "Favoritos">("Tudo");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [activeModel, setActiveModel] = useState("");
  const [cameraHelp, setCameraHelp] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const visibleItems = useMemo(() => items.filter(item => {
    if (tab === "Vídeos") return item.kind === "Vídeo";
    if (tab === "Fotos") return item.kind === "Foto";
    return true;
  }), [items, tab]);

  useEffect(() => () => items.forEach(item => URL.revokeObjectURL(item.url)), [items]);

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const incoming = Array.from(fileList).filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (!incoming.length) { setNotice("Escolha fotos ou vídeos compatíveis."); return; }
    const next = incoming.map(file => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? "Vídeo" as const : "Foto" as const,
      duration: file.type.startsWith("video/") ? "Vídeo" : "Imagem",
    }));
    setItems(current => [...current, ...next]);
    setSelected(current => [...current, ...next.map(item => item.id)]);
    setNotice(next.length === 1 ? "1 mídia adicionada à seleção." : next.length + " mídias adicionadas à seleção.");
  }

  function toggleItem(id: string) {
    setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  }

  function continueToAssembly() {
    if (!selected.length) {
      setNotice("Selecione pelo menos uma foto ou vídeo para continuar.");
      return;
    }
    const selectedItems = items.filter(item => selected.includes(item.id));
    try {
      sessionStorage.setItem("nexora-reels-selected-media", JSON.stringify(selectedItems.map(item => ({
        name: item.file.name, type: item.file.type, size: item.file.size,
      }))));
    } catch {}
    setNotice("Seleção preparada. A próxima etapa será a montagem da história.");
  }

  return (
    <main className="nrx-page">
      <header className="nrx-header">
        <a className="nrx-brand" href="/creator-studio" aria-label="Voltar ao Creator Studio">
          <span className="nrx-brand-mark">N</span>
          <span><b>NEXORA</b><small>REELS STUDIO</small></span>
        </a>
        <button className="nrx-settings" type="button" aria-label="Configurações" onClick={() => setNotice("As configurações do estúdio serão disponibilizadas em uma etapa posterior.")}>⚙</button>
      </header>

      <section className="nrx-intro">
        <span className="nrx-eyebrow">SEU PRÓXIMO REELS COMEÇA AQUI</span>
        <h1>Vamos criar<br/><span>algo incrível.</span></h1>
        <p>Escolha seus momentos. A história começa com você.</p>
      </section>

      <section className="nrx-source-grid" aria-label="Adicionar mídia">
        <button className="nrx-source-card nrx-camera" type="button" onClick={() => cameraRef.current?.click()}>
          <span className="nrx-source-icon">◎</span>
          <b>Câmera</b>
          <small>Capture um novo momento</small>
          <span className="nrx-card-arrow">↗</span>
        </button>
        <button className="nrx-source-card nrx-gallery" type="button" onClick={() => galleryRef.current?.click()}>
          <span className="nrx-source-icon">▧</span>
          <b>Galeria</b>
          <small>Escolha fotos e vídeos</small>
          <span className="nrx-card-arrow">↗</span>
        </button>
        <input ref={cameraRef} className="nrx-hidden" type="file" accept="image/*,video/*" capture="environment" onChange={event => { addFiles(event.target.files); event.currentTarget.value = ""; }}/>
        <input ref={galleryRef} className="nrx-hidden" type="file" accept="image/*,video/*" multiple onChange={event => { addFiles(event.target.files); event.currentTarget.value = ""; }}/>
      </section>

      <section className="nrx-library">
        <div className="nrx-library-heading">
          <div><span className="nrx-eyebrow">BIBLIOTECA DE MÍDIAS</span><h2>Suas criações</h2></div>
          <span className="nrx-count">{items.length} {items.length === 1 ? "arquivo" : "arquivos"}</span>
        </div>
        <div className="nrx-tabs" role="tablist" aria-label="Filtrar mídias">
          {(["Tudo", "Vídeos", "Fotos", "Favoritos"] as const).map(value => <button type="button" role="tab" aria-selected={tab === value} className={tab === value ? "active" : ""} key={value} onClick={() => setTab(value)}>{value}</button>)}
        </div>

        {visibleItems.length ? <div className="nrx-media-grid">
          {visibleItems.map((item, index) => {
            const isSelected = selected.includes(item.id);
            return <button type="button" key={item.id} className={"nrx-media-tile" + (isSelected ? " selected" : "")} onClick={() => toggleItem(item.id)} aria-pressed={isSelected} aria-label={(isSelected ? "Desmarcar " : "Selecionar ") + item.file.name}>
              {item.kind === "Vídeo" ? <video src={item.url} muted playsInline preload="metadata"/> : <img src={item.url} alt={item.file.name}/>}
              <span className="nrx-media-kind">{item.kind === "Vídeo" ? "▶" : "▧"}</span>
              <span className="nrx-select-mark">{isSelected ? "✓" : ""}</span>
              <span className="nrx-media-name">{item.file.name}</span>
              {item.kind === "Vídeo" && <span className="nrx-media-duration">VÍDEO</span>}
              <span className="nrx-order">{isSelected ? selected.indexOf(item.id) + 1 : index + 1}</span>
            </button>;
          })}
        </div> : <div className="nrx-empty-library">
          <span className="nrx-empty-icon">▧</span>
          <b>{tab === "Favoritos" ? "Seus favoritos aparecerão aqui" : "Sua galeria está pronta"}</b>
          <p>{tab === "Favoritos" ? "Marque mídias como favoritas para encontrá-las rapidamente." : "Adicione fotos e vídeos pela câmera ou galeria para começar a montar seu Reels."}</p>
          <button type="button" onClick={() => galleryRef.current?.click()}>Escolher mídias <span>↗</span></button>
        </div>}
      </section>

      <section className="nrx-selected">
        <div className="nrx-selected-head"><div><span className="nrx-eyebrow">SUA SEQUÊNCIA</span><h2>Selecionados <span>{selected.length}</span></h2></div><button type="button" onClick={() => setSelected([])} disabled={!selected.length}>Limpar</button></div>
        <div className="nrx-selected-strip">
          {items.filter(item => selected.includes(item.id)).map(item => <button type="button" className="nrx-selected-thumb" key={item.id} onClick={() => toggleItem(item.id)} title={"Remover " + item.file.name}>
            {item.kind === "Vídeo" ? <video src={item.url} muted playsInline/> : <img src={item.url} alt=""/>}<span>×</span>
          </button>)}
          {!selected.length && <span className="nrx-selection-placeholder">As mídias escolhidas aparecerão aqui.</span>}
          <button className="nrx-add-more" type="button" onClick={() => galleryRef.current?.click()} aria-label="Adicionar mais mídias">＋</button>
        </div>
        <div className="nrx-continue-row">
          <span>{selected.length ? selected.length + " item(ns) na sequência" : "Selecione mídias para continuar"}</span>
          <button type="button" onClick={continueToAssembly} disabled={!selected.length}>Continuar <span>→</span></button>
        </div>
      </section>

      <section className="nrx-models">
        <div className="nrx-models-heading"><div><span className="nrx-eyebrow">COMECE COM INSPIRAÇÃO</span><h2>Modelos</h2></div><button type="button" onClick={() => setNotice("A biblioteca completa de modelos será planejada em uma próxima etapa.")}>Explorar todos ↗</button></div>
        <div className="nrx-model-grid">
          {modelCards.map(model => <button type="button" key={model.title} className={"nrx-model-card " + model.tone + (activeModel === model.title ? " active" : "")} onClick={() => setActiveModel(model.title)}>
            <span className="nrx-model-art"><i/><i/><i/></span><b>{model.title}</b><small>{model.detail}</small>
          </button>)}
        </div>
      </section>
      {notice && <div className="nrx-notice" role="status"><span>✦</span>{notice}<button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso">×</button></div>}
      {cameraHelp && <span className="nrx-hidden">{String(cameraHelp)}</span>}
      <footer className="nrx-footer"><span>NEXORA</span><span>CRIATIVIDADE SEM LIMITES</span><a href="/creator-studio">Voltar ao Creator Studio</a></footer>
    </main>
  );
}
