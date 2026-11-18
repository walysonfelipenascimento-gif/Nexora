"use client";

import { useMemo, useRef, useState } from "react";
import "./reels-studio.css";

type Media = { id: string; file: File; url: string; kind: "Vídeo" | "Foto"; favorite: boolean };
const sampleScenes = [
  "scene-a","scene-b","scene-c","scene-d","scene-e","scene-f","scene-g","scene-h",
  "scene-i","scene-j","scene-k","scene-l"
];
const models = [
  { name: "Cinemático", detail: "Luz e movimento", style: "cinema" },
  { name: "Lifestyle", detail: "Momentos naturais", style: "life" },
  { name: "Minimal", detail: "Visual clean", style: "minimal" },
  { name: "Neon", detail: "Energia e cor", style: "neon" },
];

export default function NexoraReelsStartPage() {
  const [filter, setFilter] = useState<"Tudo" | "Vídeos" | "Fotos" | "Favoritos">("Tudo");
  const [media, setMedia] = useState<Media[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeModel, setActiveModel] = useState("Cinemático");
  const [message, setMessage] = useState("");
  const galleryInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const visible = useMemo(() => media.filter(item => {
    if (filter === "Vídeos") return item.kind === "Vídeo";
    if (filter === "Fotos") return item.kind === "Foto";
    if (filter === "Favoritos") return item.favorite;
    return true;
  }), [media, filter]);

  function importFiles(list: FileList | null) {
    if (!list?.length) return;
    const added = Array.from(list).filter(file => file.type.startsWith("image/") || file.type.startsWith("video/")).map(file => ({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random(),
      file, url: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? "Vídeo" as const : "Foto" as const, favorite: false,
    }));
    if (!added.length) { setMessage("Escolha fotos ou vídeos para adicionar."); return; }
    setMedia(current => [...current, ...added]);
    setSelected(current => [...current, ...added.map(item => item.id)]);
    setMessage(added.length + (added.length === 1 ? " mídia adicionada." : " mídias adicionadas."));
  }
  function toggleSelected(id: string) {
    setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  }

  return (
    <main className="nrs-page">
      <div className="nrs-aurora" aria-hidden="true"><i/><i/><i/><i/></div>
      <header className="nrs-header">
        <a href="/creator-studio" className="nrs-brand" aria-label="Nexora Reels Studio">
          <span className="nrs-wordmark">NEXORA</span><span className="nrs-brand-sub">REELS STUDIO</span>
        </a>
        <button className="nrs-settings" type="button" aria-label="Configurações" onClick={() => setMessage("Configurações do Reels Studio")}>⚙</button>
      </header>

      <section className="nrs-hero">
        <h1>Vamos criar<br/>algo incrível</h1>
        <p>Escolha seus momentos e comece a criar.</p>
      </section>

      <section className="nrs-source" aria-label="Origem da mídia">
        <button type="button" className="nrs-source-card camera" onClick={() => cameraInput.current?.click()}>
          <span className="nrs-source-icon">◎</span><b>Câmera</b><small>Capture novos momentos</small><span className="nrs-source-ghost">◉</span>
        </button>
        <button type="button" className="nrs-source-card gallery" onClick={() => galleryInput.current?.click()}>
          <span className="nrs-source-icon">▧</span><b>Galeria</b><small>Escolha fotos e vídeos</small><span className="nrs-source-ghost">▧</span>
        </button>
        <input ref={cameraInput} className="nrs-hidden" type="file" accept="image/*,video/*" capture="environment" onChange={e => {importFiles(e.currentTarget.files);e.currentTarget.value="";}}/>
        <input ref={galleryInput} className="nrs-hidden" type="file" accept="image/*,video/*" multiple onChange={e => {importFiles(e.currentTarget.files);e.currentTarget.value="";}}/>
      </section>

      <section className="nrs-library">
        <div className="nrs-library-heading"><h2>Galeria</h2><span>{media.length ? media.length+" arquivos" : "Recentes"}</span></div>
        <nav className="nrs-filters" aria-label="Filtros da galeria">
          {(["Tudo","Vídeos","Fotos","Favoritos"] as const).map(item=><button key={item} type="button" className={filter===item?"active":""} onClick={()=>setFilter(item)}>{item}{item==="Vídeos"||item==="Fotos"?<i/>:null}</button>)}
        </nav>
        {visible.length ? <div className="nrs-grid">
          {visible.map((item,index)=>{const chosen=selected.includes(item.id);return <button key={item.id} type="button" className={"nrs-media "+(chosen?"chosen":"")} onClick={()=>toggleSelected(item.id)}>
            {item.kind==="Vídeo"?<video src={item.url} muted playsInline/>:<img src={item.url} alt={item.file.name}/>}
            <span className="nrs-media-check">{chosen?"✓":""}</span>{item.kind==="Vídeo"?<span className="nrs-video-mark">▶</span>:null}
            <span className="nrs-media-number">{chosen?selected.indexOf(item.id)+1:index+1}</span>
            <span className={"nrs-favorite "+(item.favorite?"on":"")} onClick={e=>{e.stopPropagation();setMedia(current=>current.map(m=>m.id===item.id?{...m,favorite:!m.favorite}:m));}}>★</span>
          </button>;})}
        </div> : <div className="nrs-preview-grid" aria-label="Prévia visual da galeria">
          {sampleScenes.map((scene,index)=><div key={scene} className={"nrs-sample "+scene} aria-label={"Miniatura de exemplo "+(index+1)}>
            <span className="sample-sun"/><span className="sample-horizon"/><span className="sample-person"/><span className="sample-glow"/>
            {index===0?<span className="sample-selected">✓</span>:null}
            {index===1||index===4||index===8?<span className="sample-play">▶</span>:null}
          </div>)}
        </div>}
      </section>

      <section className="nrs-selected">
        <div className="nrs-selected-head"><h2>Selecionados <span>{selected.length}</span></h2><button type="button" onClick={()=>setSelected([])} disabled={!selected.length}>Limpar</button></div>
        <div className="nrs-selected-strip">
          {media.filter(item=>selected.includes(item.id)).map(item=><button type="button" className="nrs-thumb" key={item.id} onClick={()=>toggleSelected(item.id)}>{item.kind==="Vídeo"?<video src={item.url} muted/>:<img src={item.url} alt=""/>}</button>)}
          {!selected.length?sampleScenes.slice(0,5).map((scene,index)=><div className={"nrs-thumb nrs-sample "+scene} key={scene}><span className="sample-sun"/><span className="sample-horizon"/><span className="sample-person"/>{index===0?<b>✓</b>:null}</div>):null}
          <button className="nrs-add" type="button" aria-label="Adicionar mídias" onClick={()=>galleryInput.current?.click()}>＋</button>
          <button className="nrs-continue" type="button" onClick={()=>selected.length?setMessage("Seleção pronta para a próxima etapa de edição."):galleryInput.current?.click()}>Continuar <span>→</span></button>
        </div>
      </section>

      <section className="nrs-models">
        <div className="nrs-models-head"><h2>Modelos</h2><button type="button" onClick={()=>setMessage("Biblioteca de modelos em preparação.")}>Ver todos ↗</button></div>
        <div className="nrs-model-grid">
          {models.map(model=><button type="button" key={model.name} className={"nrs-model "+model.style+(activeModel===model.name?" active":"")} onClick={()=>setActiveModel(model.name)}>
            <span className="nrs-model-art"><i/><i/><i/></span><b>{model.name}</b><small>{model.detail}</small>
          </button>)}
        </div>
      </section>
      {message?<div className="nrs-toast" role="status">{message}<button type="button" onClick={()=>setMessage("")}>×</button></div>:null}
      <footer className="nrs-footer"><span>NEXORA</span><small>REELS STUDIO</small><a href="/creator-studio">Voltar</a></footer>
    </main>
  );
}
