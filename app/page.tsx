"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrimaryNav from "./components/PrimaryNav";
import LanguageWelcome from "./components/LanguageWelcome";
import { getSavedLanguage, translate, type NexoraLanguage } from "../lib/i18n";

type FeedPost = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  image: string;
  mediaType?: "image" | "video";
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  verified?: boolean;
};

type StoryItem = { name: string; own?: boolean; verified?: boolean; image: string; mediaType?: "image" | "video"; caption?: string; id?: string };

type ChatMessage = { id: number; text: string; mine: boolean; time: string; kind?: "text" | "audio" | "image"; reactions?: string[] };
type ChatThread = { id: string; name: string; username: string; avatar: string; online?: boolean; group?: boolean; members?: number; unread?: number; preview: string; time: string; messages: ChatMessage[] };

const chatEmojiCatalog = "😀 😃 😄 😁 😆 😅 😂 🤣 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😋 😛 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🫣 🤭 🫢 🫡 🤫 🫠 😶 😐 😑 😬 🙄 😯 😮 😲 🥱 😴 🤤 😪 😵 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 😈 👿 💀 ☠️ 👻 👽 👾 🤖 💩 🙈 🙉 🙊 💋 💌 💘 💝 💖 💗 💓 💞 💕 💟 ❣️ 💔 ❤️ 🩷 🧡 💛 💚 💙 🩵 💜 🤎 🖤 🩶 🤍 💯 💢 💥 💫 💦 💨 💬 💭 💤 👋 🤚 🖐️ ✋ 🖖 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 👏 🙌 🫶 👐 🤲 🙏 💅 🤳 💪 🧠 👀 👁️ 👅 👄 🫦 👶 🧒 👦 👧 🧑 👨 👩 🧓 👴 👵 🙍 🙎 🙅 🙆 💁 🙋 🤦 🤷 👮 🕵️ 💂 🥷 👷 🤴 👸 🧕 🤵 👰 🤰 🤱 🎅 🤶 🦸 🦹 🧙 🧚 🧛 🧜 🧝 💆 💇 🚶 🧍 🧎 🏃 💃 🕺 👯 🧗 🤺 🏇 ⛷️ 🏂 🏌️ 🏄 🚣 🏊 🏋️ 🚴 🚵 🤸 🤼 🤽 🤾 🤹 🧘 🛀 🛌 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🦋 🐌 🐞 🐜 🕷️ 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🦈 🐊 🐅 🐆 🦓 🦍 🐘 🦛 🦏 🐪 🦒 🦘 🦬 🐃 🐄 🐎 🐖 🐑 🦙 🐐 🦌 🐕 🦮 🐈 🐓 🦃 🦜 🦢 🦩 🕊️ 🐇 🦝 🦨 🦡 🦫 🦦 🦥 🐁 🐀 🐿️ 🦔 🐉 🐲 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🪴 🍃 🍂 🍁 🍄 🐚 🌾 💐 🌷 🌹 🥀 🌺 🌸 🌼 🌻 🌞 🌝 🌛 🌜 🌚 🌕 🌑 🌙 🌎 🌍 🌏 ⭐ 🌟 ✨ ⚡ ☄️ 🔥 🌪️ 🌈 ☀️ 🌤️ ⛅ ☁️ 🌧️ ⛈️ 🌨️ ❄️ ☃️ 🌬️ 💧 💦 ☔ 🌊 🎃 🎉 🎊 🎈 🎁 🎀 🏆 🥇 🥈 🥉 ⚽ 🏀 🏈 ⚾ 🎾 🏐 🏉 🎱 🏓 🏸 🏒 🥍 🏏 🎣 🥊 🥋 🎽 🛹 🛼 🛷 ⛸️ 🎿 🚗 🚕 🚙 🚌 🏎️ 🚓 🚑 🚒 🚐 🛻 🚚 🚛 🚜 🏍️ 🛵 🚲 🛴 🚦 🚥 ⚓ ⛵ 🚤 🛳️ 🚢 ✈️ 🛫 🛬 🚁 🚀 🛸 ⌛ ⏳ ⌚ ⏰ 🕰️ 🔋 🔌 💻 🖥️ 🖨️ ⌨️ 🖱️ 📷 📸 📹 🎥 📞 ☎️ 📺 📻 🎙️ 🧭 🔭 🔬 🧪 🧬 💉 🩸 💊 🩹 🩺 🚪 🛏️ 🛋️ 🪑 🚽 🚿 🛁 🧴 🧹 🧺 🧻 🧼 🫧 🪥 🧽 🧯 🛒 ⚰️ 🪦 🗿 🪬 🪩 🧿 🕯️ 💎 🔮 📿 🧸 🪄 🎩 🎓 🧢 👑 💍 💄 👠 👢 👞 👟 🥾 🧦 🧤 🧣 🎒 👜 👛 💼 👓 🕶️ 🥽 👔 👕 👖 🧥 👗 👘 🩱 🩲 🩳 👙 👚 🧵 🪡 🧶 🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🫒 🥑 🍆 🥔 🥕 🌽 🌶️ 🫑 🥒 🥬 🥦 🧄 🧅 🥜 🌰 🍞 🥐 🥖 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥙 🧆 🥚 🍳 🥘 🍲 🥣 🥗 🍿 🍱 🍙 🍚 🍛 🍜 🍝 🍣 🍤 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍯 🍼 🥛 ☕ 🫖 🍵 🧃 🥤 🧋 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🍾 🧊 🥄 🍴 🍽️ 🏺 🚩 🏁 🏳️‍🌈 🏳️‍⚧️ 🏴‍☠️ 🇧🇷 🇺🇸 🇵🇹 🇮🇹 🇫🇷 🇪🇸 🇩🇪 🇬🇧 🇯🇵 🇰🇷 🇨🇦 🇦🇷 🇲🇽 🇦🇴 🇲🇿 🇨🇻 🇬🇼 🇺🇳 ✔️ ☑️ ⚠️ ❌ ❎ ➕ ➖ ➗ ✖️ ♾️ ‼️ ⁉️ ❓ ❔ ❕ ❗ 💲 🅰️ 🅱️ 🅾️ 🆘 🆙 🆚 🔴 🟠 🟡 🟢 🔵 🟣 ⚫ ⚪ 🟤 🔺 🔻 🔸 🔹 🔶 🔷 🟥 🟧 🟨 🟩 🟦 🟪 ⬛ ⬜ 🔈 🔉 🔊 🔔 🔕 📣 📢 🔒 🔓 🔑 🔨 🪓 ⛏️ 🛠️ 🗡️ ⚔️ 💣 🛡️ 🔧 🔩 ⚙️ 🔗 ⛓️ 🧰 🧲 🪜 📚 📖 📝 ✏️ ✂️ 📅 📈 📉 📊 📌 📍 🔍 🔎 ❤️‍🔥 ❤️‍🩹 🫨 🫥 🫤 🫎 🪽 🪿 🪼 🪻 🫚 🫛 🪇 🪈 🫗 🫏 🪾 🫟".split(" ");

const chatWallpapers = [
  { name: "Preto absoluto", preview: "radial-gradient(circle at 50% 0%,#20202c 0%,#08080d 42%,#000 100%)" },
  { name: "Aurora boreal", preview: "radial-gradient(ellipse at 20% 20%,#6affcf88,transparent 35%),radial-gradient(ellipse at 70% 15%,#a75dff99,transparent 42%),linear-gradient(160deg,#031b25,#07564e 55%,#090c23)" },
  { name: "Montanhas e rios", preview: "linear-gradient(165deg,transparent 42%,#172b3d 43% 51%,transparent 52%),linear-gradient(155deg,transparent 47%,#3d8e9a 48% 56%,transparent 57%),linear-gradient(180deg,#80c5e7 0%,#24445c 48%,#071624 100%)" },
  { name: "Nebulosa violeta", preview: "radial-gradient(ellipse at 25% 35%,#fa62df99,transparent 32%),radial-gradient(ellipse at 75% 60%,#713cffcc,transparent 40%),linear-gradient(140deg,#09051b,#35106a,#100720)" },
  { name: "Néon Nexora", preview: "radial-gradient(ellipse at 20% 100%,#00d9ff99,transparent 35%),radial-gradient(ellipse at 90% 0%,#ec22ff99,transparent 40%),linear-gradient(135deg,#050b20,#15245a 55%,#10051c)" },
  { name: "Oceano profundo", preview: "radial-gradient(ellipse at 50% 100%,#008cc988,transparent 50%),repeating-linear-gradient(170deg,transparent 0 14px,#37d9ff22 15px 17px),linear-gradient(180deg,#031126,#064c72 65%,#010712)" },
  { name: "Pôr do sol", preview: "radial-gradient(circle at 50% 38%,#ffe6a2 0 8%,#ff8c68 9% 20%,transparent 21%),linear-gradient(180deg,#39235d,#d44f85 52%,#ffac65 72%,#30204b)" },
  { name: "Galáxia azul", preview: "radial-gradient(circle at 25% 30%,white 0 1px,transparent 2px),radial-gradient(circle at 75% 70%,#78dfff 0 1px,transparent 2px),radial-gradient(ellipse at 55% 45%,#3b5cffaa,transparent 42%),linear-gradient(145deg,#020617,#111b58,#08051d)" },
  { name: "Floresta mística", preview: "radial-gradient(ellipse at 50% 100%,#20bd7777,transparent 48%),linear-gradient(80deg,#061b19 0 20%,transparent 21% 31%,#0b2b26 32% 42%,transparent 43%),linear-gradient(180deg,#071b25,#12513d,#030c0b)" },
  { name: "Chuva na cidade", preview: "repeating-linear-gradient(105deg,transparent 0 12px,#b8e8ff22 13px 14px),linear-gradient(90deg,#101728,#334b69 45%,#171329)" },
  { name: "Rosas cósmicas", preview: "radial-gradient(ellipse at 25% 30%,#ff5fb477,transparent 24%),radial-gradient(ellipse at 70% 60%,#b6268a99,transparent 32%),linear-gradient(135deg,#1d0825,#5b164e,#130c2b)" },
  { name: "Gelo elétrico", preview: "radial-gradient(ellipse at 50% 50%,#a6f8ff99,transparent 28%),conic-gradient(from 30deg at 50% 50%,#092743,#48d5ff,#3446a7,#e5ffff,#092743)" },
  { name: "Lavanda", preview: "radial-gradient(ellipse at 80% 15%,#e8c7ff99,transparent 32%),linear-gradient(135deg,#211936,#7561a8 55%,#d6a9e7)" },
  { name: "Verde aurora", preview: "radial-gradient(ellipse at 25% 0%,#3effb688,transparent 40%),radial-gradient(ellipse at 80% 35%,#00d7b477,transparent 36%),linear-gradient(160deg,#031d25,#07594d,#081329)" },
  { name: "Fogo estelar", preview: "radial-gradient(ellipse at 50% 100%,#ffcf4777,transparent 42%),radial-gradient(ellipse at 30% 65%,#ff421caa,transparent 35%),linear-gradient(150deg,#14071d,#6b1737,#180912)" },
  { name: "Prisma", preview: "conic-gradient(from 45deg at 50% 50%,#00cfff,#663cff,#ff3cb8,#ffad45,#00cfff)" },
  { name: "Areia lunar", preview: "radial-gradient(ellipse at 50% 15%,#e6d9c588,transparent 32%),linear-gradient(155deg,#1a1a29,#686275 55%,#b18d9a)" },
  { name: "Coração neon", preview: "radial-gradient(ellipse at 50% 48%,#ff168c66,transparent 35%),linear-gradient(135deg,#13091f,#5c0a55,#171047)" },
  { name: "Brilho de âmbar", preview: "radial-gradient(ellipse at 50% 100%,#ff9b3d44,transparent 48%),radial-gradient(ellipse at 25% 70%,#ff5b3030,transparent 35%),linear-gradient(180deg,#100b13,#080609 70%,#211007)" },
  { name: "✨ Chuva de emojis", preview: "radial-gradient(circle at 20% 25%,#d5b4ff88,transparent 18%),radial-gradient(circle at 80% 65%,#7e62ff88,transparent 22%),linear-gradient(135deg,#0a1731,#273a70,#642f91)" }
];

const initialChats: ChatThread[] = [
  { id: "lary", name: "Lary Santos", username: "larysantos", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces", online: true, unread: 2, preview: "Tá indo pra onde hoje? 😍", time: "09:24", messages: [
    { id: 1, text: "Oi! Tudo bem por aí? 💜", mine: false, time: "09:18" },
    { id: 2, text: "Tudo sim! E você?", mine: true, time: "09:20" },
    { id: 3, text: "Tá indo pra onde hoje? 😍", mine: false, time: "09:24" },
    { id: 4, text: "Que lugar incrível! 😍", mine: true, time: "21:18", kind: "image" },
    { id: 5, text: "Sim! É aqui perto do centro. A gente tem que ir junto! 💜", mine: false, time: "21:20" },
    { id: 6, text: "Com certeza! Quando você vai?", mine: true, time: "21:21" },
    { id: 7, text: "Amanhã talvez, te aviso! 🥹", mine: false, time: "21:24" }
  ]},
  { id: "gabriel", name: "Gabriel Costa", username: "gabrielcosta", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces", online: true, unread: 1, preview: "Enviou uma foto", time: "08:47", messages: [{id:1,text:"Bom dia! Olha essa foto 📸",mine:false,time:"08:47"},{id:2,text:"Ficou muito boa!",mine:true,time:"08:49"}]},
  { id: "bruna", name: "Bruna Alves", username: "brunaalves", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop&crop=faces", preview: "Kkkkk, verdade! 😂", time: "Ontem", unread: 3, messages: [{id:1,text:"Você viu aquilo? 😂",mine:false,time:"Ontem"},{id:2,text:"Kkkkk, verdade! 😂",mine:true,time:"Ontem"}]},
  { id: "grupo", name: "Grupo da Resenha", username: "grupo-resenha", avatar: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=160&h=160&fit=crop&crop=faces", group: true, members: 8, preview: "Você: Bora marcar algo esse fim...", time: "Ontem", unread: 5, messages: [{id:1,text:"Bora marcar algo esse fim de semana? Tô dentro! 🎉",mine:false,time:"20:12"},{id:2,text:"Eu topo! Qual lugar?",mine:false,time:"20:14"},{id:3,text:"Tem um bar novo que tá bombando por aqui. 😍",mine:false,time:"20:16"},{id:4,text:"Vou pesquisar e mando as opções!",mine:true,time:"20:18"},{id:5,text:"Aproveita e manda a localização aí, galera! 📍",mine:false,time:"20:20"}]},
  { id: "caio", name: "Caio Mendes", username: "caiomendes", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces", preview: "Vlw mano! 👊", time: "Sáb", messages: [{id:1,text:"Valeu pela força!",mine:false,time:"Sáb"},{id:2,text:"Vlw mano! 👊",mine:true,time:"Sáb"}]},
  { id: "amanda", name: "Amanda Silva", username: "amandasilva", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop&crop=faces", preview: "Já vou te mandar!", time: "Sáb", messages: [{id:1,text:"Você consegue me enviar depois?",mine:false,time:"Sáb"},{id:2,text:"Já vou te mandar!",mine:true,time:"Sáb"}]}
];

const initialStories: StoryItem[] = [
  { name: "Adicionar", own: true, image: "" },
  { name: "Camila", verified: true, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&h=180&fit=crop&crop=faces" },
  { name: "Ramo_22", verified: true, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop&crop=faces" },
  { name: "Angela", verified: true, image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=180&h=180&fit=crop&crop=faces" },
  { name: "Ranulfo", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=180&h=180&fit=crop&crop=faces" },
];

const initialPosts: FeedPost[] = [
  {
    id: 1, name: "Aalonne Chika", username: "aalonnechika",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1100&h=1000&fit=crop&crop=faces",
    caption: "Your vibe shapes your feed — share a smile and watch the world light up.",
    likes: 1500, comments: 556, shares: 254, saved: 100, verified: true
  },
  {
    id: 2, name: "Anjala Rodry", username: "anjalarodry",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop&crop=faces",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1100&h=1000&fit=crop&crop=faces",
    caption: "Your vibe is your signature. Let the world see your colors.",
    likes: 982, comments: 214, shares: 87, saved: 63, verified: true
  }
];

function Verified() {
  return <span className="verified" aria-label="Verificado">✓</span>;
}

export default function Home() {
  const router = useRouter();
  const [uiLanguage, setUiLanguage] = useState<NexoraLanguage>("pt-BR");
  const t = (key: string) => translate(uiLanguage, key);
  useEffect(() => {
    setUiLanguage(getSavedLanguage());
    const syncLanguage = () => setUiLanguage(getSavedLanguage());
    window.addEventListener("nexora-language-change", syncLanguage);
    window.addEventListener("storage", syncLanguage);
    return () => { window.removeEventListener("nexora-language-change", syncLanguage); window.removeEventListener("storage", syncLanguage); };
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "mensagens") setMessagesOpen(true);
    if (params.get("action") === "create") setComposerOpen(true);
  }, []);
  const [posts, setPosts] = useState(initialPosts);
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [reposted, setReposted] = useState<number[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [commentsOpen, setCommentsOpen] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, string[]>>({});
  useEffect(() => { try { const stored = localStorage.getItem("nexora-comments-v1"); if (stored) { const all = JSON.parse(stored); const feed: Record<number,string[]> = {}; Object.entries(all).forEach(([key,value]) => { if (key.startsWith("feed-") && Array.isArray(value)) feed[Number(key.slice(5))] = value as string[]; }); setComments(feed); } } catch {} const sync = (event: StorageEvent) => { if (event.key !== "nexora-comments-v1" || !event.newValue) return; try { const all = JSON.parse(event.newValue); const feed: Record<number,string[]> = {}; Object.entries(all).forEach(([key,value]) => { if (key.startsWith("feed-") && Array.isArray(value)) feed[Number(key.slice(5))] = value as string[]; }); setComments(feed); } catch {} }; window.addEventListener("storage",sync); return () => window.removeEventListener("storage",sync); }, []);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [composerOpen, setComposerOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"hub" | "post" | "reel" | "live" | "highlight">("hub");
  const [composerText, setComposerText] = useState("");
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createPreview, setCreatePreview] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const createInputRef = useRef<HTMLInputElement>(null);
  const [stories, setStories] = useState<StoryItem[]>(initialStories);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(1);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const [likedStories, setLikedStories] = useState<string[]>([]);
  const [storyReactions, setStoryReactions] = useState<Record<string, string>>({});
  const [storyCommentsOpen, setStoryCommentsOpen] = useState(false);
  const [storyCommentDraft, setStoryCommentDraft] = useState("");
  const [storyComments, setStoryComments] = useState<Record<string, string[]>>({});
  const [showStoryReactions, setShowStoryReactions] = useState(false);
  const [showStoryHeart, setShowStoryHeart] = useState(false);
  const [storyFloatingReaction, setStoryFloatingReaction] = useState("");
  const [storyQuickComment, setStoryQuickComment] = useState("");
  const [storyQuickCommentVisible, setStoryQuickCommentVisible] = useState(false);
  const [storyFeedbackId, setStoryFeedbackId] = useState(0);
  const storyFeedbackTimerRef = useRef<number | null>(null);
  const lastStoryTapRef = useRef(0);
  const mediaTapTimerRef = useRef<number | null>(null);
  const reactionHoldRef = useRef<number | null>(null);
  const reactionHeldRef = useRef(false);
  const storyVideoRef = useRef<HTMLVideoElement>(null);
  const storyTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const storyRailRef = useRef<HTMLElement | null>(null);
  const [storyComposerOpen, setStoryComposerOpen] = useState(false);
  const [storyPreview, setStoryPreview] = useState("");
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyCaption, setStoryCaption] = useState("");
  const [storyEffect, setStoryEffect] = useState<"none" | "glow" | "warm" | "mono" | "dream">("none");
  const storyCameraInputRef = useRef<HTMLInputElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);
  const storyLiveVideoRef = useRef<HTMLVideoElement>(null);
  const storyLiveStreamRef = useRef<MediaStream | null>(null);
  const storyRecorderRef = useRef<MediaRecorder | null>(null);
  const storyRecordingChunksRef = useRef<Blob[]>([]);
  const [storyCameraActive, setStoryCameraActive] = useState(false);
  const [storyRecording, setStoryRecording] = useState(false);
  const [storyFacingMode, setStoryFacingMode] = useState<"user" | "environment">("user");
  const [storyLens, setStoryLens] = useState<"none" | "dog" | "bunny" | "coffee" | "glow" | "mono" | "warm" | "dream" | "neon" | "blur" | "aurora" | "vintage" | "rose" | "cool" | "cinema" | "soft" | "sunset" | "invert">("none");
  const [storyToolPanel, setStoryToolPanel] = useState<"none" | "stickers" | "gifs" | "questions" | "poll" | "quiz" | "boomerang" | "text" | "music" | "download">("none");
  const [storyBoomerangMode, setStoryBoomerangMode] = useState<"classic" | "slow" | "echo" | "portrait">("classic");
  const [storyInteractiveText, setStoryInteractiveText] = useState("");
  const [storyPollOptions, setStoryPollOptions] = useState(["Sim", "Não"]);
  const [storyQuizAnswer, setStoryQuizAnswer] = useState("A");
  const [storySticker, setStorySticker] = useState("");
  const [storyOverlayText, setStoryOverlayText] = useState("");
  const [storyLocation, setStoryLocation] = useState("");
  const [notice, setNotice] = useState("");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatSearch, setChatSearch] = useState("");
  const [chatFilter, setChatFilter] = useState<"all" | "unread" | "groups">("all");
  const [chatDraft, setChatDraft] = useState("");
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(initialChats);
  const [chatDetail, setChatDetail] = useState<"chat" | "media" | "profile" | "settings" | "wallpaper">("chat");
  const [callMode, setCallMode] = useState<"audio" | "video" | null>(null);
  const [callMicMuted, setCallMicMuted] = useState(false);
  const [callCameraOn, setCallCameraOn] = useState(true);
  const [callSpeakerOn, setCallSpeakerOn] = useState(true);
  const [chatWallpaperById, setChatWallpaperById] = useState<Record<string, number>>({});
  const [chatBubbleStyleById, setChatBubbleStyleById] = useState<Record<string, number>>({});
  const [autoTranslateChat, setAutoTranslateChat] = useState(false);
  const [reactionPickerFor, setReactionPickerFor] = useState<number | null>(null);
  const [chatReactionBurst, setChatReactionBurst] = useState<{ messageId: number; emoji: string; nonce: number } | null>(null);
  const [revealedTimestampId, setRevealedTimestampId] = useState<number | null>(null);
  const messageTouchStart = useRef<{x:number;y:number;id:number}|null>(null);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [chatStorageReady, setChatStorageReady] = useState(false);
  const [wallpaperApplyTo, setWallpaperApplyTo] = useState<"me" | "both">("me");
  const [chatMuted, setChatMuted] = useState(false);
  const [chatReadReceipts, setChatReadReceipts] = useState(true);
  const [chatSaveMedia, setChatSaveMedia] = useState(false);
  const [groupOnlyAdmins, setGroupOnlyAdmins] = useState(false);
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [myFollowerCount] = useState(1200);
  const [chatEmojiOpen, setChatEmojiOpen] = useState(false);
  const [notesComposerOpen, setNotesComposerOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [myNote, setMyNote] = useState("");
  const [noteStyle, setNoteStyle] = useState(0);

  // The Stories rail is a clean, panel-free carousel: the profile closest to the center grows smoothly as the user swipes.
  useEffect(() => {
    const rail = storyRailRef.current;
    if (!rail) return;
    const updateFocus = () => {
      const railBox = rail.getBoundingClientRect();
      const center = railBox.left + railBox.width / 2;
      const range = Math.max(1, railBox.width * 0.58);
      rail.querySelectorAll<HTMLElement>(".story").forEach((item) => {
        const itemBox = item.getBoundingClientRect();
        const distance = Math.abs(itemBox.left + itemBox.width / 2 - center);
        const focus = Math.max(0, 1 - distance / range);
        item.style.setProperty("--story-focus", focus.toFixed(3));
        item.style.setProperty("--story-scale", (0.86 + focus * 0.25).toFixed(3));
        item.style.setProperty("--story-opacity", (0.72 + focus * 0.28).toFixed(3));
      });
    };
    updateFocus();
    rail.addEventListener("scroll", updateFocus, { passive: true });
    window.addEventListener("resize", updateFocus);
    return () => { rail.removeEventListener("scroll", updateFocus); window.removeEventListener("resize", updateFocus); };
  }, [stories.length]);

  // Shared navigation events keep panels responsive without forcing a full-page reload.
  useEffect(() => {
    const openMessages = () => {
      setMessagesOpen(true);
      setActiveChatId(null);
    };
    const openComposer = () => {
      setCreateMode("hub");
      setComposerOpen(true);
    };
    window.addEventListener("nexora-open-messages", openMessages);
    window.addEventListener("nexora-open-composer", openComposer);
    return () => {
      window.removeEventListener("nexora-open-messages", openMessages);
      window.removeEventListener("nexora-open-composer", openComposer);
    };
  }, []);

  // Deep links from the shared app navigation must open the intended Home panel.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    const tab = params.get("tab");
    if (action === "create") { setCreateMode("hub"); setComposerOpen(true); }
    if (tab === "mensagens") {
      setMessagesOpen(true);
      setActiveChatId(null);
    }
    if (tab === "perfil") setNotice("A área de perfil está sendo preparada para conectar seus dados de conta.");
    if (tab === "explorar") setNotice("A área Explorar está sendo preparada para descoberta de criadores e publicações.");
    if (action || tab) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  useEffect(() => {
    try {
      setAutoTranslateChat(window.localStorage.getItem("nexora-chat-auto-translate-v1") === "true");
      const savedWallpapers = window.localStorage.getItem("nexora-chat-wallpapers-v1");
      const savedThreads = window.localStorage.getItem("nexora-chat-threads-v1");
      const savedBubbleStyles = window.localStorage.getItem("nexora-chat-bubble-styles-v1");
      const savedSettings = window.localStorage.getItem("nexora-chat-settings-v1");
      const savedNote = window.localStorage.getItem("nexora-chat-note-v1");
      const savedNoteStyle = window.localStorage.getItem("nexora-chat-note-style-v1");
      if (savedNote) setMyNote(savedNote);
      if (savedNoteStyle && Number.isInteger(Number(savedNoteStyle))) setNoteStyle(Math.min(3, Math.max(0, Number(savedNoteStyle))));
      if (savedWallpapers) {
        const parsed = JSON.parse(savedWallpapers) as Record<string, number>;
        const safe: Record<string, number> = {};
        Object.entries(parsed).forEach(([id, index]) => { if (typeof index === "number" && Number.isInteger(index) && index >= 0 && index < chatWallpapers.length) safe[id] = index; });
        setChatWallpaperById(safe);
      }
      if (savedBubbleStyles) {
        const parsed = JSON.parse(savedBubbleStyles) as Record<string, number>;
        const safe: Record<string, number> = {};
        Object.entries(parsed).forEach(([id, index]) => { if (typeof index === "number" && Number.isInteger(index) && index >= 0 && index < 10) safe[id] = index; });
        setChatBubbleStyleById(safe);
      }
      if (savedThreads) {
        const parsed = JSON.parse(savedThreads) as ChatThread[];
        if (Array.isArray(parsed)) setChatThreads(parsed.filter(chat => chat && typeof chat.id === "string" && Array.isArray(chat.messages)));
      }
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as { muted?: boolean; readReceipts?: boolean; saveMedia?: boolean; groupOnlyAdmins?: boolean };
        if (typeof parsed.muted === "boolean") setChatMuted(parsed.muted);
        if (typeof parsed.readReceipts === "boolean") setChatReadReceipts(parsed.readReceipts);
        if (typeof parsed.saveMedia === "boolean") setChatSaveMedia(parsed.saveMedia);
        if (typeof parsed.groupOnlyAdmins === "boolean") setGroupOnlyAdmins(parsed.groupOnlyAdmins);
      }
    } catch { /* dados locais inválidos não devem impedir a abertura das conversas */ }
    setChatStorageReady(true);
  }, []);

  // Recebe compartilhamentos enviados do perfil e os coloca na conversa escolhida.
  useEffect(() => {
    if (!chatStorageReady) return;
    try {
      const raw = window.localStorage.getItem("nexora-share-handoff-v1");
      if (!raw) return;
      const payload = JSON.parse(raw) as { title?: string; type?: string; url?: string; from?: string; recipients?: string[]; createdAt?: number };
      if (!Array.isArray(payload.recipients) || payload.recipients.length === 0 || !payload.title) {
        window.localStorage.removeItem("nexora-share-handoff-v1");
        return;
      }
      window.localStorage.removeItem("nexora-share-handoff-v1");
      const now = new Date();
      const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const messageText = "↗ " + (payload.type === "reel" ? "Reel" : "Publicação") + " compartilhada por " + (payload.from || "um perfil Nexora") + ": " + payload.title + " · " + (payload.url || window.location.origin + "/perfil");
      setChatThreads(current => current.map(chat => payload.recipients!.includes(chat.id) ? {
        ...chat,
        preview: "Você compartilhou uma publicação",
        time,
        unread: 0,
        messages: [...chat.messages, { id: Date.now() + Math.floor(Math.random() * 1000), text: messageText, mine: true, time }]
      } : chat));
      setActiveChatId(payload.recipients[0]);
      setChatDetail("chat");
      setMessagesOpen(true);
    } catch {
      window.localStorage.removeItem("nexora-share-handoff-v1");
    }
  }, [chatStorageReady]);
  useEffect(() => {
    if (!chatStorageReady) return;
    try {
      window.localStorage.setItem("nexora-chat-auto-translate-v1", String(autoTranslateChat));
      window.localStorage.setItem("nexora-chat-wallpapers-v1", JSON.stringify(chatWallpaperById));
      window.localStorage.setItem("nexora-chat-bubble-styles-v1", JSON.stringify(chatBubbleStyleById));
      window.localStorage.setItem("nexora-chat-threads-v1", JSON.stringify(chatThreads));
      window.localStorage.setItem("nexora-chat-settings-v1", JSON.stringify({ muted: chatMuted, readReceipts: chatReadReceipts, saveMedia: chatSaveMedia, groupOnlyAdmins }));
    } catch { setNotice("O navegador não permitiu salvar as preferências localmente."); }
  }, [chatStorageReady, autoTranslateChat, chatWallpaperById, chatBubbleStyleById, chatThreads, chatMuted, chatReadReceipts, chatSaveMedia, groupOnlyAdmins]);
  const activeChat = chatThreads.find(chat => chat.id === activeChatId) || null;
  const normalizedChatSearch = chatSearch.trim().toLocaleLowerCase("pt-BR");
  const filteredChats = chatThreads.filter(chat => (chatFilter === "all" || (chatFilter === "unread" ? Boolean(chat.unread) : Boolean(chat.group))) && (!normalizedChatSearch || chat.name.toLocaleLowerCase("pt-BR").includes(normalizedChatSearch) || chat.username.toLocaleLowerCase("pt-BR").includes(normalizedChatSearch) || chat.preview.toLocaleLowerCase("pt-BR").includes(normalizedChatSearch) || chat.messages.some(message => message.text.toLocaleLowerCase("pt-BR").includes(normalizedChatSearch))));
  function openChat(chatId: string) {
    setActiveChatId(chatId);
    setChatDetail("chat");
    setChatThreads(current => current.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat));
  }
  function toggleMessageReaction(messageId: number, emoji: string) {
    if (!activeChat) return;
    const existing = activeChat.messages.find(message => message.id === messageId)?.reactions || [];
    const removing = existing.includes(emoji);
    setChatThreads(current => current.map(chat => chat.id !== activeChat.id ? chat : { ...chat, messages: chat.messages.map(message => message.id !== messageId ? message : { ...message, reactions: (message.reactions || []).includes(emoji) ? (message.reactions || []).filter(item => item !== emoji) : [...(message.reactions || []), emoji] }) }));
    setReactionPickerFor(null);
    if (!removing) {
      const nonce = Date.now();
      setChatReactionBurst({ messageId, emoji, nonce });
      window.setTimeout(() => setChatReactionBurst(current => current?.nonce === nonce ? null : current), 950);
    }
  }

  function handleMessageTouchEnd(event: React.TouchEvent<HTMLDivElement>, messageId: number) {
    const start = messageTouchStart.current;
    if (!start || start.id !== messageId) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) >= 34 && Math.abs(dx) > Math.abs(dy) * 1.25) setRevealedTimestampId(current => current === messageId ? null : messageId);
    messageTouchStart.current = null;
  }

  function sendChatMessage() {
    const text = chatDraft.trim();
    if (!text || !activeChat) return;
    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setChatThreads(current => current.map(chat => chat.id === activeChat.id ? { ...chat, preview: "Você: " + text, time, messages: [...chat.messages, { id: Date.now(), text, mine: true, time }] } : chat));
    setChatDraft("");
    setChatEmojiOpen(false);
  }

  function publish() {
    const caption = composerText.trim();
    if (!caption && !createPreview) return;
    if (createMode === "reel" && (!createFile || !createFile.type.startsWith("video/"))) {
      setNotice("Para publicar um Reel, escolha um vídeo primeiro.");
      return;
    }
    const mediaType = createFile?.type.startsWith("video/") ? "video" as const : "image" as const;
    setPosts(current => [{
      id: Date.now(), name: "Licinhosz.bb", username: "licinhosz.bb",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces",
      image: createPreview, mediaType: createPreview ? mediaType : undefined, caption: caption || "Novo conteúdo na Nexora ✦", likes: 0, comments: 0, shares: 0, saved: 0
    }, ...current]);
    setComposerText("");
    setCreateFile(null);
    setCreatePreview("");
    setComposerOpen(false);
    setCreateMode("hub");
    setNotice(createMode === "reel" ? "Reel adicionado ao Feed nesta sessão." : "Publicação adicionada ao Feed nesta sessão.");
    window.setTimeout(() => setNotice(""), 2800);
  }
  function openCreateMode(mode: "post" | "reel" | "live" | "highlight") {
    setCreateMode(mode);
    setComposerText("");
    setCreateFile(null);
    setCreatePreview("");
    setCreateTitle("");
  }
  function createProfileHighlight() {
    const title = createTitle.trim();
    if (!title) { setNotice("Dê um nome ao destaque antes de criar."); return; }
    try {
      const raw = localStorage.getItem("nexora-profile-v1");
      const data = raw ? JSON.parse(raw) : {};
      const current = Array.isArray(data.highlights) ? data.highlights.filter((item: {title?:string}) => !["Minha vida","Resenha","Momentos","Músicas"].includes(item?.title || "")) : [];
      const next = [...current, { id: Date.now(), title, emoji: "🌟", tone: ["#6c4cff", "#e84d9b", "#168db7", "#8a4ce0"][current.length % 4] }];
      localStorage.setItem("nexora-profile-v1", JSON.stringify({ ...data, highlights: next }));
      setComposerOpen(false);
      setCreateMode("hub");
      setCreateTitle("");
      setNotice("Destaque criado neste dispositivo. Abra o perfil para vê-lo.");
    } catch {
      setNotice("Não foi possível salvar o destaque neste navegador.");
    }
  }

  function goToStory(index: number) {
    if (stories.length <= 1) return;
    const firstStoryIndex = stories.findIndex(item => !item.own || Boolean(item.image));
    const safeFirst = firstStoryIndex < 0 ? 0 : firstStoryIndex;
    const nextIndex = index < safeFirst ? stories.length - 1 : index >= stories.length ? safeFirst : index;
    setActiveStoryIndex(nextIndex);
    setActiveStory(stories[nextIndex]);
    setIsStoryPaused(false);
    setShowStoryReactions(false);
    setStoryFloatingReaction("");
    setStoryQuickCommentVisible(false);
  }

  function goNextStory() {
    goToStory(activeStoryIndex + 1);
  }

  function goPreviousStory() {
    goToStory(activeStoryIndex - 1);
  }

  function messageStoryUser() {
    if (!activeStory) return;
    const story = activeStory;
    const id = `story-${story.id || story.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const existing = chatThreads.find(chat => chat.id === id || chat.name === story.name);
    const targetId = existing?.id || id;
    if (!existing) {
      setChatThreads(current => [...current, {
        id, name: story.name, username: story.name.toLowerCase().replace(/[^a-z0-9]+/g, ""),
        avatar: story.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces",
        preview: "Inicie uma conversa", time: "Agora", messages: []
      }]);
    }
    setActiveChatId(targetId);
    setChatDetail("chat");
    setMessagesOpen(true);
    setStoryCommentsOpen(false);
    setShowStoryReactions(false);
    closeStoryViewer();
  }

  function closeStoryViewer() {
    setActiveStory(null);
    setIsStoryPaused(false);
  }

  function toggleStoryPlayback() {
    setIsStoryPaused(current => !current);
  }

  function currentStoryKey() {
    return activeStory?.id || activeStory?.name || "story";
  }

  function showStoryFeedback(kind: "reaction" | "comment", message: string) {
    if (storyFeedbackTimerRef.current) window.clearTimeout(storyFeedbackTimerRef.current);
    setStoryFeedbackId(current => current + 1);
    if (kind === "reaction") {
      setStoryFloatingReaction(message);
      setStoryQuickCommentVisible(false);
    } else {
      setStoryQuickComment(message);
      setStoryQuickCommentVisible(true);
      setStoryFloatingReaction("");
    }
    storyFeedbackTimerRef.current = window.setTimeout(() => {
      setStoryFloatingReaction("");
      setStoryQuickCommentVisible(false);
    }, 2400);
  }

  function toggleStoryLike(reaction?: string) {
    const key = currentStoryKey();
    if (reaction) {
      setStoryReactions(current => ({ ...current, [key]: reaction }));
      setLikedStories(current => current.includes(key) ? current : [...current, key]);
      showStoryFeedback("reaction", reaction);
    } else {
      const wasLiked = likedStories.includes(key);
      setLikedStories(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]);
      if (wasLiked) setStoryReactions(current => { const next = { ...current }; delete next[key]; return next; });
      else showStoryFeedback("reaction", "❤️");
    }
    setShowStoryReactions(false);
  }

  function startReactionHold() {
    reactionHeldRef.current = false;
    if (reactionHoldRef.current) window.clearTimeout(reactionHoldRef.current);
    reactionHoldRef.current = window.setTimeout(() => {
      reactionHeldRef.current = true;
      setShowStoryReactions(true);
    }, 420);
  }

  function endReactionHold() {
    if (reactionHoldRef.current) window.clearTimeout(reactionHoldRef.current);
    reactionHoldRef.current = null;
  }

  function handleStoryMediaTap(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
    const now = Date.now();
    if (now - lastStoryTapRef.current < 320) {
      if (mediaTapTimerRef.current) window.clearTimeout(mediaTapTimerRef.current);
      setShowStoryHeart(true);
      toggleStoryLike();
      window.setTimeout(() => setShowStoryHeart(false), 850);
      lastStoryTapRef.current = 0;
      return;
    }
    lastStoryTapRef.current = now;
    const x = event.clientX / window.innerWidth;
    mediaTapTimerRef.current = window.setTimeout(() => {
      if (x < 0.38) goPreviousStory();
      else if (x < 0.80) goNextStory();
      lastStoryTapRef.current = 0;
    }, 320);
  }

  function handleStoryVideoTap(event: React.MouseEvent<HTMLVideoElement>) {
    event.stopPropagation();
    const now = Date.now();
    if (now - lastStoryTapRef.current < 320) {
      if (mediaTapTimerRef.current) window.clearTimeout(mediaTapTimerRef.current);
      setShowStoryHeart(true);
      toggleStoryLike();
      window.setTimeout(() => setShowStoryHeart(false), 850);
      lastStoryTapRef.current = 0;
      return;
    }
    lastStoryTapRef.current = now;
    mediaTapTimerRef.current = window.setTimeout(() => {
      toggleStoryPlayback();
      lastStoryTapRef.current = 0;
    }, 320);
  }

  function addStoryComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = storyCommentDraft.trim();
    if (!value) return;
    const key = currentStoryKey();
    setStoryComments(current => { const next = { ...current, [key]: [...(current[key] || []), value] }; try { localStorage.setItem("nexora-story-comments-v1", JSON.stringify(next)); } catch {} return next; });
    showStoryFeedback("comment", value);
    setStoryCommentDraft("");
    setStoryCommentsOpen(false);
  }

  function shareStory() {
    const text = activeStory?.caption ? `Story de ${activeStory.name}: ${activeStory.caption}` : `Veja este Story de ${activeStory?.name} na Nexora!`;
    if (navigator.share) {
      void navigator.share({ title: "Nexora · Story", text, url: window.location.href }).catch(() => undefined);
    } else if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(`${text} ${window.location.href}`).then(() => setNotice("Link do Story copiado para compartilhar.")).catch(() => setNotice("Não foi possível copiar o link neste navegador."));
    } else {
      setNotice("Compartilhamento não disponível neste navegador.");
    }
  }

  useEffect(() => {
    if (!activeStory || isStoryPaused || storyCommentsOpen || showStoryReactions || activeStory.mediaType === "video") return;
    const timer = window.setTimeout(() => goNextStory(), 6000);
    return () => window.clearTimeout(timer);
  }, [activeStory, activeStoryIndex, isStoryPaused, storyCommentsOpen, showStoryReactions, stories]);

  useEffect(() => {
    const video = storyVideoRef.current;
    if (!video || !activeStory || activeStory.mediaType !== "video") return;
    if (isStoryPaused || storyCommentsOpen || showStoryReactions) video.pause();
    else void video.play().catch(() => undefined);
  }, [activeStory, isStoryPaused, storyCommentsOpen, showStoryReactions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!activeStory) return;
      if (event.key === "ArrowRight") { event.preventDefault(); goNextStory(); }
      else if (event.key === "ArrowLeft") { event.preventDefault(); goPreviousStory(); }
      else if (event.key === " " || event.key === "k") { event.preventDefault(); toggleStoryPlayback(); }
      else if (event.key === "Escape") closeStoryViewer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStory, activeStoryIndex, stories]);

  useEffect(() => {
    const video = storyVideoRef.current;
    if (!video) return;
    if (isStoryPaused) video.pause();
    else if (activeStory?.mediaType === "video") void video.play().catch(() => undefined);
  }, [activeStory, isStoryPaused]);

  function addComment(id: number) {
    const value = (drafts[id] || "").trim();
    if (!value) return;
    setComments(current => { const next = { ...current, [id]: [...(current[id] || []), value] }; try { const all = JSON.parse(localStorage.getItem("nexora-comments-v1") || "{}"); all["feed-"+id] = next[id]; localStorage.setItem("nexora-comments-v1", JSON.stringify(all)); } catch {} return next; });
    setDrafts(current => ({ ...current, [id]: "" }));
  }

  const stopStoryCamera = () => {
    if (storyRecorderRef.current && storyRecorderRef.current.state !== "inactive") storyRecorderRef.current.stop();
    storyLiveStreamRef.current?.getTracks().forEach(track => track.stop());
    storyLiveStreamRef.current = null;
    setStoryCameraActive(false);
    setStoryRecording(false);
  };

  const startStoryCamera = async () => {
    try {
      if (!window.isSecureContext) throw new Error("secure-context");
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      storyLiveStreamRef.current?.getTracks().forEach(track => track.stop());

      // A câmera não deve falhar só porque o microfone foi recusado.
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: storyFacingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false
      });
      let stream = videoStream;
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioStream.getAudioTracks().forEach(track => videoStream.addTrack(track));
      } catch {
        setNotice("Câmera liberada. O microfone não foi autorizado; você ainda pode tirar fotos e gravar vídeo sem áudio.");
      }
      storyLiveStreamRef.current = stream;
      setStoryCameraActive(true);
      requestAnimationFrame(() => {
        const video = storyLiveVideoRef.current;
        if (video) {
          video.srcObject = stream;
          void video.play().catch(() => {});
        }
      });
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      const message = !window.isSecureContext
        ? "A câmera exige uma conexão segura (HTTPS). Abra a Nexora pelo endereço oficial."
        : !navigator.mediaDevices?.getUserMedia
          ? "Este navegador não disponibiliza acesso direto à câmera. Atualize o Chrome ou use a galeria."
          : name === "NotAllowedError" || name === "SecurityError"
            ? "O acesso à câmera foi bloqueado. No Chrome, toque no cadeado/ícone ao lado do endereço, entre em Permissões e permita Câmera. Depois recarregue a página."
            : name === "NotFoundError" || name === "DevicesNotFoundError"
              ? "Não encontramos uma câmera disponível neste dispositivo."
              : name === "NotReadableError" || name === "TrackStartError"
                ? "A câmera pode estar sendo usada por outro aplicativo. Feche os outros apps que usam a câmera e tente novamente."
                : name === "OverconstrainedError"
                  ? "Este modo de câmera não está disponível. Tente alternar entre a câmera frontal e traseira."
                  : "Não foi possível iniciar a câmera. Confira as permissões do Chrome e tente novamente ou selecione uma mídia da galeria.";
      setNotice(message);
      setStoryCameraActive(false);
    }
  };

  const captureStoryPhoto = () => {
    const video = storyLiveVideoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) { setNotice("Aguarde a câmera carregar antes de capturar."); return; }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    const captureFilters: Record<string,string> = { mono:"grayscale(1)", glow:"brightness(1.12) saturate(1.2)", coffee:"sepia(.35) saturate(1.25)", warm:"sepia(.22) saturate(1.2)", dream:"saturate(1.2) hue-rotate(12deg) brightness(1.04)", neon:"saturate(1.65) contrast(1.08) hue-rotate(12deg)", blur:"blur(1.5px) saturate(1.05)", aurora:"hue-rotate(35deg) saturate(1.45)", vintage:"sepia(.3) contrast(1.08)", rose:"hue-rotate(325deg) saturate(1.2)", cool:"hue-rotate(175deg) saturate(1.1)", cinema:"contrast(1.2) saturate(.85)", soft:"brightness(1.06) saturate(.9)", sunset:"sepia(.28) saturate(1.35) hue-rotate(-8deg)", invert:"invert(1)" };
    context.filter = captureFilters[storyLens] || "none";
    if (storyFacingMode === "user") { context.translate(canvas.width,0); context.scale(-1,1); }
    context.drawImage(video,0,0,canvas.width,canvas.height);
    context.setTransform(1,0,0,1,0,0); context.filter = "none";
    if (storyLens === "dog") { context.font = `${Math.round(canvas.width*.16)}px sans-serif`; context.textAlign = "center"; context.fillText("🐶",canvas.width/2,canvas.height*.28); }
    if (storyLens === "bunny") { context.font = `${Math.round(canvas.width*.16)}px sans-serif`; context.textAlign = "center"; context.fillText("🐰",canvas.width/2,canvas.height*.22); }
    if (storyLens === "coffee") { context.font = `${Math.round(canvas.width*.12)}px sans-serif`; context.textAlign = "center"; context.fillText("☕✨",canvas.width/2,canvas.height*.28); }
    if (storySticker) { context.font = `${Math.round(canvas.width*.1)}px sans-serif`; context.textAlign = "center"; context.fillText(storySticker,canvas.width/2,canvas.height*.82); }
    if (storyOverlayText.trim()) { context.font = `bold ${Math.round(canvas.width*.06)}px sans-serif`; context.textAlign = "center"; context.lineWidth = Math.max(3,canvas.width*.006); context.strokeStyle = "#000"; context.fillStyle = "#fff"; context.strokeText(storyOverlayText.trim(),canvas.width/2,canvas.height*.55,canvas.width*.85); context.fillText(storyOverlayText.trim(),canvas.width/2,canvas.height*.55,canvas.width*.85); }
    canvas.toBlob(blob => { if(!blob)return; const file = new File([blob],`nexora-story-${Date.now()}.jpg`,{type:"image/jpeg"}); if(storyPreview.startsWith("blob:"))URL.revokeObjectURL(storyPreview);setStoryFile(file);setStoryPreview(URL.createObjectURL(file));storyLiveStreamRef.current?.getTracks().forEach(track=>track.stop());storyLiveStreamRef.current=null;setStoryCameraActive(false);setNotice("Foto capturada. Confira a prévia antes de compartilhar."); }, "image/jpeg", .92);
  };

  const startStoryRecording = () => {
    const stream = storyLiveStreamRef.current;
    if (!stream || typeof MediaRecorder === "undefined") { setNotice("A gravação de vídeo não é compatível com este navegador."); return; }
    try {
      const mimeType = ["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"].find(type=>MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream,mimeType?{mimeType}:undefined);
      storyRecordingChunksRef.current = [];
      recorder.ondataavailable = event => { if(event.data.size) storyRecordingChunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(storyRecordingChunksRef.current,{type:recorder.mimeType||"video/webm"});
        if(blob.size > 50*1024*1024) { setNotice("O vídeo excedeu o limite de 50 MB."); return; }
        const file = new File([blob],`nexora-story-${Date.now()}.webm`,{type:blob.type});
        if(storyPreview.startsWith("blob:"))URL.revokeObjectURL(storyPreview);
        setStoryFile(file);setStoryPreview(URL.createObjectURL(file));storyLiveStreamRef.current?.getTracks().forEach(track=>track.stop());storyLiveStreamRef.current=null;setStoryCameraActive(false);setNotice("Vídeo gravado. Confira a prévia antes de compartilhar.");
      };
      storyRecorderRef.current = recorder; recorder.start(); setStoryRecording(true);
    } catch { setNotice("Não foi possível iniciar a gravação neste dispositivo."); }
  };

  const stopStoryRecording = () => {
    if(storyRecorderRef.current && storyRecorderRef.current.state !== "inactive") storyRecorderRef.current.stop();
    setStoryRecording(false);
  };

  return (
    <main className="nexora-app">
      <header className="topbar" style={{position:"relative",zIndex:30}}> 
        <a className="brand" href="/" aria-label="Nexora início">
          <img className="brand-symbol" src="/nexora-logo.svg" alt="" />
          <span>Nexora</span>
        </a>
        <div className="topbar-actions" style={{position:"relative",zIndex:31}}> 
          <a className="round-action" href="/pesquisar" aria-label={t("search")} title={t("search")} style={{display:"grid",placeItems:"center",textDecoration:"none"}}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
          </a>
          <button className="round-action" aria-label={t("messages")} onClick={() => { setMessagesOpen(true); setActiveChatId(null); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 3 3 10.2l7.1 2.1L12.2 20 21 3Z"/><path d="m10.1 12.3 5-5"/></svg>
          </button>
          <a className="round-action" href="/notificacoes" onClick={(event) => { event.preventDefault(); router.push("/notificacoes"); }} aria-label={t("notifications")} title={t("notifications")} style={{display:"grid",placeItems:"center",textDecoration:"none",position:"relative",zIndex:32,pointerEvents:"auto",cursor:"pointer",touchAction:"manipulation"}}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg>
          </a>
        </div>
      </header>

      <section ref={storyRailRef} className="stories-rail" aria-label={t("stories")}>
        {stories.map((story) => (
          <button className="story" key={story.name} onClick={() => { if (story.own) setStoryComposerOpen(true); else { setActiveStoryIndex(stories.indexOf(story)); setActiveStory(story); } }}>
            <span className={`story-ring ${story.own ? "story-own" : ""}`}>
              {story.own ? <span className="story-plus">＋</span> : <img src={story.image} alt="" />}
            </span>
            <span className="story-name">{story.name}{story.verified && <Verified />}</span>
          </button>
        ))}
      </section>

      <section className="feed" aria-label={t("socialFeed")}>
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            <header className="post-header">
              <img className="avatar" src={post.avatar} alt="" />
              <div className="post-author">
                <strong>{post.name} {post.verified && <Verified />}</strong>
                <span>@{post.username}</span>
              </div>
              <button className="more-button" aria-label={t("moreOptions")} onClick={() => setNotice("Mais opções de publicação serão adicionadas.")}>⋮</button>
            </header>
            {post.image ? (post.mediaType === "video" ? <video className="post-image" src={post.image} controls playsInline /> : <img className="post-image" src={post.image} alt={`Publicação de ${post.name}`} />) : <div className="text-post-visual"><span>NEXORA ✦</span><p>{post.caption}</p></div>}
            <div className="post-bottom">
              <div className="post-actions">
                <button className={`post-action ${liked.includes(post.id) ? "is-liked" : ""}`} aria-label={t("like")} onClick={() => setLiked(current => current.includes(post.id) ? current.filter(id => id !== post.id) : [...current, post.id])}>
                  <svg viewBox="0 0 24 24"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg><span>{(post.likes + (liked.includes(post.id) ? 1 : 0)).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 })}</span>
                </button>
                <button className="post-action" aria-label={t("comment")} onClick={() => setCommentsOpen(commentsOpen === post.id ? null : post.id)}>
                  <svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.2-.6L4 20l1.4-4A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg><span>{(post.comments + (comments[post.id]?.length || 0)).toLocaleString("en-US")}</span>
                </button>
                <button className="post-action" aria-label={t("share")} onClick={() => { if (navigator.share) void navigator.share({ title: `Nexora · @${post.username}`, text: post.caption }).catch(() => undefined); else { void navigator.clipboard?.writeText(post.caption); setNotice("Legenda copiada para compartilhar."); } }}>
                  <svg viewBox="0 0 24 24"><path d="m21 3-7.2 18-3.5-7.3L3 10.2 21 3Z"/><path d="m10.3 13.7 5-5"/></svg><span>{post.shares}</span>
                </button>
                <button className={`post-action ${reposted.includes(post.id) ? "is-reposted" : ""}`} style={{gap:5,paddingInline:7,minWidth:0,whiteSpace:"nowrap",fontSize:11}} aria-label={reposted.includes(post.id) ? translate(uiLanguage, "reposted") : translate(uiLanguage, "repost")} title={reposted.includes(post.id) ? translate(uiLanguage, "reposted") : translate(uiLanguage, "repost")} onClick={() => { setReposted(current => current.includes(post.id) ? current.filter(id => id !== post.id) : [...current, post.id]); setNotice(reposted.includes(post.id) ? "Repost removido desta demonstração." : "Repost adicionado nesta demonstração."); }}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg><span>{reposted.includes(post.id) ? "Repostado" : "Repost"}</span>
                </button>
                <button className={`post-action bookmark-action ${saved.includes(post.id) ? "is-saved" : ""}`} aria-label={translate(uiLanguage, "save")} onClick={() => setSaved(current => current.includes(post.id) ? current.filter(id => id !== post.id) : [...current, post.id])}>
                  <svg viewBox="0 0 24 24"><path d="M6 3.5h12v17l-6-4-6 4v-17Z"/></svg><span>{post.saved + (saved.includes(post.id) ? 1 : 0)}</span>
                </button>
              </div>
              <p className="post-caption">{post.caption}</p>
              {commentsOpen === post.id && <div className="comments-panel">
                {(comments[post.id] || []).map((comment, index) => <p key={index}><strong>Você</strong> {comment}</p>)}
                <form onSubmit={event => { event.preventDefault(); addComment(post.id); }}>
                  <input value={drafts[post.id] || ""} onChange={event => setDrafts(current => ({ ...current, [post.id]: event.target.value }))} placeholder={t("comment")} aria-label={t("comment")} />
                  <button type="submit">{t("send")}</button>
                </form>
              </div>}
            </div>
          </article>
        ))}
      </section>


      {messagesOpen && <section className="messages-app" aria-label={t("chatTitle")}>
        <header className="messages-topbar">
          {activeChat ? <><button className="messages-back" onClick={() => { setActiveChatId(null); setChatDetail("chat"); }} aria-label={t("chatBack")}>‹</button><button className="messages-person" onClick={() => setChatDetail("profile")}><img src={activeChat.avatar} alt="" /><span><strong>{activeChat.name}</strong><small className={activeChat.online ? "online" : ""}>{activeChat.group ? `${activeChat.members || 8} membros` : activeChat.online ? "Online" : "@"+activeChat.username}</small></span></button><button className="messages-head-action call-action" aria-label="Chamada de áudio" title="Chamada de áudio" onClick={() => { setCallMode("audio"); setCallMicMuted(false); setCallCameraOn(false); setCallSpeakerOn(true); }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3.8h3.2l1.6 4.1-2.1 1.7a13.8 13.8 0 0 0 3.7 3.7l1.7-2.1 4.1 1.6V16a2 2 0 0 1-2 2A13.2 13.2 0 0 1 5 5.8a2 2 0 0 1 2-2Z"/></svg></button><button className="messages-head-action call-action" aria-label="Chamada de vídeo" title="Chamada de vídeo" onClick={() => { setCallMode("video"); setCallMicMuted(false); setCallCameraOn(true); setCallSpeakerOn(true); }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="6" width="12" height="12" rx="2.5"/><path d="m15 10 6-3v10l-6-3Z"/></svg></button><button className="messages-head-action" aria-label="Mídias e detalhes" onClick={() => setChatDetail(chatDetail === "media" ? "chat" : "media")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></button><button className="messages-head-action" aria-label="Configurações da conversa" onClick={() => setChatDetail(chatDetail === "settings" ? "chat" : "settings")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 3.1-.2-.1a1.7 1.7 0 0 0-1.9.1 1.7 1.7 0 0 0-.9 1.5v.2h-3.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8-.1l-.2.1-1.8-3.1.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-.9H5v-3.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.1-1.8l-.1-.2 3.1-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 .9-1.5V4h3.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.1l.2-.1 1.8 3.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5.9h.2v3.6h-.2a1.7 1.7 0 0 0-1.5.9Z"/></svg></button></>
          : <><div className="messages-title"><button className="messages-close" onClick={() => setMessagesOpen(false)} aria-label={t("chatBack")}>‹</button><div><h1>{t("chatTitle")}</h1><p>{t("chatTagline")}</p></div></div><button className="messages-new" aria-label="Nova conversa" onClick={() => setNotice("Para iniciar conversas reais, precisamos conectar a autenticação e o backend de mensagens.")}>＋</button></>}
        </header>
        {!activeChat && <><label className="messages-search"><span>⌕</span><input value={chatSearch} onChange={event => setChatSearch(event.target.value)} placeholder={t("chatSearch")} aria-label={t("chatSearch")} />{chatSearch && <button onClick={() => setChatSearch("")} aria-label="Limpar busca">×</button>}</label><div className="messages-filter-tabs" role="tablist" aria-label="Filtrar conversas"><button type="button" role="tab" aria-selected={chatFilter === "all"} className={chatFilter === "all" ? "active" : ""} onClick={() => setChatFilter("all")}>Todas <span>{chatThreads.length}</span></button><button type="button" role="tab" aria-selected={chatFilter === "unread"} className={chatFilter === "unread" ? "active" : ""} onClick={() => setChatFilter("unread")}>Não lidas <span>{chatThreads.filter(chat => chat.unread).length}</span></button><button type="button" role="tab" aria-selected={chatFilter === "groups"} className={chatFilter === "groups" ? "active" : ""} onClick={() => setChatFilter("groups")}>Grupos <span>{chatThreads.filter(chat => chat.group).length}</span></button></div><div className="messages-notes-head"><strong>{t("chatNotes")}</strong><span>{t("chatNotesPrompt")}</span></div><div className="messages-notes"><button className="note-person own-note" onClick={() => setNotesComposerOpen(true)}><span className={`note-bubble note-style-${noteStyle}`}>{myNote || t("chatNotesPrompt")}</span><span className="note-person-avatar"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces" alt="" /><i>＋</i></span><small>{t("chatMyNote")}</small></button>{initialChats.filter(chat => !chat.group).slice(0,3).map((chat,index) => <button className="note-person" key={chat.id} onClick={() => openChat(chat.id)}><span className={`note-bubble note-style-${(index+1)%4}`}>{["Só vivendo 💜","Qual a boa? 🎧","✨ no meu mundo"][index]}</span><span className="note-person-avatar"><img src={chat.avatar} alt="" />{chat.online && <i />}</span><small>{chat.name.split(" ")[0]}</small></button>)}</div><div className="messages-list-heading"><strong>{t("chatConversations")}</strong><div className="messages-heading-actions"><button className="create-channel-trigger" onClick={() => setChannelModalOpen(true)}><span aria-hidden="true">▤</span><span>{t("chatCreateChannel")}</span><small>{t("chatOfficial")}</small></button><button onClick={() => setNotice("Os pedidos de mensagem serão habilitados com as contas reais.")}>{t("chatRequests")}</button></div></div><div className="messages-list">{filteredChats.map(chat => <button className="message-row" key={chat.id} onClick={() => openChat(chat.id)}><span className="message-avatar"><img src={chat.avatar} alt="" />{chat.online && <i />}</span><span className="message-row-copy"><strong>{chat.name}{chat.group && <small className="group-tag">GRUPO</small>}</strong><span>{chat.preview}</span></span><span className="message-row-meta"><small>{chat.time}</small>{Boolean(chat.unread) && <i>{chat.unread}</i>}</span></button>)}{filteredChats.length === 0 && <div className="messages-empty">{t("chatNoResults")}</div>}</div></>}
        {activeChat && <>{chatDetail === "chat" ? <><div className="chat-thread-topline">{activeChat.group ? "🔒 " + t("chatGroup") + " · " + (activeChat.members || 8) + " membros" : "🔒 " + t("chatPrivateDemo")}</div><div className="chat-messages" key={activeChat.id} style={{ background: chatWallpapers[chatWallpaperById[activeChat.id] ?? 0].preview, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>{activeChat.messages.map(message => <div className={`chat-message-line ${message.mine ? "mine" : "theirs"} ${revealedTimestampId === message.id ? "time-revealed" : ""}`} key={message.id} onTouchStart={event => { const touch = event.touches[0]; messageTouchStart.current = {x:touch.clientX,y:touch.clientY,id:message.id}; }} onTouchEnd={event => handleMessageTouchEnd(event,message.id)} onMouseEnter={() => setRevealedTimestampId(message.id)} onMouseLeave={() => setRevealedTimestampId(current => current === message.id ? null : current)}>{!message.mine && activeChat.group && <small className="chat-sender">{message.id % 2 ? "Lucas" : "Fernanda"}</small>}<div className={`chat-bubble chat-bubble-style-${chatBubbleStyleById[activeChat.id] ?? 0} ${message.kind === "image" ? "chat-image-bubble" : ""}`}>{message.kind === "image" ? <><div className="chat-city-image" role="img" aria-label="Foto de uma rua iluminada à noite"></div><span>{message.text}</span></> : message.text}<small>{message.time}</small></div>{chatReactionBurst?.messageId === message.id && <span key={chatReactionBurst.nonce} className="chat-reaction-burst" aria-hidden="true">{chatReactionBurst.emoji}</span>}<div className="chat-message-actions"><button type="button" className="chat-reaction-trigger" onClick={() => {setReactionPickerFor(reactionPickerFor === message.id ? null : message.id);setEmojiSearch("");}} aria-label="Reagir à mensagem" title="Reagir">☺<span>＋</span></button>{(message.reactions || []).length > 0 && <div className="chat-reaction-list">{message.reactions!.map(emoji => <button type="button" key={emoji} onClick={() => toggleMessageReaction(message.id,emoji)} aria-label={`Remover reação ${emoji}`}>{emoji}</button>)}</div>}{reactionPickerFor === message.id && <div className="chat-reaction-picker"><input value={emojiSearch} onChange={event => setEmojiSearch(event.target.value)} placeholder="Buscar emoji..." aria-label="Buscar emoji para reação" /><div className="chat-reaction-emoji-grid">{chatEmojiCatalog.filter(emoji => !emojiSearch || emoji.toLowerCase().includes(emojiSearch.toLowerCase())).map((emoji,index) => <button type="button" key={`${emoji}-${index}`} onClick={() => toggleMessageReaction(message.id,emoji)} aria-label={`Reagir com ${emoji}`}>{emoji}</button>)}</div></div>}</div></div>)}<div className="chat-read-receipt" role="status"><span className="read-receipt-dot"></span> {chatReadReceipts ? "Confirmações de leitura ativadas neste dispositivo" : "Confirmações de leitura desativadas nas preferências"}</div></div><form className="chat-composer" onSubmit={event => { event.preventDefault(); sendChatMessage(); }}><button type="button" className="chat-add" onClick={() => setNotice("O envio de arquivos será conectado ao armazenamento da Nexora.")} aria-label="Anexar arquivo">＋</button><div className="chat-input-wrap"><input value={chatDraft} onChange={event => setChatDraft(event.target.value)} placeholder={t("chatTypeMessage")} aria-label={t("chatTypeMessage")} maxLength={2000} /><button type="button" className={`chat-translate-toggle ${autoTranslateChat ? "is-active" : ""}`} aria-pressed={autoTranslateChat} onClick={() => { const next = !autoTranslateChat; setAutoTranslateChat(next); setNotice(next ? "Preferência de tradução automática ativada neste dispositivo. As mensagens ainda não são traduzidas automaticamente." : "Preferência de tradução automática desativada."); }} title="Preferência de tradução automática (tradução real ainda não conectada)" aria-label="Preferência de tradução automática; tradução real ainda não conectada">文<span className="chat-translate-label">Traduzir</span><i>{autoTranslateChat ? "ON" : "OFF"}</i></button><button type="button" onClick={() => setChatEmojiOpen(!chatEmojiOpen)} aria-label="Emojis">☺</button></div><button type="submit" className="chat-send" disabled={!chatDraft.trim()} aria-label={t("chatSend")}>➤</button>{chatEmojiOpen && <div className="chat-emoji-tray chat-emoji-tray-full"><input value={emojiSearch} onChange={event => setEmojiSearch(event.target.value)} placeholder="Buscar emoji..." aria-label="Buscar emoji" /><div>{chatEmojiCatalog.filter(emoji => !emojiSearch || emoji.toLowerCase().includes(emojiSearch.toLowerCase())).map((emoji,index) => <button type="button" key={`${emoji}-${index}`} onClick={() => setChatDraft(value => value + emoji)}>{emoji}</button>)}</div></div>}</form></> : chatDetail === "media" ? <div className="chat-info-panel"><h2>{t("chatMedia")}</h2><p>Conteúdos compartilhados nesta conversa</p><div className="chat-media-grid"><div className="chat-city-image" /><div className="chat-city-image second" /><div className="chat-city-image third" /></div><button onClick={() => setNotice("O salvamento de mídia estará disponível com o armazenamento conectado.")}>⇩ Salvar na galeria</button><button onClick={() => setNotice("O compartilhamento de mídia será habilitado nesta etapa.")}>↗ Compartilhar</button><button onClick={() => setChatDetail("chat")}>Voltar à conversa</button></div> : chatDetail === "wallpaper" ? <div className="chat-settings-panel wallpaper-screen">
          <div className="chat-settings-heading"><div><span className="chat-settings-kicker">NEXORA ✦ PERSONALIZAÇÃO</span><h2>Papel de parede</h2><p>Escolha o clima da sua conversa.</p></div><button onClick={() => setChatDetail("settings")} aria-label="Voltar às configurações">‹</button></div>
          <div className="wallpaper-preview-live" style={{background:chatWallpapers[chatWallpaperById[activeChat.id] ?? 0].preview}}><div className="wallpaper-preview-bubble theirs">Oi! Como foi seu dia?</div><div className="wallpaper-preview-bubble mine">Foi ótimo 💜<small>Agora</small></div><span>PRÉ-VISUALIZAÇÃO</span></div>
          <section className="chat-settings-section"><div className="chat-settings-section-title"><strong>Escolha um fundo</strong><small>{chatWallpapers.length} estilos</small></div><p>O fundo aparece atrás das mensagens. Seus balões e textos continuam em destaque.</p><div className="wallpaper-grid">{chatWallpapers.map((wallpaper,index) => <button key={wallpaper.name} className={`wallpaper-choice ${(chatWallpaperById[activeChat.id] ?? 0) === index ? "selected" : ""}`} onClick={() => setChatWallpaperById(current => ({...current,[activeChat.id]:index}))}><span style={{background:wallpaper.preview}}>{index===18 ? "✦ 🔥 ✧" : index===19 ? "✨ 💜 🌙" : ""}</span><small>{wallpaper.name}</small>{(chatWallpaperById[activeChat.id] ?? 0) === index && <i>✓</i>}</button>)}</div></section>
          <button className="wallpaper-done-button" onClick={() => setChatDetail("chat")}>Aplicar papel de parede <span>✓</span></button>
        </div> : chatDetail === "settings" ? <div className="chat-settings-panel">
          <div className="chat-settings-heading"><div><span className="chat-settings-kicker">NEXORA ✦ CONVERSA</span><h2>{t("chatSettings")}</h2><p>Personalize esta conversa do seu jeito.</p></div><button onClick={() => setChatDetail("chat")} aria-label="Fechar configurações">✕</button></div>
          <section className="chat-settings-profile"><img src={activeChat.avatar} alt="" /><div><strong>{activeChat.name}</strong><small>{activeChat.group ? `Grupo · ${activeChat.members || 8} membros` : `@${activeChat.username}`}</small></div><button onClick={() => setChatDetail("profile")}>{t("chatProfile")} ↗</button></section>
          <button className="settings-navigation-row" onClick={() => setChatDetail("wallpaper")}><span className="settings-row-icon">✧</span><span className="settings-row-copy"><strong>Papel de parede</strong><small>Escolha um fundo para esta conversa</small></span><span className="settings-row-preview" style={{background:chatWallpapers[chatWallpaperById[activeChat.id] ?? 0].preview}}/><b>›</b></button>
          <section className="chat-settings-section nexora-chat-style-note"><div className="chat-settings-section-title"><strong>Estilo Nexora</strong><small>Visual oficial</small></div><p>Balões modernos e arredondados com degradê neon azul, ciano e violeta. Os estilos antigos foram retirados desta tela.</p></section>
          <section className="chat-settings-section"><div className="chat-settings-section-title"><strong>Preferências da conversa</strong><small>Salvas neste dispositivo</small></div>
            <p className="chat-local-preferences-note">Estas opções ficam salvas neste navegador. Notificações entre contas, confirmações de leitura reais e salvamento automático de mídias dependem da conexão do sistema de mensagens.</p>
            <button type="button" className="chat-setting-row" aria-pressed={chatMuted} onClick={() => setChatMuted(value => !value)}><span>🔔 Silenciar notificações<small>Preferência local; notificações reais ainda não conectadas</small></span><i className={chatMuted?"toggle on":"toggle"} /></button>
            <button type="button" className="chat-setting-row" aria-pressed={!chatReadReceipts} onClick={() => setChatReadReceipts(value => !value)}><span>👁 Confirmações de leitura<small>Preferência local de privacidade</small></span><i className={chatReadReceipts?"toggle on":"toggle"} /></button>
            <button type="button" className="chat-setting-row" aria-pressed={chatSaveMedia} onClick={() => setChatSaveMedia(value => !value)}><span>📥 Salvar mídias automaticamente<small>Preferência local; mídia recebida ainda não sincronizada</small></span><i className={chatSaveMedia?"toggle on":"toggle"} /></button>
          </section>
          <details className="settings-advanced"><summary><span>⚙</span><span><strong>Mais opções</strong><small>Recursos adicionais e privacidade</small></span><b>＋</b></summary><div className="settings-advanced-content">
            <button className="chat-setting-row" onClick={() => setNotice("O modo efêmero será ativado quando as mensagens reais estiverem conectadas.")}><span>🫥 Modo efêmero<small>Mensagens temporárias</small></span><b>Em breve</b></button>
            {activeChat.group && <><button className="chat-setting-row" onClick={() => setNotice("A edição do nome, descrição e foto será habilitada com o backend de grupos.")}><span>✏️ Identidade do grupo<small>Nome, descrição e imagem</small></span><b>Editar ›</b></button><button className="chat-setting-row" onClick={() => setGroupOnlyAdmins(!groupOnlyAdmins)}><span>🛡️ Só administradores enviam avisos<small>Organize comunicados do grupo</small></span><i className={groupOnlyAdmins?"toggle on":"toggle"} /></button><button className="chat-setting-row" onClick={() => setNotice("A lista de membros e cargos será carregada com o backend de grupos.")}><span>⭐ Membros e administradores<small>Gerencie participantes</small></span><b>Ver ›</b></button></>}
            <button className="chat-setting-row" onClick={() => setChatDetail("media")}><span>▤ Mídias, links e documentos<small>Conteúdos desta conversa</small></span><b>Abrir ›</b></button>
          </div></details>
          <button className="chat-danger-action" onClick={() => setNotice("As opções de sair ou apagar conversa serão conectadas às permissões reais.")}>{activeChat.group ? "Sair do grupo" : "Apagar conversa"} <span>›</span></button>
        </div>: <div className="chat-profile-panel"><img src={activeChat.avatar} alt="" /><h2>{activeChat.name}</h2><p>@{activeChat.username} · {activeChat.online ? "Online" : "Nexora"}</p><div className="chat-profile-actions"><button onClick={() => setChatDetail("chat")}>Mensagem</button><button onClick={() => setChatDetail("media")}>Mídias</button></div><div className="chat-profile-option">♧ Notificações da conversa <span>●</span></div><div className="chat-profile-option">ⓘ Informações e participantes</div><button className="chat-block-button" onClick={() => setNotice("O bloqueio de contas será ativado junto ao sistema de usuários.")}>Bloquear usuário</button></div>}</>}
        <footer className="messages-footer"><span>N</span> Nexora <small>Conectando pessoas, marcas e oportunidades.</small></footer>
      </section>}

      {callMode && activeChat && <div className="nexora-call-overlay" role="dialog" aria-modal="true" aria-label={callMode === "video" ? "Chamada de vídeo" : "Chamada de áudio"}>
        <section className={`nexora-call-screen ${callMode === "video" ? "video-call" : "audio-call"}`}>
          <div className="nexora-call-ambient" aria-hidden="true" />
          <header className="nexora-call-header"><span className="nexora-call-brand"><img src="/nexora-logo.svg" alt="" /> NEXORA</span><button type="button" onClick={() => setCallMode(null)} aria-label="Fechar chamada">×</button></header>
          <div className="nexora-call-person">
            {callMode === "video" && callCameraOn && <div className="nexora-call-video-placeholder"><span className="nexora-call-video-icon">▣</span><strong>Prévia de vídeo</strong><small>A câmera só será ativada quando a chamada em tempo real estiver integrada.</small></div>}
            <div className="nexora-call-avatar-glow"><img src={activeChat.avatar} alt="" /></div>
            <h2>{activeChat.name}</h2><p>{callMode === "video" ? "Chamada de vídeo" : "Chamada de áudio"}</p>
            <span className="nexora-call-status"><i /> Interface de chamada · demonstração local</span>
          </div>
          <div className="nexora-call-notice"><span>✦</span><p>A interface está pronta visualmente. A conexão real entre usuários ainda precisa de serviço de chamadas em tempo real (WebRTC) e sinalização no servidor.</p></div>
          <footer className="nexora-call-controls">
            <button type="button" className={callMicMuted ? "is-toggled" : ""} onClick={() => setCallMicMuted(v => !v)} aria-pressed={callMicMuted}><span>{callMicMuted ? "♩̸" : "♩"}</span><small>{callMicMuted ? "Microfone mudo" : "Microfone"}</small></button>
            {callMode === "video" && <button type="button" className={!callCameraOn ? "is-toggled" : ""} onClick={() => setCallCameraOn(v => !v)} aria-pressed={!callCameraOn}><span>▣</span><small>{callCameraOn ? "Câmera" : "Câmera desligada"}</small></button>}
            <button type="button" className={!callSpeakerOn ? "is-toggled" : ""} onClick={() => setCallSpeakerOn(v => !v)} aria-pressed={!callSpeakerOn}><span>◖))</span><small>{callSpeakerOn ? "Áudio" : "Áudio reduzido"}</small></button>
            <button type="button" className="nexora-call-end" onClick={() => setCallMode(null)} aria-label="Encerrar chamada"><span>☎</span><small>Encerrar</small></button>
          </footer>
        </section>
      </div>}
      {channelModalOpen && <div className="notes-composer-backdrop" onClick={event => {if(event.target===event.currentTarget)setChannelModalOpen(false);}}><section className="notes-composer-card channel-create-card" role="dialog" aria-modal="true" aria-label="Criar canal Nexora"><header><div><strong><span className="channel-official-mark">✓</span> Criar canal</strong><small>Um espaço oficial para sua comunidade e seus seguidores.</small></div><button onClick={() => setChannelModalOpen(false)} aria-label="Fechar">×</button></header><div className="channel-requirement-card"><span>📣</span><div><strong>15.000 seguidores</strong><small>Requisito para criar um canal público.</small></div><b>{myFollowerCount.toLocaleString("pt-BR")} / 15K</b></div>{myFollowerCount >= 15000 ? <><input className="channel-name-input" value={channelName} onChange={event => setChannelName(event.target.value)} maxLength={40} placeholder="Nome do canal" /><button className="notes-publish" disabled={!channelName.trim()} onClick={() => {setChannelModalOpen(false);setNotice("Nome de canal preparado. A criação real será ativada quando o sistema de seguidores e canais estiver conectado.");}}>Continuar</button></> : <><div className="channel-progress"><span style={{width:`${Math.min(100,myFollowerCount/15000*100)}%`}} /></div><p className="channel-gate-copy">Você ainda precisa de {(15000-myFollowerCount).toLocaleString("pt-BR")} seguidores para desbloquear a criação de canais. Estamos deixando a experiência preparada para essa etapa.</p><button className="notes-publish" onClick={() => setChannelModalOpen(false)}>Entendi</button></>}</section></div>}\n      {notesComposerOpen && <div className="notes-composer-backdrop" onClick={event => { if (event.target === event.currentTarget) setNotesComposerOpen(false); }}><section className="notes-composer-card" role="dialog" aria-modal="true" aria-label="Criar nota"><header><div><strong>Sua nota</strong><small>Uma ideia rápida, do seu jeito.</small></div><button onClick={() => setNotesComposerOpen(false)} aria-label="Fechar">×</button></header><textarea value={notesDraft} onChange={event => setNotesDraft(event.target.value)} maxLength={60} placeholder="O que você quer compartilhar?" autoFocus /><div className="notes-style-label">Escolha seu neon</div><div className="notes-style-picker">{[0,1,2,3].map(style => <button type="button" key={style} className={`note-style-swatch note-style-${style} ${noteStyle===style ? "selected" : ""}`} onClick={() => setNoteStyle(style)} aria-label={`Estilo de nota ${style+1}`}>{["Néon","Aurora","Cosmos","Pulse"][style]}</button>)}</div><button className="notes-music-button" onClick={() => { window.open("/musicas?origem=nota","_blank","noopener,noreferrer"); }}>♫ Explorar catálogo musical <small>Ver artistas</small></button><button className="notes-publish" disabled={!notesDraft.trim()} onClick={() => { setMyNote(notesDraft.trim()); try { window.localStorage.setItem("nexora-chat-note-v1", notesDraft.trim()); window.localStorage.setItem("nexora-chat-note-style-v1", String(noteStyle)); } catch { /* preferência local opcional */ } setNotesComposerOpen(false); setNotesDraft(""); setNotice("Sua nota foi salva neste dispositivo."); }}>Compartilhar nota</button></section></div>}\n      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso">×</button></div>}

      {activeStory && <div className="story-overlay" onClick={event => { if (event.target === event.currentTarget) closeStoryViewer(); }}><section className="story-viewer" role="dialog" aria-modal="true" aria-label={`Story de ${activeStory.name}`} onTouchStart={event => { const touch = event.touches[0]; storyTouchStartRef.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={event => { const start = storyTouchStartRef.current; storyTouchStartRef.current = null; if (!start || storyCommentsOpen || showStoryReactions) return; const touch = event.changedTouches[0]; const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; const target = event.target as HTMLElement; if (target.closest("button, input, textarea, form, .story-comments-sheet, .story-action-rail, .story-bottom-bubbles")) return; if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) { if (dx < 0) goNextStory(); else goPreviousStory(); } }}><div key={activeStory.id || activeStory.name} className={`story-progress ${isStoryPaused || storyCommentsOpen || showStoryReactions ? "is-paused" : ""}`}><span /></div><header><img src={activeStory.image} alt="" /><strong>{activeStory.name} <small>· agora</small></strong><button className="story-pause-button" onClick={toggleStoryPlayback} aria-label={isStoryPaused ? "Continuar Story" : "Pausar Story"} title={isStoryPaused ? "Continuar" : "Pausar"}>{isStoryPaused ? "▶" : "Ⅱ"}</button><button onClick={closeStoryViewer} aria-label="Fechar">×</button></header>{activeStory.mediaType === "video" ? <video ref={storyVideoRef} className="story-full-image" src={activeStory.image} autoPlay={!isStoryPaused && !storyCommentsOpen && !showStoryReactions} playsInline onClick={handleStoryVideoTap} onEnded={goNextStory} /> : <img className="story-full-image" src={activeStory.image.replace("w=180&h=180", "w=900&h=1500")} alt={activeStory.caption || `Story de ${activeStory.name}`} onClick={handleStoryMediaTap} />}{showStoryHeart && <div className="story-heart-burst" aria-hidden="true">❤️</div>}{storyFloatingReaction && <div key={`reaction-${storyFeedbackId}`} className="story-floating-reaction" aria-hidden="true">{storyFloatingReaction}</div>}{storyQuickCommentVisible && <div key={`comment-${storyFeedbackId}`} className="story-quick-comment" aria-live="polite"><span className="story-quick-comment-avatar">L</span><span><strong>Licinhosz.bb</strong><small>{storyQuickComment}</small></span></div>}{isStoryPaused && !storyCommentsOpen && !showStoryReactions && <button className="story-resume-overlay" onClick={toggleStoryPlayback} aria-label="Continuar Story">▶</button>}{activeStory.caption && <p className="story-caption">{activeStory.caption}</p>}<button className="story-hit story-hit-prev" aria-label="Story anterior" onClick={goPreviousStory} /><button className="story-hit story-hit-next" aria-label="Próximo Story" onClick={goNextStory} /><aside className="story-action-rail" aria-label="Interações do Story"><div className="story-reaction-anchor">{showStoryReactions && <div className="story-reaction-picker" role="group" aria-label="Escolha uma reação">{["🫦","🤌","😍","🔥","🫶"].map(emoji => <button key={emoji} onClick={() => toggleStoryLike(emoji)} aria-label={`Reagir com ${emoji}`}>{emoji}</button>)}</div>}<button className={`story-action-button ${likedStories.includes(currentStoryKey()) ? "liked" : ""}`} aria-label="Curtir Story; segure para escolher emoji" onPointerDown={startReactionHold} onPointerUp={endReactionHold} onPointerLeave={endReactionHold} onContextMenu={event => { event.preventDefault(); setShowStoryReactions(true); }} onClick={event => { event.stopPropagation(); if (reactionHeldRef.current) { reactionHeldRef.current = false; return; } toggleStoryLike(); }}><span className="story-action-icon">{storyReactions[currentStoryKey()] || (likedStories.includes(currentStoryKey()) ? "❤️" : "♡")}</span><small>{likedStories.includes(currentStoryKey()) ? "Curtido" : "Curtir"}</small></button></div><button className="story-action-button" aria-label="Comentar Story" onClick={event => { event.stopPropagation(); setStoryCommentsOpen(true); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h8M8 14h5"/></svg></span><small>{translate(uiLanguage, "comments")}</small></button><button className="story-action-button" aria-label="Enviar mensagem privada para quem publicou o Story" onClick={event => { event.stopPropagation(); messageStoryUser(); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5Z"/><path d="m5 6 7 6 7-6"/></svg></span><small>Mensagem</small></button><button className="story-action-button" aria-label="Compartilhar Story" onClick={event => { event.stopPropagation(); shareStory(); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 3-7.5 18-3.2-7.3L3 10.5 21 3Z"/><path d="M10.3 13.7 15 9"/></svg></span><small>Enviar</small></button></aside><div className="story-bottom-bubbles" aria-label="Navegar entre Stories">{stories.filter(item => !item.own || item.image).map(story => <button key={story.id || story.name} className={`story-bubble ${story.name === activeStory.name && story.image === activeStory.image ? "active" : ""}`} onClick={event => { event.stopPropagation(); const index = stories.indexOf(story); setActiveStoryIndex(index); setActiveStory(story); setIsStoryPaused(false); setShowStoryReactions(false); }}><span><img src={story.image} alt="" /></span><small>{story.name}</small></button>)}</div>{storyCommentsOpen && <div className="story-comments-backdrop" onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) setStoryCommentsOpen(false); }}><section className="story-comments-sheet" role="dialog" aria-modal="true" aria-label="Comentários do Story"><header><div><strong>{translate(uiLanguage, "comments")}</strong><small>Converse com respeito, do seu jeito</small></div><button onClick={() => setStoryCommentsOpen(false)} aria-label="Fechar comentários">×</button></header><div className="story-comments-list">{(storyComments[currentStoryKey()] || []).length ? (storyComments[currentStoryKey()] || []).map((comment, index) => <p key={index}><span className="story-comment-avatar">L</span><span><strong>Licinhosz.bb</strong>{comment}</span></p>) : <div className="story-comments-empty"><span>✦</span><strong>Comece a conversa</strong><small>Seja a primeira pessoa a comentar neste Story.</small></div>}</div><form onSubmit={addStoryComment}><span className="story-comment-avatar">L</span><input autoFocus value={storyCommentDraft} onChange={event => setStoryCommentDraft(event.target.value)} placeholder="Adicione um comentário..." aria-label="Adicionar comentário" maxLength={300} /><button type="submit" disabled={!storyCommentDraft.trim()}>Enviar</button></form></section></div>}</section></div>}

<>{storyComposerOpen && <div className="overlay story-composer-overlay" onClick={event=>{if(event.target===event.currentTarget){stopStoryCamera();setStoryComposerOpen(false);}}} style={{position:"fixed",inset:0,zIndex:1000,display:"flex",justifyContent:"center",padding:0,background:"#000"}}>
<section role="dialog" aria-modal="true" aria-labelledby="story-composer-title" style={{width:"min(100%,520px)",height:"100dvh",maxHeight:"100dvh",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",background:"#050507",color:"#fff",fontFamily:"Arial,sans-serif"}}>
<input ref={storyInputRef} type="file" accept="image/*,video/*" onChange={event=>{const file=event.currentTarget.files?.[0];if(!file)return;if(!file.type.startsWith("image/")&&!file.type.startsWith("video/")){setNotice("Escolha uma foto ou vídeo.");event.currentTarget.value="";return;}if(file.size>50*1024*1024){setNotice("O arquivo deve ter até 50 MB.");event.currentTarget.value="";return;}stopStoryCamera();if(storyPreview.startsWith("blob:"))URL.revokeObjectURL(storyPreview);setStoryFile(file);setStoryPreview(URL.createObjectURL(file));event.currentTarget.value="";}} style={{display:"none"}}/>
<input ref={storyCameraInputRef} type="file" accept="image/*" capture="user" onChange={event=>{const file=event.currentTarget.files?.[0];if(!file)return;if(file.size>50*1024*1024){setNotice("A foto deve ter até 50 MB.");event.currentTarget.value="";return;}stopStoryCamera();if(storyPreview.startsWith("blob:"))URL.revokeObjectURL(storyPreview);setStoryFile(file);setStoryPreview(URL.createObjectURL(file));event.currentTarget.value="";}} style={{display:"none"}}/>
<header style={{height:62,flex:"0 0 62px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",background:"#08080b",zIndex:3}}><button type="button" onClick={()=>{stopStoryCamera();setStoryComposerOpen(false);}} aria-label="Fechar estúdio" style={{border:0,background:"transparent",color:"#fff",fontSize:30,width:38}}>×</button><div style={{textAlign:"center"}}><strong id="story-composer-title" style={{fontSize:16}}>Criar Story</strong><small style={{display:"block",fontSize:10,color:"#a8a8b3",marginTop:3}}>NEXORA CAMERA</small></div><button type="button" onClick={()=>setStoryFacingMode(current=>current==="user"?"environment":"user")} aria-label="Alternar câmera" style={{border:"1px solid #ffffff24",background:"#ffffff12",color:"#fff",width:38,height:38,borderRadius:50,fontSize:20}}>⇄</button></header>
<div style={{position:"relative",flex:"1 1 auto",minHeight:0,overflow:"hidden",background:"#17171b",display:"grid",placeItems:"center"}}>
{storyCameraActive?<video ref={storyLiveVideoRef} autoPlay muted playsInline style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:storyFacingMode==="user"?"scaleX(-1)":"none",filter:(({mono:"grayscale(1)",glow:"brightness(1.12) saturate(1.2)",coffee:"sepia(.3) saturate(1.2)",warm:"sepia(.22) saturate(1.2)",dream:"saturate(1.2) hue-rotate(12deg) brightness(1.04)",neon:"saturate(1.65) contrast(1.08) hue-rotate(12deg)",blur:"blur(1.5px) saturate(1.05)",aurora:"hue-rotate(35deg) saturate(1.45)",vintage:"sepia(.3) contrast(1.08)",rose:"hue-rotate(325deg) saturate(1.2)",cool:"hue-rotate(175deg) saturate(1.1)",cinema:"contrast(1.2) saturate(.85)",soft:"brightness(1.06) saturate(.9)",sunset:"sepia(.28) saturate(1.35) hue-rotate(-8deg)",invert:"invert(1)"} as Record<string,string>)[storyLens]||"none")}}/>:storyPreview?(storyFile?.type.startsWith("video/")?<video src={storyPreview} controls playsInline style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",background:"#050507"}}/>:<img src={storyPreview} alt="Prévia da mídia do Story" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",filter:(({mono:"grayscale(1)",warm:"sepia(.22) saturate(1.2)",glow:"brightness(1.12) saturate(1.2)",dream:"saturate(1.2) hue-rotate(12deg) brightness(1.04)",neon:"saturate(1.65) contrast(1.08) hue-rotate(12deg)",blur:"blur(1.5px) saturate(1.05)",aurora:"hue-rotate(35deg) saturate(1.45)",vintage:"sepia(.3) contrast(1.08)",rose:"hue-rotate(325deg) saturate(1.2)",cool:"hue-rotate(175deg) saturate(1.1)",cinema:"contrast(1.2) saturate(.85)",soft:"brightness(1.06) saturate(.9)",sunset:"sepia(.28) saturate(1.35) hue-rotate(-8deg)",invert:"invert(1)"} as Record<string,string>)[storyLens]||"none")}}/>):<div style={{textAlign:"center",padding:28,color:"#f4f4f6"}}><div style={{fontSize:52,marginBottom:12}}>◎</div><strong style={{fontSize:17}}>Sua história começa aqui</strong><p style={{fontSize:13,color:"#b5b5c0",lineHeight:1.5}}>Abra a câmera ou escolha uma foto ou vídeo da galeria.</p><button type="button" onClick={startStoryCamera} style={{marginTop:10,padding:"11px 18px",borderRadius:24,border:0,background:"#fff",color:"#111",fontWeight:700}}>Abrir câmera</button></div>}
{storyCameraActive&&storyLens==="dog"&&<div aria-hidden="true" style={{position:"absolute",top:"13%",left:0,right:0,textAlign:"center",fontSize:64,pointerEvents:"none"}}>🐶</div>}{storyCameraActive&&storyLens==="bunny"&&<div aria-hidden="true" style={{position:"absolute",top:"8%",left:0,right:0,textAlign:"center",fontSize:64,pointerEvents:"none"}}>🐰</div>}{storyCameraActive&&storyLens==="coffee"&&<div aria-hidden="true" style={{position:"absolute",top:"15%",left:0,right:0,textAlign:"center",fontSize:50,pointerEvents:"none"}}>☕✨</div>}
{storySticker&&<div aria-hidden="true" style={{position:"absolute",bottom:"19%",left:0,right:0,textAlign:"center",fontSize:48,textShadow:"0 3px 14px #000",pointerEvents:"none"}}>{storySticker}</div>}{storyOverlayText&&<div style={{position:"absolute",top:"48%",left:18,right:18,textAlign:"center",fontSize:25,fontWeight:900,color:"#fff",textShadow:"0 2px 8px #000,0 0 14px #000",overflowWrap:"anywhere",pointerEvents:"none"}}>{storyOverlayText}</div>}{storyLocation&&<div style={{position:"absolute",bottom:12,left:18,right:18,textAlign:"center",padding:"8px 12px",borderRadius:24,background:"#111c",color:"#fff",fontSize:12,backdropFilter:"blur(10px)"}}>{storyLocation}</div>}{storyRecording&&<div style={{position:"absolute",top:16,left:16,padding:"7px 11px",borderRadius:20,background:"#d9273e",fontSize:11,fontWeight:800}}>● GRAVANDO</div>}
<div style={{position:"absolute",right:12,top:16,display:"flex",flexDirection:"column",gap:13,alignItems:"center",zIndex:4}}>
<button type="button" onClick={()=>{const value=window.prompt("Escreva o texto do Story",storyOverlayText);if(value!==null)setStoryOverlayText(value.slice(0,120));}} aria-label="Texto" title="Texto" style={{width:42,height:42,borderRadius:"50%",border:"1px solid #ffffff55",background:"#1119",backdropFilter:"blur(14px)",color:"#fff",fontSize:22,fontWeight:700}}>Aa</button>
<button type="button" onClick={()=>setStoryToolPanel(current=>current==="gifs"?"none":"gifs")} aria-label="GIFs" title="GIFs" style={{width:42,height:42,borderRadius:"50%",border:"1px solid #ffffff55",background:"#1119",backdropFilter:"blur(14px)",color:"#fff",fontSize:17,fontWeight:800}}>GIF</button>
<button type="button" onClick={()=>setStoryToolPanel(current=>current==="stickers"?"none":"stickers")} aria-label="Stickers" title="Stickers" style={{width:42,height:42,borderRadius:"50%",border:"1px solid #ffffff55",background:"#1119",backdropFilter:"blur(14px)",color:"#fff",fontSize:21}}>▧</button>
<button type="button" onClick={()=>setStoryToolPanel(current=>current==="questions"?"none":"questions")} aria-label="Caixa de perguntas" title="Perguntas" style={{width:42,height:42,borderRadius:"50%",border:"1px solid #ffffff55",background:"#1119",backdropFilter:"blur(14px)",color:"#fff",fontSize:20}}>?</button>
<button type="button" onClick={()=>setStoryToolPanel(current=>current==="poll"?"none":"poll")} aria-label="Enquete" title="Enquete" style={{width:42,height:42,borderRadius:"50%",border:"1px solid #ffffff55",background:"#1119",backdropFilter:"blur(14px)",color:"#fff",fontSize:20}}>☷</button>
<button type="button" onClick={()=>setStoryToolPanel(current=>current==="boomerang"?"none":"boomerang")} aria-label="Boomerang" title="Boomerang" style={{width:42,height:42,border:"1px solid #ffffff55",background:"#1119",backdropFilter:"blur(14px)",borderRadius:"50%",color:"#fff",fontSize:21}}>∞</button>
<button type="button" onClick={()=>window.open("/musicas?origem=story","_blank","noopener,noreferrer")} aria-label="Música" title="Música" style={{width:42,height:42,borderRadius:"50%",border:"1px solid #ffffff55",background:"#1119",backdropFilter:"blur(14px)",color:"#fff",fontSize:21}}>♫</button>
<button type="button" onClick={async()=>{try{if(!navigator.geolocation)throw new Error();const pos=await new Promise<GeolocationPosition>((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{timeout:10000}));setStoryLocation("📍 "+pos.coords.latitude.toFixed(3)+", "+pos.coords.longitude.toFixed(3));}catch{setNotice("Não foi possível obter a localização. Confira a permissão do navegador.");}}} aria-label="Localização" title="Localização" style={{width:42,height:42,borderRadius:"50%",border:"1px solid #ffffff55",background:"#1119",backdropFilter:"blur(14px)",color:"#fff",fontSize:21}}>⌖</button>
</div>
{storyToolPanel!=="none"&&<div style={{position:"absolute",left:12,right:64,bottom:16,zIndex:5,maxHeight:"44%",overflowY:"auto",padding:14,borderRadius:18,background:"#101015ed",border:"1px solid #ffffff25",backdropFilter:"blur(20px)",boxShadow:"0 12px 35px #0008"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><strong style={{fontSize:14}}>{({stickers:"Stickers",gifs:"GIFs e reações",questions:"Caixa de perguntas",poll:"Enquete",quiz:"Quiz",boomerang:"Boomerang",text:"Texto",music:"Música",download:"Salvar"} as Record<string,string>)[storyToolPanel]}</strong><button type="button" onClick={()=>setStoryToolPanel("none")} aria-label="Fechar ferramentas" style={{border:0,background:"transparent",color:"#fff",fontSize:23}}>×</button></div>
{storyToolPanel==="stickers"&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:8}}>{["❤️","😂","🔥","✨","🎀","🦋","😍","🥹","💫","🌈","🎉","🤍","👏","😎","💖","☁️"].map(sticker=><button key={sticker} type="button" onClick={()=>{setStorySticker(sticker);setStoryToolPanel("none");}} style={{border:"1px solid #ffffff18",borderRadius:12,background:"#ffffff0b",padding:10,fontSize:25}}>{sticker}</button>)}</div>}
{storyToolPanel==="gifs"&&<div><p style={{fontSize:11,color:"#bdbdca",margin:"0 0 10px"}}>Reações animadas para decorar a história. A biblioteca GIF online será conectada depois.</p><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:8}}>{["✨","💖","😂","🔥","🎉","💅","😍","🫶","👀","💃","🦋","🤌","💯","🥹","🌈","⭐","👏","😎","💋","☁️","🪩","💘","😈","🧸","🍒","🧿"].map((gif,index)=><button key={gif+index} type="button" onClick={()=>{setStorySticker(gif);setStoryToolPanel("none");}} style={{border:"1px solid #ffffff18",borderRadius:12,background:"#ffffff0b",padding:8,fontSize:23}}>{gif}</button>)}</div></div>}
{storyToolPanel==="questions"&&<div><input value={storyInteractiveText} onChange={e=>setStoryInteractiveText(e.target.value)} placeholder="Faça uma pergunta..." maxLength={120} style={{width:"100%",padding:12,borderRadius:12,background:"#25252d",border:"1px solid #ffffff25",color:"#fff"}}/><button type="button" onClick={()=>{setStoryOverlayText("❔ "+(storyInteractiveText.trim()||"Me pergunte alguma coisa!"));setStoryToolPanel("none");}} style={{width:"100%",marginTop:10,padding:11,border:0,borderRadius:12,background:"#fff",color:"#111",fontWeight:800}}>Adicionar caixa à prévia</button></div>}
{storyToolPanel==="poll"&&<div><input value={storyInteractiveText} onChange={e=>setStoryInteractiveText(e.target.value)} placeholder="Pergunta da enquete" maxLength={100} style={{width:"100%",padding:12,borderRadius:12,background:"#25252d",border:"1px solid #ffffff25",color:"#fff"}}/><div style={{display:"flex",gap:8,marginTop:8}}>{storyPollOptions.map((option,index)=><input key={index} value={option} onChange={e=>setStoryPollOptions(current=>current.map((item,i)=>i===index?e.target.value:item))} maxLength={24} style={{width:"50%",minWidth:0,padding:10,borderRadius:10,background:"#25252d",border:"1px solid #ffffff25",color:"#fff"}}/>)}</div><button type="button" onClick={()=>{setStoryOverlayText("📊 "+(storyInteractiveText.trim()||"O que você prefere?")+"\n"+storyPollOptions.join("   /   "));setStoryToolPanel("none");}} style={{width:"100%",marginTop:10,padding:11,border:0,borderRadius:12,background:"#fff",color:"#111",fontWeight:800}}>Adicionar enquete à prévia</button></div>}
{storyToolPanel==="boomerang"&&<div><p style={{fontSize:11,color:"#bdbdca",margin:"0 0 10px"}}>Escolha o estilo para a revisão do clipe. O processamento final do loop e do rastro será validado na próxima etapa.</p><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>{([{id:"classic",label:"Clássico",desc:"Vai e volta"},{id:"slow",label:"Lento",desc:"Movimento suave"},{id:"echo",label:"Eco",desc:"Rastro de movimento"},{id:"portrait",label:"Fundo borrado",desc:"Destaca a pessoa"}] as const).map(mode=><button key={mode.id} type="button" onClick={()=>setStoryBoomerangMode(mode.id)} style={{textAlign:"left",padding:11,borderRadius:12,border:storyBoomerangMode===mode.id?"2px solid #fff":"1px solid #ffffff25",background:storyBoomerangMode===mode.id?"#ffffff20":"#ffffff08",color:"#fff"}}><strong style={{display:"block",fontSize:12}}>{mode.label}</strong><small style={{display:"block",fontSize:10,color:"#bdbdca",marginTop:4}}>{mode.desc}</small></button>)}</div></div>}
</div>}
<div style={{flex:"0 0 auto",background:"#08080b",padding:"10px 16px max(14px,env(safe-area-inset-bottom))"}}>
<div aria-label="Efeitos da câmera" style={{display:"flex",gap:13,overflowX:"auto",padding:"4px 3px 14px",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>{([{id:"none",label:"Original",icon:"◉"},{id:"soft",label:"Suave",icon:"✧"},{id:"warm",label:"Dourado",icon:"☼"},{id:"mono",label:"P&B",icon:"◐"},{id:"neon",label:"Neon",icon:"✦"},{id:"blur",label:"Desfoque",icon:"◌"},{id:"aurora",label:"Aurora",icon:"❋"},{id:"dream",label:"Dream",icon:"✧"},{id:"vintage",label:"Vintage",icon:"◍"},{id:"rose",label:"Rose",icon:"♡"},{id:"cool",label:"Frio",icon:"❄"},{id:"cinema",label:"Cinema",icon:"▣"},{id:"sunset",label:"Pôr do sol",icon:"◉"},{id:"invert",label:"Invertido",icon:"◐"},{id:"glow",label:"Brilho",icon:"✦"}] as const).map(lens=><button type="button" key={lens.id} onClick={()=>{setStoryLens(lens.id);setStoryEffect(lens.id==="none"?"none":lens.id==="warm"?"warm":lens.id==="mono"?"mono":lens.id==="glow"?"glow":lens.id==="dream"?"dream":"none");}} aria-pressed={storyLens===lens.id} style={{flex:"0 0 58px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,border:0,background:"transparent",color:"#fff",fontSize:10,opacity:storyLens===lens.id?1:.76}}><span style={{width:50,height:50,display:"grid",placeItems:"center",borderRadius:"50%",border:storyLens===lens.id?"2px solid #fff":"2px solid #ffffff40",outline:storyLens===lens.id?"2px solid #111":"none",outlineOffset:2,background:({none:"#24242b",soft:"linear-gradient(135deg,#ddd,#777)",warm:"linear-gradient(135deg,#ffd58c,#a55b2b)",mono:"linear-gradient(135deg,#fff,#111)",neon:"linear-gradient(135deg,#28e5ff,#e13bff)",blur:"linear-gradient(135deg,#9ba7c4,#353746)",aurora:"linear-gradient(135deg,#34e6bc,#744dff)",dream:"linear-gradient(135deg,#f3b7ff,#7ebaff)",vintage:"linear-gradient(135deg,#d5a66a,#61452c)",rose:"linear-gradient(135deg,#ffb0d1,#9b4f85)",cool:"linear-gradient(135deg,#a7e8ff,#4354a4)",cinema:"linear-gradient(135deg,#555,#171717)",sunset:"linear-gradient(135deg,#ffb35c,#ab397a)",invert:"linear-gradient(135deg,#000,#fff)",glow:"linear-gradient(135deg,#fff3a1,#ff75dc)"} as Record<string,string>)[lens.id],fontSize:21}}>{lens.icon}</span><span>{lens.label}</span></button>)}</div>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
<button type="button" onClick={()=>storyInputRef.current?.click()} aria-label="Abrir galeria" style={{width:54,height:54,flex:"0 0 54px",borderRadius:10,border:"2px solid #ffffff65",background:"#29292f",color:"#fff",fontSize:23}}>{storyPreview?"✓":"▧"}</button>
<button type="button" onClick={()=>{if(storyCameraActive){if(storyRecording)stopStoryRecording();else startStoryRecording();}else if(storyPreview){setNotice("Prévia pronta. Você pode compartilhar o Story.");}else startStoryCamera();}} aria-label={storyRecording?"Parar gravação":storyCameraActive?"Gravar vídeo":"Abrir câmera"} style={{width:76,height:76,flex:"0 0 76px",borderRadius:"50%",border:"5px solid #fff",background:storyRecording?"#e52b49":"#ffffff20",boxShadow:"0 0 0 2px #ffffff30",display:"grid",placeItems:"center",padding:5}}><span style={{width:storyRecording?25:56,height:storyRecording?25:56,borderRadius:storyRecording?5:"50%",background:storyRecording?"#e52b49":"#fff",display:"block"}}/></button>
<button type="button" onClick={()=>{if(!storyPreview||!storyFile){storyInputRef.current?.click();return;}const a=document.createElement("a");a.href=storyPreview;a.download=storyFile.name||("nexora-story-"+Date.now());document.body.appendChild(a);a.click();a.remove();setNotice("Mídia preparada para salvar no dispositivo.");}} aria-label="Baixar mídia" title="Baixar mídia" style={{width:54,height:54,flex:"0 0 54px",borderRadius:"50%",border:"1px solid #ffffff35",background:"#202027",color:"#fff",fontSize:22}}>↓</button></div>
{storyFile&&storyPreview&&<div style={{display:"flex",gap:8,marginTop:12,alignItems:"center"}}><input value={storyCaption} onChange={event=>setStoryCaption(event.target.value)} maxLength={180} placeholder="Escreva uma legenda..." style={{flex:1,minWidth:0,padding:"11px 13px",borderRadius:22,border:"1px solid #ffffff22",background:"#17171d",color:"#fff",outline:"none"}}/><button type="button" onClick={()=>{if(!storyFile||!storyPreview)return;const caption=[storyOverlayText.trim(),storyLocation,storyCaption.trim(),storySticker].filter(Boolean).join(" · ");const ownStory:StoryItem={name:"Licinhosz.bb",own:true,image:storyPreview,mediaType:storyFile.type.startsWith("video/")?"video":"image",caption,id:"local-"+Date.now()};setStories(current=>[current[0],ownStory,...current.slice(1).filter(item=>!item.own||!item.image)]);setActiveStoryIndex(1);setActiveStory(ownStory);stopStoryCamera();setStoryComposerOpen(false);setStoryFile(null);setStoryPreview("");setStoryCaption("");setStoryOverlayText("");setStorySticker("");setStoryLocation("");setStoryLens("none");setStoryEffect("none");setNotice("Story adicionado ao Feed nesta sessão do navegador. A publicação entre contas ainda requer armazenamento conectado.");}} disabled={!storyFile||!storyPreview} style={{padding:"11px 15px",border:0,borderRadius:22,background:!storyFile||!storyPreview?"#35353b":"linear-gradient(100deg,#50e5ff,#8e67ff 65%,#e45bd5)",color:!storyFile||!storyPreview?"#85858d":"#080916",fontWeight:800,whiteSpace:"nowrap"}}>Compartilhar</button></div>}
<div style={{textAlign:"center",fontSize:10,color:"#777783",paddingTop:8}}>Foto ou vídeo · até 50 MB · confira a prévia antes de publicar</div></div>
</div></section></div>}</>      {composerOpen && <div className="overlay" onClick={event => { if (event.target === event.currentTarget) setComposerOpen(false); }}><section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title" style={{maxHeight:"min(88dvh,760px)",overflowY:"auto"}}><header><div><small>NEXORA · CENTRAL DE CRIAÇÃO</small><h2 id="composer-title">{createMode === "hub" ? "O que vamos criar?" : createMode === "post" ? "Nova publicação" : createMode === "reel" ? "Criar Reel" : "Preparar Live"}</h2></div><button onClick={() => {setComposerOpen(false);setCreateMode("hub");}} aria-label="Fechar">×</button></header>
        {createMode === "hub" ? <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,marginTop:16}}>
          {[
            {mode:"story",icon:"◉",title:"Story",desc:"Foto ou vídeo por 24 horas"},
            {mode:"post",icon:"▧",title:"Publicação",desc:"Foto, vídeo ou texto"},
            {mode:"reel",icon:"▶",title:"Reels",desc:"Vídeos verticais"},
            {mode:"highlight",icon:"✦",title:"Destaques",desc:"Organize Stories no perfil"},
            {mode:"live",icon:"●",title:"Live",desc:"Prepare uma transmissão"},
            {mode:"note",icon:"✎",title:"Nota",desc:"Compartilhe um pensamento"}
          ].map(item => <button key={item.mode} type="button" onClick={() => {
            if(item.mode==="story"){setComposerOpen(false);setStoryComposerOpen(true);return;}
            if(item.mode==="note"){setComposerOpen(false);setNotesComposerOpen(true);return;}
            if(item.mode==="highlight"){openCreateMode("highlight");return;}
            openCreateMode(item.mode as "post"|"reel"|"live");
          }} style={{textAlign:"left",padding:14,borderRadius:16,border:"1px solid #8e78ff45",background:"linear-gradient(135deg,#15152a,#0c1221)",color:"#fff",minHeight:106,cursor:"pointer"}}>
            <span style={{display:"grid",placeItems:"center",width:35,height:35,borderRadius:12,background:"linear-gradient(135deg,#55e8ff30,#a66cff35)",color:"#8ceeff",fontSize:20,marginBottom:9}}>{item.icon}</span><strong style={{display:"block",fontSize:13}}>{item.title}</strong><small style={{display:"block",fontSize:10,color:"#9da2bd",marginTop:5,lineHeight:1.45}}>{item.desc}</small>
          </button>)}
        </div> : createMode === "live" ? <div style={{paddingTop:12}}>
          <p style={{fontSize:13,color:"#c3c5dc",lineHeight:1.6}}>Configure o título e a privacidade da sua Live. A transmissão real precisa de integração com câmera, servidor de streaming e moderação; esta tela ainda não inicia vídeo ao vivo.</p>
          <input value={createTitle} onChange={event=>setCreateTitle(event.target.value)} maxLength={80} placeholder="Título da transmissão" style={{width:"100%",padding:13,borderRadius:12,background:"#0b0c18",border:"1px solid #ffffff20",color:"#fff",margin:"10px 0"}} />
          <button type="button" onClick={()=>setNotice(createTitle.trim() ? `Configuração da Live “${createTitle.trim()}” preparada. A transmissão será habilitada com a integração de streaming.` : "Digite um título para a Live.")} style={{width:"100%",padding:13,borderRadius:12,border:0,background:"linear-gradient(90deg,#55e8ff,#a66cff)",color:"#080817",fontWeight:800}}>Preparar transmissão</button>
        </div> : createMode === "highlight" ? null : <div style={{paddingTop:12}}>
          <input ref={createInputRef} type="file" accept={createMode==="reel" ? "video/*" : "image/*,video/*"} onChange={event=>{const file=event.target.files?.[0];if(!file)return;if(createMode==="reel"&&!file.type.startsWith("video/")){setNotice("Reels precisam de um vídeo.");return;}if(!file.type.startsWith("image/")&&!file.type.startsWith("video/")){setNotice("Escolha uma imagem ou vídeo.");return;}if(file.size>50*1024*1024){setNotice("O arquivo deve ter até 50 MB.");return;}setCreateFile(file);setCreatePreview(URL.createObjectURL(file));}} style={{display:"none"}} />
          <button type="button" onClick={()=>createInputRef.current?.click()} style={{width:"100%",minHeight:150,borderRadius:15,border:"1px dashed #8e78ff88",background:"#0a0c18",color:"#dce5ff",overflow:"hidden",display:"grid",placeItems:"center"}}>
            {createPreview ? (createFile?.type.startsWith("video/") ? <video src={createPreview} muted playsInline style={{maxHeight:220,maxWidth:"100%"}} /> : <img src={createPreview} alt="Prévia da publicação" style={{maxHeight:220,maxWidth:"100%",objectFit:"contain"}} />) : <span style={{padding:20}}>＋<br/>Selecionar {createMode==="reel"?"vídeo":"foto ou vídeo"}</span>}
          </button>
          <a href="/musicas?origem=publicacao" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,marginTop:12,padding:"12px 13px",borderRadius:12,border:"1px solid #6d7dff55",background:"linear-gradient(100deg,#17203a,#1b1230)",color:"#dce5ff",textDecoration:"none",fontSize:12}}><span>♫ <strong>Explorar catálogo musical</strong><small style={{display:"block",fontSize:10,color:"#a9b1d3",marginTop:4}}>Artistas desejados · faixas só após liberação dos direitos</small></span><span aria-hidden="true">↗</span></a><textarea value={composerText} onChange={event=>setComposerText(event.target.value)} maxLength={1000} placeholder={createMode==="reel"?"Escreva a legenda do Reel...":"Escreva uma legenda ou mensagem..."} style={{marginTop:12}} />
          <footer><span>{composerText.length}/1000</span><button disabled={(!composerText.trim()&&!createPreview)||(createMode==="reel"&&!(createFile?.type.startsWith("video/")))} onClick={publish}>{createMode==="reel"?"Publicar Reel ↗":"Publicar ↗"}</button></footer>
          <p>O conteúdo fica disponível nesta sessão do navegador. Para publicar para outros usuários e manter a mídia após sair, falta integrar autenticação e armazenamento da Nexora.</p>
        </div>}
        {createMode === "highlight" ? <div style={{paddingTop:12}}><p style={{fontSize:12,color:"#bfc4dc",lineHeight:1.6}}>Dê um nome à coleção que ficará no seu perfil. Um destaque criado aqui aparecerá na área de perfil deste dispositivo.</p><input value={createTitle} onChange={event=>setCreateTitle(event.target.value)} maxLength={30} placeholder="Ex.: Viagens, Música, Momentos" style={{width:"100%",padding:13,borderRadius:12,background:"#0b0c18",border:"1px solid #ffffff20",color:"#fff",margin:"10px 0"}}/><button type="button" onClick={createProfileHighlight} style={{width:"100%",padding:13,borderRadius:12,border:0,background:"linear-gradient(90deg,#55e8ff,#a66cff)",color:"#080817",fontWeight:800}}>Criar destaque</button></div> : null}
        {createMode === "hub" ? <p style={{marginTop:14,fontSize:10,color:"#858ba9",lineHeight:1.5}}>Escolha um formato. Stories, publicações e Reels usam mídia local nesta etapa; Live exige integração de streaming.</p> : null}
      </section></div>}

      <a href="/club" aria-label="Abrir Nexora Club" title="Nexora Club" style={{position:"fixed",left:10,top:"calc(43% - 2px)",zIndex:45,width:47,height:47,display:"grid",placeItems:"center",border:"1px solid #f0cf83",borderRadius:"16px",background:"linear-gradient(145deg,#49320c,#171006 75%)",boxShadow:"0 0 20px #d6a84735,inset 0 1px #fff4cf35",color:"#f5d98c",textDecoration:"none",touchAction:"manipulation"}}><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 7 5 4 4-7 4 7 5-4-2 12H5L3 7Z"/><path d="M5 16h14M8 21h8"/></svg><span style={{position:"absolute",top:49,fontSize:9,fontWeight:900,color:"#f5d98c",letterSpacing:.6}}>CLUB</span></a>
      <LanguageWelcome />
      <PrimaryNav active={messagesOpen ? "mensagens" : "inicio"} />
      <style jsx global>{`
        .chat-input-wrap .chat-translate-toggle{display:inline-flex;align-items:center;justify-content:center;gap:3px;flex:0 0 auto;min-width:42px;max-width:84px;height:32px;padding:0 6px;border:1px solid rgba(92,207,255,.24);border-radius:12px;background:linear-gradient(135deg,rgba(40,117,255,.13),rgba(151,69,255,.15));color:#9feeff;font-size:14px;line-height:1;white-space:nowrap;cursor:pointer;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease}
        .chat-input-wrap .chat-translate-toggle .chat-translate-label{font-size:9px;font-weight:750;letter-spacing:-.15px}
        .chat-input-wrap .chat-translate-toggle i{font-style:normal;font-size:8px;font-weight:900;color:#8b91a8}
        .chat-input-wrap .chat-translate-toggle.is-active{border-color:rgba(81,231,255,.75);background:linear-gradient(110deg,rgba(31,205,255,.22),rgba(154,75,255,.25));box-shadow:0 0 12px rgba(48,197,255,.15);color:#e5fcff}
        .chat-input-wrap .chat-translate-toggle.is-active i{color:#6fffd7}
        .chat-input-wrap>button[aria-label="Emojis"]{flex:0 0 auto;padding:0 1px}
        .chat-reaction-burst{position:absolute;z-index:15;left:50%;top:34%;pointer-events:none;font-size:clamp(34px,9vw,54px);line-height:1;filter:drop-shadow(0 4px 12px rgba(96,100,255,.48));animation:nexora-chat-story-reaction .92s cubic-bezier(.18,.75,.25,1) both}
        @keyframes nexora-chat-story-reaction{0%{opacity:0;transform:translate(-50%,20px) scale(.28) rotate(-18deg)}18%{opacity:1;transform:translate(-50%,0) scale(1.28) rotate(7deg)}38%{transform:translate(-50%,-7px) scale(.94) rotate(-4deg)}68%{opacity:1;transform:translate(-50%,-33px) scale(1.08) rotate(3deg)}100%{opacity:0;transform:translate(-50%,-62px) scale(.72) rotate(0)}}
        @media(max-width:430px){.chat-composer{gap:6px;padding-inline:9px}.chat-add,.chat-send{width:35px;height:35px}.chat-input-wrap{gap:3px;padding-left:9px;padding-right:6px}.chat-input-wrap .chat-translate-toggle{gap:2px;min-width:34px;padding-inline:4px}.chat-input-wrap .chat-translate-toggle .chat-translate-label{font-size:8px}.chat-input-wrap .chat-translate-toggle i{font-size:7px}}
        @media(prefers-reduced-motion:reduce){.chat-reaction-burst{animation-duration:.01ms;animation-iteration-count:1}}
      `}</style>
    </main>
  );
}
