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
  {
    id: 1,
    user: "nexora.criadores",
    name: "Nexora Criadores",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    caption: "Um respiro no meio da correria. 🌅 Qual foi seu momento favorito de hoje?",
    song: "Som original · Nexora",
    likes: 12840,
    comments: 836,
    shares: 294,
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    tint: "sunset",
  },
  {
    id: 2,
    user: "mundosempressa",
    name: "Mundo sem pressa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    caption: "Pequenos detalhes, grandes histórias. 💫 Salve para assistir de novo.",
    song: "Vibe leve · áudio demonstrativo",
    likes: 9732,
    comments: 421,
    shares: 182,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    tint: "violet",
  },
];

const navItems = [
  { id: "inicio", label: "Início", icon: "⌂", href: "/" },
  { id: "reels", label: "Reels", icon: "▷", href: "/reels" },
  { id: "explorar", label: "Explorar", icon: "⌕", href: "/?tab=explorar" },
  { id: "criar", label: "Criar", icon: "+", href: "/?action=create" },
  { id: "oportunidades", label: "Oportunidades", icon: "◇", href: "/?tab=oportunidades" },
  { id: "perfil", label: "Perfil", icon: "○", href: "/?tab=perfil" },
];

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
  const touchStart = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reel = demoReels[index];

  useEffect(() => {
    if (!videoRef.current) return;
    if (paused) videoRef.current.pause();
    else videoRef.current.play().catch(() => undefined);
  }, [paused, index]);

  function move(delta: number) {
    setIndex((current) => (current + delta + demoReels.length) % demoReels.length);
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
        .reel-video { width:100%; height:100%; object-fit:cover; background:#12121d; }
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
        .reel-progress-fill { height:100%; width:38%; background:linear-gradient(90deg,#4de6ff,#9b6bff,#f06bce); border-radius:9px; }
        .reels-nav { position:absolute; z-index:10; bottom:0; left:0; right:0; min-height:68px; padding:8px 6px calc(7px + env(safe-area-inset-bottom)); display:flex; justify-content:space-around; align-items:center; background:#080910ed; border-top:1px solid #ffffff13; backdrop-filter:blur(22px); }
        .reels-nav-item { display:flex; flex:1; flex-direction:column; align-items:center; gap:4px; text-decoration:none; color:#a5a6b8; font-size:10px; font-weight:650; }
        .reels-nav-icon { width:35px; height:29px; display:grid; place-items:center; font-size:22px; border-radius:11px; }
        .reels-nav-item.active { color:#75eaff; }
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
        <div className="reels-brand"><span className="reels-mark">▷</span><span>Nexora <span style={{ color: "#77eaff" }}>Reels</span></span></div>
        <button className="reels-top-label" onClick={() => setCreatorTools(true)}>✦ Modo criador</button>
      </header>

      <section className="reel-stage" aria-label="Visualizador de Reels"
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientY ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = (event.changedTouches[0]?.clientY ?? touchStart.current) - touchStart.current;
          if (Math.abs(delta) > 55) move(delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}>
        <video key={reel.id} ref={videoRef} className="reel-video" src={reel.video} playsInline loop muted={muted} onClick={() => setPaused((v) => !v)} onError={() => setPaused(true)} />
        <div className="reel-vignette" />
        <div className="reel-top-controls">
          <span className="glass-chip"><span className="live-dot" /> PARA VOCÊ</span>
          <button className="glass-chip" onClick={() => setMuted((v) => !v)} aria-label={muted ? "Ativar som" : "Silenciar"}>{muted ? "♪̸ Som" : "♫ Som"}</button>
        </div>
        {paused && <button className="reel-center-play" onClick={() => setPaused(false)} aria-label="Reproduzir">▶</button>}

        <aside className="reel-side-actions" aria-label="Ações do Reel">
          <button className={`reel-action ${liked[reel.id] ? "active" : ""}`} onClick={() => setLiked((v) => ({ ...v, [reel.id]: !v[reel.id] }))}><span className="reel-action-icon">{liked[reel.id] ? "♥" : "♡"}</span><small>{compactNumber(reel.likes + (liked[reel.id] ? 1 : 0))}</small></button>
          <button className="reel-action" onClick={() => { setCommentsOpen(true); setPaused(true); }}><span className="reel-action-icon">☷</span><small>{compactNumber(reel.comments + (comments[reel.id]?.length || 0) - 2)}</small></button>
          <button className={`reel-action ${saved[reel.id] ? "active" : ""}`} onClick={() => setSaved((v) => ({ ...v, [reel.id]: !v[reel.id] }))}><span className="reel-action-icon">{saved[reel.id] ? "▣" : "♧"}</span><small>{saved[reel.id] ? "Salvo" : "Salvar"}</small></button>
          <button className="reel-action" onClick={shareReel}><span className="reel-action-icon">↗</span><small>{compactNumber(reel.shares)}</small></button>
          <button className="reel-action" onClick={() => setCreatorTools(true)} aria-label="Ferramentas do criador"><span className="reel-disc"><img src={reel.avatar} alt="" /></span><small>Criador</small></button>
        </aside>

        <div className="reel-info">
          <div className="reel-author-row">
            <img className="reel-avatar" src={reel.avatar} alt={reel.name} />
            <span className="reel-author">@{reel.user}</span>
            <button className="reel-follow" onClick={() => setFollowing((v) => ({ ...v, [reel.user]: !v[reel.user] }))}>{following[reel.user] ? "✓ Seguindo" : "+ Seguir"}</button>
          </div>
          <p className="reel-caption">{reel.caption}</p>
          <div className="reel-audio"><span>♫</span><span>{reel.song}</span><span>·</span><span>{index + 1}/{demoReels.length}</span></div>
        </div>
        <div className="reel-progress"><div className="reel-progress-fill" /></div>
      </section>

      <nav className="reels-nav" aria-label="Navegação principal">
        {navItems.map((item) => <a key={item.id} href={item.href} className={`reels-nav-item ${item.id === "reels" ? "active" : ""}`}><span className="reels-nav-icon">{item.icon}</span><span>{item.label}</span></a>)}
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
          <div className="reels-sheet-head"><span>✦ Central do criador</span><button className="reels-close" onClick={() => setCreatorTools(false)}>×</button></div>
          <p style={{ color: "#aeb0c5", fontSize: 12, lineHeight: 1.6, marginTop: 0 }}>Ferramentas de demonstração para organizar e acompanhar este Reel. A gestão real será conectada à conta do autor na etapa de integração.</p>
          <div className="reels-tools">
            <button className="reels-tool" onClick={() => alert("Estatísticas demonstrativas: alcance " + compactNumber(reel.likes * 4) + " · interações " + compactNumber(reel.likes + reel.comments))}><strong>▥ Visão geral</strong><span>Alcance, interações e desempenho</span></button>
            <button className="reels-tool" onClick={() => alert("A edição estará disponível quando os Reels estiverem vinculados à sua conta.")}><strong>✎ Editar Reel</strong><span>Legenda, capa e informações</span></button>
            <button className="reels-tool" onClick={() => alert("Preferências de comentários demonstrativas nesta versão.")}><strong>☷ Comentários</strong><span>Preferências e moderação</span></button>
            <button className="reels-tool" onClick={() => { setSaved((v) => ({ ...v, [reel.id]: !v[reel.id] })); setCreatorTools(false); }}><strong>♧ {saved[reel.id] ? "Remover dos salvos" : "Guardar Reel"}</strong><span>Adicionar aos seus favoritos locais</span></button>
          </div>
        </section>
      </div>}
    </main>
  );
}
