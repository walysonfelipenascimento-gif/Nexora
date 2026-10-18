"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PrimaryNav from "../components/PrimaryNav";

type ActivityKind = "like" | "comment" | "follow" | "mention" | "collab";
type Activity = {
  id: number; kind: ActivityKind; name: string; username: string; avatar: string;
  followers: number; text: string; time: string; unread: boolean; accepted?: boolean;
};

const initialActivities: Activity[] = [
  { id: 1, kind: "collab", name: "Lívia Martins", username: "liviamartins", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces", followers: 12400, text: "convidou você para colaborar em uma publicação", time: "há 8 min", unread: true },
  { id: 2, kind: "like", name: "Rafael Costa", username: "rafaelcosta", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces", followers: 860, text: "curtiu sua publicação", time: "há 18 min", unread: true },
  { id: 3, kind: "follow", name: "Ana Clara", username: "anaclara", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop&crop=faces", followers: 2300, text: "começou a seguir você", time: "há 32 min", unread: true },
  { id: 4, kind: "comment", name: "João Pedro", username: "joaopedro", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces", followers: 540, text: "comentou: “Essa ficou boa demais! 💜”", time: "há 1 h", unread: false },
  { id: 5, kind: "mention", name: "Bia Santos", username: "biasantos", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop&crop=faces", followers: 18400, text: "mencionou você em um comentário", time: "há 2 h", unread: false },
  { id: 6, kind: "collab", name: "Estúdio Aurora", username: "estudioaurora", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop&crop=faces", followers: 78000, text: "enviou um convite de colaboração", time: "há 4 h", unread: false },
  { id: 7, kind: "like", name: "Marcos Lima", username: "marcoslima", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces", followers: 1250, text: "curtiu seu Reel", time: "ontem", unread: false },
];

const kindLabels: Record<ActivityKind, string> = { like: "Curtidas", comment: "Comentários", follow: "Seguidores", mention: "Menções", collab: "Colaborações" };
const icons: Record<ActivityKind, string> = { like: "♥", comment: "▤", follow: "＋", mention: "@", collab: "✦" };

export default function NotificationsPage() {
  const [activities, setActivities] = useState(initialActivities);
  const [filter, setFilter] = useState<"all" | ActivityKind>("all");
  const [followerRange, setFollowerRange] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [beamActive, setBeamActive] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let hideTimer: number | undefined;
    const interval = window.setInterval(() => {
      setBeamActive(true);
      hideTimer = window.setTimeout(() => setBeamActive(false), 2600);
    }, 180000);
    return () => { window.clearInterval(interval); if (hideTimer) window.clearTimeout(hideTimer); };
  }, []);

  const filtered = useMemo(() => activities.filter(item => {
    if (filter !== "all" && item.kind !== filter) return false;
    if (unreadOnly && !item.unread) return false;
    if (followerRange === "under1k" && item.followers >= 1000) return false;
    if (followerRange === "1to10k" && (item.followers < 1000 || item.followers >= 10000)) return false;
    if (followerRange === "over10k" && item.followers < 10000) return false;
    return true;
  }), [activities, filter, followerRange, unreadOnly]);

  function markAllRead() {
    setActivities(current => current.map(item => ({ ...item, unread: false })));
    setFeedback("Tudo marcado como lido nesta visualização.");
  }
  function acceptCollab(id: number) {
    setActivities(current => current.map(item => item.id === id ? { ...item, accepted: true, unread: false } : item));
    setFeedback("Convite aceito nesta visualização.");
  }
  function dismissCollab(id: number) {
    setActivities(current => current.filter(item => item.id !== id));
    setFeedback("Convite removido da lista.");
  }

  return <main className="notify-page">
    <div className={`notify-side-beam ${beamActive ? "is-active" : ""}`} aria-hidden="true" />
    <header className="notify-header">
      <Link href="/" className="notify-back" aria-label="Voltar ao feed">‹</Link>
      <div className="notify-heading"><span>NEXORA · CENTRAL DE ATIVIDADES</span><h1>Notificações</h1><p>O que está acontecendo com você.</p></div>
      <button className="notify-read-all" onClick={markAllRead}>Marcar lidas</button>
    </header>

    <section className="notify-summary" aria-label="Resumo de atividades">
      <div className="notify-summary-icon">✦</div><div><strong>Você está por dentro</strong><p>{activities.filter(item => item.unread).length} atividades não lidas · curtidas, seguidores e convites em um só lugar.</p></div>
    </section>

    <section className="notify-filter-panel">
      <div className="notify-filter-title"><div><span>⌘</span><strong>Filtrar atividades</strong></div><label className="notify-unread"><input type="checkbox" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)}/> Não lidas</label></div>
      <div className="notify-tabs" role="tablist" aria-label="Tipos de notificação">
        {([{id:"all",label:"Tudo"},{id:"follow",label:"Seguidores"},{id:"collab",label:"Colaborações"},{id:"like",label:"Curtidas"},{id:"comment",label:"Comentários"},{id:"mention",label:"Menções"}] as {id:"all"|ActivityKind;label:string}[]).map(tab => <button key={tab.id} role="tab" aria-selected={filter === tab.id} className={filter === tab.id ? "active" : ""} onClick={() => setFilter(tab.id)}>{tab.label}</button>)}
      </div>
      <label className="notify-followers-filter"><span><strong>Filtrar por seguidores</strong><small>Veja atividades de perfis conforme o tamanho da audiência</small></span><select value={followerRange} onChange={e => setFollowerRange(e.target.value)} aria-label="Quantidade de seguidores"><option value="all">Qualquer quantidade</option><option value="under1k">Até 999 seguidores</option><option value="1to10k">1 mil a 9.999</option><option value="over10k">10 mil ou mais</option></select></label>
    </section>

    <section className="notify-list-section">
      <div className="notify-list-heading"><h2>Recentes <span>{filtered.length}</span></h2><span>Mais novas primeiro</span></div>
      {feedback && <div className="notify-feedback" role="status">{feedback}<button onClick={() => setFeedback("")} aria-label="Fechar aviso">×</button></div>}
      {filtered.length === 0 ? <div className="notify-empty"><span>✧</span><strong>Nada por aqui com esses filtros</strong><p>Experimente outra categoria ou faixa de seguidores.</p><button onClick={() => { setFilter("all"); setFollowerRange("all"); setUnreadOnly(false); }}>Limpar filtros</button></div> :
        <div className="notify-list">{filtered.map(item => <article className={`notify-item ${item.unread ? "unread" : ""}`} key={item.id}>
          <Link href={`/perfil?username=${encodeURIComponent(item.username)}`} className="notify-avatar-link" aria-label={`Abrir perfil de ${item.name}`}><img src={item.avatar} alt=""/></Link>
          <div className="notify-item-copy"><div className="notify-message"><strong>{item.name}</strong><span className="notify-username">@{item.username}</span> {item.text}</div><div className="notify-meta"><span>{item.time}</span><span>·</span><span>{item.followers.toLocaleString("pt-BR")} seguidores</span>{item.unread && <i aria-label="Não lida"/>}</div>
          {item.kind === "collab" && <div className="notify-collab-actions">{item.accepted ? <span className="notify-accepted">✓ Colaboração aceita</span> : <><button className="notify-accept" onClick={() => acceptCollab(item.id)}>Aceitar convite</button><button className="notify-decline" onClick={() => dismissCollab(item.id)}>Agora não</button></>}</div>}
          </div><span className={`notify-kind-icon kind-${item.kind}`} aria-label={kindLabels[item.kind]}>{icons[item.kind]}</span>
        </article>)}</div>
      }
    </section>
    <p className="notify-demo-note">Prévia de interface: as atividades exibidas são exemplos e as ações ficam nesta sessão. Para notificações reais e convites persistentes, falta conectar esta tela à autenticação e à tabela de notificações do backend.</p>
    <PrimaryNav active="inicio"/>
    <style jsx>{`
      .notify-page{position:relative;min-height:100dvh;overflow:hidden;padding:0 0 112px;color:#faf7ff;background:radial-gradient(ellipse at 50% -8%,#321050 0,transparent 46%),radial-gradient(ellipse at 100% 38%,#180a34 0,transparent 38%),#080411}
      .notify-header{display:flex;align-items:center;gap:12px;padding:23px 17px 19px;border-bottom:1px solid #a02eff2b}
      .notify-back{display:grid;place-items:center;flex:0 0 43px;width:43px;height:43px;border:1px solid #a344ef6b;border-radius:15px;color:#fff;text-decoration:none;font-size:31px;line-height:1;background:#190d29}
      .notify-heading{min-width:0;flex:1}.notify-heading>span{font-size:9px;font-weight:850;letter-spacing:1.35px;color:#bd91ff}.notify-heading h1{margin:3px 0 2px;font-size:24px;letter-spacing:-.8px;font-weight:850}.notify-heading p{margin:0;color:#ac9abf;font-size:11px}
      .notify-read-all{padding:9px 10px;border:1px solid #7730a6;border-radius:12px;background:#1a0d29;color:#e4c7ff;font-size:10px;font-weight:750;white-space:nowrap}
      .notify-summary{display:flex;align-items:center;gap:13px;margin:18px 16px;padding:15px;border:1px solid #a23eff70;border-radius:20px;background:linear-gradient(110deg,#25103b,#11091e 65%,#10223a);box-shadow:0 10px 28px #0003,inset 0 1px #ffffff0c}
      .notify-summary-icon{display:grid;place-items:center;flex:0 0 44px;height:44px;border-radius:15px;background:linear-gradient(140deg,#00d9ff,#8b2bff 58%,#f02bc4);box-shadow:0 0 24px #9e2dff44;font-size:22px}.notify-summary strong{font-size:13px}.notify-summary p{margin:4px 0 0;color:#b8a7ca;font-size:11px;line-height:1.45}
      .notify-filter-panel{margin:0 16px;padding:15px 13px;border:1px solid #6b2c8e70;border-radius:21px;background:linear-gradient(145deg,#170b25,#0d0716);box-shadow:0 12px 28px #0002}
      .notify-filter-title,.notify-filter-title>div{display:flex;align-items:center;justify-content:space-between;gap:8px}.notify-filter-title>div{justify-content:flex-start}.notify-filter-title>div>span{color:#dca9ff}.notify-filter-title strong{font-size:13px}
      .notify-unread{display:flex;align-items:center;gap:5px;color:#b9a9ca;font-size:10px;white-space:nowrap}.notify-unread input{accent-color:#a13aff}
      .notify-tabs{display:flex;gap:7px;overflow-x:auto;padding:15px 0 13px;scrollbar-width:none}.notify-tabs button{flex:0 0 auto;border:1px solid #5c2a7c;border-radius:999px;background:#10081a;color:#bda9ce;padding:9px 12px;font-size:11px;font-weight:700}.notify-tabs button.active{border-color:#b24cff;background:linear-gradient(110deg,#6922a9,#a41de0);color:white;box-shadow:0 4px 15px #9628d92c}
      .notify-followers-filter{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:13px;border-top:1px solid #ffffff12}.notify-followers-filter>span{display:flex;flex-direction:column;gap:4px;min-width:0}.notify-followers-filter strong{font-size:11px}.notify-followers-filter small{color:#a997b9;font-size:9px;line-height:1.4}.notify-followers-filter select{max-width:48%;min-width:132px;padding:10px 8px;border:1px solid #8a3cb1;border-radius:12px;background:#170c24;color:#eee1ff;font-size:10px;outline:none}
      .notify-list-section{margin:24px 16px 0}.notify-list-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.notify-list-heading h2{margin:0;font-size:16px;font-weight:850}.notify-list-heading h2 span{display:inline-grid;place-items:center;min-width:21px;height:21px;padding:0 5px;margin-left:5px;border-radius:99px;background:#28103b;color:#d7a2ff;font-size:10px}.notify-list-heading>span{color:#a796b8;font-size:10px}
      .notify-list{display:grid;gap:9px}.notify-item{display:flex;align-items:flex-start;gap:10px;padding:13px 11px;border:1px solid #55276c70;border-radius:18px;background:linear-gradient(120deg,#160b22,#0e0816);transition:border-color .2s,background .2s}.notify-item.unread{border-color:#8e35c57d;background:linear-gradient(110deg,#241037,#10091b 68%)}.notify-avatar-link{flex:0 0 44px;width:44px;height:44px;border-radius:50%;padding:2px;background:linear-gradient(140deg,#13d7ff,#a23aff,#ee42c5)}.notify-avatar-link img{display:block;width:100%;height:100%;object-fit:cover;border-radius:50%;border:2px solid #100817}.notify-item-copy{flex:1;min-width:0}.notify-message{font-size:11px;line-height:1.55;color:#d7c9e2}.notify-message strong{color:#fff;font-size:12px}.notify-username{display:block;color:#9d88b3;font-size:9px;margin:0 0 2px}.notify-meta{display:flex;align-items:center;gap:5px;margin-top:6px;color:#9d8bab;font-size:9px}.notify-meta i{width:6px;height:6px;border-radius:50%;background:#c34cff;box-shadow:0 0 8px #c34cff}.notify-kind-icon{display:grid;place-items:center;flex:0 0 29px;height:29px;border-radius:10px;background:#2b123a;color:#e7b6ff;font-size:14px}.kind-like{color:#ff78bb;background:#36142b}.kind-follow{color:#68e4ff;background:#102c39}.kind-collab{color:#c99aff;background:#2c1745}.kind-comment{color:#bda0ff;background:#21163c}.kind-mention{color:#72d9ff;background:#102a3a}
      .notify-collab-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px}.notify-collab-actions button{padding:8px 11px;border-radius:10px;font-size:10px;font-weight:800}.notify-accept{border:0;background:linear-gradient(105deg,#0ebde8,#773bff 70%,#c337dc);color:white;box-shadow:0 4px 14px #5b28db30}.notify-decline{border:1px solid #633875;background:#170c24;color:#c9b5d8}.notify-accepted{padding:7px 9px;border-radius:9px;background:#12382f;color:#8bf0cc;font-size:10px;font-weight:750}
      .notify-feedback{display:flex;justify-content:space-between;gap:8px;margin:0 0 12px;padding:10px 12px;border:1px solid #377e70;border-radius:12px;background:#102720;color:#a7f3d0;font-size:11px}.notify-feedback button{border:0;background:transparent;color:inherit;font-size:18px}
      .notify-empty{display:flex;align-items:center;flex-direction:column;text-align:center;padding:35px 20px;border:1px dashed #673481;border-radius:20px;background:#12091d}.notify-empty>span{font-size:29px;color:#d39aff}.notify-empty strong{margin-top:9px;font-size:13px}.notify-empty p{color:#ad9bbc;font-size:11px;line-height:1.5}.notify-empty button{border:1px solid #8d35c4;border-radius:11px;padding:9px 13px;background:#27103a;color:#e9caff;font-size:11px}
      .notify-demo-note{margin:18px 20px;color:#857794;font-size:9px;line-height:1.5;text-align:center}
      .notify-side-beam{position:fixed;z-index:3;pointer-events:none;left:0;top:18%;height:120px;width:3px;opacity:0;background:linear-gradient(180deg,transparent,#00d9ff,#a33cff,#f02bc4,transparent);filter:blur(1px);box-shadow:0 0 16px #8e39ff;transform:translateY(-30px)}.notify-side-beam.is-active{animation:notifyBeam 2.6s ease-in-out both}
      @keyframes notifyBeam{0%{opacity:0;transform:translateY(-30px)}15%{opacity:.9}80%{opacity:.6}100%{opacity:0;transform:translateY(120px)}}
      @media(min-width:700px){.notify-page{max-width:650px;margin:0 auto;border-left:1px solid #ffffff08;border-right:1px solid #ffffff08}.notify-side-beam{left:max(0px,calc((100vw - 650px)/2))}.notify-header{padding:28px 24px 22px}.notify-summary,.notify-filter-panel{margin-left:24px;margin-right:24px}.notify-list-section{margin-left:24px;margin-right:24px}}
      @media(prefers-reduced-motion:reduce){.notify-side-beam.is-active{animation:none;opacity:0}}
    `}</style>
  </main>;
}
