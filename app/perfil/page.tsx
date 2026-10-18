"use client";

import { useEffect, useState } from "react";
import PrimaryNav from "../components/PrimaryNav";

type Highlight = { id: number; title: string; emoji: string; tone: string };
const covers = [
  "radial-gradient(ellipse at 15% 110%,#00d9ff88,transparent 42%),radial-gradient(ellipse at 85% 0%,#df35ff88,transparent 44%),linear-gradient(130deg,#070b1b,#18113d 55%,#090713)",
  "radial-gradient(ellipse at 50% 120%,#ff4fa888,transparent 48%),linear-gradient(135deg,#140b23,#4b1756,#080817)",
  "radial-gradient(ellipse at 75% 0%,#55ffce66,transparent 38%),linear-gradient(135deg,#031a20,#07544e,#080b1d)",
  "radial-gradient(ellipse at 50% 50%,#b7f5ff88,transparent 28%),linear-gradient(135deg,#10172f,#245c88,#17113b)",
];
const defaultHighlights: Highlight[] = [
  { id: 1, title: "Minha vida", emoji: "✨", tone: "#6c4cff" },
  { id: 2, title: "Resenha", emoji: "😂", tone: "#e84d9b" },
  { id: 3, title: "Momentos", emoji: "📸", tone: "#168db7" },
  { id: 4, title: "Músicas", emoji: "🎧", tone: "#8a4ce0" },
];
const tabNames = ["Publicações", "Reels", "Preferências", "Republicados"] as const;
type TabName = typeof tabNames[number];

export default function ProfilePage() {
  const [coverIndex, setCoverIndex] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>(defaultHighlights);
  const [activeTab, setActiveTab] = useState<TabName>("Publicações");
  const [note, setNote] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileCategory, setProfileCategory] = useState("Criador de conteúdo");
  const [profileName, setProfileName] = useState("Licinhosz.bb");
  const [profileUsername, setProfileUsername] = useState("licinhosz.bb");
  const [profileLinks, setProfileLinks] = useState("");
  const [avatarData, setAvatarData] = useState("");
  const [coverData, setCoverData] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsSearch, setSettingsSearch] = useState("");
  const [settingsSection, setSettingsSection] = useState("Geral");
  const [profileBio, setProfileBio] = useState("Humor, resenha, vida real e muito mais... 👑\nUma nova emoção, Sintonia de Amor 💜");
  const [profileLocation, setProfileLocation] = useState("Brasil");
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightEmoji, setHighlightEmoji] = useState("🌟");
  const [toast, setToast] = useState("");
  const [prefs, setPrefs] = useState({ neon: true, showActivity: true, allowReposts: true, compactGrid: false, privateProfile: false, allowMessages: true, showLocation: true, saveData: false });
  const [posts, setPosts] = useState<{id:number; title:string; emoji:string; type:"post"|"reel"}[]>([]);
  const [reposted, setReposted] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nexora-profile-v1");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data.note === "string") setNote(data.note);
      if (typeof data.profileName === "string") setProfileName(data.profileName);
      if (typeof data.profileUsername === "string") setProfileUsername(data.profileUsername);
      if (typeof data.profileLinks === "string") setProfileLinks(data.profileLinks);
      if (typeof data.avatarData === "string") setAvatarData(data.avatarData);
      if (typeof data.coverData === "string") setCoverData(data.coverData);
      if (typeof data.profileBio === "string") setProfileBio(data.profileBio);
      if (typeof data.profileLocation === "string") setProfileLocation(data.profileLocation);
      if (typeof data.profileCategory === "string") setProfileCategory(data.profileCategory);
      if (Array.isArray(data.highlights)) setHighlights(data.highlights);
      if (Array.isArray(data.posts)) setPosts(data.posts);
      if (Array.isArray(data.reposted)) setReposted(data.reposted);
      if (typeof data.coverIndex === "number") setCoverIndex(Math.max(0, Math.min(covers.length - 1, data.coverIndex)));
      if (data.prefs && typeof data.prefs === "object") setPrefs((p) => ({ ...p, ...data.prefs }));
    } catch { /* Ignore malformed local demo data safely. */ }
  }, []);

  function save(next: Record<string, unknown>) {
    try {
      const current = JSON.parse(localStorage.getItem("nexora-profile-v1") || "{}");
      localStorage.setItem("nexora-profile-v1", JSON.stringify({ ...current, ...next }));
    } catch { setToast("Não foi possível salvar neste navegador."); }
  }
  function publishNote() {
    const value = noteDraft.trim();
    if (!value) return;
    setNote(value); save({ note: value }); setEditOpen(false); setNoteDraft("");
    setToast("Nota atualizada neste dispositivo.");
  }
  function createHighlight() {
    const title = highlightTitle.trim();
    if (!title) return;
    const next = [...highlights, { id: Date.now(), title, emoji: highlightEmoji, tone: ["#6c4cff", "#e84d9b", "#168db7", "#8a4ce0"][highlights.length % 4] }];
    setHighlights(next); save({ highlights: next }); setHighlightOpen(false); setHighlightTitle("");
    setToast("Destaque criado neste dispositivo.");
  }
  function addSamplePost(type: "post" | "reel") {
    const next = [...posts, { id: Date.now(), title: type === "post" ? "Nova publicação" : "Novo Reel", emoji: type === "post" ? "🖼️" : "▶️", type }];
    setPosts(next); save({ posts: next }); setActiveTab(type === "post" ? "Publicações" : "Reels");
    setToast("Adicionamos um cartão de demonstração. A publicação real exige envio de mídia.");
  }
  function toggleRepost(id: string) {
    const next = reposted.includes(id) ? reposted.filter((x) => x !== id) : [...reposted, id];
    setReposted(next); save({ reposted: next }); setToast(next.includes(id) ? "Adicionado aos seus republicados locais." : "Republicação removida.");
  }

  return (
    <main className="nex-profile">
      <style jsx global>{`
        *{box-sizing:border-box}html,body{margin:0;background:#07070d;color:#f7f7ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif}
        .nex-profile{--cyan:#55e8ff;--violet:#a66cff;min-height:100dvh;padding-bottom:105px;background:radial-gradient(ellipse at 50% 0%,#1b1438 0,transparent 38%),#07070d;color:#f7f7ff}
        .profile-shell{width:100%;max-width:850px;margin:auto;padding:0 14px}
        .profile-top{height:60px;display:flex;align-items:center;justify-content:space-between}
        .profile-brand{display:flex;align-items:center;gap:9px;font-weight:900;font-size:20px;letter-spacing:-.6px}
        .profile-logo{display:grid;place-items:center;width:34px;height:34px;border-radius:12px;background:linear-gradient(140deg,#4de5ff,#8c5dff 62%,#e65cff);color:#080817;font-weight:1000;box-shadow:0 0 24px #7865ff50}
        .profile-icon-btn{border:1px solid #ffffff1d;border-radius:13px;background:#ffffff08;color:white;padding:9px 11px;font-size:18px}
        .profile-cover{height:178px;border-radius:23px;position:relative;overflow:hidden;border:1px solid #ffffff20;background-size:cover;box-shadow:0 10px 36px #0007}
        .profile-cover:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#07070df0,transparent 80%)}
        .cover-controls{position:absolute;z-index:1;right:12px;top:12px;display:flex;gap:7px}
        .cover-controls button{background:#070711a8;color:#fff;border:1px solid #ffffff35;border-radius:99px;padding:8px 11px;font-size:11px;backdrop-filter:blur(12px)}
        .cover-label{position:absolute;z-index:1;left:15px;bottom:13px;font-size:10px;letter-spacing:2px;color:#c7dfff;text-transform:uppercase}
        .profile-identity{position:relative;margin-top:-39px;padding:0 8px;z-index:2}
        .profile-avatar-row{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}
        .profile-avatar{width:94px;height:94px;border-radius:30px;border:3px solid #0a0914;background:linear-gradient(135deg,#42e4ff,#915bff,#ee5acb);padding:3px;box-shadow:0 0 0 1px #a66cff,0 0 26px #9b5bff44}
        .profile-avatar-inner{width:100%;height:100%;border-radius:25px;display:grid;place-items:center;background:linear-gradient(145deg,#18122e,#090b17);font-size:34px}
        .profile-identity-actions{display:flex;gap:8px;padding-bottom:5px}
        .profile-btn{border:1px solid #ffffff24;border-radius:13px;background:#ffffff09;color:white;padding:10px 13px;font-size:12px;font-weight:800}
        .profile-btn.primary{border:0;background:linear-gradient(110deg,#267fff,#8a4dff 65%,#d94fe5);box-shadow:0 0 22px #6d52ff30}
        .profile-name{display:flex;align-items:center;gap:7px;margin:13px 0 3px;font-size:22px;letter-spacing:-.7px;font-weight:900}
        .profile-check{width:17px;height:17px;display:inline-grid;place-items:center;border-radius:50%;font-size:11px;color:#06121b;background:linear-gradient(135deg,#61f1ff,#4d94ff)}
        .profile-handle{color:#9b9db5;font-size:13px}
        .profile-bio{font-size:13px;line-height:1.65;color:#e4e3f1;margin:13px 0 10px;white-space:pre-wrap}
        .profile-bio-meta{display:flex;flex-wrap:wrap;gap:12px;color:#aeb3c8;font-size:11px}
        .profile-bio-meta span{display:flex;gap:5px;align-items:center}
        .profile-stats{display:grid;grid-template-columns:repeat(3,1fr);margin:19px 0 20px;padding:14px 0;border-top:1px solid #ffffff12;border-bottom:1px solid #ffffff12}
        .profile-stat{text-align:center;border-right:1px solid #ffffff12}.profile-stat:last-child{border:0}
        .profile-stat strong{display:block;font-size:17px;font-weight:900}.profile-stat span{display:block;color:#9c9eb5;font-size:10px;margin-top:4px}
        .profile-section-title{display:flex;align-items:center;justify-content:space-between;margin:19px 0 12px;font-size:13px;font-weight:850}
        .profile-section-title small{font-size:10px;color:#8588a4;font-weight:500}
        .highlight-row{display:flex;gap:13px;overflow-x:auto;padding:2px 0 7px;scrollbar-width:none}.highlight-row::-webkit-scrollbar{display:none}
        .highlight-item{flex:0 0 69px;text-align:center;color:#e7e7f5;font-size:10px}
        .highlight-circle{width:64px;height:64px;margin:0 auto 7px;border-radius:23px;padding:2px;background:linear-gradient(140deg,#58e7ff,#8e57ff,#ed5fcd);box-shadow:0 0 18px #8057ff22}
        .highlight-inner{height:100%;border-radius:21px;border:2px solid #0a0914;display:grid;place-items:center;font-size:23px;background:#151126}
        .highlight-add{width:64px;height:64px;border-radius:23px;border:1px dashed #8c70ff99;background:#9b73ff0c;color:#c7baff;font-size:26px;margin:0 auto 7px;display:grid;place-items:center}
        .note-card{border:1px solid #8e6bff42;background:linear-gradient(110deg,#121126,#0c1020 65%,#160d22);border-radius:17px;padding:13px;display:flex;align-items:center;gap:11px;box-shadow:inset 0 1px #ffffff08}
        .note-orb{width:39px;height:39px;flex:0 0 39px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(140deg,#3adfff,#9a60ff,#e455dc);font-size:18px}
        .note-copy{min-width:0;flex:1}.note-copy strong{font-size:11px;display:block;margin-bottom:4px}.note-copy p{font-size:12px;color:#bcbad4;margin:0;overflow-wrap:anywhere}.note-edit{border:1px solid #ffffff20;background:#ffffff0a;color:#fff;border-radius:11px;padding:8px 10px;font-size:11px}
        .profile-tabs{display:flex;gap:5px;overflow-x:auto;margin-top:24px;padding:5px;border:1px solid #ffffff10;background:#ffffff04;border-radius:15px;scrollbar-width:none}
        .profile-tab{flex:1;white-space:nowrap;border:0;background:transparent;color:#9395ad;border-radius:11px;padding:11px 12px;font-size:11px;font-weight:800}
        .profile-tab.active{color:white;background:linear-gradient(110deg,#287eff44,#8a52ff3d);box-shadow:inset 0 0 0 1px #8b71ff55}
        .profile-content{margin-top:14px;min-height:150px}
        .profile-empty{border:1px dashed #ffffff1e;border-radius:18px;text-align:center;padding:26px 16px;background:#ffffff03}
        .profile-empty-icon{font-size:29px;margin-bottom:9px}.profile-empty strong{display:block;font-size:13px}.profile-empty p{font-size:11px;color:#9698b0;line-height:1.6;max-width:320px;margin:8px auto 14px}
        .profile-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.profile-tile{aspect-ratio:1/1.15;border-radius:12px;background:linear-gradient(145deg,#121b32,#25164b 55%,#10101c);border:1px solid #ffffff12;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;font-size:25px}.profile-tile span{font-size:10px;color:#c7c4dc}
        .profile-pref{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 2px;border-bottom:1px solid #ffffff10}.profile-pref strong{display:block;font-size:12px}.profile-pref small{display:block;color:#8f92ac;font-size:10px;margin-top:5px;line-height:1.4}.profile-switch{width:42px;height:25px;flex:0 0 42px;border:0;border-radius:99px;padding:3px;background:#39394c}.profile-switch:after{content:"";display:block;width:19px;height:19px;border-radius:50%;background:#fff;transition:transform .18s}.profile-switch.on{background:linear-gradient(90deg,#328aff,#a15aff)}.profile-switch.on:after{transform:translateX(17px)}
        .profile-modal-backdrop{position:fixed;z-index:100;inset:0;background:#000a;backdrop-filter:blur(7px);display:flex;align-items:flex-end;justify-content:center;padding:12px}
        .profile-modal{width:100%;max-width:500px;border:1px solid #ffffff20;background:#10101b;border-radius:24px;padding:20px;box-shadow:0 15px 60px #000b}
        .profile-modal h2{font-size:17px;margin:0 0 6px}.profile-modal p{font-size:12px;color:#a2a4bd;line-height:1.5;margin:0 0 15px}
        .profile-input{width:100%;border:1px solid #ffffff22;background:#080811;color:#fff;border-radius:13px;padding:13px;margin:7px 0 12px;outline:none}.profile-input:focus{border-color:#8d70ff}
        .profile-emoji-options{display:flex;gap:8px;margin:6px 0 16px}.profile-emoji-options button{font-size:20px;background:#ffffff09;border:1px solid #ffffff1b;border-radius:11px;padding:9px}
        .profile-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:8px}
        .profile-settings-search{width:100%;border:1px solid #ffffff20;background:#080811;color:white;border-radius:13px;padding:12px;margin:8px 0 12px;outline:none}
        .profile-settings-cats{display:flex;gap:7px;overflow-x:auto;padding:3px 0 10px;scrollbar-width:none}
        .profile-settings-cats button{flex:0 0 auto;border:1px solid #ffffff1a;background:#ffffff08;color:#bcbad4;border-radius:99px;padding:8px 11px;font-size:11px}
        .profile-settings-cats button.active{color:#fff;border-color:#8c71ff;background:#8c71ff24}
        .profile-file{display:block;width:100%;color:#b9b8d0;font-size:11px;margin:5px 0 12px}
        .profile-modal-backdrop{overflow-y:auto}
        .profile-modal{max-height:88dvh;overflow-y:auto}
        .profile-toast{position:fixed;z-index:150;left:50%;bottom:92px;transform:translateX(-50%);background:#19172a;border:1px solid #8f78ff66;color:#fff;padding:12px 16px;border-radius:14px;font-size:12px;box-shadow:0 8px 30px #0008;width:max-content;max-width:90vw}
        @media(min-width:700px){.profile-shell{padding:0 24px}.profile-cover{height:230px}.profile-identity{padding:0 16px}.profile-tabs{gap:8px}.profile-tab{font-size:12px}.profile-grid{gap:9px}.profile-tile{border-radius:16px}}
        @media(max-width:380px){.profile-cover{height:145px}.profile-identity-actions{gap:5px}.profile-btn{padding:9px 10px;font-size:10px}.profile-name{font-size:20px}.profile-tab{padding:10px 9px;font-size:10px}.highlight-row{gap:9px}}
      `}</style>

      <div className="profile-shell">
        <header className="profile-top">
          <div className="profile-brand"><span className="profile-logo">N</span><span>Nexora</span></div>
          <button className="profile-icon-btn" aria-label="Opções do perfil" onClick={() => setSettingsOpen(true)}>⋯</button>
        </header>

        <section className="profile-cover" style={coverData ? {backgroundImage:"linear-gradient(0deg,#07070df0,transparent 80%),url("+coverData+")",backgroundSize:"cover",backgroundPosition:"center"} : { background: covers[coverIndex] }}>
          <div className="cover-controls">
            <button onClick={() => setCoverIndex((v) => { const n = (v + 1) % covers.length; save({ coverIndex: n }); return n; })}>✦ Mudar estilo</button>
          </div>
          <span className="cover-label">NEXORA · SUA IDENTIDADE, SEU UNIVERSO</span>
        </section>

        <section className="profile-identity">
          <div className="profile-avatar-row">
            <div className="profile-avatar"><div className="profile-avatar-inner" style={avatarData ? {backgroundImage:"url("+avatarData+")",backgroundSize:"cover",backgroundPosition:"center",fontSize:0} : undefined}>{avatarData ? "" : "👑"}</div></div>
            <div className="profile-identity-actions">
              <button className="profile-btn" onClick={() => { setNoteDraft(note); setEditOpen(true); }}>Editar perfil</button><button className="profile-btn" onClick={() => setPreviewOpen(true)}>Prévia</button>
              <button className="profile-btn primary" onClick={() => addSamplePost("post")}>＋ Criar</button>
            </div>
          </div>
          <h1 className="profile-name">{profileName || "Seu nome"} <span className="profile-check" title="Identidade visual Nexora">✓</span></h1>
          <div className="profile-handle">@{profileUsername || "seu.usuario"} · {profileCategory}</div>
          <p className="profile-bio">{profileBio}</p>
          <div className="profile-bio-meta">{prefs.showLocation && profileLocation ? <span>⌖ {profileLocation}</span> : null}<span>✦ Nexora</span><span>◉ Perfil de criador</span></div>
          <div className="profile-stats">
            <div className="profile-stat"><strong>{posts.length}</strong><span>Publicações</span></div>
            <div className="profile-stat"><strong>—</strong><span>Seguidores</span></div>
            <div className="profile-stat"><strong>—</strong><span>Seguindo</span></div>
          </div>
        </section>

        <section>
          <div className="profile-section-title"><span>Seus destaques <small>· coleções do seu universo</small></span><small>{highlights.length} coleções</small></div>
          <div className="highlight-row">
            <button className="highlight-item" style={{border:0,background:"transparent"}} onClick={() => setHighlightOpen(true)}><span className="highlight-add">＋</span><span>Criar novo</span></button>
            {highlights.map((item) => <div className="highlight-item" key={item.id}><div className="highlight-circle"><div className="highlight-inner" style={{background:item.tone+"24"}}>{item.emoji}</div></div><span>{item.title}</span></div>)}
          </div>
        </section>

        <section>
          <div className="profile-section-title"><span>Notas Nexora <small>· presença rápida</small></span><small>✦ Neon</small></div>
          {prefs.showActivity ? <div className="note-card"><div className="note-orb">✧</div><div className="note-copy"><strong>Sua nota de agora</strong><p>{note || "Adicione uma nota em Editar perfil para mostrar seu momento…"}</p></div><button className="note-edit" onClick={() => setEditOpen(true)}>Editar perfil</button></div> : <div className="profile-empty"><strong>Notas ocultas</strong><p>Ative “Mostrar nota no perfil” nas configurações para exibir sua nota.</p></div>}
        </section>

        <div className="profile-tabs" role="tablist" aria-label="Conteúdo do perfil">
          {tabNames.map((tab) => <button key={tab} role="tab" aria-selected={activeTab===tab} className={`profile-tab ${activeTab===tab?"active":""}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </div>
        <section className="profile-content">
          {activeTab === "Preferências" ? <div>
            {([
              ["neon","Efeitos neon","Aplicar brilho sutil aos elementos do perfil."],
              ["showActivity","Mostrar atividade","Exibir sua nota atual no perfil."],
              ["allowReposts","Permitir republicações","Controlar se suas publicações podem ser republicadas."],
              ["compactGrid","Grade compacta","Usar cartões mais compactos na grade."],
              ["privateProfile","Perfil privado","Deixar seu perfil marcado como privado. A restrição real de acesso depende da integração de contas."],
              ["allowMessages","Permitir mensagens","Preferência visual para receber mensagens na Nexora."],
              ["showLocation","Mostrar localização","Exibir ou ocultar a localização na apresentação do perfil."],
              ["saveData","Economia de dados","Preferir uma experiência com menos efeitos visuais."] ,
            ] as const).map(([key,label,desc]) => <div className="profile-pref" key={key}><div><strong>{label}</strong><small>{desc}</small></div><button aria-label={label} aria-pressed={prefs[key]} className={`profile-switch ${prefs[key]?"on":""}`} onClick={() => {const next={...prefs,[key]:!prefs[key]};setPrefs(next);save({prefs:next});setToast("Preferência salva neste dispositivo.");}} /></div>)}
          </div> : activeTab === "Republicados" ? <div>
            {reposted.length ? <div className="profile-grid">{reposted.map((id) => <button className="profile-tile" key={id} onClick={() => toggleRepost(id)}>🔁<span>Republicação local</span><small>Remover ×</small></button>)}</div> : <div className="profile-empty"><div className="profile-empty-icon">🔁</div><strong>Seu espaço de republicações</strong><p>Quando você republicar algo do Feed ou dos Reels, ele aparecerá aqui quando a integração estiver conectada.</p><button className="profile-btn primary" onClick={() => toggleRepost("demo-repost-01")}>＋ Experimentar republicação</button></div>}
          </div> : posts.filter(p => activeTab === "Publicações" ? p.type === "post" : p.type === "reel").length ? <div className={`profile-grid ${prefs.compactGrid?"compact":""}`}>{posts.filter(p => activeTab === "Publicações" ? p.type === "post" : p.type === "reel").map(p => <div className="profile-tile" key={p.id}>{p.emoji}<span>{p.title}</span></div>)}</div> : <div className="profile-empty"><div className="profile-empty-icon">{activeTab === "Reels" ? "▶" : "✦"}</div><strong>{activeTab === "Reels" ? "Seus Reels começam aqui" : "Seu próximo momento começa aqui"}</strong><p>{activeTab === "Reels" ? "Crie vídeos curtos e organize seus melhores momentos nesta aba." : "Publique fotos, ideias e momentos para começar a construir seu perfil."}</p><button className="profile-btn primary" onClick={() => addSamplePost(activeTab === "Reels" ? "reel" : "post")}>＋ {activeTab === "Reels" ? "Preparar Reel" : "Nova publicação"}</button></div>}
        </section>
      </div>

      <PrimaryNav active="perfil" />

      {editOpen && <div className="profile-modal-backdrop" onClick={() => setEditOpen(false)}><section className="profile-modal" onClick={e => e.stopPropagation()}><h2>✦ Editar perfil</h2><p>Personalize sua identidade e sua Nota Nexora em um único lugar.</p><label style={{fontSize:11,color:"#b8b7ce"}}>Nome de exibição</label><input className="profile-input" value={profileName} maxLength={30} onChange={e => setProfileName(e.target.value)} placeholder="Como as pessoas vão te chamar"/><label style={{fontSize:11,color:"#b8b7ce"}}>@Nome de usuário</label><input className="profile-input" value={profileUsername} maxLength={30} onChange={e => setProfileUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g,""))} placeholder="seu.usuario"/><label style={{fontSize:11,color:"#b8b7ce"}}>Links externos (separe por vírgula)</label><textarea className="profile-input" rows={2} value={profileLinks} maxLength={500} onChange={e=>setProfileLinks(e.target.value)} placeholder="seudominio.com, instagram.com/seuperfil"/><label style={{fontSize:11,color:"#b8b7ce"}}>Foto de perfil (imagem até 8 MB)</label><input className="profile-file" type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>8*1024*1024){setToast("Escolha uma imagem de até 8 MB.");return;}const reader=new FileReader();reader.onload=()=>setAvatarData(String(reader.result));reader.onerror=()=>setToast("Não foi possível abrir essa imagem.");reader.readAsDataURL(file);}}/><label style={{fontSize:11,color:"#b8b7ce"}}>Capa do perfil (imagem até 8 MB)</label><input className="profile-file" type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>8*1024*1024){setToast("Escolha uma imagem de até 8 MB.");return;}const reader=new FileReader();reader.onload=()=>setCoverData(String(reader.result));reader.onerror=()=>setToast("Não foi possível abrir essa imagem.");reader.readAsDataURL(file);}}/><label style={{fontSize:11,color:"#b8b7ce"}}>Biografia</label><textarea className="profile-input" rows={3} maxLength={180} value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="Conte um pouco sobre você"/><label style={{fontSize:11,color:"#b8b7ce"}}>Localização (opcional)</label><input className="profile-input" value={profileLocation} maxLength={45} onChange={e => setProfileLocation(e.target.value)} placeholder="Cidade ou país"/><label style={{fontSize:11,color:"#b8b7ce"}}>✧ Nota Nexora · até 120 caracteres</label><textarea className="profile-input" rows={2} maxLength={120} value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="Uma ideia, pergunta ou o clima do momento…"/><div style={{textAlign:"right",fontSize:10,color:"#9294ad"}}>{noteDraft.length}/120</div><div className="profile-modal-actions"><button className="profile-btn" onClick={() => setEditOpen(false)}>Cancelar</button><button className="profile-btn primary" onClick={() => { const value=noteDraft.trim(); setNote(value); save({profileName,profileUsername,profileBio,profileLocation,profileLinks,avatarData,coverData,note:value}); setEditOpen(false); setToast("Perfil atualizado neste dispositivo."); }}>Salvar alterações</button></div></section></div>}
      {settingsOpen && <div className="profile-modal-backdrop" onClick={() => setSettingsOpen(false)}><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-settings-title" onClick={e => e.stopPropagation()}><h2 id="profile-settings-title">⚙ Configurações do perfil</h2><p>Controle a aparência, a privacidade visual e as ferramentas da sua experiência Nexora.</p><label style={{fontSize:11,color:"#b8b7ce"}}>Classificação do perfil</label><select className="profile-input" value={profileCategory} onChange={e => { setProfileCategory(e.target.value); save({profileCategory:e.target.value}); }}><option>Criador de conteúdo</option><option>Blogueiro(a)</option><option>Artista / músico</option><option>Marca / empresa</option><option>Loja</option><option>Uso pessoal</option></select><div className="profile-pref"><div><strong>Ferramentas do criador</strong><small>{posts.filter(p=>p.type==="post").length} publicações de demonstração · {posts.filter(p=>p.type==="reel").length} Reels de demonstração</small></div><span>✦</span></div>{([["neon","Efeitos neon","Brilho visual do perfil."],["showActivity","Mostrar nota no perfil","Exibir sua Nota Nexora."],["allowReposts","Permitir republicações","Preferência para republicações."],["compactGrid","Grade compacta","Reduzir o espaço entre cartões."],["privateProfile","Perfil privado","Marcador visual; não bloqueia acesso sem sistema de contas."],["allowMessages","Permitir mensagens","Preferência local de mensagens."],["showLocation","Mostrar localização","Exibir sua localização no perfil."],["saveData","Economia de dados","Reduzir efeitos visuais." ]] as const).map(([key,label,desc]) => <div className="profile-pref" key={key}><div><strong>{label}</strong><small>{desc}</small></div><button aria-label={label} aria-pressed={prefs[key]} className={`profile-switch ${prefs[key]?"on":""}`} onClick={() => {const next={...prefs,[key]:!prefs[key]};setPrefs(next);save({prefs:next});setToast("Preferência salva neste dispositivo.");}} /></div>)}<div className="profile-modal-actions"><button className="profile-btn" onClick={() => setSettingsOpen(false)}>Fechar</button><button className="profile-btn primary" onClick={() => { try { const data=localStorage.getItem("nexora-profile-v1") || "{}"; const blob=new Blob([data],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="nexora-meus-dados.json"; a.click(); URL.revokeObjectURL(url); setToast("Exportação dos dados locais iniciada."); } catch { setToast("Não foi possível exportar neste navegador."); } }}>Baixar meus dados</button></div><p style={{marginTop:12,fontSize:10}}>Aviso: estas preferências e o arquivo exportado abrangem apenas dados salvos neste navegador. Recursos de privacidade, mensagens e publicação global dependem da integração com contas e banco de dados.</p></section></div>}
      {highlightOpen && <div className="profile-modal-backdrop" onClick={() => setHighlightOpen(false)}><section className="profile-modal" onClick={e => e.stopPropagation()}><h2>＋ Criar destaque</h2><p>Escolha um nome e um símbolo para a nova coleção.</p><input className="profile-input" value={highlightTitle} onChange={e => setHighlightTitle(e.target.value)} maxLength={22} placeholder="Ex.: Bastidores, Viagens, Favoritos"/><div className="profile-emoji-options">{["🌟","😂","📸","🎧","💜","🎮","🌎","🔥"].map(emoji => <button key={emoji} style={{borderColor:highlightEmoji===emoji?"#9d7aff":undefined,background:highlightEmoji===emoji?"#8d6aff25":undefined}} onClick={() => setHighlightEmoji(emoji)}>{emoji}</button>)}</div><div className="profile-modal-actions"><button className="profile-btn" onClick={() => setHighlightOpen(false)}>Cancelar</button><button className="profile-btn primary" onClick={createHighlight}>Criar destaque</button></div></section></div>}
      {toast && <button className="profile-toast" role="status" onClick={() => setToast("")}>{toast}　×</button>}
    </main>
  );
}
