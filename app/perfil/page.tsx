/* NEXORA_PROFILE_REFRESH: functional video-interest preferences + compact, honest follower preview; preserve saved profile data. */
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
const defaultHighlights: Highlight[] = [];
const tabNames = ["Publicações", "Reels", "Preferências", "Republicados"] as const;

const settingsOptions = [
  {id:"tipo-conta",title:"Tipo de perfil",desc:"Pessoal, profissional ou criador",cat:"Conta",choices:["Pessoal","Profissional","Criador de conteúdo"]},
  {id:"visibilidade",title:"Privacidade da conta",desc:"Escolha quem pode ver seu perfil",cat:"Privacidade",choices:["Público","Privado"]},
  {id:"bloqueios",title:"Contas bloqueadas",desc:"Gerencie perfis que você bloqueou",cat:"Privacidade",choices:["Nenhuma conta bloqueada","Gerenciar bloqueios"]},
  {id:"restritos",title:"Contas restritas",desc:"Limite interações sem bloquear",cat:"Privacidade",choices:["Desativado","Gerenciar restrições"]},
  {id:"mencoes",title:"Menções e marcações",desc:"Quem pode mencionar você",cat:"Privacidade",choices:["Todos","Pessoas que sigo","Ninguém"]},
  {id:"mensagens",title:"Solicitações de mensagem",desc:"Controle quem pode chamar no privado",cat:"Privacidade",choices:["Todos","Pessoas que sigo","Desativado"]},
  {id:"comentarios",title:"Comentários",desc:"Defina quem pode comentar",cat:"Privacidade",choices:["Todos","Pessoas que sigo","Desativado"]},
  {id:"atividade",title:"Status de atividade",desc:"Exiba quando estiver online",cat:"Privacidade",choices:["Ativado","Desativado"]},
  {id:"stories",title:"Privacidade dos Stories",desc:"Controle a audiência dos Stories",cat:"Conteúdo",choices:["Todos os seguidores","Amigos próximos","Ocultar dos selecionados"]},
  {id:"reposts",title:"Republicações",desc:"Permita que compartilhem suas publicações",cat:"Conteúdo",choices:["Permitidas","Desativadas"]},
  {id:"salvos",title:"Itens salvos",desc:"Organize suas coleções pessoais",cat:"Conteúdo",choices:["Minhas coleções","Criar coleção"]},
  {id:"filtros",title:"Palavras ocultas",desc:"Reduza comentários e mensagens indesejadas",cat:"Conteúdo",choices:["Filtro padrão","Filtro personalizado","Desativado"]},
  {id:"categoria",title:"Categoria do perfil",desc:"Mostre sua área abaixo da identidade",cat:"Criador",choices:["Criador de conteúdo","Blogueiro(a)","Artista / músico","Marca / empresa","Loja","Educação","Entretenimento","Uso pessoal"]},
  {id:"painel-criador",title:"Painel profissional",desc:"Ferramentas para criadores e negócios",cat:"Criador",choices:["Visão geral","Ferramentas de conteúdo","Parcerias e marcas"]},
  {id:"monetizacao",title:"Monetização e parcerias",desc:"Preferências de colaboração",cat:"Criador",choices:["Interesse em parcerias","Interesse em publicidade","Ainda não"]},
  {id:"notificacoes",title:"Notificações",desc:"Escolha como quer ser avisado",cat:"Geral",choices:["Todas","Personalizadas","Pausadas"]},
  {id:"selos-verificacao",title:"Verificação e Selos 3D",desc:"Conheça os selos, critérios e avisos automáticos",cat:"Geral",choices:["Entender os selos","Preferências automáticas"]},
  {id:"idioma",title:"Idioma",desc:"Idioma preferido da interface; a tradução completa das páginas será conectada por etapas",cat:"Geral",choices:["Português (Brasil)","English (United States)","Español","Français","Deutsch","Italiano","日本語","한국어","中文（简体）","中文（繁體）","العربية","हिन्दी","বাংলা","Русский","Türkçe","Bahasa Indonesia","Bahasa Melayu","ไทย","Tiếng Việt","Filipino","Nederlands","Polski","Українська","Svenska","Kiswahili"]},
  {id:"aparencia",title:"Aparência",desc:"Personalize a experiência visual",cat:"Aparência",choices:["Escuro Nexora","Escuro discreto","Seguir dispositivo"]},
  {id:"acessibilidade",title:"Acessibilidade",desc:"Movimento, contraste e legibilidade",cat:"Aparência",choices:["Padrão","Reduzir animações","Contraste elevado","Texto ampliado"]},
  {id:"economia",title:"Uso de dados",desc:"Preferências de carregamento",cat:"Dados",choices:["Padrão","Economia de dados","Qualidade alta"]},
  {id:"download",title:"Baixar suas informações",desc:"Exporte os dados salvos neste dispositivo",cat:"Dados",choices:["Exportar dados locais","Entender quais dados são salvos"]},
  {id:"seguranca",title:"Segurança da conta",desc:"Opções de proteção da conta",cat:"Conta",choices:["Sessões conectadas","Autenticação em duas etapas","Alertas de acesso"]},
];

const settingsIconById: Record<string, string> = {
  "tipo-conta":"◉","visibilidade":"◉","bloqueios":"⊘","restritos":"◌","mencoes":"@","mensagens":"✉",
  "comentarios":"☷","atividade":"◉","stories":"◍","reposts":"↻","salvos":"▣","filtros":"≋",
  "categoria":"✧","painel-criador":"▤","monetizacao":"↗","notificacoes":"♧","selos-verificacao":"♛",
  "idioma":"文","aparencia":"◐","acessibilidade":"♿","economia":"⇅","download":"↓","seguranca":"⛨"
};
const settingsIconColorById: Record<string, string> = {
  "tipo-conta":"#a78bfa","visibilidade":"#60a5fa","bloqueios":"#fb7185","restritos":"#fbbf24","mencoes":"#c084fc",
  "mensagens":"#67e8f9","comentarios":"#93c5fd","atividade":"#34d399","stories":"#f472b6","reposts":"#22d3ee",
  "salvos":"#fbbf24","filtros":"#a3e635","categoria":"#c084fc","painel-criador":"#60a5fa","monetizacao":"#4ade80",
  "notificacoes":"#facc15","selos-verificacao":"#67e8f9","idioma":"#c4b5fd","aparencia":"#a78bfa",
  "acessibilidade":"#5eead4","economia":"#86efac","download":"#93c5fd","seguranca":"#f87171"
};

type TabName = typeof tabNames[number];

export default function ProfilePage() {
  const [coverIndex, setCoverIndex] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>(defaultHighlights);
  const [activeTab, setActiveTab] = useState<TabName>("Publicações");
  const [note, setNote] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [socialListOpen, setSocialListOpen] = useState<"followers" | "following" | null>(null);
  const [socialSearch, setSocialSearch] = useState("");
  const [profileCategory, setProfileCategory] = useState("Criador de conteúdo");
  const [profileName, setProfileName] = useState("Licinhosz.bb");
  const [profileUsername, setProfileUsername] = useState("licinhosz.bb");
  const [profileLinks, setProfileLinks] = useState("");
  const [avatarData, setAvatarData] = useState("");
  const [coverData, setCoverData] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsSearch, setSettingsSearch] = useState("");
  const [settingsSection, setSettingsSection] = useState("Geral");
  const [settingsDetail, setSettingsDetail] = useState("");
  const [selectedSettings, setSelectedSettings] = useState<Record<string, string>>({});
  const [profileBio, setProfileBio] = useState("Humor, resenha, vida real e muito mais... 👑\nUma nova emoção, Sintonia de Amor 💜");
  const [profileLocation, setProfileLocation] = useState("Brasil");
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightEmoji, setHighlightEmoji] = useState("🌟");
  const [toast, setToast] = useState("");
  const [prefs, setPrefs] = useState({ neon: true, showActivity: true, allowReposts: true, compactGrid: false, privateProfile: false, allowMessages: true, showLocation: true, saveData: false });
  const [videoTopics, setVideoTopics] = useState<string[]>(["Humor", "Música"]);
  const videoTopicOptions = ["Humor", "Música", "Games", "Lifestyle", "Tutoriais", "Esportes", "Beleza", "Comédia", "Tecnologia", "Educação"];
  const sampleFollowerTemplates = [
    { username: "demo.humor", name: "Criador de humor", initials: "CH", hue: 285 },
    { username: "demo.musica", name: "Música & covers", initials: "MC", hue: 190 },
    { username: "demo.games", name: "Universo gamer", initials: "UG", hue: 145 },
    { username: "demo.lifestyle", name: "Vida cotidiana", initials: "VC", hue: 330 },
    { username: "demo.tutoriais", name: "Dicas e tutoriais", initials: "DT", hue: 215 },
    { username: "demo.esportes", name: "Esportes", initials: "ES", hue: 25 },
    { username: "demo.tecnologia", name: "Tecnologia", initials: "TC", hue: 255 },
    { username: "demo.criativo", name: "Criatividade", initials: "CR", hue: 45 },
  ];
  // 1.000 perfis sintéticos exclusivamente para demonstração visual; não representam usuários reais.
  const sampleFollowers = Array.from({ length: 1000 }, (_, index) => {
    const template = sampleFollowerTemplates[index % sampleFollowerTemplates.length];
    const number = String(index + 1).padStart(4, "0");
    return {
      id: `sample-follower-${number}`,
      username: index < sampleFollowerTemplates.length ? template.username : `${template.username.replace("demo.", "teste.")}${number}`,
      name: index < sampleFollowerTemplates.length ? template.name : `${template.name} · Teste ${number}`,
      initials: template.initials,
      hue: (template.hue + index * 17) % 360,
    };
  });
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
      if (Array.isArray(data.highlights)) setHighlights(data.highlights.filter((item: Highlight) => !["Minha vida","Resenha","Momentos","Músicas"].includes(item?.title || "")));
      if (Array.isArray(data.posts)) setPosts(data.posts);
      if (Array.isArray(data.reposted)) setReposted(data.reposted);
      if (typeof data.coverIndex === "number") setCoverIndex(Math.max(0, Math.min(covers.length - 1, data.coverIndex)));
      if (data.prefs && typeof data.prefs === "object") setPrefs((p) => ({ ...p, ...data.prefs }));
      if (Array.isArray(data.videoTopics)) setVideoTopics(data.videoTopics.filter((topic: unknown): topic is string => typeof topic === "string" && ["Humor", "Música", "Games", "Lifestyle", "Tutoriais", "Esportes", "Beleza", "Comédia", "Tecnologia", "Educação"].includes(topic)));
      if (data.selectedSettings && typeof data.selectedSettings === "object") setSelectedSettings(data.selectedSettings);
    } catch { /* Ignore malformed local demo data safely. */ }
  }, []);

  async function readOptimizedImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Falha ao ler imagem"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Imagem inválida"));
        img.onload = () => {
          const scale = Math.min(1, 900 / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("Canvas indisponível")); return; }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

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
        .profile-pref{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 2px;border-bottom:1px solid #ffffff10}.profile-pref strong{display:block;font-size:12px}.profile-pref small{display:block;color:#8f92ac;font-size:10px;margin-top:5px;line-height:1.4}.video-preference-preview{display:flex;gap:13px;align-items:flex-start;padding:15px;margin:0 0 13px;border:1px solid #8b70ff55;border-radius:20px;background:radial-gradient(ellipse at 100% 0%,#a66cff24,transparent 55%),linear-gradient(120deg,#121a2d,#151023);box-shadow:inset 0 1px #ffffff0c,0 12px 30px #0002}.video-preference-icon{width:44px;height:44px;flex:0 0 44px;display:grid;place-items:center;border-radius:16px;background:linear-gradient(140deg,#55e8ff,#8a5cff 65%,#df58dc);color:#090914;font-size:18px;font-weight:900;box-shadow:0 6px 20px #8b5cff30}.video-preference-preview strong{font-size:13px}.video-preference-preview p{font-size:11px;line-height:1.65;color:#b3b5cf;margin:6px 0 8px}.video-preference-preview span{font-size:9px;color:#9eeeff;letter-spacing:.2px}.video-topic-panel{padding:14px;margin:0 0 10px;border:1px solid #ffffff15;border-radius:18px;background:linear-gradient(140deg,#ffffff08,#ffffff02)}.video-topic-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}.video-topic-heading strong{font-size:12px}.video-topic-heading span{font-size:10px;color:#9feeff;white-space:nowrap}.video-topic-grid{display:flex;flex-wrap:wrap;gap:8px}.video-topic-chip{border:1px solid #ffffff1b;background:#ffffff06;color:#c7c8dd;border-radius:999px;padding:10px 12px;font-size:11px;font-weight:750;transition:background .18s,border-color .18s,transform .18s}.video-topic-chip.selected{color:#fff;border-color:#71ddff99;background:linear-gradient(110deg,#2c8bff35,#a15aff35);box-shadow:0 0 18px #8a5cff18,inset 0 1px #ffffff16}.video-topic-chip:active{transform:scale(.97)}.video-topic-note{font-size:10px;line-height:1.55;color:#8588a5;margin:12px 0 0}.profile-switch{width:42px;height:25px;flex:0 0 42px;border:0;border-radius:99px;padding:3px;background:#39394c}.profile-switch:after{content:"";display:block;width:19px;height:19px;border-radius:50%;background:#fff;transition:transform .18s}.profile-switch.on{background:linear-gradient(90deg,#328aff,#a15aff)}.profile-switch.on:after{transform:translateX(17px)}
        .profile-modal-backdrop{position:fixed;z-index:100;inset:0;background:#000a;backdrop-filter:blur(7px);display:flex;align-items:flex-end;justify-content:center;padding:12px}
        .profile-modal{width:100%;max-width:500px;border:1px solid #ffffff20;background:#10101b;border-radius:24px;padding:20px;box-shadow:0 15px 60px #000b}
        .profile-modal h2{font-size:17px;margin:0 0 6px}.profile-modal p{font-size:12px;color:#a2a4bd;line-height:1.5;margin:0 0 15px}
        .social-list-head{display:flex;align-items:center;gap:12px;padding:calc(env(safe-area-inset-top) + 16px) 17px 15px;border-bottom:1px solid #bda7ff20;background:radial-gradient(ellipse at 88% -10%,#8b5cf638,transparent 54%),radial-gradient(ellipse at 0% 100%,#22d3ee10,transparent 46%),rgba(12,11,24,.94);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}
        .social-list-back{width:42px;height:42px;border:1px solid #ffffff24;border-radius:50%;background:linear-gradient(145deg,#ffffff18,#ffffff05);color:#fff;font-size:25px;flex:0 0 42px;display:grid;place-items:center;box-shadow:inset 0 1px #ffffff18,0 5px 18px #0004;transition:transform .18s,border-color .18s}
        .social-list-back:active{transform:scale(.94);border-color:#8b70ff80}
        .social-list-title{font-size:20px;font-weight:900;letter-spacing:-.55px}.social-list-subtitle{font-size:11px;color:#a9abc5;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .social-list-count{margin-left:auto;border:1px solid #67e8f955;border-radius:99px;padding:8px 11px;color:#b9f6ff;background:linear-gradient(120deg,#55e8ff20,#a66cff20);font-size:10px;font-weight:850;white-space:nowrap;box-shadow:inset 0 1px #ffffff14,0 0 18px #55e8ff0a}
        .social-list-search-wrap{padding:13px 15px 11px;background:rgba(12,11,24,.82);border-bottom:1px solid #ffffff0c;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
        .social-list-search{width:100%;height:45px;border:1px solid #ffffff20;border-radius:999px;background:linear-gradient(110deg,#ffffff0d,#ffffff05);color:#fff;padding:0 16px;outline:none;font:inherit;font-size:12px;box-shadow:inset 0 1px #ffffff0b;transition:border-color .2s,box-shadow .2s,background .2s}
        .social-list-search::placeholder{color:#8588a5}.social-list-search:focus{border-color:#8b70ffad;background:#171329;box-shadow:0 0 0 3px #8b70ff20,0 0 22px #8b70ff10}
        .social-list-body{flex:1;min-height:0;overflow-y:auto;padding:11px 13px calc(env(safe-area-inset-bottom) + 14px);overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#65528e transparent}
        .social-list-summary{font-size:10px;color:#9698b3;padding:3px 5px 10px}
        .social-user-row{min-height:72px;display:flex;align-items:center;gap:12px;border:1px solid #ffffff13;border-radius:22px;padding:10px 12px;margin:0 0 9px;background:linear-gradient(115deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:inset 0 1px #ffffff0c,0 7px 20px #0002;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);transition:background .2s,border-color .2s,transform .2s,box-shadow .2s}
        .social-user-row:hover{background:linear-gradient(115deg,#55e8ff12,#a66cff13);border-color:#8d75ff55;box-shadow:inset 0 1px #ffffff15,0 9px 24px #0003}
        .social-user-avatar{width:48px;height:48px;flex:0 0 48px;border-radius:50%;display:grid;place-items:center;border:2px solid transparent;background-clip:padding-box;font-size:12px;font-weight:900;color:white;box-shadow:0 0 0 2px #121020,0 0 0 3px #7b6bff9c,0 0 17px #7b6bff25,inset 0 1px #ffffff50}
        .social-user-copy{min-width:0;flex:1}.social-user-name{font-size:13px;font-weight:850;letter-spacing:-.1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f7f5ff}.social-user-handle{font-size:10px;color:#a8abc7;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .social-user-tag{font-size:9px;color:#c8bbff;border:1px solid #a66cff4b;border-radius:99px;padding:6px 9px;white-space:nowrap;background:linear-gradient(120deg,#a66cff1c,#55e8ff0b);font-weight:850;box-shadow:inset 0 1px #ffffff12}
        .social-list-empty{min-height:220px;display:grid;place-items:center;text-align:center;padding:24px;color:#a3a5bd}
        .social-list-empty-icon{width:66px;height:66px;border-radius:50%;margin:0 auto 13px;display:grid;place-items:center;font-size:27px;color:#a9eaff;background:linear-gradient(145deg,#55e8ff18,#a66cff26);border:1px solid #a66cff45;box-shadow:0 8px 28px #7455ff1b,inset 0 1px #ffffff18}
        .social-list-footer{padding:11px 15px calc(env(safe-area-inset-bottom) + 11px);border-top:1px solid #ffffff12;color:#8d90ab;font-size:10px;line-height:1.55;background:rgba(11,11,20,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
        @media(max-width:420px){.social-list-head{gap:9px;padding-left:13px;padding-right:13px}.social-list-title{font-size:18px}.social-list-count{padding:7px 9px;font-size:9px}.social-list-body{padding-left:10px;padding-right:10px}.social-user-row{gap:10px;padding:9px 10px;border-radius:20px}.social-user-avatar{width:45px;height:45px;flex-basis:45px}.social-user-name{font-size:12px}.social-user-tag{padding:5px 7px}}
        .profile-stat-button{appearance:none;background:transparent;color:inherit;border:0;padding:0;width:100%;font:inherit;cursor:pointer}
        .profile-stat-button:focus-visible{outline:2px solid #55e8ff;border-radius:8px}

        .profile-input{width:100%;border:1px solid #ffffff22;background:#080811;color:#fff;border-radius:13px;padding:13px;margin:7px 0 12px;outline:none}.profile-input:focus{border-color:#8d70ff}
        .profile-emoji-options{display:flex;gap:8px;margin:6px 0 16px}.profile-emoji-options button{font-size:20px;background:#ffffff09;border:1px solid #ffffff1b;border-radius:11px;padding:9px}
        .profile-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:8px}
        .profile-settings-search{width:100%;border:1px solid #ffffff20;background:#080811;color:white;border-radius:13px;padding:12px;margin:8px 0 12px;outline:none}
        .profile-settings-cats{display:flex;gap:7px;overflow-x:auto;padding:3px 0 10px;scrollbar-width:none}
        .profile-settings-cats button{flex:0 0 auto;border:1px solid #ffffff1a;background:#ffffff08;color:#bcbad4;border-radius:99px;padding:8px 11px;font-size:11px}
        .profile-settings-cats button.active{color:#fff;border-color:#8c71ff;background:#8c71ff24}
        .profile-file{display:block;width:100%;color:#b9b8d0;font-size:11px;margin:5px 0 12px}
        
        .profile-modal-backdrop{overflow:hidden;align-items:stretch;justify-content:stretch;padding:0;background:#080810}
        .profile-modal{width:100%;max-width:none;height:100dvh;max-height:100dvh;border:0;border-radius:0;padding:0;overflow:hidden;background:#090911;display:flex;flex-direction:column;box-shadow:none}
        .settings-screen-head{flex:0 0 auto;padding:calc(env(safe-area-inset-top) + 14px) 17px 12px;border-bottom:1px solid #ffffff12;background:#0d0c18}
        .settings-screen-body{min-height:0;flex:1;overflow-y:auto;padding:14px 17px calc(env(safe-area-inset-bottom) + 22px)}
        .settings-back{border:1px solid #ffffff1a;background:#ffffff08;color:#fff;border-radius:12px;padding:9px 12px;margin-bottom:12px}
        .settings-option-row{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid #ffffff12;border-radius:16px;background:linear-gradient(110deg,#ffffff07,#ffffff02);padding:14px;margin:7px 0;color:#fff}
        .settings-option-icon{width:39px;height:39px;flex:0 0 39px;display:grid;place-items:center;border-radius:13px;background:linear-gradient(140deg,#2c8bff44,#9d5cff33);border:1px solid #8c71ff35;font-size:16px}
        .settings-option-copy{min-width:0;flex:1}.settings-option-copy strong{display:block;font-size:13px}.settings-option-copy small{display:block;color:#9698b2;font-size:11px;line-height:1.45;margin-top:4px}.settings-option-value{font-size:10px;color:#8bdfff;margin-top:5px}
        .settings-choice{width:100%;display:flex;align-items:center;justify-content:space-between;text-align:left;border:1px solid #ffffff14;border-radius:14px;background:#ffffff05;color:#fff;padding:15px;margin:7px 0}
        .settings-choice.active{border-color:#7e83ff;background:#6654ff20}
        .settings-footer{flex:0 0 auto;padding:12px 17px calc(env(safe-area-inset-bottom) + 12px);border-top:1px solid #ffffff12;background:#0d0c18;display:flex;gap:8px}
        .settings-footer button{flex:1}
      
        .profile-toast{position:fixed;z-index:150;left:50%;bottom:92px;transform:translateX(-50%);background:#19172a;border:1px solid #8f78ff66;color:#fff;padding:12px 16px;border-radius:14px;font-size:12px;box-shadow:0 8px 30px #0008;width:max-content;max-width:90vw}
        @media(min-width:700px){.profile-shell{padding:0 24px}.profile-cover{height:230px}.profile-identity{padding:0 16px}.profile-tabs{gap:8px}.profile-tab{font-size:12px}.profile-grid{gap:9px}.profile-tile{border-radius:16px}}
        @media(max-width:380px){.profile-cover{height:145px}.profile-identity-actions{gap:5px}.profile-btn{padding:9px 10px;font-size:10px}.profile-name{font-size:20px}.profile-tab{padding:10px 9px;font-size:10px}.highlight-row{gap:9px}}
      `}</style>

      <div className="profile-shell">
        <header className="profile-top">
          <div className="profile-brand"><span className="profile-logo">N</span><span>Nexora</span></div>
          <button className="profile-icon-btn" aria-label="Opções do perfil" onClick={() => { setSettingsDetail(""); setSettingsOpen(true); }}>☰</button>
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
              <button className="profile-btn primary" onClick={() => { window.location.href = "/?action=create"; }}>＋ Criar</button>
            </div>
          </div>
          <h1 className="profile-name">{profileName || "Seu nome"}</h1>
          <div className="profile-handle">@{profileUsername || "seu.usuario"}</div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginTop:8,flexWrap:"wrap"}}><span style={{display:"inline-flex",alignItems:"center",gap:6,border:"1px solid #72dfff70",borderRadius:999,padding:"5px 10px",background:"linear-gradient(100deg,#55e8ff12,#a66cff12)",color:"#b9f4ff",fontSize:10,letterSpacing:".2px",backdropFilter:"blur(12px)"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.8l2.3 1.5 2.8-.1 1.1 2.6 2.4 1.5-.7 2.7.7 2.7-2.4 1.5-1.1 2.6-2.8-.1-2.3 1.5-2.3-1.5-2.8.1-1.1-2.6-2.4-1.5.7-2.7-.7-2.7 2.4-1.5 1.1-2.6 2.8.1L12 2.8Z" fill="#63dfff" fillOpacity=".22" stroke="#74e8ff"/><path d="m8.4 12.2 2.2 2.1 5-5" stroke="#baf8ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>{profileCategory}</span><span style={{fontSize:10,color:"#8588a3"}}>Identidade do perfil</span></div>
          <p className="profile-bio">{profileBio}</p>
          <div className="profile-bio-meta">{prefs.showLocation && profileLocation ? <span>⌖ {profileLocation}</span> : null}<span>✦ Nexora</span><span>◉ {profileCategory}</span></div>{profileLinks.trim() && <div style={{marginTop:9,fontSize:12,overflowWrap:"anywhere"}}>{profileLinks.split(",").map((item,i)=>item.trim()).filter(Boolean).map((item,i)=><a key={i} href={item.startsWith("http://") || item.startsWith("https://") ? item : "https://" + item} target="_blank" rel="noreferrer" style={{color:"#69dfff",marginRight:10}}>{item.replace("https://","").replace("http://","")}</a>)}</div>}
          <div className="profile-stats">
            <div className="profile-stat"><strong>{posts.length}</strong><span>Publicações</span></div>
            <div className="profile-stat"><button className="profile-stat-button" onClick={() => setSocialListOpen("followers")} aria-label="Ver seguidores"><strong>1.000*</strong><span>Seguidores de teste</span></button></div>
            <div className="profile-stat"><button className="profile-stat-button" onClick={() => setSocialListOpen("following")} aria-label="Ver seguindo"><strong>0</strong><span>Seguindo</span></button></div>
          </div>
          <div style={{marginTop:-12,marginBottom:18,fontSize:9,color:"#8e91aa",textAlign:"center"}}>Demonstração · 1.000 seguidores fictícios para teste; nenhum é uma conta real.</div>
        </section>

        {highlights.length > 0 && <section>
          <div className="profile-section-title"><span>Seus destaques <small>· coleções do seu universo</small></span><small>{highlights.length} coleções</small></div>
          <div className="highlight-row">
            {highlights.map((item) => <div className="highlight-item" key={item.id}><div className="highlight-circle"><div className="highlight-inner" style={{background:item.tone+"24"}}>{item.emoji}</div></div><span>{item.title}</span></div>)}
          </div>
        </section>}

        <section>
          <div className="profile-section-title"><span>Notas Nexora <small>· presença rápida</small></span><small>✦ Neon</small></div>
          {prefs.showActivity ? <div className="note-card"><div className="note-orb">✧</div><div className="note-copy"><strong>Sua nota de agora</strong><p>{note || "Adicione uma nota em Editar perfil para mostrar seu momento…"}</p></div><button className="note-edit" onClick={() => setEditOpen(true)}>Editar perfil</button></div> : <div className="profile-empty"><strong>Notas ocultas</strong><p>Ative “Mostrar nota no perfil” nas configurações para exibir sua nota.</p></div>}
        </section>

        <div className="profile-tabs" role="tablist" aria-label="Conteúdo do perfil">
          {tabNames.map((tab) => <button key={tab} role="tab" aria-selected={activeTab===tab} className={`profile-tab ${activeTab===tab?"active":""}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </div>
        <section className="profile-content">
          {activeTab === "Preferências" ? <div>
            <div className="video-preference-preview"><div className="video-preference-icon">▶</div><div><strong>Seus interesses em vídeos</strong><p>Marque os assuntos que você mais gosta para deixar sua preferência salva. Isso prepara seu perfil para o futuro sistema de recomendações; por enquanto, a seleção ainda não altera o Feed nem os Reels.</p><span>✦ Preferências salvas neste dispositivo</span></div></div>
            <div className="video-topic-panel"><div className="video-topic-heading"><strong>O que você gosta de assistir?</strong><span>{videoTopics.length} selecionado{videoTopics.length === 1 ? "" : "s"}</span></div><div className="video-topic-grid">{videoTopicOptions.map((topic) => { const selected = videoTopics.includes(topic); return <button key={topic} type="button" aria-pressed={selected} className={`video-topic-chip ${selected ? "selected" : ""}`} onClick={() => { const next = selected ? videoTopics.filter((item) => item !== topic) : [...videoTopics, topic]; setVideoTopics(next); save({ videoTopics: next }); setToast("Preferências de vídeos salvas neste dispositivo."); }}>{selected ? "✓ " : "＋ "}{topic}</button>; })}</div><p className="video-topic-note">Você pode marcar vários temas ou desmarcar todos. Nenhuma recomendação real é alterada até o sistema de vídeos ser conectado.</p></div>
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

      {editOpen && <div className="profile-modal-backdrop" onClick={() => setEditOpen(false)}><section className="profile-modal" onClick={e => e.stopPropagation()}><h2>✦ Editar perfil</h2><p>Personalize sua identidade e sua Nota Nexora em um único lugar.</p><label style={{fontSize:11,color:"#b8b7ce"}}>Nome de exibição</label><input className="profile-input" value={profileName} maxLength={30} onChange={e => setProfileName(e.target.value)} placeholder="Como as pessoas vão te chamar"/><label style={{fontSize:11,color:"#b8b7ce"}}>@Nome de usuário</label><input className="profile-input" value={profileUsername} maxLength={30} onChange={e => setProfileUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g,""))} placeholder="seu.usuario"/><label style={{fontSize:11,color:"#b8b7ce"}}>Links externos (separe por vírgula)</label><textarea className="profile-input" rows={2} value={profileLinks} maxLength={500} onChange={e=>setProfileLinks(e.target.value)} placeholder="seudominio.com, instagram.com/seuperfil"/><label style={{fontSize:11,color:"#b8b7ce"}}>Foto de perfil (imagem até 8 MB)</label><input className="profile-file" type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>8*1024*1024){setToast("Escolha uma imagem de até 8 MB.");return;}readOptimizedImage(file).then(setAvatarData).catch(()=>setToast("Não foi possível abrir essa imagem."));}}/><label style={{fontSize:11,color:"#b8b7ce"}}>Capa do perfil (imagem até 8 MB)</label><input className="profile-file" type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>8*1024*1024){setToast("Escolha uma imagem de até 8 MB.");return;}readOptimizedImage(file).then(setCoverData).catch(()=>setToast("Não foi possível abrir essa imagem."));}}/><label style={{fontSize:11,color:"#b8b7ce"}}>Biografia</label><textarea className="profile-input" rows={3} maxLength={180} value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="Conte um pouco sobre você"/><label style={{fontSize:11,color:"#b8b7ce"}}>Localização (opcional)</label><input className="profile-input" value={profileLocation} maxLength={45} onChange={e => setProfileLocation(e.target.value)} placeholder="Cidade ou país"/><label style={{fontSize:11,color:"#b8b7ce"}}>✧ Nota Nexora · até 120 caracteres</label><textarea className="profile-input" rows={2} maxLength={120} value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="Uma ideia, pergunta ou o clima do momento…"/><div style={{textAlign:"right",fontSize:10,color:"#9294ad"}}>{noteDraft.length}/120</div><div className="profile-modal-actions"><button className="profile-btn" onClick={() => setEditOpen(false)}>Cancelar</button><button className="profile-btn primary" onClick={() => { const value=noteDraft.trim(); setNote(value); save({profileName,profileUsername,profileBio,profileLocation,profileLinks,avatarData,coverData,note:value}); setEditOpen(false); setToast("Perfil atualizado neste dispositivo."); }}>Salvar alterações</button></div></section></div>}
      {settingsOpen && <div className="profile-modal-backdrop" onClick={() => setSettingsOpen(false)}><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-settings-title" onClick={e => e.stopPropagation()}>
        <div className="settings-screen-head">
          <button className="settings-back" onClick={() => settingsDetail ? setSettingsDetail("") : setSettingsOpen(false)} aria-label="Voltar">← {settingsDetail ? "Todas as configurações" : "Voltar ao perfil"}</button>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:43,height:43,display:"grid",placeItems:"center",borderRadius:15,background:"linear-gradient(135deg,#55e8ff30,#a66cff35)",border:"1px solid #8f7aff55"}}><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#aeefff" strokeWidth="1.7"><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
            <div><h2 id="profile-settings-title" style={{fontSize:21,margin:"0 0 4px",letterSpacing:"-.5px"}}>{settingsDetail ? (settingsOptions.find(x=>x.id===settingsDetail)?.title || "Configuração") : "Configurações e atividade"}</h2><p style={{margin:0,fontSize:11}}>Nexora · personalize sua experiência</p></div>
          </div>
          {!settingsDetail && <input className="profile-settings-search" value={settingsSearch} onChange={e=>setSettingsSearch(e.target.value)} placeholder="⌕  Buscar nas configurações" aria-label="Buscar nas configurações"/>}
          {!settingsDetail && <div className="profile-settings-cats">{["Geral","Conta","Privacidade","Conteúdo","Criador","Aparência","Dados"].map(cat=><button key={cat} className={settingsSection===cat?"active":""} onClick={()=>setSettingsSection(cat)}>{cat}</button>)}</div>}
        </div>
        <div className="settings-screen-body">
          {settingsDetail ? (() => { const item = settingsOptions.find(x=>x.id===settingsDetail); if(!item) return <p>Esta opção não foi encontrada.</p>; return <><p style={{fontSize:12,lineHeight:1.6,color:"#a7a8c0",margin:"2px 0 16px"}}>{item.desc}. Selecione a opção que corresponde ao que você deseja.</p>{item.id==="selos-verificacao" ? (() => { const badges=[{id:"premium",name:"Premium",sub:"Plano elegível",color:"#368bff",glow:"#368bff55",symbol:"✦",requirement:"Assinatura de um plano Nexora elegível e pagamento confirmado.",details:["A conta precisa estar em situação regular.","O plano deve incluir explicitamente o selo Premium.","A concessão real deve ocorrer após confirmação segura do pagamento pelo servidor."],benefit:"Identifica a assinatura Premium. Os benefícios exatos devem corresponder ao plano comprado; o selo não substitui os demais critérios de autenticidade."},{id:"15k",name:"15K",sub:"15 mil seguidores autênticos",color:"#55e8ff",glow:"#55e8ff55",symbol:"✓",requirement:"Alcançar pelo menos 15.000 seguidores autênticos.",details:["A contagem precisa vir dos dados oficiais da Nexora.","Seguidores artificiais, contas falsas ou atividade manipulada não devem contar para a elegibilidade.","O sistema deve verificar a meta antes de conceder o selo."],benefit:"Reconhece criadores que atingiram a marca de 15 mil seguidores. A concessão automática depende da verificação real no servidor."},{id:"1m-elite",name:"1M Elite",sub:"1 milhão de seguidores autênticos",color:"#b18aff",glow:"#a66cff66",symbol:"◆",requirement:"Alcançar pelo menos 1.000.000 de seguidores autênticos.",details:["A contagem deve ser conferida na base oficial da Nexora.","A plataforma deve validar autenticidade e atividade suspeita.","A concessão deve ser registrada no servidor e refletida no perfil."],benefit:"Selo de reconhecimento para criadores que alcançam um milhão de seguidores autênticos."},{id:"10m-coroa",name:"10M Coroa",sub:"10 milhões de seguidores autênticos",color:"#f6cf75",glow:"#f6cf7555",symbol:"♛",requirement:"Alcançar pelo menos 10.000.000 de seguidores autênticos.",details:["A contagem precisa ser confirmada pelos dados oficiais da Nexora.","A plataforma deve validar a autenticidade dos seguidores e investigar sinais de crescimento manipulado.","A concessão deve ser registrada no servidor após a validação; atingir a meta não deve depender de compra de selo."],benefit:"Selo de distinção superior para criadores que alcançam 10 milhões de seguidores autênticos."}]; const active=badges.find(b=>b.id===selectedSettings.badgeDetail); return <div style={{display:"grid",gap:12}}>{active ? <><button className="settings-back" onClick={()=>setSelectedSettings(prev=>({...prev,badgeDetail:""}))} style={{justifySelf:"start",marginBottom:2}}>← Todos os selos</button><div style={{padding:18,borderRadius:20,border:"1px solid "+active.color+"77",background:"radial-gradient(circle at 90% 0%,"+active.glow+",transparent 55%),linear-gradient(145deg,#171728,#0b0b14)",textAlign:"center"}}><div style={{width:76,height:76,margin:"0 auto 12px",borderRadius:24,display:"grid",placeItems:"center",fontSize:38,fontWeight:900,color:active.color,background:"linear-gradient(145deg,#ffffff25,#080811)",border:"1px solid "+active.color+"bb",boxShadow:"0 8px 28px "+active.glow+",inset 0 1px #ffffff55",textShadow:"0 0 18px "+active.glow}}>{active.symbol}</div><strong style={{display:"block",fontSize:21,color:active.color}}>{active.name}</strong><span style={{display:"block",fontSize:11,color:"#c3c4d8",marginTop:5}}>{active.sub}</span></div><div style={{padding:14,borderRadius:16,border:"1px solid #ffffff16",background:"#ffffff06"}}><strong style={{fontSize:13}}>Como conseguir este selo</strong><p style={{fontSize:12,lineHeight:1.7,color:"#c4c5d9",margin:"8px 0 0"}}>{active.requirement}</p></div><div style={{padding:14,borderRadius:16,border:"1px solid #ffffff16",background:"#ffffff06"}}><strong style={{fontSize:13}}>Critérios de análise</strong><ul style={{paddingLeft:19,margin:"9px 0 0",color:"#aeb0c8",fontSize:11,lineHeight:1.8}}>{active.details.map((d,i)=><li key={i}>{d}</li>)}</ul></div><div style={{padding:14,borderRadius:16,border:"1px solid "+active.color+"33",background:active.glow}}><strong style={{fontSize:13}}>O que representa</strong><p style={{fontSize:11,lineHeight:1.7,color:"#d3d4e5",margin:"7px 0 0"}}>{active.benefit}</p></div><p style={{fontSize:10,lineHeight:1.6,color:"#898ba4",margin:"2px 0"}}>Informações sobre os critérios previstos para a Nexora. A verificação e a concessão automáticas só estarão ativas quando conectadas à contagem oficial e às regras do servidor.</p></> : <><p style={{fontSize:12,lineHeight:1.6,color:"#a7a8c0",margin:"2px 0 4px"}}>Toque em um selo para ver os requisitos, os critérios e o que ele representa.</p>{badges.map(b=><button key={b.id} onClick={()=>setSelectedSettings(prev=>({...prev,badgeDetail:b.id}))} style={{display:"flex",alignItems:"center",gap:12,padding:13,textAlign:"left",width:"100%",borderRadius:17,border:"1px solid "+b.color+"55",background:"linear-gradient(120deg,"+b.glow+",#11111d 70%)",color:"inherit",cursor:"pointer",boxShadow:"inset 0 1px #ffffff12"}}><div style={{width:48,height:48,flexShrink:0,borderRadius:16,display:"grid",placeItems:"center",fontSize:24,fontWeight:900,color:b.color,background:"linear-gradient(145deg,#ffffff22,#080811)",border:"1px solid "+b.color+"99",boxShadow:"0 5px 18px "+b.glow+",inset 0 1px #ffffff45",textShadow:"0 0 12px "+b.glow}}>{b.symbol}</div><div style={{minWidth:0,flex:1}}><strong style={{display:"block",fontSize:14,color:b.color}}>{b.name}</strong><small style={{display:"block",fontSize:11,color:"#c3c4d8",marginTop:4,lineHeight:1.5}}>{b.sub}</small></div><span style={{fontSize:20,color:b.color}}>›</span></button>)}<div style={{padding:12,borderRadius:14,background:"#ffffff07",border:"1px solid #ffffff12"}}><strong style={{fontSize:12}}>Selo de Loja Oficial</strong><p style={{fontSize:11,lineHeight:1.6,color:"#a7a8c0",margin:"6px 0 0"}}>É uma verificação comercial separada dos selos de criadores. Quando houver plano comercial elegível, a compra precisa ser confirmada e a loja analisada; pagar, por si só, não garante aprovação.</p></div>{[{id:"autoBadgeCheck",title:"Verificar metas automaticamente",desc:"Permitir que o sistema confira metas quando a contagem oficial estiver conectada."},{id:"autoBadgeNotices",title:"Avisos e mensagens oficiais",desc:"Receber avisos de meta atingida e confirmação de compra elegível."}].map(pref=>{const enabled=(selectedSettings[pref.id]??"Ativado")==="Ativado";return <div key={pref.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #ffffff12"}}><div style={{flex:1}}><strong style={{fontSize:12}}>{pref.title}</strong><small style={{display:"block",fontSize:10,color:"#999bb4",lineHeight:1.5,marginTop:4}}>{pref.desc}</small></div><button aria-pressed={enabled} className={"profile-switch "+(enabled?"on":"")} onClick={()=>{const next={...selectedSettings,[pref.id]:enabled?"Desativado":"Ativado"};setSelectedSettings(next);save({selectedSettings:next});setToast("Preferência de verificação salva neste dispositivo.");}}/></div>})}<p style={{fontSize:10,lineHeight:1.6,color:"#898ba4",margin:"2px 0"}}>Esses controles guardam suas preferências neste dispositivo; não concedem selos nem confirmam pagamentos por si só. Mensagens oficiais nunca devem pedir sua senha ou código de autenticação.</p></>}</div>; })() : <>{item.choices.map(choice=><button key={choice} className={"settings-choice "+((selectedSettings[item.id] || (item.id==="tipo-conta" ? "Criador de conteúdo" : item.id==="visibilidade" ? "Público" : item.id==="categoria" ? profileCategory : ""))===choice?"active":"")} onClick={()=>{const next={...selectedSettings,[item.id]:choice};setSelectedSettings(next);if(item.id==="categoria"){setProfileCategory(choice);save({profileCategory:choice});}save({selectedSettings:next});setToast("Preferência atualizada neste dispositivo.");if(item.id!=="bloqueios"&&item.id!=="restritos"&&item.id!=="salvos"&&item.id!=="painel-criador"&&item.id!=="download"&&item.id!=="seguranca")setSettingsDetail("");}}><span><strong style={{fontSize:13}}>{choice}</strong>{(choice==="Público"||choice==="Privado")&&<small style={{display:"block",color:"#999bb4",marginTop:4}}>{choice==="Público"?"Qualquer pessoa poderá encontrar seu perfil quando os recursos de conta estiverem conectados.":"Seu perfil deverá exigir aprovação de seguidores quando a privacidade real estiver conectada."}</small>}</span><span style={{color:((selectedSettings[item.id] || (item.id==="tipo-conta" ? "Criador de conteúdo" : item.id==="visibilidade" ? "Público" : item.id==="categoria" ? profileCategory : ""))===choice)?"#7fe8ff":"#656780"}}>{((selectedSettings[item.id] || (item.id==="tipo-conta" ? "Criador de conteúdo" : item.id==="visibilidade" ? "Público" : item.id==="categoria" ? profileCategory : ""))===choice)?"✓":"○"}</span></button>)}</>}{item.id!=="selos-verificacao"&&["bloqueios","restritos","salvos","painel-criador","download","seguranca"].includes(item.id)&&<div className="profile-empty" style={{marginTop:14}}><strong>{item.id==="bloqueios"?"Suas contas bloqueadas":item.id==="restritos"?"Contas restritas":item.id==="salvos"?"Coleções salvas":item.id==="painel-criador"?"Central profissional":item.id==="seguranca"?"Proteção da conta":"Seus dados Nexora"}</strong><p>{item.id==="bloqueios"||item.id==="restritos"?"A gestão real de contas bloqueadas/restritas será ativada quando o sistema de contas estiver conectado.":item.id==="painel-criador"?"Ferramentas, métricas e campanhas reais dependem de dados do servidor; não exibimos estatísticas inventadas.":item.id==="seguranca"?"Sessões e autenticação exigem uma conta conectada ao serviço de autenticação.":"Esta versão guarda preferências apenas neste navegador. Você pode exportar os dados locais abaixo."}</p></div>}</>; })() : <>
            <div style={{border:"1px solid #ffffff13",borderRadius:17,padding:14,marginBottom:16,background:"linear-gradient(110deg,#19142c,#0e1421)"}}><div style={{fontSize:10,color:"#a9a9c3",marginBottom:6}}>SUA CONTA</div><strong style={{fontSize:14}}>{profileName}</strong><div style={{fontSize:11,color:"#9b9db6",marginTop:4}}>@{profileUsername} · {profileCategory}</div><div style={{fontSize:11,color:"#71e8ff",marginTop:8}}>Perfil e preferências deste dispositivo</div></div>
            {settingsOptions.filter(item=>(settingsSection==="Geral"||item.cat===settingsSection)&& (item.title+" "+item.desc+" "+item.cat).toLowerCase().includes(settingsSearch.toLowerCase())).map((item,i)=><button className="settings-option-row" key={item.id} onClick={()=>setSettingsDetail(item.id)}><span className="settings-option-icon" style={{color:settingsIconColorById[item.id]||"#aeefff",background:"linear-gradient(145deg,"+(settingsIconColorById[item.id]||"#38bdf8")+"24,"+(settingsIconColorById[item.id]||"#8b5cf6")+"0b)",borderColor:(settingsIconColorById[item.id]||"#8b5cf6")+"45"}} aria-hidden="true">{settingsIconById[item.id]||"✧"}</span><span className="settings-option-copy"><strong>{item.title}</strong><small>{item.desc}</small><span className="settings-option-value">{selectedSettings[item.id] || (item.id==="tipo-conta"?"Criador de conteúdo":item.id==="visibilidade"?"Público":item.id==="categoria"?profileCategory:item.id==="selos-verificacao"?"4 selos · critérios e avisos":"Abrir configuração")}</span></span><span style={{color:"#8588a4",fontSize:20}}>›</span></button>)}
            {settingsSection==="Geral" && <button className="settings-option-row" onClick={()=>{try{const data=localStorage.getItem("nexora-profile-v1")||"{}";const blob=new Blob([data],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="nexora-meus-dados.json";a.click();URL.revokeObjectURL(url);setToast("Exportação dos dados locais iniciada.");}catch{setToast("Não foi possível exportar neste navegador.");}}}><span className="settings-option-icon">⇩</span><span className="settings-option-copy"><strong>Baixar suas informações</strong><small>Exportar preferências salvas neste dispositivo</small></span><span>›</span></button>}
          </>}
          <p style={{fontSize:10,lineHeight:1.6,color:"#777991",marginTop:18}}>Importante: algumas opções estão preparadas visualmente, mas bloqueios, privacidade efetiva, autenticação e recursos profissionais globais só funcionam de verdade quando conectados ao sistema de contas e ao servidor. Suas escolhas atuais são salvas neste navegador.</p>
        </div>
        {!settingsDetail && <div className="settings-footer"><button className="profile-btn" onClick={()=>setSettingsOpen(false)}>Fechar configurações</button><button className="profile-btn primary" onClick={()=>{setSettingsOpen(false);setToast("Preferências locais mantidas.");}}>Concluir</button></div>}
      </section></div>}
      {socialListOpen && <div className="profile-modal-backdrop" role="presentation" onClick={() => setSocialListOpen(null)}>
        <section className="profile-modal" role="dialog" aria-modal="true" aria-label={socialListOpen === "followers" ? "Seguidores" : "Seguindo"} onClick={event => event.stopPropagation()}>
          <header className="social-list-head">
            <button className="social-list-back" onClick={() => { setSocialListOpen(null); setSocialSearch(""); }} aria-label="Voltar">‹</button>
            <div style={{minWidth:0}}><div className="social-list-title">{socialListOpen === "followers" ? "Seguidores" : "Seguindo"}</div><div className="social-list-subtitle">@{profileUsername} · perfil de criador</div></div>
            <span className="social-list-count">{socialListOpen === "followers" ? "1.000 testes" : "0 perfis"}</span>
          </header>
          <div className="social-list-search-wrap"><input className="social-list-search" value={socialSearch} onChange={event => setSocialSearch(event.target.value)} placeholder={socialListOpen === "followers" ? "⌕  Buscar nome ou @usuário" : "⌕  Buscar quem você segue"} aria-label="Buscar perfis"/></div>
          {socialListOpen === "followers" ? <div className="social-list-body">
            <div className="social-list-summary">DEMONSTRAÇÃO · {sampleFollowers.filter(person => (person.name + " " + person.username).toLowerCase().includes(socialSearch.trim().toLowerCase())).length.toLocaleString("pt-BR")} perfis fictícios encontrados. São dados de teste, não seguidores reais; mostrando até 100 por vez.</div>
            {sampleFollowers.filter(person => (person.name + " " + person.username).toLowerCase().includes(socialSearch.trim().toLowerCase())).slice(0, 100).map((person) => <div className="social-user-row" key={person.id}>
              <div className="social-user-avatar" style={{background:`linear-gradient(145deg,hsl(${person.hue} 78% 54%),#111126 88%)`}}>{person.initials}</div>
              <div className="social-user-copy"><div className="social-user-name">{person.name}</div><div className="social-user-handle">@{person.username}</div></div>
              <span className="social-user-tag">Exemplo</span>
            </div>)}
            {sampleFollowers.filter(person => (person.name + " " + person.username).toLowerCase().includes(socialSearch.trim().toLowerCase())).length === 0 && <div className="social-list-empty"><div><div className="social-list-empty-icon">⌕</div><strong style={{display:"block",fontSize:13,color:"#f3f2ff"}}>Nenhum perfil encontrado</strong><p style={{fontSize:11,lineHeight:1.6,marginTop:7}}>Tente buscar por outro nome ou usuário.</p></div></div>}
          </div> : <div className="social-list-body"><div className="social-list-empty"><div><div className="social-list-empty-icon">◎</div><strong style={{display:"block",fontSize:13,color:"#f3f2ff"}}>Você ainda não segue perfis</strong><p style={{fontSize:11,lineHeight:1.6,marginTop:7}}>Quando seguir contas na Nexora, elas aparecerão aqui em uma lista compacta.</p></div></div></div>}
          <footer className="social-list-footer">MODO DE TESTE: estes 1.000 perfis são fictícios e existem apenas para testar o visual da Nexora. Não são contas, seguidores nem relacionamentos reais. Os seguidores reais serão carregados quando o sistema de contas estiver conectado.</footer>
        </section>
      </div>}
      {previewOpen && <div className="profile-modal-backdrop" onClick={()=>setPreviewOpen(false)}><section className="profile-modal" role="dialog" aria-modal="true" aria-label="Pré-visualização do perfil" onClick={e=>e.stopPropagation()}><h2>Pré-visualização do perfil</h2><p>Confira sua identidade antes de salvar. Esta prévia é local, não uma página pública separada.</p><div style={{border:"1px solid #ffffff1c",borderRadius:18,overflow:"hidden",background:"#090913"}}><div style={{height:85,background:coverData?"url("+coverData+") center/cover":covers[coverIndex]}}/><div style={{padding:14}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:54,height:54,borderRadius:17,background:avatarData?"url("+avatarData+") center/cover":"linear-gradient(135deg,#42e4ff,#915bff,#ee5acb)",display:"grid",placeItems:"center"}}>{avatarData?"":"👑"}</div><div><strong>{profileName||"Seu nome"}</strong><div style={{fontSize:11,color:"#a5a6bc"}}>@{profileUsername||"seu.usuario"}</div></div></div><p style={{whiteSpace:"pre-wrap",fontSize:12,lineHeight:1.6}}>{profileBio}</p>{prefs.showLocation&&profileLocation&&<small style={{color:"#a5a6bc"}}>⌖ {profileLocation}</small>}</div></div><div className="profile-modal-actions"><button className="profile-btn" onClick={()=>setPreviewOpen(false)}>Fechar prévia</button><button className="profile-btn primary" onClick={()=>{setPreviewOpen(false);setNoteDraft(note);setEditOpen(true)}}>Editar perfil</button></div></section></div>}
      {highlightOpen && <div className="profile-modal-backdrop" onClick={() => setHighlightOpen(false)}><section className="profile-modal" onClick={e => e.stopPropagation()}><h2>＋ Criar destaque</h2><p>Escolha um nome e um símbolo para a nova coleção.</p><input className="profile-input" value={highlightTitle} onChange={e => setHighlightTitle(e.target.value)} maxLength={22} placeholder="Ex.: Bastidores, Viagens, Favoritos"/><div className="profile-emoji-options">{["🌟","😂","📸","🎧","💜","🎮","🌎","🔥"].map(emoji => <button key={emoji} style={{borderColor:highlightEmoji===emoji?"#9d7aff":undefined,background:highlightEmoji===emoji?"#8d6aff25":undefined}} onClick={() => setHighlightEmoji(emoji)}>{emoji}</button>)}</div><div className="profile-modal-actions"><button className="profile-btn" onClick={() => setHighlightOpen(false)}>Cancelar</button><button className="profile-btn primary" onClick={createHighlight}>Criar destaque</button></div></section></div>}
      {toast && <button className="profile-toast" role="status" onClick={() => setToast("")}>{toast}　×</button>}
    </main>
  );
}
