"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import "./creator-studio.css";

type StudioSection = "story" | "post" | "reels" | "insights" | "calendar" | "comments";
type Metric = { label: string; value: string; change: string };

const sections: { id: StudioSection; label: string; icon: string }[] = [
  { id: "story", label: "Story", icon: "◉" },
  { id: "post", label: "POST", icon: "▧" },
  { id: "reels", label: "REELS", icon: "▣" },
  { id: "insights", label: "Insights", icon: "⌁" },
  { id: "calendar", label: "Calendário", icon: "▦" },
  { id: "comments", label: "Comentários", icon: "▤" },
];

const metricsByPeriod: Record<string, Metric[]> = {
  "7 dias": [
    { label: "Visualizações", value: "24.892", change: "+12,8%" },
    { label: "Engajamento", value: "7,84%", change: "+8,2%" },
    { label: "Seguidores", value: "323", change: "+3,5%" },
    { label: "Compartilhamentos", value: "942", change: "+6,1%" },
  ],
  "30 dias": [
    { label: "Visualizações", value: "98.430", change: "+18,4%" },
    { label: "Engajamento", value: "8,12%", change: "+5,7%" },
    { label: "Seguidores", value: "1.284", change: "+4,1%" },
    { label: "Compartilhamentos", value: "3.716", change: "+9,3%" },
  ],
  "90 dias": [
    { label: "Visualizações", value: "286.710", change: "+22,6%" },
    { label: "Engajamento", value: "7,96%", change: "+6,4%" },
    { label: "Seguidores", value: "3.902", change: "+7,8%" },
    { label: "Compartilhamentos", value: "10.584", change: "+12,2%" },
  ],
};


function StoryStudio({ onOpenEditor }: { onOpenEditor: (format: "POST" | "REELS") => void }) {
  const [mode, setMode] = useState("STORY");
  const [stage, setStage] = useState<"camera" | "preview">("camera");
  const [effect, setEffect] = useState("Original");
  const [caption, setCaption] = useState("");
  const [audience, setAudience] = useState("Seu Story");
  const [selected, setSelected] = useState("Câmera");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaUrlRef = useRef("");
  const mountedRef = useRef(true);
  const filter = effect === "P&B" ? "grayscale(1)" : effect === "Quente" ? "sepia(.35) saturate(1.25)" : effect === "Frio" ? "hue-rotate(12deg) saturate(.85)" : effect === "Contraste" ? "contrast(1.25)" : "none";

  function stopCamera() {
    cameraStreamRef.current?.getTracks().forEach(track => track.stop());
    cameraStreamRef.current = null;
    if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
    setCameraActive(false);
  }
  function setLocalMedia(file: File) {
    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    const url = URL.createObjectURL(file);
    mediaUrlRef.current = url;
    setMediaUrl(url);
    setMediaType(file.type);
    setMediaFile(file);
    setSelected("Galeria");
    stopCamera();
    setStage("preview");
  }
  async function startCamera() {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Este navegador ou contexto não oferece acesso à câmera. Use a galeria para importar uma mídia.");
      return;
    }
    stopCamera();
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: true });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        setCameraError("Microfone indisponível: a câmera funcionará sem áudio.");
      }
      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      cameraStreamRef.current = stream;
      setCameraActive(true);
      setSelected("Câmera");
    } catch (error) {
      if (!mountedRef.current) return;
      const name = error instanceof DOMException ? error.name : "";
      setCameraError(name === "NotAllowedError" ? "A permissão da câmera foi negada. Autorize o acesso nas configurações do navegador ou escolha uma mídia da galeria." : name === "NotFoundError" ? "Nenhuma câmera foi encontrada neste dispositivo." : "Não foi possível iniciar a câmera. Verifique as permissões e tente novamente.");
    }
  }
  function toggleRecording() {
    const stream = cameraStreamRef.current;
    if (recording) {
      if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
      return;
    }
    if (!stream) { setCameraError("Ative a câmera antes de iniciar a gravação."); return; }
    if (typeof MediaRecorder === "undefined") { setCameraError("Este navegador não oferece gravação de vídeo. Você ainda pode capturar fotos ou importar um vídeo."); return; }
    try {
      const mimeType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find(type => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recordedChunksRef.current = [];
      recorder.ondataavailable = event => { if (event.data.size > 0) recordedChunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || "video/webm" });
        recordedChunksRef.current = [];
        recorderRef.current = null;
        if (!mountedRef.current) return;
        setRecording(false);
        if (blob.size > 0) setLocalMedia(new File([blob], "nexora-story-video.webm", { type: blob.type }));
        else setCameraError("A gravação terminou sem gerar um arquivo de vídeo.");
      };
      recorder.onerror = () => { setRecording(false); setCameraError("O navegador encontrou um erro durante a gravação."); };
      recorderRef.current = recorder;
      recorder.start(250);
      setRecording(true);
      setCameraError("");
    } catch {
      setCameraError("Não foi possível iniciar a gravação neste dispositivo.");
    }
  }
  async function capturePhoto() {
    const video = cameraVideoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError("A câmera ainda está iniciando. Aguarde a imagem aparecer e tente novamente.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) { setCameraError("Não foi possível preparar a captura neste navegador."); return; }
    context.save();
    context.filter = filter;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.restore();
    setBusy(true);
    canvas.toBlob(blob => {
      setBusy(false);
      if (!blob) { setCameraError("A captura não pôde ser convertida em imagem."); return; }
      setLocalMedia(new File([blob], "nexora-story.jpg", { type: "image/jpeg" }));
    }, "image/jpeg", .94);
  }
  async function downloadStory() {
    if (!mediaUrl || !mediaFile) { setCameraError("Capture uma foto ou escolha uma mídia antes de continuar."); return; }
    if (busy) return;
    setBusy(true);
    setCameraError("");
    try {
      let output: Blob;
      let filename: string;
      const baseName = mediaFile.name.replace(/\.[^.]+$/, "") || "nexora-story";
      if (mediaType.startsWith("image/")) {
        const image = new Image();
        image.src = mediaUrl;
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Não foi possível abrir a imagem importada."));
        });
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Não foi possível preparar a imagem para aplicar o efeito.");
        context.filter = filter;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        output = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem com o efeito.")), "image/png"));
        filename = baseName + "-com-efeito.png";
      } else if (mediaType.startsWith("video/")) {
        if (typeof MediaRecorder === "undefined" || !HTMLCanvasElement.prototype.captureStream) {
          throw new Error("Este navegador não oferece exportação de vídeo com filtros. Tente salvar uma foto ou use outro navegador compatível.");
        }
        const video = document.createElement("video");
        video.src = mediaUrl;
        video.playsInline = true;
        video.preload = "auto";
        video.muted = false;
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error("Não foi possível abrir o vídeo importado."));
        });
        if (!video.videoWidth || !video.videoHeight) throw new Error("O vídeo não possui dimensões válidas para exportação.");
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Não foi possível preparar o vídeo para aplicar o efeito.");
        const canvasStream = canvas.captureStream(30);
        const capturableVideo = video as HTMLVideoElement & { webkitCaptureStream?: () => MediaStream };
        const sourceStream = typeof video.captureStream === "function" ? video.captureStream() : typeof capturableVideo.webkitCaptureStream === "function" ? capturableVideo.webkitCaptureStream() : null;
        const outputStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...(sourceStream?.getAudioTracks() ?? []),
        ]);
        const mimeType = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find(type => MediaRecorder.isTypeSupported(type));
        const recorder = new MediaRecorder(outputStream, mimeType ? { mimeType } : undefined);
        const chunks: Blob[] = [];
        output = await new Promise<Blob>((resolve, reject) => {
          let stopped = false;
          let settled = false;
          let frame = 0;
          let failure: Error | null = null;
          const stopTracks = () => {
            canvasStream.getTracks().forEach(track => track.stop());
            sourceStream?.getTracks().forEach(track => track.stop());
            video.pause();
          };
          const finish = (error?: Error) => {
            if (error && !failure) failure = error;
            if (stopped) return;
            stopped = true;
            if (frame) cancelAnimationFrame(frame);
            if (recorder.state !== "inactive") {
              try { recorder.stop(); } catch { stopTracks(); }
            } else {
              stopTracks();
              if (!settled) {
                settled = true;
                reject(failure ?? new Error("A gravação não foi iniciada."));
              }
            }
          };
          recorder.ondataavailable = event => { if (event.data.size > 0) chunks.push(event.data); };
          recorder.onerror = () => finish(new Error("O navegador encontrou um erro ao renderizar o vídeo com efeito."));
          recorder.onstop = () => {
            stopTracks();
            if (settled) return;
            settled = true;
            if (failure) { reject(failure); return; }
            const result = new Blob(chunks, { type: recorder.mimeType || mimeType || "video/webm" });
            if (result.size) resolve(result);
            else reject(new Error("A renderização terminou sem gerar um vídeo."));
          };
          const drawFrame = () => {
            if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
              context.save();
              context.filter = filter;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              context.restore();
            }
            if (!stopped) frame = requestAnimationFrame(drawFrame);
          };
          video.onended = () => finish();
          video.onerror = () => finish(new Error("A leitura do vídeo foi interrompida."));
          try {
            video.currentTime = 0;
            void video.play().then(() => {
              if (stopped) return;
              try {
                recorder.start(250);
                drawFrame();
              } catch {
                finish(new Error("Este navegador não conseguiu iniciar a gravação do vídeo processado."));
              }
            }).catch(() => finish(new Error("Não foi possível iniciar a renderização deste vídeo neste navegador.")));
          } catch {
            finish(new Error("Não foi possível iniciar a renderização deste vídeo neste navegador."));
          }
        });
        const extension = output.type.includes("mp4") ? "mp4" : "webm";
        filename = baseName + "-com-efeito." + extension;
      } else {
        throw new Error("Este formato de mídia não é compatível com a exportação de efeitos.");
      }
      const url = URL.createObjectURL(output);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      setCameraError("Arquivo com o efeito aplicado preparado para salvar. A publicação na conta ainda não está conectada.");
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : "Não foi possível salvar a mídia com o efeito aplicado.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!cameraActive || !cameraVideoRef.current || !cameraStreamRef.current) return;
    cameraVideoRef.current.srcObject = cameraStreamRef.current;
    cameraVideoRef.current.play().catch(() => setCameraError("A câmera foi ativada, mas a prévia não iniciou. Tente novamente."));
  }, [cameraActive]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
      cameraStreamRef.current?.getTracks().forEach(track => track.stop());
      if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    };
  }, []);

  return (
    <div className="cs-story-layout">
      <div className="cs-phone cs-camera-phone">
        <div className="cs-phone-status"><span>9:41</span><span>● ◔ ▰</span></div>
        <input ref={galleryInputRef} className="cs-hidden-file-input" type="file" accept="image/*,video/*" onChange={event => { const file = event.target.files?.[0]; if (file) setLocalMedia(file); event.currentTarget.value = ""; }} />
        {stage === "camera" ? <>
          <div className="cs-camera-top">
            <button className="cs-icon-button" aria-label="Fechar câmera" onClick={stopCamera}>×</button>
            <div className="cs-camera-top-actions">
              <button className="cs-icon-button" aria-label="Alternar efeito P&B" onClick={() => setEffect(effect === "P&B" ? "Original" : "P&B")}>◐</button>
              <button className="cs-icon-button" aria-label="Alternar efeito quente" onClick={() => setEffect(effect === "Quente" ? "Original" : "Quente")}>✦</button>
              <button className="cs-icon-button" aria-label="Iniciar câmera" onClick={startCamera}>◎</button>
            </div>
          </div>
          <div className="cs-camera-view">
            {cameraActive ? <video ref={cameraVideoRef} className="cs-story-selected-media" autoPlay muted playsInline style={{ filter }} /> : <div className="cs-night-scene"><div className="cs-moon" /><div className="cs-camp-tent" /><div className="cs-camp-fire" /></div>}
            <div className="cs-camera-tools">
              {["Original", "P&B", "Quente", "Frio", "Contraste"].map(item => <button key={item} className={effect === item ? "active" : ""} onClick={() => setEffect(item)}>{item}</button>)}
            </div>
            <span className="cs-effect-label">{recording ? "Gravando vídeo…" : cameraActive ? "Câmera ativa" : "Prévia ilustrativa"} · {effect}</span>
          </div>
          {cameraError && <p className="cs-story-error" role="status">{cameraError}</p>}
          <div className="cs-capture-row">
            <button className="cs-gallery-thumb" onClick={() => galleryInputRef.current?.click()} aria-label="Abrir galeria">▧</button>
            <button className="cs-record-mode" onClick={() => { if (recording) return; setRecordMode(value => !value); }}>{recordMode ? "Vídeo" : "Foto"}</button>
            <button className={"cs-shutter" + (recording ? " recording" : "")} onClick={!cameraActive ? startCamera : recordMode ? toggleRecording : capturePhoto} disabled={busy} aria-label={!cameraActive ? "Ativar câmera" : recordMode ? (recording ? "Parar gravação" : "Iniciar gravação") : "Capturar foto"} />
            <button className="cs-creative-effect" onClick={() => setEffect(effect === "Contraste" ? "Original" : "Contraste")} aria-label="Alternar contraste">✧</button>
          </div>
          <div className="cs-mode-switch">{["POST", "STORY", "REEL", "LIVE"].map(item => <button key={item} className={mode === item ? "active" : ""} onClick={() => { if (item === "LIVE") { setCameraError("LIVE está reservado para uma etapa futura; a transmissão ainda não foi implementada."); return; } setMode(item); setCameraError(""); if (item === "POST" || item === "REEL") { stopCamera(); onOpenEditor(item === "POST" ? "POST" : "REELS"); } }}>{item}</button>)}</div>
        </> : <>
          <div className="cs-preview-top"><button onClick={() => { setStage("camera"); setCameraError(""); }}>‹</button><div><button onClick={() => setCaption(value => value + " ✦")}>Aa</button><button onClick={() => galleryInputRef.current?.click()}>▧</button><button onClick={() => setEffect(effect === "P&B" ? "Original" : "P&B")}>◐</button><button onClick={() => setCaption(value => value + " ♫")}>♫</button><button onClick={() => setCaption("")}>Limpar</button></div></div>
          <div className="cs-story-preview">
            {mediaUrl ? (mediaType.startsWith("video/") ? <video className="cs-story-selected-media" src={mediaUrl} controls playsInline style={{ filter }} /> : <img className="cs-story-selected-media" src={mediaUrl} alt="Prévia do Story" style={{ filter }} />) : <div className="cs-night-scene"><div className="cs-moon" /><div className="cs-camp-tent" /><div className="cs-camp-fire" /></div>}
            {caption && <span className="cs-story-caption-overlay">{caption}</span>}
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Adicionar texto..." aria-label="Texto do Story" />
          </div>
          <div className="cs-publish-row">
            <button className={audience === "Seu Story" ? "selected" : ""} onClick={() => setAudience("Seu Story")}>◉ Seu Story</button>
            <button className={audience === "Amigos Próximos" ? "selected" : ""} onClick={() => setAudience("Amigos Próximos")}>✦ Amigos Próximos</button>
            <button className="cs-next" onClick={downloadStory} disabled={busy}>{busy ? "Aplicando efeito…" : "Salvar"}</button>
          </div>
          <p className="cs-story-local-note">Prévia local · público selecionado não é aplicado até a integração de publicação.</p>
        </>}
        <div className="cs-home-indicator" />
      </div>
      <div className="cs-story-side">
        <span className="cs-kicker">CAPTURA E PUBLICAÇÃO</span>
        <h3>{stage === "camera" ? "Registre o momento." : "Sua história, do seu jeito."}</h3>
        <p>{stage === "camera" ? "Ative a câmera com permissão do navegador ou escolha uma foto ou vídeo da galeria." : "Revise a mídia, aplique um filtro de prévia, escreva uma legenda e salve o arquivo."}</p>
        <div className="cs-option-list">
          <button className={selected === "Câmera" ? "selected" : ""} onClick={startCamera}>Câmera<span>›</span></button>
          <button className={selected === "Galeria" ? "selected" : ""} onClick={() => galleryInputRef.current?.click()}>Galeria<span>›</span></button>
          <button onClick={() => setCaption(value => value + " Texto")}>Texto<span>›</span></button>
          <button onClick={() => setCameraError("Boomerang ainda não foi implementado; não será simulado.")}>Boomerang<span>›</span></button>
          <button onClick={() => setCameraError("Layout de múltiplas capturas ainda não foi implementado.")}>Layout<span>›</span></button>
        </div>
        {cameraError && <p className="cs-story-error" role="status">{cameraError}</p>}
      </div>
    </div>
  );
}
type EditorClip = { id: string; file: File; url: string; start: number; end: number };
type EditorFilter = "Nenhum" | "P&B" | "Quente" | "Frio" | "Contraste";
function MediaEditor({ initialFormat = "REELS" }: { initialFormat?: "POST" | "REELS" }) {
  const [format, setFormat] = useState<"POST" | "REELS">(initialFormat);
  const [clips, setClips] = useState<EditorClip[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [playhead, setPlayhead] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [filter, setFilter] = useState<EditorFilter>("Nenhum");
  const [overlayText, setOverlayText] = useState("");
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [notice, setNotice] = useState("Importe fotos ou vídeos para começar.");
  const videoRef = useRef<HTMLVideoElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());
  function createLocalUrl(file: File) {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.add(url);
    return url;
  }
  useEffect(() => () => {
    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);
  const selected = clips.find(clip => clip.id === selectedId) ?? clips[0];
  const filterStyle = filter === "P&B" ? "grayscale(1)" : filter === "Quente" ? "sepia(.35) saturate(1.25)" : filter === "Frio" ? "hue-rotate(12deg) saturate(.85)" : filter === "Contraste" ? "contrast(1.3) saturate(1.1)" : "none";
  function importMedia(files: FileList | null) {
    if (!files?.length) return;
    const accepted = Array.from(files).filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (!accepted.length) { setNotice("Formato não suportado. Escolha imagens ou vídeos."); return; }
    const added = accepted.map(file => ({ id: crypto.randomUUID(), file, url: createLocalUrl(file), start: 0, end: 0 }));
    setClips(current => [...current, ...added]); setSelectedId(added[0].id); setPlayhead(0);
    setNotice(accepted.length + " arquivo(s) importado(s) localmente. Ainda não foram enviados para a Nexora.");
  }
  function updateClip(id: string, patch: Partial<EditorClip>) { setClips(current => current.map(clip => clip.id === id ? { ...clip, ...patch } : clip)); }
  function removeSelected() { if (!selected) return; const remaining=clips.filter(clip=>clip.id!==selected.id); setClips(remaining); setSelectedId(remaining[0]?.id??""); setPlayhead(0); setPlaying(false); setNotice("Clipe removido da sequência."); }
  function duplicateSelected() { if (!selected) return; const copy={...selected,id:crypto.randomUUID(),url:createLocalUrl(selected.file)}; const index=clips.findIndex(clip=>clip.id===selected.id); setClips(current=>[...current.slice(0,index+1),copy,...current.slice(index+1)]); setNotice("Clipe duplicado na sequência."); }
  function splitSelected() { if (!selected || selected.file.type.startsWith("image/")) { setNotice("A divisão está disponível para vídeos."); return; } const point=Math.max(selected.start+.2,Math.min(playhead,selected.end-.2)); if(point<=selected.start||point>=selected.end){setNotice("Posicione a reprodução no interior do clipe para dividi-lo.");return;} const left={...selected,id:crypto.randomUUID(),end:point}; const right={...selected,id:crypto.randomUUID(),start:point}; const index=clips.findIndex(clip=>clip.id===selected.id); setClips(current=>[...current.slice(0,index),left,right,...current.slice(index+1)]); setSelectedId(right.id); setNotice("Clipe dividido em dois segmentos."); }
  function moveSelected(direction: -1 | 1) { if(!selected)return; const index=clips.findIndex(clip=>clip.id===selected.id), target=index+direction; if(target<0||target>=clips.length)return; const next=[...clips]; [next[index],next[target]]=[next[target],next[index]]; setClips(next); }
  function downloadOriginal() { if(!selected)return; const anchor=document.createElement("a"); anchor.href=selected.url; anchor.download=selected.file.name; anchor.click(); setNotice("Download do arquivo original iniciado. As edições ainda não são renderizadas."); }
  const selectedIsVideo=Boolean(selected?.file.type.startsWith("video/"));
  return <div className="cs-real-editor">
    <div className="cs-real-editor-head"><div><span className="cs-kicker">EDITOR COMPARTILHADO</span><h3>{format==="POST"?"Editar publicação":"Editar Reel"}</h3><p>Um único conjunto de ferramentas para os dois formatos.</p></div><div className="cs-speed-options"><button className={format==="POST"?"active":""} onClick={()=>setFormat("POST")}>POST</button><button className={format==="REELS"?"active":""} onClick={()=>setFormat("REELS")}>REELS</button></div></div>
    <div className="cs-real-editor-grid">
      <section className="cs-real-preview-panel"><div className={"cs-real-preview "+(format==="REELS"?"vertical":"post")}>
        {selected ? (selectedIsVideo ? <video ref={videoRef} key={selected.id} src={selected.url} playsInline style={{filter:filterStyle}} onLoadedMetadata={event=>{const video=event.currentTarget;const end=selected.end||video.duration;setDuration(end-selected.start);updateClip(selected.id,{end});video.currentTime=selected.start;video.volume=volume;video.playbackRate=speed;}} onTimeUpdate={event=>{const video=event.currentTarget;setPlayhead(video.currentTime);if(selected.end&&video.currentTime>=selected.end){video.pause();setPlaying(false);}}}/> : <img src={selected.url} alt={selected.file.name} style={{filter:filterStyle}}/>) : <div className="cs-empty-preview"><span>＋</span><b>Sua prévia aparecerá aqui</b><small>Adicione fotos ou vídeos para começar</small></div>}
        {overlayText&&selected&&<span className="cs-preview-overlay">{overlayText}</span>}</div>
      <div className="cs-real-playbar"><span>{selected?selected.file.name:"Nenhuma mídia selecionada"}</span>{selectedIsVideo&&<><input aria-label="Posição do vídeo" type="range" min={selected?.start??0} max={selected?.end||duration||1} step=".05" value={Math.min(playhead,selected?.end||duration||1)} onChange={event=>{const value=Number(event.target.value);setPlayhead(value);if(videoRef.current)videoRef.current.currentTime=value;}}/><button onClick={async()=>{if(!videoRef.current)return;if(playing){videoRef.current.pause();setPlaying(false);}else{try{await videoRef.current.play();setPlaying(true);}catch{setNotice("Não foi possível reproduzir este vídeo.");}}}}>{playing?"Pausar":"Reproduzir"}</button></>}</div>
      <div className="cs-real-timeline-head"><b>Linha do tempo</b><small>{clips.length} clipe(s)</small></div><div className="cs-real-timeline">{clips.map((clip,index)=><button key={clip.id} className={clip.id===selected?.id?"selected":""} onClick={()=>{setSelectedId(clip.id);setPlayhead(clip.start);setPlaying(false);}}><b>{index+1}. {clip.file.name}</b><small>{clip.file.type.startsWith("video/")?"Vídeo":"Imagem"}{clip.end>clip.start?" · "+(clip.end-clip.start).toFixed(1)+"s":""}</small></button>)}</div></section>
      <section className="cs-real-tools-panel"><label className="cs-media-picker">＋ Importar fotos e vídeos<input type="file" accept="image/*,video/*" multiple onChange={event=>importMedia(event.target.files)}/></label>
        <div className="cs-tool-group"><b>Clipe selecionado</b><div className="cs-tool-buttons"><button disabled={!selected} onClick={duplicateSelected}>Duplicar</button><button disabled={!selected||!selectedIsVideo} onClick={splitSelected}>Dividir no cursor</button><button disabled={!selected} onClick={()=>moveSelected(-1)}>Mover ←</button><button disabled={!selected} onClick={()=>moveSelected(1)}>Mover →</button><button disabled={!selected} className="danger" onClick={removeSelected}>Excluir</button></div></div>
        <div className="cs-tool-group"><b>Texto sobre a mídia</b><input className="cs-editor-text-input" value={overlayText} onChange={event=>setOverlayText(event.target.value)} placeholder="Digite o texto da publicação"/></div>
        <div className="cs-tool-group"><b>Filtros de prévia</b><div className="cs-tool-buttons">{(["Nenhum","P&B","Quente","Frio","Contraste"] as EditorFilter[]).map(item=><button key={item} className={filter===item?"active":""} onClick={()=>setFilter(item)}>{item}</button>)}</div></div>
        <div className="cs-tool-group"><label>Volume <strong>{Math.round(volume*100)}%</strong></label><input type="range" min="0" max="1" step=".05" value={volume} onChange={event=>{const value=Number(event.target.value);setVolume(value);if(videoRef.current)videoRef.current.volume=value;}}/></div>
        <div className="cs-tool-group"><label>Velocidade <strong>{speed.toFixed(2)}×</strong></label><input type="range" min=".25" max="2" step=".25" value={speed} onChange={event=>{const value=Number(event.target.value);setSpeed(value);if(videoRef.current)videoRef.current.playbackRate=value;}}/></div>
        <label className="cs-audio-picker">＋ Adicionar faixa de áudio<input type="file" accept="audio/*" onChange={event=>{const file=event.target.files?.[0]??null;setAudioFile(file);setAudioUrl(file?createLocalUrl(file):"");}}/></label>{audioFile&&<div className="cs-audio-file"><b>Áudio selecionado:</b> {audioFile.name}<audio controls src={audioUrl}/></div>}
        <button className="cs-export-original" disabled={!selected} onClick={downloadOriginal}>Baixar arquivo original selecionado</button><p className="cs-editor-notice" role="status">{notice}</p><small className="cs-editor-disclaimer">A edição e a prévia são locais. Renderização final, salvamento e publicação exigem integração de mídia e servidor.</small></section>
    </div></div>;
}
function MiniChart({ title, value, kind = "line" }: { title: string; value: string; kind?: "line" | "bars" }) {
  return <div className="cs-chart-card"><div className="cs-chart-head"><span>{title}</span><b>{value}</b></div>{kind === "line" ? <svg viewBox="0 0 300 90" role="img" aria-label={title}><path d="M0 72 C20 64 24 48 42 55 S70 22 90 40 S120 18 142 36 S170 49 190 26 S220 42 240 18 S275 28 300 8" fill="none" stroke="url(#cs-line)" strokeWidth="3"/><defs><linearGradient id="cs-line"><stop stopColor="#39d9ff"/><stop offset="1" stopColor="#a56bff"/></linearGradient></defs><path d="M0 72 C20 64 24 48 42 55 S70 22 90 40 S120 18 142 36 S170 49 190 26 S220 42 240 18 S275 28 300 8 L300 90 L0 90Z" fill="url(#cs-fill)" opacity=".18"/><defs><linearGradient id="cs-fill" x2="0" y2="1"><stop stopColor="#6e75ff"/><stop offset="1" stopColor="#6e75ff" stopOpacity="0"/></linearGradient></defs></svg> : <div className="cs-bars">{Array.from({length:18},(_,i)=><i key={i} style={{height:(20+((i*17)%63))+"%"}} />)}</div>}</div>;
}

function InsightsStudio() {
  const [period, setPeriod] = useState("7 dias");
  return <div className="cs-dashboard">
    <div className="cs-dashboard-heading"><div><span className="cs-kicker">CREATOR ANALYTICS</span><h3>Visão geral</h3><p>Indicadores demonstrativos de interface</p></div><select value={period} onChange={e=>setPeriod(e.target.value)}><option>7 dias</option><option>30 dias</option><option>90 dias</option></select></div>
    <div className="cs-metric-grid">{metricsByPeriod[period].map(m=><div className="cs-metric" key={m.label}><span>{m.label}</span><b>{m.value}</b><small>{m.change} <em>vs. período anterior</em></small></div>)}</div>
    <div className="cs-insights-grid"><MiniChart title="Retenção de audiência" value={period==="7 dias"?"68%":period==="30 dias"?"71%":"74%"} /><MiniChart title="Visualizações no período" value={metricsByPeriod[period][0].value} kind="bars" /><MiniChart title="Engajamento por conteúdo" value={metricsByPeriod[period][1].value} /><MiniChart title="Origem do tráfego" value={period==="7 dias"?"Distribuição semanal":period==="30 dias"?"Distribuição mensal":"Distribuição trimestral"} kind="bars" /></div>
    <div className="cs-audience-row"><div><span className="cs-kicker">AUDIÊNCIA · DADOS DE EXEMPLO</span><h4>Conheça quem acompanha seu conteúdo</h4><p>Localização, atividade e evolução do público.</p></div><div className="cs-donut"><span>{period==="7 dias"?"72%":period==="30 dias"?"76%":"79%"}<small>atividade</small></span></div></div>
  </div>;
}

type ScheduledDraft = { id: string; date: string; time: string; format: string; caption: string; mediaName: string };
function CalendarStudio() {
  const today = new Date();
  const toDateKey = (date: Date) => [date.getFullYear(), String(date.getMonth()+1).padStart(2,"0"), String(date.getDate()).padStart(2,"0")].join("-");
  const [monthKey, setMonthKey] = useState(toDateKey(new Date(today.getFullYear(), today.getMonth(), 1)).slice(0,7));
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [caption, setCaption] = useState("");
  const [time, setTime] = useState("18:00");
  const [format, setFormat] = useState("POST");
  const [media, setMedia] = useState<File | null>(null);
  const [drafts, setDrafts] = useState<ScheduledDraft[]>([]);
  const [draftsHydrated, setDraftsHydrated] = useState(false);
  const [notice, setNotice] = useState("Os agendamentos ficam nesta sessão do navegador; não serão publicados automaticamente.");
  const [showAll, setShowAll] = useState(false);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaPreviewType, setMediaPreviewType] = useState("");
  const mediaPreviewRef = useRef("");
  const [mediaInputKey, setMediaInputKey] = useState(0);
  const [yearText, monthText] = monthKey.split("-").map(Number);
  const firstDay = new Date(yearText, monthText - 1, 1).getDay();
  const daysInMonth = new Date(yearText, monthText, 0).getDate();
  const monthLabel = new Date(yearText, monthText - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const calendarCells = Array.from({length:firstDay+daysInMonth},(_,index)=>index<firstDay?0:index-firstDay+1);
  const selectedDrafts = drafts.filter(item=>item.date===selectedDate).sort((x,y)=>x.time.localeCompare(y.time));
  const visibleDrafts = showAll ? [...drafts].sort((x,y)=>(x.date+x.time).localeCompare(y.date+y.time)) : selectedDrafts;
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("nexora-creator-calendar-v1");
      if (saved) {
        const parsed = JSON.parse(saved) as ScheduledDraft[];
        if (Array.isArray(parsed)) setDrafts(parsed.filter(item => item && typeof item.id === "string" && typeof item.date === "string" && typeof item.time === "string"));
      }
    } catch {
      setNotice("Não foi possível recuperar os rascunhos locais salvos neste navegador.");
    } finally {
      setDraftsHydrated(true);
    }
  }, []);
  useEffect(() => {
    if (!draftsHydrated) return;
    try {
      window.localStorage.setItem("nexora-creator-calendar-v1", JSON.stringify(drafts));
    } catch {
      setNotice("O armazenamento do navegador está indisponível ou cheio; os rascunhos podem não persistir.");
    }
  }, [drafts, draftsHydrated]);
  useEffect(() => () => {
    if (mediaPreviewRef.current) URL.revokeObjectURL(mediaPreviewRef.current);
  }, []);
  function changeMonth(offset:number) {
    const next=new Date(yearText,monthText-1+offset,1);
    const key=toDateKey(next).slice(0,7);
    setMonthKey(key);
    const nextDate=toDateKey(new Date(next.getFullYear(),next.getMonth(),1));
    setSelectedDate(nextDate);
  }
  function addDraft(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!caption.trim()&&!media){setNotice("Adicione uma legenda ou selecione um arquivo de mídia antes de salvar.");return;}
    if(!selectedDate||!time){setNotice("Escolha uma data e um horário válidos.");return;}
    setDrafts(current=>[...current,{id:crypto.randomUUID(),date:selectedDate,time,format,caption:caption.trim(),mediaName:media?.name??""}]);
    setNotice("Rascunho adicionado ao calendário local. Nenhuma publicação foi enviada.");
    setCaption("");
    setMedia(null);
    if (mediaPreviewRef.current) URL.revokeObjectURL(mediaPreviewRef.current);
    mediaPreviewRef.current = "";
    setMediaPreview("");
    setMediaPreviewType("");
    setMediaInputKey(value=>value+1);
  }
  function removeDraft(id:string) {
    setDrafts(current=>current.filter(item=>item.id!==id));
    setNotice("Agendamento removido do calendário local.");
  }
  function selectDay(day:number) {
    const date=new Date(yearText,monthText-1,day);
    setSelectedDate(toDateKey(date));
    setShowAll(false);
  }
  return <div className="cs-calendar-grid">
    <div className="cs-calendar-panel">
      <div className="cs-calendar-head">
        <div><span className="cs-kicker">PLANEJAMENTO</span><h3>Calendário editorial</h3></div>
        <div className="cs-month-controls"><button type="button" onClick={()=>changeMonth(-1)} aria-label="Mês anterior">‹</button><b>{monthLabel}</b><button type="button" onClick={()=>changeMonth(1)} aria-label="Próximo mês">›</button></div>
      </div>
      <div className="cs-calendar-days">{["D","S","T","Q","Q","S","S"].map((x,i)=><span key={i}>{x}</span>)}{calendarCells.map((day,index)=>day===0?<i key={"blank-"+index}/>:<button type="button" key={day} className={selectedDate===toDateKey(new Date(yearText,monthText-1,day))?"selected":""} onClick={()=>selectDay(day)}>{day}{drafts.some(item=>item.date===toDateKey(new Date(yearText,monthText-1,day)))&&<i/>}</button>)}</div>
      <div className="cs-schedule-list">
        <div className="cs-schedule-list-head"><b>{new Date(selectedDate+"T12:00:00").toLocaleDateString("pt-BR",{day:"numeric",month:"long",year:"numeric"})}</b><button type="button" onClick={()=>setShowAll(value=>!value)}>{showAll?"Ver dia":"Ver todos"}</button></div>
        {visibleDrafts.length===0?<p className="cs-empty-schedule">Nenhum rascunho neste período.</p>:visibleDrafts.map(item=><div className="cs-scheduled-item" key={item.id}><div><b>{item.time} · {item.format}</b><p>{item.caption||item.mediaName||"Publicação sem legenda"}</p>{item.mediaName&&<small>Arquivo: {item.mediaName}</small>}{showAll&&<small>{new Date(item.date+"T12:00:00").toLocaleDateString("pt-BR")}</small>}</div><button type="button" onClick={()=>removeDraft(item.id)} aria-label="Excluir agendamento">×</button></div>)}
      </div>
    </div>
    <form className="cs-compose-panel" onSubmit={addDraft}>
      <span className="cs-kicker">NOVA PUBLICAÇÃO</span><h3>Criar rascunho e planejar</h3>
      <label className="cs-calendar-field">Data<input type="date" value={selectedDate} onChange={event=>{setSelectedDate(event.target.value);setMonthKey(event.target.value.slice(0,7));setShowAll(false);}} required/></label>
      <label className="cs-calendar-field">Horário<input type="time" value={time} onChange={event=>setTime(event.target.value)} required/></label>
      <label className="cs-calendar-field">Formato<select value={format} onChange={event=>setFormat(event.target.value)}><option>POST</option><option>REELS</option><option>STORY</option></select></label>
      <label className="cs-upload-box cs-calendar-upload">＋<span>{media?media.name:"Adicionar foto ou vídeo"}</span><input key={mediaInputKey} type="file" accept="image/*,video/*" onChange={event=>{const file=event.target.files?.[0]??null;setMedia(file);if(mediaPreviewRef.current)URL.revokeObjectURL(mediaPreviewRef.current);const url=file?URL.createObjectURL(file):"";mediaPreviewRef.current=url;setMediaPreview(url);setMediaPreviewType(file?.type??"");}}/></label>
      {mediaPreview&&<div className="cs-calendar-media-preview">{mediaPreviewType.startsWith("video/")?<video src={mediaPreview} controls/>:<img src={mediaPreview} alt="Mídia selecionada para o rascunho"/>}<button type="button" onClick={()=>{setMedia(null);if(mediaPreviewRef.current)URL.revokeObjectURL(mediaPreviewRef.current);mediaPreviewRef.current="";setMediaPreview("");setMediaPreviewType("");setMediaInputKey(value=>value+1);}}>Remover mídia</button></div>}
      <textarea value={caption} onChange={event=>setCaption(event.target.value)} placeholder="Adicione uma legenda ou observações..." />
      <button className="cs-primary-action" type="submit">Salvar no calendário</button>
      <p className="cs-calendar-notice" role="status">{notice}</p>
      <small className="cs-editor-disclaimer">Planejamento local desta sessão. A publicação automática e a sincronização entre dispositivos ainda não estão conectadas.</small>
    </form>
  </div>;
}
function CommentsStudio() {
  const [comment,setComment]=useState("");
  const [replyTo,setReplyTo]=useState("");
  const [liked,setLiked]=useState<string[]>([]);
  const [items,setItems]=useState(["True fashion begins with the confidence to wear your vision.","When you wear love unapologetically, you’re already winning at style.","Sharp, sleek, and just the right shade of iconic."]);
  function submitComment(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if(!comment.trim())return; const text=(replyTo?"↳ Resposta para "+replyTo+": ":"")+comment.trim(); setItems(current=>[...current,text]); setComment(""); setReplyTo(""); }
  return <div className="cs-comments-layout"><div className="cs-comment-content"><div className="cs-comment-art">N<span>CONTEÚDO</span></div></div><div className="cs-comments-sheet"><div className="cs-sheet-handle"/><h3>Comentários <small>{items.length}</small></h3><div className="cs-comment-list">{items.map((x,i)=>{const id=String(i);const author=["Ava Monroe","John Brooks","Zoey Hart","Mia Cruz"][i%4];const isLiked=liked.includes(id);return <div className="cs-comment" key={id}><div className="cs-avatar">{["A","J","Z","N"][i%4]}</div><div><b>{author}</b><p>{x}</p><small><button type="button" onClick={()=>{setReplyTo(author);setComment("@"+author+" ");}}>Responder</button>　<button type="button" className={isLiked?"liked":""} onClick={()=>setLiked(current=>isLiked?current.filter(value=>value!==id):[...current,id])}>{isLiked?"Curtido":"Curtir"}</button></small></div><button type="button" aria-label={isLiked?"Remover curtida":"Curtir comentário"} className={isLiked?"liked":""} onClick={()=>setLiked(current=>isLiked?current.filter(value=>value!==id):[...current,id])}>{isLiked?"♥":"♡"}</button></div>;})}</div><form onSubmit={submitComment}><span>↗</span><input value={comment} onChange={e=>setComment(e.target.value)} placeholder={replyTo?"Responder a "+replyTo:"Adicione um comentário..."} aria-label="Novo comentário ou resposta"/><button type="submit" disabled={!comment.trim()}>➤</button></form><small className="cs-comment-local-note">Interações demonstrativas nesta sessão; ainda não sincronizadas com a conta.</small></div></div>;
}
export default function CreatorStudioPage() {
  const [active, setActive] = useState<StudioSection>("story");
  const title = useMemo(() => sections.find(s=>s.id===active)?.label ?? "Creator Studio",[active]);
  return <main className="cs-app">
    <header className="cs-header"><a className="cs-brand" href="/"><span>N</span>NEXORA <i>CREATOR</i></a><div className="cs-header-actions"><span className="cs-status"><i/> Ambiente independente</span><button className="cs-profile">L</button></div></header>
    <div className="cs-shell"><aside className="cs-sidebar"><div className="cs-side-label">ESTÚDIO</div>{sections.map(s=><button key={s.id} className={active===s.id?"active":""} onClick={()=>setActive(s.id)}><span>{s.icon}</span>{s.label}</button>)}<div className="cs-side-foot"><span>WORKSPACE</span><b>Nexora Creator</b><small>Prévia independente</small></div></aside><section className="cs-main"><div className="cs-page-heading"><div><span className="cs-kicker">NEXORA / CREATOR STUDIO</span><h1>{title}</h1></div><span className="cs-demo-badge">AMBIENTE DE PRÉVIA</span></div>{active==="story"&&<StoryStudio onOpenEditor={format => setActive(format === "POST" ? "post" : "reels")} />}{active==="post"&&<MediaEditor initialFormat="POST"/>}{active==="reels"&&<MediaEditor initialFormat="REELS"/>}{active==="insights"&&<InsightsStudio/>}{active==="calendar"&&<CalendarStudio/>}{active==="comments"&&<CommentsStudio/>}</section></div>
  </main>;
}
