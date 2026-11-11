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
  const [stage, setStage] = useState<"camera" | "preview" | "share">("camera");
  const [editorTool, setEditorTool] = useState<"text" | "stickers" | "effects" | "music" | null>(null);
  const [sticker, setSticker] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
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
  const audioInputRef = useRef<HTMLInputElement>(null);
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
    setEditorTool(null);
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
        const capturableVideo = video as HTMLVideoElement & { captureStream?: () => MediaStream; webkitCaptureStream?: () => MediaStream };
        const sourceStream = typeof capturableVideo.captureStream === "function" ? capturableVideo.captureStream() : typeof capturableVideo.webkitCaptureStream === "function" ? capturableVideo.webkitCaptureStream() : null;
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
    if (!audioFile) { setAudioUrl(""); return; }
    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioFile]);

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
    <div className="cs-story-stage">
      <div className="cs-story-device">
        <input ref={galleryInputRef} className="cs-hidden-file-input" type="file" accept="image/*,video/*" onChange={event => { const file = event.target.files?.[0]; if (file) setLocalMedia(file); event.currentTarget.value = ""; }} />
        {stage === "camera" ? <>
          <div className="cs-story-camera-top">
            <button type="button" aria-label="Fechar câmera" onClick={() => { stopCamera(); window.location.assign("/"); }}>×</button>
            <div>
              <button type="button" aria-label="Alternar flash" onClick={() => setCameraError("O flash depende do suporte da câmera deste dispositivo.")}>ϟ</button>
              <button type="button" aria-label="Modo noturno" onClick={() => setEffect(effect === "Frio" ? "Original" : "Frio")}>☾</button>
              <button type="button" aria-label="Configurações da câmera" onClick={() => setCameraError("Escolha um dos efeitos disponíveis na barra lateral.")}>⚙</button>
            </div>
          </div>
          <div className="cs-story-camera-view">
            {cameraActive ? <video ref={cameraVideoRef} className="cs-story-live-media" autoPlay muted playsInline style={{ filter }} /> : (
              <button type="button" className="cs-story-camera-start" onClick={startCamera}>
                <span>◎</span><b>Ativar câmera</b><small>Permita o acesso para visualizar a câmera em tempo real</small>
              </button>
            )}
            <div className="cs-story-vertical-tools">
              <button type="button" aria-label="Adicionar texto" onClick={() => setCameraError("Capture ou escolha uma mídia para adicionar texto na edição.")}>Aa</button>
              <button type="button" aria-label="Modo Boomerang" onClick={() => setCameraError("O modo Boomerang ainda não está implementado.")}>∞</button>
              <button type="button" aria-label="Layout" onClick={() => setCameraError("O modo Layout ainda não está implementado.")}>▦</button>
              <button type="button" aria-label="Abrir galeria" onClick={() => galleryInputRef.current?.click()}>⌄</button>
            </div>
            <div className="cs-story-camera-hint">{recording ? "GRAVANDO" : cameraActive ? "CÂMERA ATIVA" : "CÂMERA NEXORA"} · {effect.toUpperCase()}</div>
          </div>
          {cameraError && <p className="cs-story-feedback" role="status">{cameraError}</p>}
          <div className="cs-story-capture-controls">
            <button type="button" className="cs-story-gallery" onClick={() => galleryInputRef.current?.click()} aria-label="Abrir galeria"><span>▧</span></button>
            <button type="button" className={"cs-story-shutter" + (recording ? " is-recording" : "")} onClick={!cameraActive ? startCamera : recordMode ? toggleRecording : capturePhoto} disabled={busy} aria-label={!cameraActive ? "Ativar câmera" : recordMode ? (recording ? "Parar gravação" : "Iniciar gravação") : "Capturar foto"}><i /></button>
            <button type="button" className="cs-story-effects" onClick={() => setEffect(effect === "Contraste" ? "Original" : "Contraste")} aria-label="Efeitos"><span>✧</span></button>
          </div>
          <div className="cs-story-mode-picker">
            {["POST", "STORY", "REEL", "LIVE"].map(item => <button type="button" key={item} className={mode === item ? "active" : ""} onClick={() => {
              if (item === "LIVE") { setCameraError("A criação de LIVE será disponibilizada em uma etapa própria."); return; }
              setMode(item); setCameraError("");
              if (item === "POST" || item === "REEL") { stopCamera(); onOpenEditor(item === "POST" ? "POST" : "REELS"); }
            }}>{item}</button>)}
          </div>
        </> : stage === "preview" ? <>
          <div className="cs-story-edit-top">
            <button type="button" aria-label="Voltar para câmera" onClick={() => { setStage("camera"); setCameraError(""); }}>‹</button>
            <div>
              <button type="button" aria-label="Adicionar texto" onClick={() => setEditorTool("text")}>Aa</button>
              <button type="button" aria-label="Figurinhas" onClick={() => setEditorTool("stickers")}>☻</button>
              <button type="button" aria-label="Efeitos" onClick={() => setEditorTool("effects")}>✣</button>
              <button type="button" aria-label="Música" onClick={() => setEditorTool("music")}>♫</button>
              <button type="button" aria-label="Mais opções" onClick={() => setStage("share")}>•••</button>
            </div>
          </div>
          <div className="cs-story-edit-canvas">
            {mediaUrl ? (mediaType.startsWith("video/") ? <video className="cs-story-edit-media" src={mediaUrl} controls playsInline style={{ filter }} /> : <img className="cs-story-edit-media" src={mediaUrl} alt="Prévia do Story" style={{ filter }} />) : null}
            {caption && <span className="cs-story-caption-overlay">{caption}</span>}
            {sticker && <span className="cs-story-sticker-overlay">{sticker}</span>}
          </div>
          {editorTool && <div className="cs-story-tool-sheet" role="dialog" aria-label="Ferramentas de edição do Story">
            <div className="cs-story-tool-head"><b>{editorTool === "text" ? "Texto" : editorTool === "stickers" ? "Figurinhas" : editorTool === "effects" ? "Efeitos" : "Música"}</b><button type="button" onClick={() => setEditorTool(null)} aria-label="Fechar ferramenta">×</button></div>
            {editorTool === "text" && <><textarea autoFocus value={caption} onChange={event => setCaption(event.target.value)} placeholder="Digite seu texto..." aria-label="Texto do Story"/><small>O texto aparece sobre a mídia na prévia.</small></>}
            {editorTool === "stickers" && <div className="cs-story-sticker-picker">{["❤️","✨","😂","🔥","🌙","⭐","🦋","💜","☀️","🎉","📍","💫"].map(item => <button type="button" key={item} onClick={() => { setSticker(item); setEditorTool(null); }}>{item}</button>)}<button type="button" onClick={() => { setSticker(""); setEditorTool(null); }}>Remover</button></div>}
            {editorTool === "effects" && <div className="cs-story-effect-picker">{["Original","P&B","Quente","Frio","Contraste"].map(item => <button type="button" key={item} className={effect === item ? "active" : ""} onClick={() => setEffect(item)}>{item}</button>)}</div>}
            {editorTool === "music" && <div className="cs-story-music-picker"><p>Escolha um áudio do seu dispositivo para ouvir como referência.</p><input ref={audioInputRef} type="file" accept="audio/*" onChange={event => setAudioFile(event.target.files?.[0] ?? null)}/>{audioFile && <><b>{audioFile.name}</b>{audioUrl && <audio controls src={audioUrl}/>}</>}<small>O áudio é apenas pré-visualizado nesta etapa; ainda não é incorporado ao arquivo final nem publicado.</small></div>}
            <button type="button" className="cs-story-tool-done" onClick={() => setEditorTool(null)}>Concluir</button>
          </div>}
          {cameraError && <p className="cs-story-feedback" role="status">{cameraError}</p>}
          <div className="cs-story-share-controls">
            <button type="button" className={audience === "Seu Story" ? "selected" : ""} onClick={() => setAudience("Seu Story")}><span>◉</span> Seu Story</button>
            <button type="button" className={audience === "Amigos Próximos" ? "selected close-friends" : "close-friends"} onClick={() => setAudience("Amigos Próximos")}><span>✦</span> Amigos Próximos</button>
            <button type="button" className="cs-story-share-next" onClick={() => { setEditorTool(null); setStage("share"); }} aria-label="Avançar para compartilhar">›</button>
          </div>
          <p className="cs-story-local-note">Prévia local · escolha o público e avance para revisar o compartilhamento.</p>
        </> : <>
          <div className="cs-story-edit-top"><button type="button" aria-label="Voltar à edição" onClick={() => setStage("preview")}>‹</button><b className="cs-story-share-title">Compartilhar Story</b><button type="button" aria-label="Voltar à câmera" onClick={() => { setStage("camera"); setCameraError(""); }}>×</button></div>
          <div className="cs-story-share-summary">
            {mediaUrl && (mediaType.startsWith("video/") ? <video src={mediaUrl} muted playsInline /> : <img src={mediaUrl} alt="Mídia selecionada para o Story"/>)}
            <div><b>Seu Story está pronto para revisão</b><small>{mediaFile?.name ?? "Mídia selecionada"} · {audience}</small></div>
          </div>
          <div className="cs-story-audience-screen"><b>Quem pode ver?</b><button type="button" className={audience === "Seu Story" ? "selected" : ""} onClick={() => setAudience("Seu Story")}><span>◉</span><span><strong>Seu Story</strong><small>Compartilhar com seus seguidores</small></span><i>{audience === "Seu Story" ? "✓" : ""}</i></button><button type="button" className={audience === "Amigos Próximos" ? "selected close-friends" : ""} onClick={() => setAudience("Amigos Próximos")}><span>✦</span><span><strong>Amigos Próximos</strong><small>Compartilhar apenas com sua lista</small></span><i>{audience === "Amigos Próximos" ? "✓" : ""}</i></button></div>
          {cameraError && <p className="cs-story-feedback" role="status">{cameraError}</p>}
          <div className="cs-story-final-actions"><button type="button" onClick={() => setStage("preview")}>Voltar à edição</button><button type="button" onClick={downloadStory} disabled={busy}>{busy ? "Preparando..." : "Salvar mídia"}</button></div>
          <p className="cs-story-local-note">A publicação na conta Nexora ainda não está conectada. Salvar mídia exporta o arquivo para o dispositivo.</p>
        </>}