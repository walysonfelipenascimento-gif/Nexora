"use client";

import { useEffect, useRef, useState } from "react";

type Reel = {
  id: number;
  user: string;
  name: string;
  avatar: string;
  caption: string;
  song: string;
  likes: number;
  comments: number;
  shares: number;
  video: string;
  tint: string;
};

const demoReels: Reel[] = [
  { id: 1, user: "risadadodia", name: "Risada do Dia", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "POV: você fala “só vou descansar 5 minutinhos” e acorda em outra dimensão 😂", song: "Comédia cotidiana · áudio demo", likes: 28400, comments: 1840, shares: 927, video: "https://videos.pexels.com/video-files/3129671/3129671-hd_1080_1920_25fps.mp4", tint: "sunset" },
  { id: 2, user: "mundosempressa", name: "Mundo sem pressa", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop", caption: "Um lugar tão surreal que parece outro planeta. Você visitaria? 🌋", song: "Natureza em foco · áudio demo", likes: 19300, comments: 742, shares: 1260, video: "https://videos.pexels.com/video-files/854982/854982-hd_1080_1920_25fps.mp4", tint: "violet" },
  { id: 3, user: "memes.da.nexa", name: "Memes da Nexa", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop", caption: "Eu ensaiando a resposta perfeita… e na hora falando “pois é né” 🤡", song: "Humor de milhões · áudio demo", likes: 36200, comments: 2310, shares: 3100, video: "https://videos.pexels.com/video-files/3195394/3195394-hd_1080_1920_25fps.mp4", tint: "violet" },
  { id: 4, user: "rotas.secretas", name: "Rotas Secretas", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop", caption: "Uma lagoa escondida entre montanhas. Salva esse destino para sonhar depois. 💎", song: "Diário de viagem · áudio demo", likes: 15700, comments: 598, shares: 1830, video: "https://videos.pexels.com/video-files/855028/855028-hd_1080_1920_25fps.mp4", tint: "sunset" },
  { id: 5, user: "vida.real.ofc", name: "Vida Real", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop", caption: "Quando a pessoa diz “não estou com fome” e começa a comer do seu prato 😭🍟", song: "Expectativa x realidade · áudio demo", likes: 42100, comments: 3050, shares: 2870, video: "https://videos.pexels.com/video-files/857195/857195-hd_1080_1920_25fps.mp4", tint: "violet" },
  { id: 6, user: "planeta.incrivel", name: "Planeta Incrível", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop", caption: "A natureza caprichou nesse cenário. Parece até um papel de parede vivo. 🌌", song: "Natureza relaxante · áudio demo", likes: 22100, comments: 914, shares: 2430, video: "https://videos.pexels.com/video-files/856857/856857-hd_1080_1920_25fps.mp4", tint: "sunset" },
  { id: 7, user: "sinceramente.eu", name: "Sinceramente", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu: hoje vou dormir cedo. Também eu às 02:47: pesquisando coisas aleatórias 😂", song: "Pensamentos da madrugada · áudio demo", likes: 33700, comments: 1980, shares: 1680, video: "https://videos.pexels.com/video-files/853889/853889-hd_1080_1920_25fps.mp4", tint: "violet" },
  { id: 8, user: "fora.do.mapa", name: "Fora do Mapa", avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120&h=120&fit=crop", caption: "Uma trilha, um horizonte infinito e zero vontade de voltar pra rotina. 🏞️", song: "Aventura pelo mundo · áudio demo", likes: 18900, comments: 667, shares: 1520, video: "https://videos.pexels.com/video-files/857251/857251-hd_1080_1920_25fps.mp4", tint: "sunset" },
  { id: 9, user: "caos.organizado", name: "Caos Organizado", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop", caption: "A confiança que eu tenho antes de abrir a câmera frontal sem querer 💀", song: "Humor sem contexto · áudio demo", likes: 29800, comments: 1420, shares: 2140, video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", tint: "violet" },
  { id: 10, user: "nexora.criadores", name: "Nexora Criadores", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop", caption: "Seu lembrete de hoje: você merece uma pausa e um momento bom. 💜", song: "Som original · Nexora", likes: 12840, comments: 836, shares: 294, video: "https://www.w3schools.com/html/mov_bbb.mp4", tint: "sunset" },
];

const navItems = [
  { id: "inicio", label: "Início", icon: "home", href: "/" },
  { id: "reels", label: "Reels", icon: "reels", href: "/reels" },
  { id: "criar", label: "Criar", icon: "plus", href: "/?action=create" },
  { id: "mensagens", label: "Mensagens", icon: "messages", href: "/?tab=mensagens" },
  { id: "perfil", label: "Perfil", icon: "profile", href: "/?tab=perfil" },
];


function UiIcon({ name, size = 22 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h5v-7h4v7h5V9"/></>,
    reels: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4z"/><path d="m7 4 3 4M15 4l3 4"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    messages: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M7.5 11.5h.01M12 11.5h.01M16.5 11.5h.01"/></>,
    profile: <><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    heart: <path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>,
    comment: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h8M8 14h5"/></>,
    bookmark: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4Z"/>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4M8.7 13.4l6.6 4"/></>,
    creator: <><path d="M12 3 14.7 8.3 21 9.2l-4.5 4.4 1.1 6.3L12 17l-5.6 2.9 1.1-6.3L3 9.2l6.3-.9Z"/></>,
    sound: <><path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15 9a5 5 0 0 1 0 6M17.5 6.5a9 9 0 0 1 0 11"/></>,
    music: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    chart: <><path d="M4 19V5M4 19h17"/><rect x="7" y="11" width="3" height="5" rx=".5"/><rect x="13" y="7" width="3" height="9" rx=".5"/><rect x="19" y="4" width="2" height="12" rx=".5"/></>,
    edit: <><path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4Z"/><path d="m14.8 5.7 3.5 3.5"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    play: <path d="m9 6 10 6-10 6z" fill="currentColor" stroke="none"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg {...common}>{paths[name] || paths.creator}</svg>;
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export default function ReelsPage() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [creatorTools, setCreatorTools] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<Record<number, string[]>>({
    1: ["Que paz esse vídeo! 💜", "Precisava ver isso hoje ✨"],
    2: ["Amei a energia!", "Mais vídeos assim, por favor 💙"],
  });
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheelMove = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reel = demoReels[index];

  useEffect(() => {
    if (!videoRef.current) return;
    if (paused) videoRef.current.pause();
    else { videoRef.current.currentTime = 0; videoRef.current.play().catch(() => undefined); }
  }, [paused, index]);

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (commentsOpen || creatorTools) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") { event.preventDefault(); move(1); }
      if (event.key === "ArrowUp" || event.key === "PageUp") { event.preventDefault(); move(-1); }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [commentsOpen, creatorTools]);

  function move(delta: number) {
    setIndex((current) => Math.max(0, Math.min(demoReels.length - 1, current + delta)));
    setPaused(false);
    setCommentsOpen(false);
    setCreatorTools(false);
  }

  function shareReel() {
    const url = window.location.href + "#reel-" + reel.id;
    if (navigator.share) {
      navigator.share({ title: "Reels da Nexora", text: reel.caption, url }).catch(() => undefined);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => alert("Link demonstrativo copiado!")).catch(() => alert(url));
    } else {
      alert(url);
    }
  }

  function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = commentDraft.trim();
    if (!text) return;
    setComments((current) => ({ ...current, [reel.id]: [...(current[reel.id] || []), text] }));
    setCommentDraft("");
  }

  return (
    <main className="reels-app">
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; background: #05060b; color: #fff; }
        .reels-app { --cyan: #53e7ff; --purple: #9b6bff; min-height: 100dvh; height: 100dvh; overflow: hidden; background: #05060b; color: #fff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; }
        .reels-top { position: absolute; z-index: 5; inset: env(safe-area-inset-top) 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 16px 18px 12px; background: linear-gradient(#05060bd9, transparent); pointer-events: none; }
        .reels-top > * { pointer-events: auto; }
        .reels-brand { display:flex; align-items:center; gap:9px; font-size:19px; font-weight:850; letter-spacing:-.6px; }
        .reels-mark { display:grid; place-items:center; width:32px; height:32px; border-radius:11px; font-size:20px; font-weight:900; background:linear-gradient(140deg,#49e5ff,#8b65ff 60%,#e05cff); box-shadow:0 0 22px #7764ff60; }
        .reels-top-label { font-size:12px; color:#d8d8e8; border:1px solid #ffffff24; background:#10111caa; border-radius:20px; padding:8px 11px; backdrop-filter:blur(12px); }
        .reel-stage { position:relative; width:100%; height:100%; max-width:560px; margin:auto; overflow:hidden; background:#12121d; }
        .reel-video { width:100%; height:100%; object-fit:cover; background:#12121d; touch-action:pan-x; }
        .reel-vignette { position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg,#0008 0%,transparent 20%,transparent 43%,#05050a24 55%,#05050be8 100%); }
        .reel-top-controls { position:absolute; top:76px; left:14px; right:14px; display:flex; justify-content:space-between; align-items:center; }
        .glass-chip { display:flex; gap:7px; align-items:center; border:1px solid #ffffff26; border-radius:99px; padding:8px 11px; color:white; background:#08091470; backdrop-filter:blur(16px); font-size:11px; font-weight:750; }
        .live-dot { width:6px; height:6px; background:#53e7ff; border-radius:50%; box-shadow:0 0 10px #53e7ff; }
        .reel-side-actions { position:absolute; right:12px; bottom:calc(94px + env(safe-area-inset-bottom)); display:flex; flex-direction:column; align-items:center; gap:17px; }
        .reel-action { border:0; background:transparent; color:white; padding:0; display:flex; flex-direction:column; align-items:center; gap:5px; min-width:46px; cursor:pointer; text-shadow:0 2px 8px #000a; }
        .reel-action-icon { width:43px; height:43px; border:1px solid #ffffff38; border-radius:16px; display:grid; place-items:center; background:#11121c78; backdrop-filter:blur(12px); font-size:23px; transition:transform .16s, background .16s; }
        .reel-action:active .reel-action-icon { transform:scale(.9); }
        .reel-action.active .reel-action-icon { color:#ff5b9a; background:#7a224b9c; border-color:#ff8ab9a0; }
        .reel-action small { font-size:10px; font-weight:800; letter-spacing:.1px; }
        .reel-disc { width:39px; height:39px; border-radius:50%; border:2px solid #fff; padding:3px; background:linear-gradient(135deg,#50e6ff,#a66aff,#ff62b0); }
        .reel-disc img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
        .reel-info { position:absolute; left:16px; right:76px; bottom:calc(94px + env(safe-area-inset-bottom)); }
        .reel-author-row { display:flex; align-items:center; gap:9px; margin-bottom:11px; }
        .reel-avatar { width:38px; height:38px; border:2px solid #fff; border-radius:50%; object-fit:cover; }
        .reel-author { font-size:13px; font-weight:850; text-shadow:0 2px 8px #000; }
        .reel-follow { border:1px solid #ffffff9c; background:#ffffff12; color:#fff; padding:6px 10px; border-radius:9px; font-size:10px; font-weight:800; backdrop-filter:blur(10px); }
        .reel-caption { font-size:13px; line-height:1.5; margin:0 0 12px; text-shadow:0 2px 9px #000; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .reel-audio { display:flex; align-items:center; gap:8px; font-size:11px; color:#f1efff; min-width:0; }
        .reel-audio span:last-child { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .reel-progress { position:absolute; bottom:calc(81px + env(safe-area-inset-bottom)); left:15px; right:15px; height:3px; background:#ffffff52; border-radius:9px; overflow:hidden; }
        .reel-progress-fill { height:100%; width:38%; background:linear-gradient(90deg,#4de6ff,#9b6bff,#f06bce); border-radius:9px; transition:width .25s ease; }
        .reels-nav { position:absolute; z-index:10; bottom:0; left:0; right:0; min-height:68px; padding:8px 6px calc(7px + env(safe-area-inset-bottom)); display:flex; justify-content:space-around; align-items:center; background:#080910ed; border-top:1px solid #ffffff13; backdrop-filter:blur(22px); }
        .reels-nav-item { display:flex; flex:1; flex-direction:column; align-items:center; gap:4px; text-decoration:none; color:#a5a6b8; font-size:10px; font-weight:650; transition:color .18s ease, transform .18s ease; }
        .reels-nav-icon { width:35px; height:29px; display:grid; place-items:center; font-size:22px; border-radius:11px; }
        .reels-nav-item:active { transform:scale(.94); } .reels-nav-item.active { color:#75eaff; }
        .reels-nav-item.active .reels-nav-icon { color:#fff; background:linear-gradient(135deg,#367bff,#9c54f5); box-shadow:0 4px 18px #7458ff55; }
        .reels-overlay { position:absolute; z-index:20; inset:0; display:flex; align-items:flex-end; background:#0007; backdrop-filter:blur(5px); }
        .reels-sheet { width:100%; max-height:74%; overflow:auto; border-radius:24px 24px 0 0; padding:16px 17px calc(18px + env(safe-area-inset-bottom)); background:#10111c; border:1px solid #ffffff16; box-shadow:0 -15px 50px #0007; }
        .reels-sheet-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; font-weight:850; }
        .reels-close { border:0; color:#fff; background:#ffffff14; border-radius:50%; width:34px; height:34px; font-size:18px; }
        .reels-comment { font-size:13px; line-height:1.5; color:#e8e8f3; padding:10px 0; border-bottom:1px solid #ffffff0d; }
        .reels-comment-form { display:flex; gap:8px; margin-top:13px; }
        .reels-comment-form input { flex:1; min-width:0; border:1px solid #ffffff20; background:#070811; color:white; border-radius:13px; padding:12px; outline:none; }
        .reels-comment-form button,.reels-primary { border:0; color:#fff; background:linear-gradient(110deg,#367bff,#9754f5); padding:11px 14px; border-radius:12px; font-weight:800; }
        .reels-tools { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .reels-tool { text-align:left; padding:13px; border:1px solid #ffffff17; border-radius:14px; background:#ffffff08; color:white; }
        .reels-tool strong { display:block; font-size:12px; margin-bottom:5px; }
        .reels-tool span { display:block; font-size:10px; color:#aaaec4; line-height:1.4; }
        .reel-center-play { position:absolute; top:48%; left:50%; transform:translate(-50%,-50%); border:1px solid #ffffff48; background:#0809149c; backdrop-filter:blur(12px); width:64px; height:64px; border-radius:50%; color:white; font-size:25px; }
        @media (min-width:700px) { .reels-app { background:radial-gradient(ellipse at 50% 35%,#211947,#05060b 65%); } .reel-stage { border-left:1px solid #ffffff12; border-right:1px solid #ffffff12; } .reels-nav { max-width:560px; left:50%; transform:translateX(-50%); border-radius:18px 18px 0 0; } }
        @media (max-height:650px) { .reel-side-actions { gap:10px; bottom:92px; } .reel-action-icon { width:36px; height:36px; border-radius:13px; } .reel-info { bottom:92px; } .reel-progress { bottom:79px; } .reel-top-controls { top:65px; } }
      `}</style>

      <header className="reels-top">
        <div className="reels-brand"><span className="reels-mark"><UiIcon name="reels" size={21} /></span><span>Nexora <span style={{ color: "#77eaff" }}>Reels</span></span></div>
        <button className="reels-top-label" onClick={() => setCreatorTools(true)}>✦ Modo criador</button>
      </header>

      <section className="reel-stage" aria-label="Visualizador de Reels"
        onWheel={(event) => { if (commentsOpen || creatorTools) return; const now = Date.now(); if (Math.abs(event.deltaY) > 35 && now - lastWheelMove.current > 520) { move(event.deltaY > 0 ? 1 : -1); lastWheelMove.current = now; } }}
        onTouchStart={(event) => { const t = event.touches[0]; touchStart.current = t ? { x: t.clientX, y: t.clientY } : null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current; if (!start || commentsOpen || creatorTools) { touchStart.current = null; return; }
          const t = event.changedTouches[0]; if (!t) return;
          const dx = t.clientX - start.x; const dy = t.clientY - start.y;
          if (Math.abs(dy) > 48 && Math.abs(dy) > Math.abs(dx) * 1.2) move(dy < 0 ? 1 : -1);
          touchStart.current = null;
        }}>
        <video key={reel.id} ref={videoRef} className="reel-video" src={reel.video} playsInline loop muted={muted} onClick={() => setPaused((v) => !v)} onError={() => setPaused(true)} />
        <div className="reel-vignette" />
        <div className="reel-top-controls">
          <span className="glass-chip"><span className="live-dot" /> PARA VOCÊ</span>
          <button className="glass-chip" onClick={() => setMuted((v) => !v)} aria-label={muted ? "Ativar som" : "Silenciar"}><><UiIcon name="sound" size={15} /> {muted ? "Ativar som" : "Silenciar"}</></button>
        </div>
        {paused && <button className="reel-center-play" onClick={() => setPaused(false)} aria-label="Reproduzir">▶</button>}

        <aside className="reel-side-actions" aria-label="Ações do Reel">
          <button className={`reel-action ${liked[reel.id] ? "active" : ""}`} onClick={() => setLiked((v) => ({ ...v, [reel.id]: !v[reel.id] }))}><span className="reel-action-icon"><UiIcon name="heart" size={24} /></span><small>{compactNumber(reel.likes + (liked[reel.id] ? 1 : 0))}</small></button>
          <button className="reel-action" onClick={() => { setCommentsOpen(true); setPaused(true); }}><span className="reel-action-icon"><UiIcon name="comment" size={23} /></span><small>{compactNumber(reel.comments + Math.max(0, (comments[reel.id]?.length || 0) - 2))}</small></button>
          <button className={`reel-action ${saved[reel.id] ? "active" : ""}`} onClick={() => setSaved((v) => ({ ...v, [reel.id]: !v[reel.id] }))}><span className="reel-action-icon"><UiIcon name="bookmark" size={22} /></span><small>{saved[reel.id] ? "Salvo" : "Salvar"}</small></button>
          <button className="reel-action" onClick={shareReel}><span className="reel-action-icon"><UiIcon name="share" size={22} /></span><small>{compactNumber(reel.shares)}</small></button>
          <button className="reel-action" onClick={() => setCreatorTools(true)} aria-label="Ferramentas do criador"><span className="reel-disc"><img src={reel.avatar} alt="" /></span><small>Criador</small></button>
        </aside>

        <div className="reel-info">
          <div className="reel-author-row">
            <img className="reel-avatar" src={reel.avatar} alt={reel.name} />
            <span className="reel-author">@{reel.user}</span>
            <button className="reel-follow" onClick={() => setFollowing((v) => ({ ...v, [reel.user]: !v[reel.user] }))}>{following[reel.user] ? "✓ Seguindo" : "+ Seguir"}</button>
          </div>
          <p className="reel-caption">{reel.caption}</p>
          <div className="reel-audio"><span><UiIcon name="music" size={14} /></span><span>{reel.song}</span><span>·</span><span>{index + 1}/{demoReels.length}</span></div>
        </div>
        <div className="reel-progress"><div className="reel-progress-fill" style={{ width: `${((index + 1) / demoReels.length) * 100}%` }} /></div>
      </section>

      <nav className="reels-nav" aria-label="Navegação principal">
        {navItems.map((item) => <a key={item.id} href={item.href} className={`reels-nav-item ${item.id === "reels" ? "active" : ""}`}><span className="reels-nav-icon"><UiIcon name={item.icon} size={21} /></span><span>{item.label}</span></a>)}
      </nav>

      {commentsOpen && <div className="reels-overlay" onClick={() => { setCommentsOpen(false); setPaused(false); }}>
        <section className="reels-sheet" onClick={(event) => event.stopPropagation()}>
          <div className="reels-sheet-head"><span>Comentários <span style={{ color: "#7ceaff" }}>· {(comments[reel.id] || []).length}</span></span><button className="reels-close" onClick={() => { setCommentsOpen(false); setPaused(false); }}>×</button></div>
          {(comments[reel.id] || []).map((comment, i) => <div className="reels-comment" key={i}><strong>@comunidade</strong> {comment}</div>)}
          <form className="reels-comment-form" onSubmit={submitComment}><input value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} placeholder="Comente com respeito..." maxLength={500} /><button type="submit">Enviar</button></form>
        </section>
      </div>}

      {creatorTools && <div className="reels-overlay" onClick={() => setCreatorTools(false)}>
        <section className="reels-sheet" onClick={(event) => event.stopPropagation()}>
          <div className="reels-sheet-head"><span><UiIcon name="creator" size={18} /> Central do criador</span><button className="reels-close" onClick={() => setCreatorTools(false)}>×</button></div>
          <p style={{ color: "#aeb0c5", fontSize: 12, lineHeight: 1.6, marginTop: 0 }}>Ferramentas de demonstração para organizar e acompanhar este Reel. A gestão real será conectada à conta do autor na etapa de integração.</p>
          <div className="reels-tools">
            <button className="reels-tool" onClick={() => alert("Estatísticas demonstrativas: alcance " + compactNumber(reel.likes * 4) + " · interações " + compactNumber(reel.likes + reel.comments))}><strong><UiIcon name="chart" size={16} /> Visão geral</strong><span>Alcance, interações e desempenho</span></button>
            <button className="reels-tool" onClick={() => alert("A edição estará disponível quando os Reels estiverem vinculados à sua conta.")}><strong><UiIcon name="edit" size={16} /> Editar Reel</strong><span>Legenda, capa e informações</span></button>
            <button className="reels-tool" onClick={() => alert("Preferências de comentários demonstrativas nesta versão.")}><strong><UiIcon name="comment" size={16} /> Comentários</strong><span>Preferências e moderação</span></button>
            <button className="reels-tool" onClick={() => { setSaved((v) => ({ ...v, [reel.id]: !v[reel.id] })); setCreatorTools(false); }}><strong><UiIcon name="bookmark" size={16} /> {saved[reel.id] ? "Remover dos salvos" : "Guardar Reel"}</strong><span>Adicionar aos seus favoritos locais</span></button>
          </div>
        </section>
      </div>}
    </main>
  );
}
