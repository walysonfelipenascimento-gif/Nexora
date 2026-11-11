"use client";

import { useMemo, useState } from "react";
import "./creator-studio.css";

type StudioSection = "story" | "reels" | "insights" | "calendar" | "editing" | "ai" | "comments";
type Metric = { label: string; value: string; change: string };

const sections: { id: StudioSection; label: string; icon: string }[] = [
  { id: "story", label: "Story", icon: "◉" },
  { id: "reels", label: "Reels", icon: "▣" },
  { id: "insights", label: "Insights", icon: "⌁" },
  { id: "calendar", label: "Calendário", icon: "▦" },
  { id: "editing", label: "Edição", icon: "✳" },
  { id: "ai", label: "AI Creator", icon: "✧" },
  { id: "comments", label: "Comentários", icon: "▤" },
];

const metrics: Metric[] = [
  { label: "Visualizações", value: "24,892", change: "+12,8%" },
  { label: "Engajamento", value: "78,4%", change: "+8,2%" },
  { label: "Seguidores", value: "32,3K", change: "+3,5%" },
  { label: "Compartilhamentos", value: "9.942", change: "+6,1%" },
];

function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return <button className="cs-icon-button" aria-label={label} title={label}>{children}</button>;
}

function StoryStudio() {
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
            <button className="cs-ai-effect" onClick={() => setEffect("Efeito inteligente")}>✧</button>
          </div>
          <div className="cs-mode-switch">{["POST", "STORY", "REEL", "LIVE"].map(item => <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>)}</div>
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

function ReelsStudio() {
  const [tool, setTool] = useState("Camada");
  const [playing, setPlaying] = useState(false);
  return <div className="cs-editor-grid">
    <div className="cs-editor-phone">
      <div className="cs-phone-status"><span>9:41</span><span>● ◔ ▰</span></div>
      <div className="cs-editor-top"><button>↶</button><button>↷</button><button>⇧</button></div>
      <div className="cs-video-preview"><div className="cs-video-person">N</div><span>PRÉVIA DO REELS</span></div>
      <div className="cs-play-controls"><span>00:08 / 00:23</span><button onClick={() => setPlaying(!playing)}>{playing ? "Ⅱ" : "▶"}</button><span>⌄</span></div>
      <Timeline />
      <div className="cs-tool-row">{["Substituir", "Excluir", "Dividir"].map(x => <button key={x} onClick={() => setTool(x)} className={tool === x ? "active" : ""}>{x}</button>)}</div>
      <div className="cs-home-indicator" />
    </div>
    <div className="cs-editor-phone">
      <div className="cs-phone-status"><span>9:41</span><span>● ◔ ▰</span></div>
      <div className="cs-editor-top"><button>⌂</button><button>↶</button><button>↷</button><button>⇧</button></div>
      <div className="cs-video-preview cs-video-preview-alt"><div className="cs-video-person">N</div><span>EDIÇÃO MULTIFAIXA</span></div>
      <div className="cs-play-controls"><span>00:15 / 00:32</span><button onClick={() => setPlaying(!playing)}>{playing ? "Ⅱ" : "▶"}</button><span>⌄</span></div>
      <Timeline compact />
      <div className="cs-tool-row">{["Duplicar", "Camada", "Dividir", "Como clipe", "Substituir"].map(x => <button key={x} onClick={() => setTool(x)} className={tool === x ? "active" : ""}>{x}</button>)}</div>
      <div className="cs-home-indicator" />
    </div>
    <div className="cs-editor-details"><span className="cs-kicker">EDITOR MULTIFAIXA</span><h3>Controle cada camada.</h3><p>Vídeo, textos, stickers, trilha sonora e narração em faixas independentes.</p><div className="cs-option-list">{["Camada", "Dividir", "Duplicar", "Substituir", "Excluir"].map(x => <button key={x} onClick={() => setTool(x)} className={tool === x ? "selected" : ""}>{x}<span>›</span></button>)}</div></div>
  </div>;
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

function EditingStudio() {
  const [volume,setVolume]=useState(75);
  const [speed,setSpeed]=useState("1×");
  return <div className="cs-editing-layout"><div className="cs-editing-preview"><div className="cs-video-preview cs-video-preview-alt"><div className="cs-video-person">N</div></div><div className="cs-editing-controls"><button>↶</button><button>▶</button><button>↷</button></div><Timeline compact /></div><div className="cs-editing-tools"><span className="cs-kicker">AJUSTES DO CLIPE</span><h3>Controles de edição</h3><label>Volume <b>{volume}%</b></label><input type="range" min="0" max="100" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><label>Velocidade</label><div className="cs-speed-options">{["0.5×","1×","1.5×","2×"].map(x=><button key={x} className={speed===x?"active":""} onClick={()=>setSpeed(x)}>{x}</button>)}</div><div className="cs-option-list">{["Substituir clipe","Dividir clipe","Ajustar cor","Transição","Camadas"].map(x=><button key={x}>{x}<span>›</span></button>)}</div></div></div>;
}

function AIStudio() {
  const [prompt,setPrompt]=useState("");
  const [tab,setTab]=useState("Destaques");
  return <div className="cs-ai-layout"><div className="cs-ai-welcome"><span className="cs-ai-orb">✧</span><span className="cs-kicker">NEXORA AI CREATOR</span><h3>Crie além do esperado.</h3><p>Transforme ideias em conceitos visuais e projetos de vídeo.</p><button onClick={()=>document.getElementById("cs-ai-prompt")?.focus()}>Começar <span>→</span></button></div><div className="cs-ai-workspace"><div className="cs-ai-tabs">{["Destaques","Recentes","Salvos"].map(x=><button key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</div><div className="cs-ai-prompt"><label htmlFor="cs-ai-prompt">Prompt criativo</label><textarea id="cs-ai-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Descreva a cena que você imagina..." /><small>Escreva uma ideia, atmosfera, movimento ou estilo visual.</small></div><div className="cs-ai-examples"><div>Retrato cinematográfico</div><div>Movimento em câmera lenta</div><div>Atmosfera neon</div></div><button className="cs-primary-action" disabled={!prompt.trim()}>Preparar conceito</button><p className="cs-demo-note">Prévia de interface — geração de mídia requer integração própria.</p></div></div>;
}

function CommentsStudio() {
  const [comment,setComment]=useState("");
  const [items,setItems]=useState(["True fashion begins with the confidence to wear your vision.","When you wear love unapologetically, you’re already winning at style.","Sharp, sleek, and just the right shade of iconic."]);
  return <div className="cs-comments-layout"><div className="cs-comment-content"><div className="cs-comment-art">N<span>CONTEÚDO</span></div></div><div className="cs-comments-sheet"><div className="cs-sheet-handle"/><h3>Comentários <small>{items.length}</small></h3><div className="cs-comment-list">{items.map((x,i)=><div className="cs-comment" key={i}><div className="cs-avatar">{["A","J","Z","N"][i%4]}</div><div><b>{["Ava Monroe","John Brooks","Zoey Hart","Mia Cruz"][i%4]}</b><p>{x}</p><small>Responder　 Curtir</small></div><button>♡</button></div>)}</div><form onSubmit={e=>{e.preventDefault();if(comment.trim()){setItems(v=>[...v,comment.trim()]);setComment("");}}}><span>↗</span><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Adicione um comentário..." /><button type="submit">➤</button></form></div></div>;
}

export default function CreatorStudioPage() {
  const [active, setActive] = useState<StudioSection>("story");
  const title = useMemo(() => sections.find(s=>s.id===active)?.label ?? "Creator Studio",[active]);
  return <main className="cs-app">
    <header className="cs-header"><a className="cs-brand" href="/"><span>N</span>NEXORA <i>CREATOR</i></a><div className="cs-header-actions"><span className="cs-status"><i/> Ambiente independente</span><button className="cs-profile">L</button></div></header>
    <div className="cs-shell"><aside className="cs-sidebar"><div className="cs-side-label">ESTÚDIO</div>{sections.map(s=><button key={s.id} className={active===s.id?"active":""} onClick={()=>setActive(s.id)}><span>{s.icon}</span>{s.label}</button>)}<div className="cs-side-foot"><span>WORKSPACE</span><b>Nexora Creator</b><small>Prévia independente</small></div></aside><section className="cs-main"><div className="cs-page-heading"><div><span className="cs-kicker">NEXORA / CREATOR STUDIO</span><h1>{title}</h1></div><span className="cs-demo-badge">AMBIENTE DE PRÉVIA</span></div>{active==="story"&&<StoryStudio/>}{active==="reels"&&<ReelsStudio/>}{active==="insights"&&<InsightsStudio/>}{active==="calendar"&&<CalendarStudio/>}{active==="editing"&&<EditingStudio/>}{active==="ai"&&<AIStudio/>}{active==="comments"&&<CommentsStudio/>}</section></div>
  </main>;
}
