"use client";

import { useMemo, useRef, useState, type ReactNode, type FormEvent } from "react";
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

const metrics: Metric[] = [
  { label: "Visualizações", value: "24,892", change: "+12,8%" },
  { label: "Engajamento", value: "78,4%", change: "+8,2%" },
  { label: "Seguidores", value: "32,3K", change: "+3,5%" },
  { label: "Compartilhamentos", value: "9.942", change: "+6,1%" },
];

function IconButton({ children, label }: { children: ReactNode; label: string }) {
  return <button className="cs-icon-button" aria-label={label} title={label}>{children}</button>;
}

function StoryStudio({ onOpenEditor }: { onOpenEditor: (format: "POST" | "REELS") => void }) {
  const [mode, setMode] = useState("STORY");
  const [stage, setStage] = useState<"camera" | "preview">("camera");
  const [flash, setFlash] = useState(false);
  const [effect, setEffect] = useState("Original");
  const [caption, setCaption] = useState("");
  const [audience, setAudience] = useState("Seu Story");
  const [selected, setSelected] = useState("Câmera");
  return (
    <div className="cs-story-layout">
      <div className="cs-phone cs-camera-phone">
        <div className="cs-phone-status"><span>9:41</span><span>● ◔ ▰</span></div>
        {stage === "camera" ? <>
          <div className="cs-camera-top">
            <IconButton label="Fechar">×</IconButton>
            <div className="cs-camera-top-actions">
              <IconButton label="Flash" ><span onClick={() => setFlash(!flash)}>{flash ? "ϟ" : "♢"}</span></IconButton>
              <IconButton label="Efeitos">✦</IconButton>
              <IconButton label="Configurações">⚙</IconButton>
            </div>
          </div>
          <div className="cs-camera-view">
            <div className="cs-night-scene"><div className="cs-moon" /><div className="cs-camp-tent" /><div className="cs-camp-fire" /></div>
            <div className="cs-camera-tools">
              <button onClick={() => setEffect("Texto")}>Aa</button>
              <button onClick={() => setEffect("Boomerang")}>∞</button>
              <button onClick={() => setEffect("Layout")}>▦</button>
              <button onClick={() => setEffect("Mais")}>⌄</button>
            </div>
            <span className="cs-effect-label">{effect}</span>
          </div>
          <div className="cs-capture-row">
            <button className="cs-gallery-thumb" onClick={() => { setSelected("Galeria"); setStage("preview"); }} aria-label="Abrir galeria">▧</button>
            <button className="cs-shutter" onClick={() => setStage("preview")} aria-label="Capturar" />
            <button className="cs-creative-effect" onClick={() => setEffect("Efeito inteligente")}>✧</button>
          </div>
          <div className="cs-mode-switch">{["POST", "STORY", "REEL", "LIVE"].map(item => <button key={item} className={mode === item ? "active" : ""} onClick={() => { setMode(item); if (item === "POST" || item === "REEL") onOpenEditor(item === "POST" ? "POST" : "REELS"); }}>{item}</button>)}</div>
        </> : <>
          <div className="cs-preview-top"><button onClick={() => setStage("camera")}>‹</button><div><button>Aa</button><button>▧</button><button>✦</button><button>♫</button><button>•••</button></div></div>
          <div className="cs-story-preview">
            <div className="cs-night-scene"><div className="cs-moon" /><div className="cs-camp-tent" /><div className="cs-camp-fire" /></div>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Adicionar texto..." aria-label="Texto do Story" />
          </div>
          <div className="cs-publish-row">
            <button className={audience === "Seu Story" ? "selected" : ""} onClick={() => setAudience("Seu Story")}>◉ Seu Story</button>
            <button className={audience === "Amigos Próximos" ? "selected" : ""} onClick={() => setAudience("Amigos Próximos")}>✦ Amigos Próximos</button>
            <button className="cs-next" onClick={() => setStage("camera")}>➜</button>
          </div>
        </>}
        <div className="cs-home-indicator" />
      </div>
      <div className="cs-story-side">
        <span className="cs-kicker">CAPTURA E PUBLICAÇÃO</span>
        <h3>{stage === "camera" ? "Registre o momento." : "Sua história, do seu jeito."}</h3>
        <p>{stage === "camera" ? "Câmera em tela cheia, modos de captura, galeria e ferramentas de acesso rápido." : "Revise a mídia, adicione elementos e escolha o público antes de compartilhar."}</p>
        <div className="cs-option-list">
          {["Câmera", "Galeria", "Texto", "Boomerang", "Layout"].map(item => <button key={item} className={selected === item ? "selected" : ""} onClick={() => { setSelected(item); if (item === "Galeria") setStage("preview"); else setEffect(item); }}>{item}<span>›</span></button>)}
        </div>
      </div>
    </div>
  );
}

function Timeline({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "cs-timeline compact" : "cs-timeline"}>
    <div className="cs-time-ruler"><span>00:00</span><span>00:05</span><span>00:10</span><span>00:15</span><span>00:20</span><span>00:25</span></div>
    <div className="cs-track cs-track-text"><span>Aa</span><b>Legenda · texto na tela</b></div>
    <div className="cs-track cs-track-sticker"><span>✧</span><b>Sticker / elemento</b></div>
    <div className="cs-track cs-track-audio"><span>♫</span><b>Trilha sonora · áudio</b></div>
    <div className="cs-track cs-track-voice"><span>◖</span><b>Narração / Voice-over</b></div>
    <div className="cs-track cs-track-video"><span>▣</span><b>▥ ▥ ▥ ▥ ▥ ▥ ▥ ▥</b></div>
    <div className="cs-playhead" />
  </div>;
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
  const selected = clips.find(clip => clip.id === selectedId) ?? clips[0];
  const filterStyle = filter === "P&B" ? "grayscale(1)" : filter === "Quente" ? "sepia(.35) saturate(1.25)" : filter === "Frio" ? "hue-rotate(12deg) saturate(.85)" : filter === "Contraste" ? "contrast(1.3) saturate(1.1)" : "none";
  function importMedia(files: FileList | null) {
    if (!files?.length) return;
    const accepted = Array.from(files).filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (!accepted.length) { setNotice("Formato não suportado. Escolha imagens ou vídeos."); return; }
    const added = accepted.map(file => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file), start: 0, end: 0 }));
    setClips(current => [...current, ...added]); setSelectedId(added[0].id); setPlayhead(0);
    setNotice(accepted.length + " arquivo(s) importado(s) localmente. Ainda não foram enviados para a Nexora.");
  }
  function updateClip(id: string, patch: Partial<EditorClip>) { setClips(current => current.map(clip => clip.id === id ? { ...clip, ...patch } : clip)); }
  function removeSelected() { if (!selected) return; const remaining=clips.filter(clip=>clip.id!==selected.id); setClips(remaining); setSelectedId(remaining[0]?.id??""); setPlayhead(0); setPlaying(false); setNotice("Clipe removido da sequência."); }
  function duplicateSelected() { if (!selected) return; const copy={...selected,id:crypto.randomUUID(),url:URL.createObjectURL(selected.file)}; const index=clips.findIndex(clip=>clip.id===selected.id); setClips(current=>[...current.slice(0,index+1),copy,...current.slice(index+1)]); setNotice("Clipe duplicado na sequência."); }
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
        <label className="cs-audio-picker">＋ Adicionar faixa de áudio<input type="file" accept="audio/*" onChange={event=>{const file=event.target.files?.[0]??null;setAudioFile(file);setAudioUrl(file?URL.createObjectURL(file):"");}}/></label>{audioFile&&<div className="cs-audio-file"><b>Áudio selecionado:</b> {audioFile.name}<audio controls src={audioUrl}/></div>}
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
    <div className="cs-metric-grid">{metrics.map(m=><div className="cs-metric" key={m.label}><span>{m.label}</span><b>{m.value}</b><small>{m.change} <em>vs. período anterior</em></small></div>)}</div>
    <div className="cs-insights-grid"><MiniChart title="Retenção de audiência" value="68%" /><MiniChart title="Visualizações em tempo real" value="24,892" kind="bars" /><MiniChart title="Engajamento por conteúdo" value="78,4%" /><MiniChart title="Origem do tráfego" value="Distribuição" kind="bars" /></div>
    <div className="cs-audience-row"><div><span className="cs-kicker">AUDIÊNCIA</span><h4>Conheça quem acompanha seu conteúdo</h4><p>Localização, atividade e evolução do público.</p></div><div className="cs-donut"><span>72%<small>atividade</small></span></div></div>
  </div>;
}

function CalendarStudio() {
  const [month, setMonth] = useState("Outubro 2026");
  const [selectedDay, setSelectedDay] = useState(2);
  const [caption, setCaption] = useState("");
  return <div className="cs-calendar-grid">
    <div className="cs-calendar-panel"><div className="cs-calendar-head"><div><span className="cs-kicker">PLANEJAMENTO</span><h3>Calendário editorial</h3></div><select value={month} onChange={e=>setMonth(e.target.value)}><option>Outubro 2026</option><option>Novembro 2026</option><option>Dezembro 2026</option></select></div><div className="cs-calendar-days">{["D","S","T","Q","Q","S","S"].map((x,i)=><span key={i}>{x}</span>)}{Array.from({length:35},(_,i)=>{const d=i-2;return <button key={i} disabled={d<1||d>31} className={selectedDay===d?"selected":""} onClick={()=>setSelectedDay(d)}>{d>0&&d<=31?d:""}{[2,8,14,21,27].includes(d)&&<i/>}</button>})}</div><div className="cs-schedule-list"><b>{selectedDay} de {month}</b><p><i/> 10:30 · Carrossel com dicas</p><p><i/> 16:00 · Story de bastidores</p><p><i/> 20:00 · Mini vlog / Reels</p></div></div>
    <div className="cs-compose-panel"><span className="cs-kicker">NOVA PUBLICAÇÃO</span><h3>Criar e agendar</h3><div className="cs-upload-box">＋<span>Adicionar mídia</span></div><textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Adicione uma legenda..." /><div className="cs-compose-options">{["Escolher formato", "Hashtags", "Adicionar localização", "Agendar publicação"].map(x=><button key={x}>{x}<span>›</span></button>)}</div><button className="cs-primary-action">Salvar rascunho</button></div>
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
