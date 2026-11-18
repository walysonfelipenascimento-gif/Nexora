"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { captureNexoraPhoto, getNexoraCameraStream, getNexoraRecorderOptions } from "../../../lib/nexora/camera";
import "./reels-studio.css";

type Media = { id: string; file: File; url: string; kind: "Vídeo" | "Foto"; favorite: boolean };

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
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [recording, setRecording] = useState(false);
  const galleryInput = useRef<HTMLInputElement>(null);
  const cameraVideo = useRef<HTMLVideoElement>(null);
  const cameraStream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const mediaUrls = useRef<string[]>([]);

  const visible = useMemo(() => media.filter(item => {
    if (filter === "Vídeos") return item.kind === "Vídeo";
    if (filter === "Fotos") return item.kind === "Foto";
    if (filter === "Favoritos") return item.favorite;
    return true;
  }), [media, filter]);

  useEffect(() => {
    if (cameraOpen && cameraActive && cameraVideo.current && cameraStream.current) {
      cameraVideo.current.srcObject = cameraStream.current;
      void cameraVideo.current.play().catch(() => setCameraError("A câmera foi ativada, mas a prévia não iniciou. Tente novamente."));
    }
  }, [cameraOpen, cameraActive]);

  useEffect(() => () => {
    cameraStream.current?.getTracks().forEach(track => track.stop());
    mediaUrls.current.forEach(url => URL.revokeObjectURL(url));
  }, []);

  function importFiles(list: FileList | null) {
    if (!list?.length) return;
    const added = Array.from(list)
      .filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .map(file => {
        const url = URL.createObjectURL(file);
        mediaUrls.current.push(url);
        return {
          id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random(),
          file, url,
          kind: file.type.startsWith("video/") ? "Vídeo" as const : "Foto" as const,
          favorite: false,
        };
      });
    if (!added.length) { setMessage("Escolha fotos ou vídeos compatíveis."); return; }
    setMedia(current => [...current, ...added]);
    setSelected(current => [...current, ...added.map(item => item.id)]);
    setMessage(added.length + (added.length === 1 ? " mídia adicionada." : " mídias adicionadas."));
  }

  function toggleSelected(id: string) {
    setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  }

  async function startCamera(nextFacing = facingMode) {
    setCameraError("");
    try {
      let stream: MediaStream;
      try {
        stream = await getNexoraCameraStream({ facingMode: nextFacing, audio: true });
      } catch {
        stream = await getNexoraCameraStream({ facingMode: nextFacing, audio: false });
        setCameraError("Microfone indisponível: a câmera continuará funcionando sem áudio.");
      }
      cameraStream.current?.getTracks().forEach(track => track.stop());
      cameraStream.current = stream;
      setFacingMode(nextFacing);
      setCameraActive(true);
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setCameraError(name === "NotAllowedError"
        ? "A permissão da câmera foi negada. Autorize o acesso nas configurações do navegador."
        : name === "NotFoundError"
          ? "Nenhuma câmera foi encontrada neste dispositivo."
          : "Não foi possível iniciar a câmera. Verifique as permissões do navegador.");
    }
  }

  function stopCamera() {
    if (recorder.current?.state === "recording") recorder.current.stop();
    cameraStream.current?.getTracks().forEach(track => track.stop());
    cameraStream.current = null;
    if (cameraVideo.current) cameraVideo.current.srcObject = null;
    setCameraActive(false);
    setRecording(false);
  }

  async function capturePhoto() {
    if (!cameraVideo.current || !cameraStream.current) return;
    try {
      const blob = await captureNexoraPhoto(cameraVideo.current, cameraStream.current);
      const file = new File([blob], `nexora-reels-${Date.now()}.jpg`, { type: "image/jpeg" });
      const transfer = new DataTransfer();
      transfer.items.add(file);
      importFiles(transfer.files);
      setCameraOpen(false);
      stopCamera();
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : "Não foi possível capturar a foto.");
    }
  }

  function toggleRecording() {
    if (!cameraStream.current) return;
    if (recorder.current?.state === "recording") {
      recorder.current.stop();
      return;
    }
    try {
      recordedChunks.current = [];
      const instance = new MediaRecorder(cameraStream.current, getNexoraRecorderOptions(cameraStream.current, [
        "video/mp4;codecs=h264,aac", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm",
      ]));
      instance.ondataavailable = event => { if (event.data.size) recordedChunks.current.push(event.data); };
      instance.onstop = () => {
        const type = instance.mimeType || "video/webm";
        const file = new File(recordedChunks.current, `nexora-reels-${Date.now()}${type.includes("mp4") ? ".mp4" : ".webm"}`, { type });
        const transfer = new DataTransfer();
        transfer.items.add(file);
        importFiles(transfer.files);
        setRecording(false);
        setCameraOpen(false);
        stopCamera();
      };
      recorder.current = instance;
      instance.start(250);
      setRecording(true);
      setCameraError("");
    } catch {
      setCameraError("Este dispositivo não conseguiu iniciar a gravação neste formato.");
    }
  }

  return (
    <main className="nrs-page">
      <div className="nrs-aurora" aria-hidden="true"><i/><i/><i/><i/><i/></div>
      <header className="nrs-header">
        <a href="/creator-studio" className="nrs-brand" aria-label="Voltar ao Creator Studio">
          <span className="nrs-wordmark">NEXORA</span><span className="nrs-brand-sub">REELS STUDIO</span>
        </a>
        <button className="nrs-settings" type="button" aria-label="Configurações" onClick={() => setMessage("Configurações do Reels Studio")}>⚙</button>
      </header>

      <section className="nrs-hero">
        <span className="nrs-eyebrow">CENTRAL DE CRIAÇÃO</span>
        <h1>Vamos criar<br/>algo incrível</h1>
        <p>Escolha seus momentos e comece a criar.</p>
      </section>

      <section className="nrs-source" aria-label="Origem da mídia">
        <button type="button" className="nrs-source-card camera" onClick={() => { setCameraOpen(true); void startCamera(); }}>
          <span className="nrs-source-icon">◎</span><b>Câmera</b><small>Capture novos momentos</small><span className="nrs-source-ghost">◉</span>
        </button>
        <button type="button" className="nrs-source-card gallery is-active" onClick={() => galleryInput.current?.click()} aria-pressed="true">
          <span className="nrs-source-icon">▧</span><b>Galeria</b><small>Escolha fotos e vídeos</small><span className="nrs-source-ghost">▧</span><span className="nrs-source-active">ATIVA</span>
        </button>
        <input ref={galleryInput} className="nrs-hidden" type="file" accept="image/*,video/*" multiple onChange={event => { importFiles(event.currentTarget.files); event.currentTarget.value = ""; }}/>
      </section>

      <section className="nrs-library">
        <div className="nrs-library-heading"><div><h2>Galeria</h2><small className="nrs-library-subtitle">Sua seleção de fotos e vídeos</small></div><button type="button" className="nrs-open-gallery" onClick={() => galleryInput.current?.click()}>Abrir galeria <span>↗</span></button></div>
        <nav className="nrs-filters" aria-label="Filtros da galeria">
          {(["Tudo","Vídeos","Fotos","Favoritos"] as const).map(item=><button key={item} type="button" className={filter===item?"active":""} onClick={()=>setFilter(item)}>{item}{item==="Vídeos"||item==="Fotos"?<i/>:null}</button>)}
        </nav>
        {visible.length ? <div className="nrs-grid">
          {visible.map((item,index)=>{const chosen=selected.includes(item.id);return <button key={item.id} type="button" className={"nrs-media "+(chosen?"chosen":"")} onClick={()=>toggleSelected(item.id)} aria-label={(chosen?"Remover ":"Selecionar ")+item.file.name}>
            {item.kind==="Vídeo"?<video src={item.url} muted playsInline/>:<img src={item.url} alt={item.file.name}/>}
            <span className="nrs-media-check">{chosen?selected.indexOf(item.id)+1:""}</span>{item.kind==="Vídeo"?<span className="nrs-video-mark">▶</span>:null}
            <span className={"nrs-favorite "+(item.favorite?"on":"")} onClick={event=>{event.stopPropagation();setMedia(current=>current.map(m=>m.id===item.id?{...m,favorite:!m.favorite}:m));}} role="button" aria-label="Alternar favorito">★</span>
            <span className="nrs-media-number">{index+1}</span>
          </button>;})}
        </div> : <div className="nrs-empty-gallery">
          <div className="nrs-empty-icon">▧</div>
          <b>{filter==="Favoritos"?"Nenhum favorito ainda":"Sua galeria está pronta"}</b>
          <p>{filter==="Favoritos"?"Marque uma mídia com a estrela para encontrá-la aqui.":"Abra a galeria do aparelho para escolher fotos e vídeos. As miniaturas reais aparecerão aqui."}</p>
          {filter!=="Favoritos"?<button type="button" onClick={()=>galleryInput.current?.click()}>Selecionar fotos e vídeos</button>:null}
        </div>}
      </section>

      <section className="nrs-selected">
        <div className="nrs-selected-head"><h2>Selecionados <span>{selected.length}</span></h2><button type="button" onClick={()=>setSelected([])} disabled={!selected.length}>Limpar</button></div>
        <div className="nrs-selected-strip">
          {media.filter(item=>selected.includes(item.id)).map(item=><button type="button" className="nrs-thumb" key={item.id} onClick={()=>toggleSelected(item.id)} aria-label="Remover da seleção">{item.kind==="Vídeo"?<video src={item.url} muted/>:<img src={item.url} alt=""/>}</button>)}
          <button className="nrs-add" type="button" aria-label="Adicionar mídias" onClick={()=>galleryInput.current?.click()}>＋</button>
          <button className="nrs-continue" type="button" disabled={!selected.length} onClick={()=>setMessage("Mídias selecionadas. A próxima etapa do editor será aberta nesta experiência.")}>Continuar <span>→</span></button>
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

      {cameraOpen?<div className="nrs-camera-backdrop" role="dialog" aria-modal="true" aria-label="Câmera Nexora">
        <div className="nrs-camera-panel">
          <header><div><b>Câmera Nexora</b><small>Mesmo perfil de captura dos Stories e da LIVE</small></div><button type="button" onClick={()=>{stopCamera();setCameraOpen(false);}} aria-label="Fechar câmera">×</button></header>
          <div className="nrs-camera-view">
            {cameraActive?<video ref={cameraVideo} autoPlay muted playsInline/>:<div className="nrs-camera-wait"><span>◎</span><b>Preparando câmera</b><small>Permita o acesso à câmera do aparelho</small></div>}
            {cameraError?<p className="nrs-camera-error" role="status">{cameraError}</p>:null}
          </div>
          <div className="nrs-camera-controls">
            <button type="button" onClick={()=>void startCamera(facingMode==="environment"?"user":"environment")} disabled={!cameraActive}>Trocar câmera</button>
            <button type="button" className="nrs-shutter" onClick={()=>void capturePhoto()} disabled={!cameraActive} aria-label="Capturar foto"/>
            <button type="button" className={"nrs-record "+(recording?"recording":"")} onClick={toggleRecording} disabled={!cameraActive}>{recording?"Parar vídeo":"Gravar vídeo"}</button>
          </div>
        </div>
      </div>:null}
      {message?<div className="nrs-toast" role="status">{message}<button type="button" onClick={()=>setMessage("")}>×</button></div>:null}
      <footer className="nrs-footer"><span>NEXORA</span><small>REELS STUDIO</small><a href="/creator-studio">Voltar</a></footer>
    </main>
  );
}
