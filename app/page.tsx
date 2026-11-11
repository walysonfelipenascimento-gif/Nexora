"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrimaryNav from "./components/PrimaryNav";
import PulseGlobalFloat from "./components/PulseGlobalFloat";
import NotesOrbit from "./components/NotesOrbit";
import LanguageWelcome from "./components/LanguageWelcome";
import { getSavedLanguage, translate, type NexoraLanguage } from "../lib/i18n";
import { ensureOwnProfile, getSupabaseBrowserClient, uploadNexoraMedia } from "../lib/supabase";
import { isIndexedProfileMedia, resolveProfileMedia, saveProfileMedia } from "../lib/profileMedia";

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

type StoryItem = { name: string; own?: boolean; verified?: boolean; image: string; mediaType?: "image" | "video"; caption?: string; id?: string; createdAt?: number };

type ChatMessage = { id: number; text: string; mine: boolean; time: string; kind?: "text" | "audio" | "image" | "story"; storyTitle?: string; storyUrl?: string; imageUrl?: string; reactions?: string[]; replyTo?: { id: number; text: string; kind?: "text" | "audio" | "image" | "story"; mine: boolean } };
type ChatThread = { id: string; name: string; username: string; avatar: string; online?: boolean; group?: boolean; members?: number; unread?: number; channel?: "personal" | "commercial" | "order" | "request"; requestDirection?: "incoming" | "outgoing"; requestStatus?: "pending" | "accepted" | "declined"; preview: string; time: string; messages: ChatMessage[] };

const chatEmojiCatalog = "😀 😃 😄 😁 😆 😅 😂 🤣 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😋 😛 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🫣 🤭 🫢 🫡 🤫 🫠 😶 😐 😑 😬 🙄 😯 😮 😲 🥱 😴 🤤 😪 😵 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 😈 👿 💀 ☠️ 👻 👽 👾 🤖 💩 🙈 🙉 🙊 💋 💌 💘 💝 💖 💗 💓 💞 💕 💟 ❣️ 💔 ❤️ 🩷 🧡 💛 💚 💙 🩵 💜 🤎 🖤 🩶 🤍 💯 💢 💥 💫 💦 💨 💬 💭 💤 👋 🤚 🖐️ ✋ 🖖 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 👏 🙌 🫶 👐 🤲 🙏 💅 🤳 💪 🧠 👀 👁️ 👅 👄 🫦 👶 🧒 👦 👧 🧑 👨 👩 🧓 👴 👵 🙍 🙎 🙅 🙆 💁 🙋 🤦 🤷 👮 🕵️ 💂 🥷 👷 🤴 👸 🧕 🤵 👰 🤰 🤱 🎅 🤶 🦸 🦹 🧙 🧚 🧛 🧜 🧝 💆 💇 🚶 🧍 🧎 🏃 💃 🕺 👯 🧗 🤺 🏇 ⛷️ 🏂 🏌️ 🏄 🚣 🏊 🏋️ 🚴 🚵 🤸 🤼 🤽 🤾 🤹 🧘 🛀 🛌 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🦋 🐌 🐞 🐜 🕷️ 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🦈 🐊 🐅 🐆 🦓 🦍 🐘 🦛 🦏 🐪 🦒 🦘 🦬 🐃 🐄 🐎 🐖 🐑 🦙 🐐 🦌 🐕 🦮 🐈 🐓 🦃 🦜 🦢 🦩 🕊️ 🐇 🦝 🦨 🦡 🦫 🦦 🦥 🐁 🐀 🐿️ 🦔 🐉 🐲 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🪴 🍃 🍂 🍁 🍄 🐚 🌾 💐 🌷 🌹 🥀 🌺 🌸 🌼 🌻 🌞 🌝 🌛 🌜 🌚 🌕 🌑 🌙 🌎 🌍 🌏 ⭐ 🌟 ✨ ⚡ ☄️ 🔥 🌪️ 🌈 ☀️ 🌤️ ⛅ ☁️ 🌧️ ⛈️ 🌨️ ❄️ ☃️ 🌬️ 💧 💦 ☔ 🌊 🎃 🎉 🎊 🎈 🎁 🎀 🏆 🥇 🥈 🥉 ⚽ 🏀 🏈 ⚾ 🎾 🏐 🏉 🎱 🏓 🏸 🏒 🥍 🏏 🎣 🥊 🥋 🎽 🛹 🛼 🛷 ⛸️ 🎿 🚗 🚕 🚙 🚌 🏎️ 🚓 🚑 🚒 🚐 🛻 🚚 🚛 🚜 🏍️ 🛵 🚲 🛴 🚦 🚥 ⚓ ⛵ 🚤 🛳️ 🚢 ✈️ 🛫 🛬 🚁 🚀 🛸 ⌛ ⏳ ⌚ ⏰ 🕰️ 🔋 🔌 💻 🖥️ 🖨️ ⌨️ 🖱️ 📷 📸 📹 🎥 📞 ☎️ 📺 📻 🎙️ 🧭 🔭 🔬 🧪 🧬 💉 🩸 💊 🩹 🩺 🚪 🛏️ 🛋️ 🪑 🚽 🚿 🛁 🧴 🧹 🧺 🧻 🧼 🫧 🪥 🧽 🧯 🛒 ⚰️ 🪦 🗿 🪬 🪩 🧿 🕯️ 💎 🔮 📿 🧸 🪄 🎩 🎓 🧢 👑 💍 💄 👠 👢 👞 👟 🥾 🧦 🧤 🧣 🎒 👜 👛 💼 👓 🕶️ 🥽 👔 👕 👖 🧥 👗 👘 🩱 🩲 🩳 👙 👚 🧵 🪡 🧶 🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🫒 🥑 🍆 🥔 🥕 🌽 🌶️ 🫑 🥒 🥬 🥦 🧄 🧅 🥜 🌰 🍞 🥐 🥖 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥙 🧆 🥚 🍳 🥘 🍲 🥣 🥗 🍿 🍱 🍙 🍚 🍛 🍜 🍝 🍣 🍤 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍯 🍼 🥛 ☕ 🫖 🍵 🧃 🥤 🧋 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🍾 🧊 🥄 🍴 🍽️ 🏺 🚩 🏁 🏳️‍🌈 🏳️‍⚧️ 🏴‍☠️ 🇧🇷 🇺🇸 🇵🇹 🇮🇹 🇫🇷 🇪🇸 🇩🇪 🇬🇧 🇯🇵 🇰🇷 🇨🇦 🇦🇷 🇲🇽 🇦🇴 🇲🇿 🇨🇻 🇬🇼 🇺🇳 ✔️ ☑️ ⚠️ ❌ ❎ ➕ ➖ ➗ ✖️ ♾️ ‼️ ⁉️ ❓ ❔ ❕ ❗ 💲 🅰️ 🅱️ 🅾️ 🆘 🆙 🆚 🔴 🟠 🟡 🟢 🔵 🟣 ⚫ ⚪ 🟤 🔺 🔻 🔸 🔹 🔶 🔷 🟥 🟧 🟨 🟩 🟦 🟪 ⬛ ⬜ 🔈 🔉 🔊 🔔 🔕 📣 📢 🔒 🔓 🔑 🔨 🪓 ⛏️ 🛠️ 🗡️ ⚔️ 💣 🛡️ 🔧 🔩 ⚙️ 🔗 ⛓️ 🧰 🧲 🪜 📚 📖 📝 ✏️ ✂️ 📅 📈 📉 📊 📌 📍 🔍 🔎 ❤️‍🔥 ❤️‍🩹 🫨 🫥 🫤 🫎 🪽 🪿 🪼 🪻 🫚 🫛 🪇 🪈 🫗 🫏 🪾 🫟".split(" ");

const chatTranslationLanguages = [{code:"pt-BR",label:"Português (Brasil)"},{code:"en",label:"English"},{code:"es",label:"Español"},{code:"fr",label:"Français"},{code:"de",label:"Deutsch"},{code:"it",label:"Italiano"},{code:"ja",label:"日本語"},{code:"ko",label:"한국어"},{code:"zh-CN",label:"中文 (简体)"},{code:"zh-TW",label:"中文 (繁體)"},{code:"ar",label:"العربية"},{code:"hi",label:"हिन्दी"},{code:"ru",label:"Русский"},{code:"nl",label:"Nederlands"},{code:"pl",label:"Polski"},{code:"tr",label:"Türkçe"},{code:"uk",label:"Українська"},{code:"sv",label:"Svenska"},{code:"da",label:"Dansk"},{code:"no",label:"Norsk"},{code:"fi",label:"Suomi"},{code:"el",label:"Ελληνικά"},{code:"he",label:"עברית"},{code:"id",label:"Bahasa Indonesia"},{code:"th",label:"ไทย"}];

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
  useEffect(() => {
    let cancelled = false;
    const restoreLocalStories = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("nexora-local-stories-v1") || "[]");
        if (!Array.isArray(stored)) return;
        const active = stored.filter((item: StoryItem) =>
          item && typeof item.image === "string" && isIndexedProfileMedia(item.image) &&
          typeof item.createdAt === "number" && Date.now() - item.createdAt < 24 * 60 * 60 * 1000
        );
        const restored = await Promise.all(active.map(async (item: StoryItem) => ({
          ...item,
          image: await resolveProfileMedia(item.image),
        })));
        if (cancelled || restored.length === 0) return;
        setStories(current => [
          current[0],
          ...restored.filter(item => item.image),
          ...current.slice(1).filter(item => !item.own || !item.id?.startsWith("local-")),
        ]);
      } catch { /* Dados locais inválidos não impedem o carregamento do feed. */ }
    };
    void restoreLocalStories();
    return () => { cancelled = true; };
  }, []);
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
  const storyRailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!activeStory) return;
    const rail = storyRailRef.current;
    const activeBubble = rail?.querySelector<HTMLButtonElement>(".story-bubble.active");
    activeBubble?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeStory, activeStoryIndex]);

  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadRemoteStories = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      const { data, error } = await supabase
        .from("stories")
        .select("id,user_id,media_url,media_type,caption,created_at,profiles(display_name,username,avatar_url)")
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(50);
      if (cancelled || error || !data) return;
      const remoteStories: StoryItem[] = data.map((row: any) => {
        const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        return {
          id: row.id,
          name: profile?.display_name || profile?.username || "Pessoa Nexora",
          own: row.user_id === authData.user.id,
          image: row.media_url,
          mediaType: row.media_type === "video" ? "video" : "image",
          caption: row.caption || "",
        };
      });
      if (!cancelled && remoteStories.length) {
        setStories(current => [...remoteStories, ...current.filter(item => !item.id || !remoteStories.some(remote => remote.id === item.id))]);
      }
    };
    void loadRemoteStories();
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareMode = params.get("nexoraShare");
    if (!shareMode) return;
    const title = params.get("title") || "Uma novidade na Nexora";
    const description = params.get("description") || "Confira esta novidade";
    const link = params.get("link") || window.location.origin;
    const caption = [title, description, link].filter(Boolean).join("\n");
    if (shareMode === "story") {
      const params = new URLSearchParams({ section: "story", shareTitle: title, shareDescription: description, shareLink: link });
      router.push(`/creator-studio?${params.toString()}`);
    } else if (shareMode === "reel" || shareMode === "post") {
      setCreateFile(null);
      setCreatePreview("");
      setCreateMode(shareMode === "reel" ? "reel" : "post");
      setComposerText(caption.slice(0,1000));
      setComposerOpen(true);
      setNotice(shareMode === "reel" ? "Legenda do Reel preparada. Escolha seu vídeo antes de publicar." : "Texto da publicação preparado. Revise e adicione uma mídia se desejar.");
    }
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);
  }, []);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [viewingChatImage, setViewingChatImage] = useState<string | null>(null);
  const [chatSearch, setChatSearch] = useState("");
  const [chatFilter, setChatFilter] = useState<"all" | "unread" | "groups">("all");
  const [inboxSection, setInboxSection] = useState<"personal" | "commercial" | "orders" | "requests">("personal");
  const [chatDraft, setChatDraft] = useState("");
  const chatImageInputRef = useRef<HTMLInputElement>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [storySharePickerOpen, setStorySharePickerOpen] = useState(false);
  const [storyShareRecipients, setStoryShareRecipients] = useState<string[]>([]);
  const [sharedStoryViewing, setSharedStoryViewing] = useState<ChatMessage | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(initialChats);
  const [chatDetail, setChatDetail] = useState<"chat" | "media" | "profile" | "settings" | "wallpaper">("chat");
  const [callMode, setCallMode] = useState<"audio" | "video" | null>(null);
  const [callChoiceOpen, setCallChoiceOpen] = useState(false);
  const [callMicMuted, setCallMicMuted] = useState(false);
  const [callCameraOn, setCallCameraOn] = useState(true);
  const [callSpeakerOn, setCallSpeakerOn] = useState(true);
  const [chatWallpaperById, setChatWallpaperById] = useState<Record<string, number>>({});
  const [chatBubbleStyleById, setChatBubbleStyleById] = useState<Record<string, number>>({});
  const [autoTranslateChat, setAutoTranslateChat] = useState(false);
  const [chatTranslationLanguage, setChatTranslationLanguage] = useState("pt-BR");
  const [translationPanelOpen, setTranslationPanelOpen] = useState(false);
  const [reactionPickerFor, setReactionPickerFor] = useState<number | null>(null);
  const [chatReactionBurst, setChatReactionBurst] = useState<{ messageId: number; emoji: string; nonce: number } | null>(null);
  const [revealedTimestampId, setRevealedTimestampId] = useState<number | null>(null);
  const messageTouchStart = useRef<{x:number;y:number;id:number}|null>(null);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [chatStorageReady, setChatStorageReady] = useState(false);
  const [chatPulseById, setChatPulseById] = useState<Record<string, {level:number; lastInteraction:number; totalInteractions:number; activeDays:string[]}>>({});
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
  const [noteViewer, setNoteViewer] = useState<{ id: string; name: string; avatar: string; note: string; own: boolean; style: number } | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [myNote, setMyNote] = useState("");
  const [noteStyle, setNoteStyle] = useState(0);
  const notesOrbitPeople = [
    { id: "own", name: "Você", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces", note: myNote || "", own: true, online: false },
    ...initialChats.filter(chat => !chat.group).slice(0, 3).map(chat => ({ id: chat.id, name: chat.name.split(" ")[0], avatar: chat.avatar, note: ["Só vivendo 💜", "Qual a boa? 🎧", "✨ no meu mundo"][initialChats.filter(item => !item.group).findIndex(item => item.id === chat.id)] || "Na minha vibe ✨", own: false, online: Boolean(chat.online) }))
  ];

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
      setInboxSection("personal");
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
    const orderDraft = params.get("pedido") || sessionStorage.getItem("nexora-store-order-draft-v1");
    const orderStore = params.get("loja");
    const contactType = params.get("contato");
    if (action === "create") { setComposerOpen(false); router.push("/creator-studio"); }
    if (tab === "mensagens") {
      setMessagesOpen(true);
      if (orderDraft && orderStore) {
        const orderChatId = "store-order-" + orderStore.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        setChatThreads(current => current.some(thread => thread.id === orderChatId) ? current.map(thread => thread.id === orderChatId ? { ...thread, channel: "order" } : thread) : [{ id: orderChatId, name: orderStore, username: "loja", avatar: "/nexora-logo.svg", online: false, unread: 0, channel: "order", preview: "Pedido iniciado pela Nexora Loja", time: "Agora", messages: [] }, ...current]);
        setInboxSection("orders");
        setActiveChatId(orderChatId);
        setChatDraft(orderDraft);
      } else if (contactType === "loja" && orderStore) {
        const requestId = "store-contact-request-" + orderStore.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        setChatThreads(current => current.some(thread => thread.id === requestId) ? current : [{ id: requestId, name: orderStore, username: "loja", avatar: "/nexora-logo.svg", online: false, unread: 0, channel: "request", requestDirection: "outgoing", requestStatus: "pending", preview: "Solicitação comercial enviada · aguardando resposta", time: "Agora", messages: [] }, ...current]);
        setInboxSection("requests");
        setActiveChatId(null);
        setChatDraft("");
        setNotice("Solicitação de contato enviada para a loja. Ela ficará em Solicitações até ser aceita.");
      } else {
        setInboxSection("personal");
        setActiveChatId(null);
        if (orderDraft) setChatDraft(orderDraft);
      }
      sessionStorage.removeItem("nexora-store-order-draft-v1");
    }
    if (tab === "perfil") setNotice("A área de perfil está sendo preparada para conectar seus dados de conta.");
    if (tab === "explorar") setNotice("A área Explorar está sendo preparada para descoberta de criadores e publicações.");
    if (action || tab) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  useEffect(() => {
    try {
      setAutoTranslateChat(window.localStorage.getItem("nexora-chat-auto-translate-v1") === "true");
      const savedTranslationLanguage = window.localStorage.getItem("nexora-chat-translation-language-v1");
      if (savedTranslationLanguage && chatTranslationLanguages.some(language => language.code === savedTranslationLanguage)) setChatTranslationLanguage(savedTranslationLanguage);
      const savedWallpapers = window.localStorage.getItem("nexora-chat-wallpapers-v1");
      const savedThreads = window.localStorage.getItem("nexora-chat-threads-v1");
      const savedBubbleStyles = window.localStorage.getItem("nexora-chat-bubble-styles-v1");
      const savedSettings = window.localStorage.getItem("nexora-chat-settings-v1");
      const savedPulse = window.localStorage.getItem("nexora-chat-pulse-v1");
      if (savedPulse) { const parsed = JSON.parse(savedPulse) as Record<string, {level:number;lastInteraction:number;totalInteractions:number;activeDays?:string[]}>; const now = Date.now(); const safe: Record<string, {level:number;lastInteraction:number;totalInteractions:number;activeDays:string[]}> = {}; Object.entries(parsed).forEach(([id,value]) => { if (value && Number.isFinite(value.lastInteraction) && Number.isFinite(value.level)) { const inactive = now - value.lastInteraction; safe[id] = {...value, activeDays: Array.isArray(value.activeDays) ? value.activeDays.filter(day => typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day)).slice(-365) : [], level: inactive >= 72*60*60*1000 ? 0 : Math.max(0,Math.min(7,value.level))}; } }); setChatPulseById(safe); }
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
      window.localStorage.setItem("nexora-chat-translation-language-v1", chatTranslationLanguage);
      window.localStorage.setItem("nexora-chat-wallpapers-v1", JSON.stringify(chatWallpaperById));
      window.localStorage.setItem("nexora-chat-bubble-styles-v1", JSON.stringify(chatBubbleStyleById));
      window.localStorage.setItem("nexora-chat-threads-v1", JSON.stringify(chatThreads));
      window.localStorage.setItem("nexora-chat-pulse-v1", JSON.stringify(chatPulseById));
      window.localStorage.setItem("nexora-chat-settings-v1", JSON.stringify({ muted: chatMuted, readReceipts: chatReadReceipts, saveMedia: chatSaveMedia, groupOnlyAdmins }));
    } catch { setNotice("O navegador não permitiu salvar as preferências localmente."); }
  }, [chatStorageReady, autoTranslateChat, chatTranslationLanguage, chatWallpaperById, chatBubbleStyleById, chatThreads, chatMuted, chatReadReceipts, chatSaveMedia, groupOnlyAdmins, chatPulseById]);
  const activeChat = chatThreads.find(chat => chat.id === activeChatId) || null;
  const normalizedChatSearch = chatSearch.trim().toLocaleLowerCase("pt-BR");
  const filteredChats = chatThreads.filter(chat => {
    const channel = chat.channel || "personal";
    const inSection = inboxSection === "personal" ? channel === "personal" : inboxSection === "commercial" ? channel === "commercial" : inboxSection === "orders" ? channel === "order" : channel === "request";
    const matchesLegacyFilter = chatFilter === "all" || (chatFilter === "unread" ? Boolean(chat.unread) : Boolean(chat.group));
    const matchesSearch = !normalizedChatSearch || chat.name.toLocaleLowerCase("pt-BR").includes(normalizedChatSearch) || chat.username.toLocaleLowerCase("pt-BR").includes(normalizedChatSearch) || chat.preview.toLocaleLowerCase("pt-BR").includes(normalizedChatSearch) || chat.messages.some(message => message.text.toLocaleLowerCase("pt-BR").includes(normalizedChatSearch));
    return inSection && matchesLegacyFilter && matchesSearch;
  });
  function openChat(chatId: string) {
    const target = chatThreads.find(chat => chat.id === chatId);
    const channel = target?.channel || "personal";
    setInboxSection(channel === "order" ? "orders" : channel === "commercial" ? "commercial" : channel === "request" ? "requests" : "personal");
    setActiveChatId(chatId);
    setChatDetail("chat");
    setChatThreads(current => current.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat));
  }
  function resolveContactRequest(requestId: string, decision: "accept" | "decline" | "cancel") {
    const request = chatThreads.find(chat => chat.id === requestId && chat.channel === "request");
    if (!request) return;
    if (decision === "accept") {
      setChatThreads(current => current.map(chat => chat.id === requestId
        ? { ...chat, channel: "commercial", requestStatus: "accepted", requestDirection: undefined, preview: "Contato comercial aceito · comece a conversar" }
        : chat));
      setInboxSection("commercial");
      setActiveChatId(requestId);
      setChatDetail("chat");
      setNotice("Solicitação aceita. A conversa foi movida para Comercial neste dispositivo.");
      return;
    }
    setChatThreads(current => current.filter(chat => chat.id !== requestId));
    setActiveChatId(null);
    setNotice(decision === "decline" ? "Solicitação recusada neste dispositivo." : "Solicitação cancelada neste dispositivo.");
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

  function handleMessageTouchEnd(event: React.TouchEvent<HTMLElement>, messageId: number) {
    const start = messageTouchStart.current;
    if (!start || start.id !== messageId) return;
    const touch = event.changedTouches[0];
    if (!touch) { messageTouchStart.current = null; return; }
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) >= 34 && Math.abs(dx) > Math.abs(dy) * 1.25) setRevealedTimestampId(current => current === messageId ? null : messageId);
    messageTouchStart.current = null;
  }

  function sendStoryToChat(story: StoryItem) {
    if (!activeChat) return;
    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const storyTitle = `Story de ${story.name}`;
    const message: ChatMessage = {
      id: Date.now(),
      text: story.caption || "Toque para visualizar o Story compartilhado",
      mine: true,
      time,
      kind: "story",
      storyTitle,
      storyUrl: story.image,
    };
    setChatThreads(current => current.map(chat => chat.id === activeChat.id
      ? { ...chat, preview: "Você: compartilhou um Story", time, messages: [...chat.messages, message] }
      : chat));
    setStorySharePickerOpen(false);
    setNotice("Story adicionado à conversa nesta sessão.");
  }

  function sendChatImage(file: File) {
    if (!activeChat || !file.type.startsWith("image/")) return;
    if (file.size > 15 * 1024 * 1024) {
      setNotice("A imagem deve ter até 15 MB nesta etapa.");
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const message: ChatMessage = { id: Date.now(), text: "", mine: true, time, kind: "image", imageUrl, replyTo: replyingTo ? { id: replyingTo.id, text: replyingTo.text || (replyingTo.kind === "image" ? "Imagem" : replyingTo.kind === "story" ? "Story compartilhado" : "Mensagem"), kind: replyingTo.kind, mine: replyingTo.mine } : undefined };
    setChatThreads(current => current.map(chat => chat.id === activeChat.id
      ? { ...chat, preview: "Você: 📷 Imagem", time, messages: [...chat.messages, message] }
      : chat));
    setReplyingTo(null);
    setNotice("Imagem adicionada à conversa nesta sessão, sem compressão pelo aplicativo.");
  }

  function sendChatMessage() {
    const text = chatDraft.trim();
    if (!text || !activeChat) return;
    const now = new Date();
    const previousPulse = chatPulseById[activeChat.id];
    const stillActive = previousPulse && now.getTime() - previousPulse.lastInteraction < 72*60*60*1000;
    const dayKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    const activeDays = Array.from(new Set([...(previousPulse?.activeDays || []), dayKey])).slice(-365);
    const nextPulse = { level: Math.min(7, (stillActive ? previousPulse.level : 0) + 1), lastInteraction: now.getTime(), totalInteractions: (previousPulse?.totalInteractions || 0) + 1, activeDays };
    setChatPulseById(current => ({...current, [activeChat.id]: nextPulse}));
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const replyTo = replyingTo ? { id: replyingTo.id, text: replyingTo.text || (replyingTo.kind === "image" ? "Imagem" : replyingTo.kind === "story" ? "Story compartilhado" : "Mensagem"), kind: replyingTo.kind, mine: replyingTo.mine } : undefined;
    setChatThreads(current => current.map(chat => chat.id === activeChat.id ? { ...chat, preview: "Você: " + text, time, messages: [...chat.messages, { id: Date.now(), text, mine: true, time, replyTo }] } : chat));
    setChatDraft("");
    setReplyingTo(null);
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
    setStoryShareRecipients([]);
    setStorySharePickerOpen(true);
  }

  function confirmShareStory() {
    if (!activeStory || storyShareRecipients.length === 0) return;
    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const storyMessage: ChatMessage = {
      id: Date.now(), text: activeStory.caption || "Story de " + activeStory.name,
      mine: true, time, kind: "story", storyTitle: "Story de " + activeStory.name,
      storyUrl: activeStory.image,
    };
    setChatThreads(current => current.map(chat => storyShareRecipients.includes(chat.id)
      ? { ...chat, preview: "Você compartilhou um Story", time, messages: [...chat.messages, { ...storyMessage, id: storyMessage.id + Math.floor(Math.random()*1000) }] }
      : chat));
    setStorySharePickerOpen(false);
    setNotice("Story enviado para " + storyShareRecipients.length + " contato(s) da Nexora nesta sessão.");
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

  return () => {
      if (video.srcObject === stream) video.srcObject = null;
    };
  }, [storyCameraActive]);

  const stopStoryCamera = () => {
    if (storyRecorderTimerRef.current) { clearTimeout(storyRecorderTimerRef.current); storyRecorderTimerRef.current = null; }
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
      // A tag <video> só existe depois que o estado ativa a prévia.
      // O useEffect abaixo conecta o stream após a renderização, evitando tela preta.
      setStoryCameraActive(true);
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
    const faceCaptureFilters: Record<string,string> = { skincare:"brightness(1.08) contrast(.94) saturate(.94)", angel:"brightness(1.08) saturate(1.12)", demon:"contrast(1.18) saturate(1.2)", glam:"brightness(1.06) contrast(1.04) saturate(1.08)", vintageFace:"sepia(.12) saturate(.92)", icy:"hue-rotate(12deg) saturate(1.12)", rosy:"hue-rotate(-12deg) saturate(1.12)" };
    context.filter = `${captureFilters[storyLens] || "none"} ${faceCaptureFilters[storyFaceEffect] || "none"} brightness(${storyBrightness}%) contrast(${storyContrast}%) saturate(${storySaturation}%)`;
    if (storyFacingMode === "user") { context.translate(canvas.width,0); context.scale(-1,1); }
    context.drawImage(video,0,0,canvas.width,canvas.height);
    context.setTransform(1,0,0,1,0,0); context.filter = "none";
    const faceOverlay: Record<string,string> = { dog:"🐶", cat:"🐱", bunny:"🐰✨", horns:"😈✨", bighead:"🤪", demon:"👹", skincare:"✨🤍✨", fox:"🦊", bear:"🐻", puppy:"🐕", kitten:"🐈", angel:"😇✨", glam:"💖✨", freckles:"🌟", hearts:"💗💗", alien:"👽", crown:"👑", icy:"❄️✨", rosy:"🌸✨", vintageFace:"🎀" };
    if (faceOverlay[storyFaceEffect]) { context.font = `${Math.round(canvas.width*.15)}px sans-serif`; context.textAlign = "center"; context.fillText(faceOverlay[storyFaceEffect],canvas.width/2,canvas.height*.25); }
    if (storyLens === "dog") { context.font = `${Math.round(canvas.width*.16)}px sans-serif`; context.textAlign = "center"; context.fillText("🐶",canvas.width/2,canvas.height*.28); }
    if (storyLens === "bunny") { context.font = `${Math.round(canvas.width*.16)}px sans-serif`; context.textAlign = "center"; context.fillText("🐰",canvas.width/2,canvas.height*.22); }
    if (storyLens === "coffee") { context.font = `${Math.round(canvas.width*.12)}px sans-serif`; context.textAlign = "center"; context.fillText("☕✨",canvas.width/2,canvas.height*.28); }
    if (storySticker) { context.font = `${Math.round(canvas.width*.1)}px sans-serif`; context.textAlign = "center"; context.fillText(storySticker,canvas.width/2,canvas.height*.82); }
    if (storyOverlayText.trim()) { context.font = `bold ${Math.round(canvas.width*.06)}px sans-serif`; context.textAlign = storyTextAlign; context.lineWidth = Math.max(3,canvas.width*.006); context.strokeStyle = "#000"; context.fillStyle = storyTextColor; context.strokeText(storyOverlayText.trim(),canvas.width/2,canvas.height*.55,canvas.width*.85); context.fillText(storyOverlayText.trim(),canvas.width/2,canvas.height*.55,canvas.width*.85); }
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
        const file = new File([blob],`nexora-story-${Date.now()}.webm`,{type:"video/webm"});
        if(storyPreview.startsWith("blob:"))URL.revokeObjectURL(storyPreview);
        setStoryFile(file);setStoryPreview(URL.createObjectURL(file));storyLiveStreamRef.current?.getTracks().forEach(track=>track.stop());storyLiveStreamRef.current=null;setStoryCameraActive(false);setNotice("Vídeo gravado. Confira a prévia antes de compartilhar.");
      };
      storyRecorderRef.current = recorder; recorder.start(); setStoryRecording(true);
      if (storyRecorderTimerRef.current) clearTimeout(storyRecorderTimerRef.current);
      storyRecorderTimerRef.current = setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); setStoryRecording(false); storyRecorderTimerRef.current = null; }, storyLivePhotoMode ? 3000 : storyRecordingDuration * 1000);
    } catch { setNotice("Não foi possível iniciar a gravação neste dispositivo."); }
  };

  const stopStoryRecording = () => {
    if (storyRecorderTimerRef.current) { clearTimeout(storyRecorderTimerRef.current); storyRecorderTimerRef.current = null; }
    if(storyRecorderRef.current && storyRecorderRef.current.state !== "inactive") storyRecorderRef.current.stop();
    setStoryRecording(false);
  };

  const publishStory = async () => {
    if (!storyFile || !storyPreview) return;
    const caption = [storyOverlayText.trim(), storyLocation, storyCaption.trim(), storySticker].filter(Boolean).join(" · ").slice(0, 180);
    let fileToPublish = storyFile;
    if (storyFile.type.startsWith("image/") && storyFaceEffect !== "none") {
      try {
        const source = new Image(); source.src = storyPreview;
        await new Promise<void>((resolve,reject)=>{source.onload=()=>resolve();source.onerror=()=>reject(new Error("Imagem indisponível"));});
        const canvas=document.createElement("canvas");canvas.width=source.naturalWidth;canvas.height=source.naturalHeight;const ctx=canvas.getContext("2d");
        if(ctx){const filters:Record<string,string>={skincare:"brightness(1.08) contrast(.94) saturate(.94)",angel:"brightness(1.08) saturate(1.12)",demon:"contrast(1.18) saturate(1.2)",glam:"brightness(1.06) contrast(1.04) saturate(1.08)",vintageFace:"sepia(.12) saturate(.92)",icy:"hue-rotate(12deg) saturate(1.12)",rosy:"hue-rotate(-12deg) saturate(1.12)"};ctx.filter=filters[storyFaceEffect]||"none";ctx.drawImage(source,0,0,canvas.width,canvas.height);ctx.filter="none";const overlays:Record<string,string>={dog:"🐶",cat:"🐱",bunny:"🐰✨",horns:"😈✨",bighead:"🤪",demon:"👹",skincare:"✨🤍✨",fox:"🦊",bear:"🐻",puppy:"🐕",kitten:"🐈",angel:"😇✨",glam:"💖✨",freckles:"🌟",hearts:"💗💗",alien:"👽",crown:"👑",icy:"❄️✨",rosy:"🌸✨",vintageFace:"🎀"};if(overlays[storyFaceEffect]){ctx.font=`${Math.round(canvas.width*.15)}px sans-serif`;ctx.textAlign="center";ctx.fillText(overlays[storyFaceEffect],canvas.width/2,canvas.height*.25);}const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Exportação falhou")),"image/jpeg",.92));fileToPublish=new File([blob],`nexora-story-edited-${Date.now()}.jpg`,{type:"image/jpeg"});}
      } catch { setNotice("Não foi possível aplicar o efeito à imagem. Tente outra foto."); return; }
    }
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        const user = authData.user;
        if (user) {
          const { data: existingProfile, error: profileLookupError } = await supabase
            .from("profiles")
            .select("id,username,display_name")
            .eq("id", user.id)
            .maybeSingle();
          if (profileLookupError) throw profileLookupError;
          if (!existingProfile) {
            const suggestedUsername = "nx_" + user.id.replace(/-/g, "").slice(0, 12);
            await ensureOwnProfile(user.id, suggestedUsername, String(user.user_metadata?.display_name || "Pessoa Nexora"));
          }
          const uploaded = await uploadNexoraMedia(fileToPublish, user.id);
          const { data: savedStory, error: insertError } = await supabase
            .from("stories")
            .insert({
              user_id: user.id,
              media_url: uploaded.signedUrl,
              media_type: fileToPublish.type.startsWith("video/") ? "video" : "image",
              caption,
            })
            .select("id")
            .single();
          if (insertError) throw insertError;
          const ownStory: StoryItem = {
            id: savedStory.id,
            name: String(user.user_metadata?.display_name || existingProfile?.display_name || existingProfile?.username || "Você"),
            own: true,
            image: uploaded.signedUrl,
            mediaType: fileToPublish.type.startsWith("video/") ? "video" : "image",
            caption,
          };
          setStories(current => [ownStory, ...current.filter(item => !item.own || !item.image)]);
          setActiveStoryIndex(0);
          setActiveStory(ownStory);
          stopStoryCamera();
          setStoryComposerOpen(false);
          setStoryFile(null);
          setStoryPreview("");
          setStoryCaption("");
          setStoryOverlayText("");
          setStorySticker("");
          setStoryLocation("");
          setStoryLens("none");
          setStoryFaceEffect("none");
          setStoryEffect("none");
          setNotice("Story publicado na Nexora. Ele ficará disponível por 24 horas.");
          return;
        }
      } catch (error) {
        const detail = error instanceof Error ? error.message : "erro desconhecido";
        setNotice("Não foi possível publicar o Story na conta: " + detail);
        return;
      }
    }
    try {
      const mediaRef = await saveProfileMedia(fileToPublish);
      const mediaUrl = await resolveProfileMedia(mediaRef);
      if (!mediaUrl) throw new Error("Não foi possível recuperar a mídia salva.");
      const createdAt = Date.now();
      const localStory: StoryItem = {
        name: "Licinhosz.bb",
        own: true,
        image: mediaUrl,
        mediaType: fileToPublish.type.startsWith("video/") ? "video" : "image",
        caption,
        id: "local-" + createdAt,
        createdAt,
      };
      const existing = JSON.parse(localStorage.getItem("nexora-local-stories-v1") || "[]");
      const activeExisting = Array.isArray(existing) ? existing.filter((item: StoryItem) =>
        item && typeof item.image === "string" && isIndexedProfileMedia(item.image) &&
        typeof item.createdAt === "number" && Date.now() - item.createdAt < 24 * 60 * 60 * 1000
      ) : [];
      localStorage.setItem("nexora-local-stories-v1", JSON.stringify([{ ...localStory, image: mediaRef }, ...activeExisting].slice(0, 20)));
      setStories(current => [current[0], localStory, ...current.slice(1).filter(item => !item.own || !item.image)]);
      setActiveStoryIndex(1);
      setActiveStory(localStory);
      stopStoryCamera();
      setStoryComposerOpen(false);
      setStoryFile(null);
      setStoryPreview("");
      setStoryCaption("");
      setStoryOverlayText("");
      setStorySticker("");
      setStoryLocation("");
      setStoryLens("none");
      setStoryEffect("none");
      setNotice("Story salvo neste dispositivo por 24 horas. Ele ainda não é compartilhado entre contas.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar o Story neste dispositivo.");
    }
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
          <button className="round-action" aria-label={t("messages")} onClick={() => router.push("/mensagens")}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 3 3 10.2l7.1 2.1L12.2 20 21 3Z"/><path d="m10.1 12.3 5-5"/></svg>
          </button>
          <a className="round-action" href="/notificacoes" onClick={(event) => { event.preventDefault(); router.push("/notificacoes"); }} aria-label={t("notifications")} title={t("notifications")} style={{display:"grid",placeItems:"center",textDecoration:"none",position:"relative",zIndex:32,pointerEvents:"auto",cursor:"pointer",touchAction:"manipulation"}}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg>
          </a>
        </div>
      </header>

      <section ref={storyRailRef} className="stories-rail" aria-label={t("stories")}>
        {stories.map((story) => (
          <button className="story" key={story.name} onClick={() => { if (story.own) router.push("/creator-studio?section=story"); else { setActiveStoryIndex(stories.indexOf(story)); setActiveStory(story); } }}>
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
          {activeChat ? <><button className="messages-back" onClick={() => { setActiveChatId(null); setChatDetail("chat"); }} aria-label={t("chatBack")}>‹</button><button className="messages-person" onClick={() => setChatDetail("profile")}><img src={activeChat.avatar} alt="" /><span><strong>{activeChat.name}</strong><small className={activeChat.online ? "online" : ""}>{activeChat.group ? `${activeChat.members || 8} membros` : activeChat.online ? "Online" : "@"+activeChat.username}</small></span></button><button className="messages-head-action call-action call-choice-trigger" aria-label="Ligar" title="Ligar" onClick={() => setCallChoiceOpen(value => !value)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3.8h3.2l1.6 4.1-2.1 1.7a13.8 13.8 0 0 0 3.7 3.7l1.7-2.1 4.1 1.6V16a2 2 0 0 1-2 2A13.2 13.2 0 0 1 5 5.8a2 2 0 0 1 2-2Z"/></svg></button><button className="messages-head-action" aria-label="Mídias e detalhes" onClick={() => setChatDetail(chatDetail === "media" ? "chat" : "media")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></button><button className="messages-head-action" aria-label="Configurações da conversa" onClick={() => setChatDetail(chatDetail === "settings" ? "chat" : "settings")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 3.1-.2-.1a1.7 1.7 0 0 0-1.9.1 1.7 1.7 0 0 0-.9 1.5v.2h-3.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8-.1l-.2.1-1.8-3.1.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-.9H5v-3.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.1-1.8l-.1-.2 3.1-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 .9-1.5V4h3.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.1l.2-.1 1.8 3.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5.9h.2v3.6h-.2a1.7 1.7 0 0 0-1.5.9Z"/></svg></button></>
          : <><div className="messages-title"><button className="messages-close" onClick={() => setMessagesOpen(false)} aria-label={t("chatBack")}>‹</button><div><h1>{t("chatTitle")}</h1><p>{t("chatTagline")}</p></div></div><button className="messages-new" aria-label="Nova conversa" onClick={() => setNotice("Para iniciar conversas reais, precisamos conectar a autenticação e o backend de mensagens.")}>＋</button></>}
        </header>
        {activeChat && callChoiceOpen && <div className="nexora-call-choice-backdrop" onClick={() => setCallChoiceOpen(false)}><section className="nexora-call-choice" role="dialog" aria-modal="true" aria-label="Escolher tipo de chamada" onClick={event => event.stopPropagation()}><div className="nexora-call-choice-grabber" /><div className="nexora-call-choice-heading"><span className="nexora-call-choice-mark">N</span><div><strong>Iniciar chamada</strong><small>Como você quer conversar?</small></div><button type="button" onClick={() => setCallChoiceOpen(false)} aria-label="Fechar opções">×</button></div><button type="button" className="nexora-call-choice-option" onClick={() => { setCallChoiceOpen(false); setCallMode("audio"); setCallMicMuted(false); setCallCameraOn(false); setCallSpeakerOn(true); }}><span className="nexora-call-choice-icon audio">☎</span><span><strong>Chamada de áudio</strong><small>Conversa por voz</small></span><i>›</i></button><button type="button" className="nexora-call-choice-option" onClick={() => { setCallChoiceOpen(false); setCallMode("video"); setCallMicMuted(false); setCallCameraOn(true); setCallSpeakerOn(true); }}><span className="nexora-call-choice-icon video">▣</span><span><strong>Chamada de vídeo</strong><small>Conversa com câmera</small></span><i>›</i></button><p>As opções visuais estão prontas; chamadas entre contas ainda dependem da integração em tempo real.</p></section></div>}
        {!activeChat && <><label className="messages-search"><span>⌕</span><input value={chatSearch} onChange={event => setChatSearch(event.target.value)} placeholder={t("chatSearch")} aria-label={t("chatSearch")} />{chatSearch && <button onClick={() => setChatSearch("")} aria-label="Limpar busca">×</button>}</label><div className="messages-business-tabs" style={{display:"flex",gap:8,overflowX:"auto",padding:"8px 0",margin:"4px 0 10px"}} role="tablist" aria-label="Áreas de mensagens"><button type="button" role="tab" aria-selected={inboxSection === "personal"} className={inboxSection === "personal" ? "active" : ""} style={{whiteSpace:"nowrap",border:"1px solid "+(inboxSection === "personal"?"#4bdcff":"#ffffff20"),borderRadius:999,padding:"9px 13px",background:inboxSection === "personal"?"linear-gradient(110deg,#17445c,#30204c)":"#101725",color:inboxSection === "personal"?"#f3fbff":"#aab8d0",fontSize:12,fontWeight:inboxSection === "personal"?800:600}} onClick={() => {setInboxSection("personal");setChatFilter("all");}}>Pessoal <span>{chatThreads.filter(chat => (chat.channel || "personal") === "personal").length}</span></button><button type="button" role="tab" aria-selected={inboxSection === "commercial"} className={inboxSection === "commercial" ? "active" : ""} style={{whiteSpace:"nowrap",border:"1px solid "+(inboxSection === "commercial"?"#4bdcff":"#ffffff20"),borderRadius:999,padding:"9px 13px",background:inboxSection === "commercial"?"linear-gradient(110deg,#17445c,#30204c)":"#101725",color:inboxSection === "commercial"?"#f3fbff":"#aab8d0",fontSize:12,fontWeight:inboxSection === "commercial"?800:600}} onClick={() => {setInboxSection("commercial");setChatFilter("all");}}>Comercial <span>{chatThreads.filter(chat => chat.channel === "commercial").length}</span></button><button type="button" role="tab" aria-selected={inboxSection === "orders"} className={inboxSection === "orders" ? "active" : ""} style={{whiteSpace:"nowrap",border:"1px solid "+(inboxSection === "orders"?"#4bdcff":"#ffffff20"),borderRadius:999,padding:"9px 13px",background:inboxSection === "orders"?"linear-gradient(110deg,#17445c,#30204c)":"#101725",color:inboxSection === "orders"?"#f3fbff":"#aab8d0",fontSize:12,fontWeight:inboxSection === "orders"?800:600}} onClick={() => {setInboxSection("orders");setChatFilter("all");}}>Pedidos <span>{chatThreads.filter(chat => chat.channel === "order").length}</span></button><button type="button" role="tab" aria-selected={inboxSection === "requests"} className={inboxSection === "requests" ? "active" : ""} style={{whiteSpace:"nowrap",border:"1px solid "+(inboxSection === "requests"?"#4bdcff":"#ffffff20"),borderRadius:999,padding:"9px 13px",background:inboxSection === "requests"?"linear-gradient(110deg,#17445c,#30204c)":"#101725",color:inboxSection === "requests"?"#f3fbff":"#aab8d0",fontSize:12,fontWeight:inboxSection === "requests"?800:600}} onClick={() => {setInboxSection("requests");setChatFilter("all");}}>Solicitações <span>{chatThreads.filter(chat => chat.channel === "request").length}</span></button></div><div className="messages-filter-tabs" role="tablist" aria-label="Filtros de conversas"><button type="button" role="tab" aria-selected={chatFilter === "all"} className={chatFilter === "all" ? "active" : ""} onClick={() => setChatFilter("all")}>Todas</button><button type="button" role="tab" aria-selected={chatFilter === "unread"} className={chatFilter === "unread" ? "active" : ""} onClick={() => setChatFilter("unread")}>Não lidas <span>{chatThreads.filter(chat => Boolean(chat.unread) && (inboxSection === "personal" ? (chat.channel || "personal") === "personal" : inboxSection === "commercial" ? chat.channel === "commercial" : inboxSection === "orders" ? chat.channel === "order" : chat.channel === "request")).length}</span></button><button type="button" role="tab" aria-selected={chatFilter === "groups"} className={chatFilter === "groups" ? "active" : ""} onClick={() => setChatFilter("groups")}>Grupos</button></div><div className="messages-notes-head"><strong>{t("chatNotes")}</strong><span>{t("chatNotesPrompt")}</span></div><NotesOrbit
          people={notesOrbitPeople}
          ownLabel={t("chatMyNote")}
          emptyOwnNoteLabel={t("chatNotesPrompt")}
          onOpenNote={(person, index) => setNoteViewer({
            id: person.id,
            name: person.name,
            avatar: person.avatar,
            note: person.note,
            own: Boolean(person.own),
            style: person.own ? noteStyle : (index + 1) % 4
          })}
          onOpenProfile={(person) => {
            if (person.own) setNotesComposerOpen(true);
            else openChat(person.id);
          }}
        />{noteViewer && <div className="notes-viewer-backdrop" role="dialog" aria-modal="true" aria-label={`Nota de ${noteViewer.name}`} onClick={() => setNoteViewer(null)}>
          <section className="notes-viewer-card" onClick={event => event.stopPropagation()}>
            <button type="button" className="notes-viewer-close" onClick={() => setNoteViewer(null)} aria-label="Fechar nota">×</button>
            <div className={`notes-viewer-note note-style-${noteViewer.style}`}>{noteViewer.note || (noteViewer.own ? "Sua nota ainda está vazia. Compartilhe uma ideia com seus contatos." : "Esta nota ainda não tem texto.")}</div>
            <div className="notes-viewer-author"><img src={noteViewer.avatar} alt="" /><span><strong>{noteViewer.name}</strong><small>Nota Nexora</small></span></div>
            {noteViewer.own && <button type="button" className="notes-viewer-edit" onClick={() => { setNoteViewer(null); setNotesComposerOpen(true); }}>Criar ou editar nota</button>}
          </section>
        </div>}{inboxSection==="personal" && !chatSearch && <button type="button" onClick={()=>router.push("/nexi")} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"13px 14px",margin:"2px 0 12px",borderRadius:17,border:"1px solid #58dfff66",background:"linear-gradient(115deg,rgba(24,86,116,.34),rgba(83,42,130,.3) 72%,rgba(19,23,43,.94))",color:"#f5f7ff",textAlign:"left",cursor:"pointer",boxShadow:"0 8px 26px rgba(36,171,226,.09),inset 0 1px rgba(255,255,255,.08)"}}><span style={{width:46,height:46,flexShrink:0,display:"grid",placeItems:"center",borderRadius:15,border:"1px solid #63dfff77",background:"linear-gradient(145deg,#164b69,#32215b)",color:"#a8f4ff",fontSize:25}}>✦</span><span style={{flex:1,minWidth:0}}><strong style={{display:"block",fontSize:14}}>Nexi IA <span style={{fontSize:9,color:"#8deaff",fontWeight:800,letterSpacing:".08em"}}>ASSISTENTE</span></strong><small style={{display:"block",fontSize:11,color:"#b7c5dc",marginTop:4}}>Sua conversa com a inteligência da Nexora</small></span><span style={{color:"#91eaff",fontSize:20}}>↗</span></button>}
        <div className="messages-list-heading"><strong>{t("chatConversations")}</strong><div className="messages-heading-actions"><button className="create-channel-trigger" onClick={() => setChannelModalOpen(true)}><span aria-hidden="true">▤</span><span>{t("chatCreateChannel")}</span><small>{t("chatOfficial")}</small></button><button onClick={() => setNotice("Os pedidos de mensagem serão habilitados com as contas reais.")}>{t("chatRequests")}</button></div></div><div className="messages-list">{filteredChats.map(chat => chat.channel === "request" ? <div className="message-row" key={chat.id} style={{display:"flex",alignItems:"center",gap:10}}><span className="message-avatar"><img src={chat.avatar} alt="" /></span><span className="message-row-copy" style={{flex:1,minWidth:0}}><strong>{chat.name}<small className="group-tag">COMERCIAL</small></strong><span>{chat.preview}</span></span><span className="message-row-meta" style={{alignItems:"flex-end",gap:7}}><time>{chat.time}</time>{chat.requestDirection === "incoming" ? <span style={{display:"flex",gap:5}}><button type="button" onClick={() => resolveContactRequest(chat.id,"accept")} style={{border:"1px solid #51d9b477",borderRadius:8,padding:"6px 9px",background:"linear-gradient(110deg,#145b55,#183c50)",color:"#cffff2",fontSize:10,fontWeight:800}}>Aceitar</button><button type="button" onClick={() => resolveContactRequest(chat.id,"decline")} style={{border:"1px solid #ffffff22",borderRadius:8,padding:"6px 9px",background:"#171827",color:"#c9cbe0",fontSize:10}}>Recusar</button></span> : <button type="button" onClick={() => resolveContactRequest(chat.id,"cancel")} style={{border:"1px solid #ffffff22",borderRadius:8,padding:"5px 8px",background:"#171827",color:"#c9cbe0",fontSize:10}}>Cancelar</button>}</span></div> : <button className={`message-row ${chat.id === activeChatId ? "is-selected" : ""} ${chat.unread ? "has-unread" : ""}`} key={chat.id} onClick={() => openChat(chat.id)}><span className={`message-avatar ${chat.online ? "is-online" : ""}`}><img src={chat.avatar} alt="" />{chat.online && <i />}</span><span className="message-row-copy"><strong>{chat.name}{chat.group && <small className="group-tag">GRUPO</small>}</strong><span>{chat.preview}</span></span><span className="message-row-meta"><time>{chat.time}</time>{Boolean(chat.unread) && <i>{chat.unread}</i>}</span></button>)}{filteredChats.length === 0 && <div className="messages-empty"><strong>{inboxSection === "requests" ? "Solicitações de contato" : t("chatNoResults")}</strong><small>{inboxSection === "requests" ? "Os pedidos enviados e recebidos ficam aqui, separados das conversas pessoais, comerciais e dos pedidos." : "Tente outro nome, mensagem ou filtro."}</small></div>}</div></>}
        {viewingChatImage && <div className="chat-image-viewer" role="dialog" aria-modal="true" aria-label="Imagem ampliada" onClick={() => setViewingChatImage(null)}><button type="button" className="chat-image-viewer-close" onClick={() => setViewingChatImage(null)} aria-label="Fechar imagem">×</button><img src={viewingChatImage} alt="Imagem em tamanho ampliado" onClick={event => event.stopPropagation()}/></div>}
        {activeChat && <>{chatDetail === "chat" ? <><div className="chat-thread-topline"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>{activeChat.group ? t("chatGroup") + " · " + (activeChat.members || 8) + " membros" : activeChat.channel === "order" ? "Atendimento relacionado a pedido" : activeChat.channel === "commercial" ? "Contato comercial da loja" : t("chatPrivateDemo")}</span></div>
          <div className="chat-canvas" key={activeChat.id}>
          <div className="chat-day-divider"><span>Conversa privada</span></div>
          <div className="chat-messages" aria-label="Mensagens da conversa" style={{backgroundImage:"radial-gradient(ellipse at 12% 18%, rgba(20,95,180,.15), transparent 38%), radial-gradient(ellipse at 88% 70%, rgba(104,43,205,.13), transparent 38%)",backgroundColor:"#070b16",backgroundSize:"cover",backgroundPosition:"center"}}>
            {activeChat.messages.map(message => <article className={`chat-message-line ${message.mine ? "mine" : "theirs"} ${revealedTimestampId === message.id ? "time-revealed" : ""}`} key={message.id} onTouchStart={event => {const touch=event.touches[0];messageTouchStart.current={x:touch.clientX,y:touch.clientY,id:message.id};}} onTouchEnd={event => handleMessageTouchEnd(event,message.id)}>
              {!message.mine && activeChat.group && <span className="chat-sender">{message.id % 2 ? "Lucas" : "Fernanda"}</span>}
              <div className={`chat-bubble chat-bubble-style-${chatBubbleStyleById[activeChat.id] ?? 0} ${message.kind === "image" ? "chat-image-bubble" : ""}`}>
                {message.replyTo && <div style={{margin:"0 0 8px",padding:"7px 10px",borderLeft:"3px solid #9b70ff",borderRadius:"8px",background:"rgba(125,105,255,.13)",fontSize:12,color:"#ded7ff",maxWidth:"100%",overflowWrap:"anywhere"}}><strong style={{display:"block",fontSize:10,letterSpacing:".04em",opacity:.8,marginBottom:2}}>{message.replyTo.mine ? "Você respondeu" : "Resposta à mensagem"}</strong><span>{message.replyTo.text}</span></div>}
                {message.kind === "image" ? <div className="chat-image-content">{message.imageUrl ? <button type="button" className="chat-image-open" onClick={() => setViewingChatImage(message.imageUrl!)} aria-label="Abrir imagem em tamanho ampliado"><img src={message.imageUrl} alt="Imagem enviada na conversa" loading="lazy"/></button> : <div className="chat-city-image" role="img" aria-label="Imagem de demonstração compartilhada na conversa"></div>}{message.text && <p className="chat-image-caption">{message.text}</p>}</div> : message.kind === "story" ? <button type="button" onClick={() => { if (message.storyUrl) setSharedStoryViewing(message); }} style={{display:"block",width:"min(240px,68vw)",textAlign:"left",border:"1px solid rgba(130,110,255,.45)",borderRadius:16,padding:12,background:"linear-gradient(135deg,rgba(28,35,70,.96),rgba(70,25,88,.92))",color:"white",cursor:message.storyUrl?"pointer":"default"}}><span style={{display:"block",fontSize:11,fontWeight:800,letterSpacing:".08em",color:"#c5b8ff",marginBottom:7}}>◉ STORY NEXORA</span>{message.storyUrl && <img src={message.storyUrl} alt="Prévia do Story compartilhado" style={{display:"block",width:"100%",height:190,objectFit:"cover",borderRadius:10,marginBottom:9}}/>}<span style={{display:"block",fontWeight:700,fontSize:14}}>{message.storyTitle || "Story compartilhado"}</span><span style={{display:"block",fontSize:12,opacity:.8,marginTop:6}}>{message.text || "Toque para visualizar"}</span></button> : <p className="chat-message-text">{message.text}</p>}
                <div className="chat-message-meta"><time className="chat-message-time">{message.time}</time><span className="chat-message-status">{message.mine ? "✓ Enviado" : ""}</span></div>
              </div>
              {chatReactionBurst?.messageId === message.id && <span key={chatReactionBurst.nonce} className="chat-reaction-burst" aria-hidden="true">{chatReactionBurst.emoji}</span>}
              <div className="chat-message-actions">
                <button type="button" className="chat-reaction-trigger" onClick={() => {setReplyingTo(message);setChatDraft("");setReactionPickerFor(null);setNotice("Respondendo à mensagem selecionada.");}} aria-label="Responder à mensagem" title="Responder"><span aria-hidden="true">↩</span></button>
                <button type="button" className="chat-reaction-trigger" onClick={() => {setReactionPickerFor(reactionPickerFor === message.id ? null : message.id);setEmojiSearch("");}} aria-label="Reagir à mensagem" title="Adicionar reação"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg><span>＋</span></button>
                {(message.reactions || []).length > 0 && <div className="chat-reaction-list">{message.reactions!.map(emoji => <button type="button" key={emoji} onClick={() => toggleMessageReaction(message.id,emoji)} aria-label={`Remover reação ${emoji}`}>{emoji}</button>)}</div>}
                {reactionPickerFor === message.id && <div className="chat-reaction-picker"><input value={emojiSearch} onChange={event => setEmojiSearch(event.target.value)} placeholder="Buscar emoji…" aria-label="Buscar emoji para reação"/><div className="chat-reaction-emoji-grid">{chatEmojiCatalog.filter(emoji => !emojiSearch || emoji.toLowerCase().includes(emojiSearch.toLowerCase())).map((emoji,index) => <button type="button" key={`${emoji}-${index}`} onClick={() => toggleMessageReaction(message.id,emoji)} aria-label={`Reagir com ${emoji}`}>{emoji}</button>)}</div></div>}
              </div>
            </article>)}
            <div className="chat-read-receipt"><span className="read-receipt-dot"></span>{chatReadReceipts ? "Confirmações de leitura ativadas neste dispositivo" : "Confirmações de leitura desativadas nas preferências"}</div>
          </div>
        </div>
        <form className="chat-composer" onSubmit={event => {event.preventDefault();sendChatMessage();}}>
          
          {replyingTo && <div style={{display:"flex",alignItems:"center",gap:10,margin:"0 0 8px",padding:"9px 12px",borderRadius:12,border:"1px solid rgba(145,111,255,.35)",background:"linear-gradient(100deg,rgba(42,35,82,.92),rgba(16,27,54,.92))"}}><span style={{color:"#bda6ff",fontSize:18}}>↩</span><span style={{flex:1,minWidth:0,color:"#f3efff",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}><strong style={{display:"block",fontSize:10,color:"#bda6ff",marginBottom:2}}>Respondendo a {replyingTo.mine ? "você" : activeChat.group ? "uma mensagem do grupo" : activeChat.name}</strong>{replyingTo.text || (replyingTo.kind === "image" ? "Imagem" : replyingTo.kind === "story" ? "Story compartilhado" : "Mensagem")}</span><button type="button" onClick={() => setReplyingTo(null)} aria-label="Cancelar resposta" title="Cancelar resposta" style={{border:0,background:"transparent",color:"#fff",fontSize:20,cursor:"pointer",padding:"2px 5px"}}>×</button></div>}
          <div className="chat-input-wrap"><input ref={chatImageInputRef} type="file" accept="image/*" onChange={event => {const file = event.currentTarget.files?.[0]; if (file) sendChatImage(file); event.currentTarget.value = "";}} style={{display:"none"}}/><button type="button" className="chat-attach-image" onClick={() => chatImageInputRef.current?.click()} aria-label="Enviar imagem" title="Enviar imagem"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg></button><input value={chatDraft} onChange={event => {setChatDraft(event.target.value);setMentionOpen(event.target.value.includes("@"));}} placeholder={replyingTo ? "Escreva sua resposta..." : t("chatTypeMessage")} aria-label={t("chatTypeMessage")} maxLength={2000}/>
            <button type="button" className={`chat-translate-toggle ${autoTranslateChat ? "is-active" : ""} ${translationPanelOpen ? "is-open" : ""}`} aria-expanded={translationPanelOpen} aria-pressed={autoTranslateChat} onClick={() => setTranslationPanelOpen(value => !value)} title="Configurar tradução" aria-label="Abrir configurações de tradução"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h12M10 3v2c0 5-3 8-6 10M6 9c1 2 3 4 5 5M14 12l4-8 4 8M15.5 9h5"/></svg><span className="chat-translate-label">Traduzir</span><i>{autoTranslateChat ? "ON" : "›"}</i></button>
            <button type="button" onClick={() => setChatEmojiOpen(!chatEmojiOpen)} aria-label="Emojis"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg></button></div>
          <button type="submit" className="chat-send" disabled={!chatDraft.trim()} aria-label={t("chatSend")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button>
          {mentionOpen && <div style={{position:"absolute",bottom:"calc(100% + 8px)",left:10,right:10,padding:8,borderRadius:12,background:"#191927",border:"1px solid #8e67ff55",zIndex:20}}><button type="button" onClick={()=>{setChatDraft(value=>value.replace(/@[^ ]*$/,"@" + activeChat.username + " "));setMentionOpen(false);}} style={{width:"100%",textAlign:"left",padding:9,border:0,borderRadius:8,background:"#25243a",color:"#e9e7ff"}}>@{activeChat.username} · {activeChat.name}</button></div>}
          {chatEmojiOpen && <div role="group" aria-label="Seletor de emojis" className="chat-emoji-tray chat-emoji-tray-full"><input value={emojiSearch} onChange={event => setEmojiSearch(event.target.value)} placeholder="Buscar emoji…" aria-label="Buscar emoji"/><div>{chatEmojiCatalog.filter(emoji => !emojiSearch || emoji.toLowerCase().includes(emojiSearch.toLowerCase())).map((emoji,index) => <button type="button" key={`${emoji}-${index}`} aria-label={`Inserir emoji ${emoji}`} onClick={() => setChatDraft(value => value+emoji)}>{emoji}</button>)}</div></div>}
          {translationPanelOpen && <div className="chat-translation-panel" role="region" aria-label="Configurações de tradução"><div className="chat-translation-panel-head"><span className="chat-translation-icon">文</span><div><strong>Tradução de mensagens</strong><small>Idioma preferido salvo neste dispositivo</small></div><button type="button" onClick={() => setTranslationPanelOpen(false)} aria-label="Fechar tradução">×</button></div><label className="chat-translation-language">Traduzir para<select value={chatTranslationLanguage} onChange={event => setChatTranslationLanguage(event.target.value)}>{chatTranslationLanguages.map(language => <option key={language.code} value={language.code}>{language.label}</option>)}</select></label><button type="button" className="chat-translation-auto" aria-pressed={autoTranslateChat} onClick={() => setAutoTranslateChat(value => !value)}><span><strong>Preferir tradução automática</strong><small>{autoTranslateChat ? "Ativada como preferência" : "Desativada"}</small></span><i className={autoTranslateChat ? "toggle on" : "toggle"} /></button><p>O idioma e a preferência já podem ser configurados. A tradução do conteúdo das mensagens será ativada quando o serviço de tradução estiver integrado.</p></div>}
        </form></> : chatDetail === "media" ? <div className="chat-info-panel chat-media-library">
          <div className="chat-settings-heading"><div><span className="chat-settings-kicker">NEXORA ✦ ARQUIVOS</span><h2>{t("chatMedia")}</h2><p>O que foi compartilhado nesta conversa.</p></div><button type="button" onClick={() => setChatDetail("chat")} aria-label="Voltar à conversa">×</button></div>
          <div className="chat-media-summary"><span>▧</span><div><strong>{activeChat.messages.filter(message => message.kind === "image" || message.kind === "story").length} itens compartilhados</strong><small>Conteúdos registrados neste dispositivo</small></div></div>
          <div className="chat-media-library-grid">{activeChat.messages.filter(message => message.kind === "image" || message.kind === "story").slice().reverse().map(message => <button type="button" key={message.id} className="chat-media-library-item" onClick={() => { if(message.kind === "story" && message.storyUrl) setSharedStoryViewing(message); else setNotice("A prévia completa desta mídia ficará disponível quando os arquivos da conversa estiverem armazenados."); }}>
            {message.kind === "story" && message.storyUrl ? <img src={message.storyUrl} alt="Story compartilhado" /> : <span className="chat-media-library-placeholder">{message.kind === "story" ? "◉" : "▧"}</span>}
            <span><strong>{message.kind === "story" ? "Story compartilhado" : "Imagem compartilhada"}</strong><small>{message.time || "Nesta conversa"}</small></span><b>›</b>
          </button>)}
          {activeChat.messages.every(message => message.kind !== "image" && message.kind !== "story") && <div className="chat-media-empty"><span>▧</span><strong>Nenhuma mídia por enquanto</strong><small>Fotos e Stories compartilhados aparecerão aqui.</small></div>}
          </div>
          <div className="chat-media-library-note">Os arquivos demonstrativos não são downloads reais. Salvamento e compartilhamento de arquivos serão habilitados com o armazenamento conectado.</div>
          <button className="chat-media-back" type="button" onClick={() => setChatDetail("chat")}>Voltar à conversa</button>
        </div> : chatDetail === "wallpaper" ? <div className="chat-settings-panel wallpaper-screen">
          <div className="chat-settings-heading"><div><span className="chat-settings-kicker">NEXORA ✦ PERSONALIZAÇÃO</span><h2>Papel de parede</h2><p>Escolha o clima da sua conversa.</p></div><button onClick={() => setChatDetail("settings")} aria-label="Voltar às configurações">‹</button></div>
          <div className="wallpaper-preview-live" style={{background:chatWallpapers[chatWallpaperById[activeChat.id] ?? 0].preview}}><div className="wallpaper-preview-bubble theirs">Oi! Como foi seu dia?</div><div className="wallpaper-preview-bubble mine">Foi ótimo 💜<small>Agora</small></div><span>PRÉ-VISUALIZAÇÃO</span></div>
          <section className="chat-settings-section"><div className="chat-settings-section-title"><strong>Escolha um fundo</strong><small>{chatWallpapers.length} estilos</small></div><p>O fundo aparece atrás das mensagens. Seus balões e textos continuam em destaque.</p><div className="wallpaper-grid">{chatWallpapers.map((wallpaper,index) => <button key={wallpaper.name} className={`wallpaper-choice ${(chatWallpaperById[activeChat.id] ?? 0) === index ? "selected" : ""}`} onClick={() => setChatWallpaperById(current => ({...current,[activeChat.id]:index}))}><span style={{background:wallpaper.preview}}>{index===18 ? "✦ 🔥 ✧" : index===19 ? "✨ 💜 🌙" : ""}</span><small>{wallpaper.name}</small>{(chatWallpaperById[activeChat.id] ?? 0) === index && <i>✓</i>}</button>)}</div></section>
          <button className="wallpaper-done-button" onClick={() => setChatDetail("chat")}>Aplicar papel de parede <span>✓</span></button>
        </div> : chatDetail === "settings" ? <div className="chat-settings-panel">
          <div className="chat-settings-heading"><div><span className="chat-settings-kicker">NEXORA ✦ CONVERSA</span><h2>{t("chatSettings")}</h2><p>Personalize esta conversa do seu jeito.</p></div><button onClick={() => setChatDetail("chat")} aria-label="Fechar configurações">✕</button></div>
          <section className="chat-settings-profile"><img src={activeChat.avatar} alt="" /><div><strong>{activeChat.name}</strong><small>{activeChat.group ? `Grupo · ${activeChat.members || 8} membros` : `@${activeChat.username}`}</small></div><button onClick={() => setChatDetail("profile")}>{t("chatProfile")} ↗</button></section>
          <div className="settings-quick-grid">
            <button type="button" onClick={() => { setChatDetail("profile"); }}><span className="settings-quick-icon aura">✦</span><strong>Farma Aura</strong><small>Ver evolução da conexão</small><b>›</b></button>
            <button type="button" onClick={() => { setTranslationPanelOpen(true); setChatDetail("chat"); }}><span className="settings-quick-icon translate">文</span><strong>Tradução</strong><small>Idioma e preferência</small><b>›</b></button>
            <button type="button" onClick={() => { setCallChoiceOpen(true); setChatDetail("chat"); }}><span className="settings-quick-icon call">⌕</span><strong>Áudio e vídeo</strong><small>Escolher tipo de chamada</small><b>›</b></button>
          </div>
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
        </div>: <div className="chat-profile-panel"><div className="chat-profile-topline"><span>PERFIL DA CONVERSA</span><button type="button" onClick={() => setChatDetail("chat")} aria-label="Voltar à conversa">×</button></div><img src={activeChat.avatar} alt="" /><h2>{activeChat.name}</h2><p>{activeChat.group ? `Grupo · ${activeChat.members || 8} membros` : `@${activeChat.username} · ${activeChat.online ? "Online" : "Nexora"}`}</p><div className="chat-profile-actions"><button onClick={() => setChatDetail("chat")}>Mensagem</button><button onClick={() => setChatDetail("media")}>Mídias</button></div>{(() => {
            const pulse = chatPulseById[activeChat.id];
            const level = pulse?.level || 0;
            const stages = ["Faísca","Brilho","Sintonia","Conexão","Constelação","Órbita","Eclipse","Lenda"];
            const stageDescriptions = ["O primeiro sinal de uma conexão.","A presença começa a ganhar brilho.","A conversa cria um ritmo próprio.","A conexão ganha mais força.","Uma presença que se destaca.","Uma conexão em plena órbita.","Uma aura intensa e especial.","O estágio máximo da Farma Aura."];
            const lastTouch = pulse?.lastInteraction ? new Date(pulse.lastInteraction).toLocaleString("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "";
            return <section className="nexora-farma-card">
              <div className="nexora-farma-head"><div><span className="nexora-farma-kicker">NEXORA ✦ CONEXÃO</span><h3>Farma Aura</h3><p>A energia desta conversa</p></div><span className="nexora-farma-level">NV. {level}/7</span></div>
              <div className="nexora-farma-core-wrap"><span className={`nexora-aura-profile-emblem nexora-aura-orbit-entry aura-stage-${level}`} aria-hidden="true"><i className="nexora-aura-orbit-ring orbit-ring-one" /><i className="nexora-aura-orbit-ring orbit-ring-two" /><span className="nexora-aura-glyph">✦</span><i className="nexora-aura-spark spark-one">✦</i><i className="nexora-aura-spark spark-two">✧</i><i className="nexora-aura-spark spark-three">·</i></span><div><strong>{stages[level]}</strong><p>{stageDescriptions[level]}</p><small>{pulse?.totalInteractions || 0} interações registradas</small></div></div>
              <div className="nexora-farma-progress-label"><span>EVOLUÇÃO DA AURA</span><b>{Math.round(level/7*100)}%</b></div><div className="nexora-farma-track"><span style={{width:`${level/7*100}%`}} /></div>
              <div className="nexora-farma-stages" aria-label="Estágios da Farma Aura">{stages.map((stage,index)=><span key={stage} className={index<=level?"reached":""} title={stage}>{index<=level?"✦":"·"}</span>)}</div>
              <div className="nexora-farma-rule"><span>◷</span><p>A aura evolui com as interações. Após <strong>72 horas sem interação</strong>, o nível retorna à Faísca. Uma nova mensagem renova o ciclo.</p></div>
              <div className="nexora-farma-foot"><span>{lastTouch ? `Última interação: ${lastTouch}` : "Aguardando a primeira interação"}</span><span>Salvo neste dispositivo</span></div>
              <a href="/pulse" className="nexora-farma-link">Conhecer o NEXORA PULSE <b>↗</b></a>
            </section>;
          })()}<div className="chat-profile-option">♧ Notificações da conversa <span>●</span></div><div className="chat-profile-option">ⓘ Informações e participantes</div><button className="chat-block-button" onClick={() => setNotice("O bloqueio de contas será ativado junto ao sistema de usuários.")}>Bloquear usuário</button></div>}</>}
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
      {channelModalOpen && <div className="notes-composer-backdrop" onClick={event => {if(event.target===event.currentTarget)setChannelModalOpen(false);}}><section className="notes-composer-card channel-create-card" role="dialog" aria-modal="true" aria-label="Criar canal Nexora"><header><div><strong><span className="channel-official-mark">✓</span> Criar canal</strong><small>Um espaço oficial para sua comunidade e seus seguidores.</small></div><button onClick={() => setChannelModalOpen(false)} aria-label="Fechar">×</button></header><div className="channel-requirement-card"><span>📣</span><div><strong>15.000 seguidores</strong><small>Requisito para criar um canal público.</small></div><b>{myFollowerCount.toLocaleString("pt-BR")} / 15K</b></div>{myFollowerCount >= 15000 ? <><input className="channel-name-input" value={channelName} onChange={event => setChannelName(event.target.value)} maxLength={40} placeholder="Nome do canal" /><button className="notes-publish" disabled={!channelName.trim()} onClick={() => {setChannelModalOpen(false);setNotice("Nome de canal preparado. A criação real será ativada quando o sistema de seguidores e canais estiver conectado.");}}>Continuar</button></> : <><div className="channel-progress"><span style={{width:`${Math.min(100,myFollowerCount/15000*100)}%`}} /></div><p className="channel-gate-copy">Você ainda precisa de {(15000-myFollowerCount).toLocaleString("pt-BR")} seguidores para desbloquear a criação de canais. Estamos deixando a experiência preparada para essa etapa.</p><button className="notes-publish" onClick={() => setChannelModalOpen(false)}>Entendi</button></>}</section></div>}
      {notesComposerOpen && <div className="notes-composer-backdrop" onClick={event => { if (event.target === event.currentTarget) setNotesComposerOpen(false); }}><section className="notes-composer-card" role="dialog" aria-modal="true" aria-label="Criar nota"><header><div><strong>Sua nota</strong><small>Uma ideia rápida, do seu jeito.</small></div><button onClick={() => setNotesComposerOpen(false)} aria-label="Fechar">×</button></header><textarea value={notesDraft} onChange={event => setNotesDraft(event.target.value)} maxLength={60} placeholder="O que você quer compartilhar?" autoFocus /><div className="notes-style-label">Escolha seu neon</div><div className="notes-style-picker">{[0,1,2,3].map(style => <button type="button" key={style} className={`note-style-swatch note-style-${style} ${noteStyle===style ? "selected" : ""}`} onClick={() => setNoteStyle(style)} aria-label={`Estilo de nota ${style+1}`}>{["Néon","Aurora","Cosmos","Pulse"][style]}</button>)}</div><button className="notes-music-button" onClick={() => { window.open("/musicas?origem=nota","_blank","noopener,noreferrer"); }}>♫ Explorar catálogo musical <small>Ver artistas</small></button><button className="notes-publish" disabled={!notesDraft.trim()} onClick={() => { setMyNote(notesDraft.trim()); try { window.localStorage.setItem("nexora-chat-note-v1", notesDraft.trim()); window.localStorage.setItem("nexora-chat-note-style-v1", String(noteStyle)); } catch { /* preferência local opcional */ } setNotesComposerOpen(false); setNotesDraft(""); setNotice("Sua nota foi salva neste dispositivo."); }}>Compartilhar nota</button></section></div>}
      <div>{storySharePickerOpen && activeStory && <div role="dialog" aria-modal="true" aria-label="Compartilhar Story com contatos Nexora" onClick={event=>{if(event.target===event.currentTarget)setStorySharePickerOpen(false);}} style={{position:"fixed",inset:0,zIndex:10001,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"#05050bd9",backdropFilter:"blur(12px)"}}>
<section style={{width:"min(520px,100%)",maxHeight:"82dvh",overflow:"hidden",borderRadius:"24px 24px 0 0",border:"1px solid #ffffff20",background:"linear-gradient(160deg,#17172a,#090b16)",color:"#fff",padding:"18px 16px calc(18px + env(safe-area-inset-bottom))"}}>
<header style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><div><strong style={{fontSize:17}}>Compartilhar Story</strong><small style={{display:"block",fontSize:11,color:"#aab0ce",marginTop:4}}>Contatos da Nexora</small></div><button type="button" onClick={()=>setStorySharePickerOpen(false)} aria-label="Fechar painel" style={{width:36,height:36,borderRadius:"50%",border:"1px solid #ffffff25",background:"#ffffff10",color:"#fff",fontSize:22}}>×</button></header>
<div style={{display:"flex",gap:10,alignItems:"center",padding:10,borderRadius:14,background:"#ffffff08",marginBottom:12}}><img src={activeStory.image} alt="Prévia do Story" style={{width:54,height:72,objectFit:"cover",borderRadius:9}}/><div><strong style={{fontSize:12}}>{activeStory.name}</strong><small style={{display:"block",fontSize:11,color:"#aeb4d2",marginTop:4}}>Story · 24 horas</small></div></div>
<div style={{overflowY:"auto",maxHeight:"42dvh",display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>{chatThreads.filter(chat=>!chat.group).map(chat=><button type="button" key={chat.id} onClick={()=>setStoryShareRecipients(current=>current.includes(chat.id)?current.filter(id=>id!==chat.id):[...current,chat.id])} style={{display:"flex",alignItems:"center",gap:9,minWidth:0,padding:10,borderRadius:14,border:storyShareRecipients.includes(chat.id)?"1px solid #54dfff":"1px solid #ffffff16",background:storyShareRecipients.includes(chat.id)?"linear-gradient(120deg,#17415a,#35204e)":"#ffffff06",color:"#fff",textAlign:"left"}}><span style={{position:"relative",flex:"0 0 38px"}}><img src={chat.avatar} alt="" style={{width:38,height:38,objectFit:"cover",borderRadius:"50%"}}/>{storyShareRecipients.includes(chat.id)&&<i style={{position:"absolute",right:-2,bottom:-2,width:16,height:16,display:"grid",placeItems:"center",borderRadius:"50%",background:"#45d9ff",color:"#07111b",fontSize:11,fontStyle:"normal",fontWeight:900}}>✓</i>}</span><span style={{fontSize:12,fontWeight:750,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{chat.name}</span></button>)}</div>
<button type="button" disabled={!storyShareRecipients.length} onClick={confirmShareStory} style={{width:"100%",marginTop:14,padding:13,border:0,borderRadius:14,background:storyShareRecipients.length?"linear-gradient(100deg,#50e5ff,#8e67ff 65%,#e45bd5)":"#252635",color:storyShareRecipients.length?"#070817":"#85879a",fontWeight:900}}>Enviar{storyShareRecipients.length?" · "+storyShareRecipients.length:""}</button>
</section></div>}</div>
      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso">×</button></div>}

      {activeStory && <div className="story-overlay" onClick={event => { if (event.target === event.currentTarget) closeStoryViewer(); }}><section className="story-viewer" role="dialog" aria-modal="true" aria-label={`Story de ${activeStory.name}`} onTouchStart={event => { const touch = event.touches[0]; storyTouchStartRef.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={event => { const start = storyTouchStartRef.current; storyTouchStartRef.current = null; if (!start || storyCommentsOpen || showStoryReactions) return; const touch = event.changedTouches[0]; const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; const target = event.target as HTMLElement; if (target.closest("button, input, textarea, form, .story-comments-sheet, .story-action-rail, .story-bottom-bubbles")) return; if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) { if (dx < 0) goNextStory(); else goPreviousStory(); } }}><div key={activeStory.id || activeStory.name} className={`story-progress ${isStoryPaused || storyCommentsOpen || showStoryReactions ? "is-paused" : ""}`}><span /></div><header><img src={activeStory.image} alt="" /><strong>{activeStory.name} <small>· agora</small></strong><button className="story-pause-button" onClick={toggleStoryPlayback} aria-label={isStoryPaused ? "Continuar Story" : "Pausar Story"} title={isStoryPaused ? "Continuar" : "Pausar"}>{isStoryPaused ? "▶" : "Ⅱ"}</button><button onClick={closeStoryViewer} aria-label="Fechar">×</button></header>{activeStory.mediaType === "video" ? <video ref={storyVideoRef} className="story-full-image" src={activeStory.image} autoPlay={!isStoryPaused && !storyCommentsOpen && !showStoryReactions} playsInline onClick={handleStoryVideoTap} onEnded={goNextStory} /> : <img className="story-full-image" src={activeStory.image.replace("w=180&h=180", "w=900&h=1500")} alt={activeStory.caption || `Story de ${activeStory.name}`} onClick={handleStoryMediaTap} />}{showStoryHeart && <div className="story-heart-burst" aria-hidden="true">❤️</div>}{storyFloatingReaction && <div key={`reaction-${storyFeedbackId}`} className="story-floating-reaction" aria-hidden="true">{storyFloatingReaction}</div>}{storyQuickCommentVisible && <div key={`comment-${storyFeedbackId}`} className="story-quick-comment" aria-live="polite"><span className="story-quick-comment-avatar">L</span><span><strong>Licinhosz.bb</strong><small>{storyQuickComment}</small></span></div>}{isStoryPaused && !storyCommentsOpen && !showStoryReactions && <button className="story-resume-overlay" onClick={toggleStoryPlayback} aria-label="Continuar Story">▶</button>}{activeStory.caption && <p className="story-caption">{activeStory.caption}</p>}<button className="story-hit story-hit-prev" aria-label="Story anterior" onClick={goPreviousStory} /><button className="story-hit story-hit-next" aria-label="Próximo Story" onClick={goNextStory} /><aside className="story-action-rail" aria-label="Interações do Story"><div className="story-reaction-anchor">{showStoryReactions && <div className="story-reaction-picker" role="group" aria-label="Escolha uma reação">{["🫦","🤌","😍","🔥","🫶"].map(emoji => <button key={emoji} onClick={() => toggleStoryLike(emoji)} aria-label={`Reagir com ${emoji}`}>{emoji}</button>)}</div>}<button className={`story-action-button ${likedStories.includes(currentStoryKey()) ? "liked" : ""}`} aria-label="Curtir Story; segure para escolher emoji" onPointerDown={startReactionHold} onPointerUp={endReactionHold} onPointerLeave={endReactionHold} onContextMenu={event => { event.preventDefault(); setShowStoryReactions(true); }} onClick={event => { event.stopPropagation(); if (reactionHeldRef.current) { reactionHeldRef.current = false; return; } toggleStoryLike(); }}><span className="story-action-icon">{storyReactions[currentStoryKey()] || (likedStories.includes(currentStoryKey()) ? "❤️" : "♡")}</span></button></div><button className="story-action-button" aria-label="Comentar Story" onClick={event => { event.stopPropagation(); setStoryCommentsOpen(true); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h8M8 14h5"/></svg></span></button><button className="story-action-button" aria-label="Enviar mensagem privada para quem publicou o Story" onClick={event => { event.stopPropagation(); messageStoryUser(); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5Z"/><path d="m5 6 7 6 7-6"/></svg></span></button><button className="story-action-button" aria-label="Compartilhar Story" onClick={event => { event.stopPropagation(); shareStory(); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 3-7.5 18-3.2-7.3L3 10.5 21 3Z"/><path d="M10.3 13.7 15 9"/></svg></span></button></aside><div ref={storyRailRef} className="story-bottom-bubbles" aria-label="Navegar entre Stories">{stories.filter(item => !item.own || item.image).map(story => <button key={story.id || story.name} className={`story-bubble ${story.name === activeStory.name && story.image === activeStory.image ? "active" : ""}`} onClick={event => { event.stopPropagation(); const index = stories.indexOf(story); setActiveStoryIndex(index); setActiveStory(story); setIsStoryPaused(false); setShowStoryReactions(false); }}><span><img src={story.image} alt="" /></span><small>{story.name}</small></button>)}</div>{storyCommentsOpen && <div className="story-comments-backdrop" onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) setStoryCommentsOpen(false); }}><section className="story-comments-sheet" role="dialog" aria-modal="true" aria-label="Comentários do Story"><header><div><strong>{translate(uiLanguage, "comments")}</strong><small>Converse com respeito, do seu jeito</small></div><button onClick={() => setStoryCommentsOpen(false)} aria-label="Fechar comentários">×</button></header><div className="story-comments-list">{(storyComments[currentStoryKey()] || []).length ? (storyComments[currentStoryKey()] || []).map((comment, index) => <p key={index}><span className="story-comment-avatar">L</span><span><strong>Licinhosz.bb</strong>{comment}</span></p>) : <div className="story-comments-empty"><span>✦</span><strong>Comece a conversa</strong><small>Seja a primeira pessoa a comentar neste Story.</small></div>}</div><form onSubmit={addStoryComment}><span className="story-comment-avatar">L</span><input autoFocus value={storyCommentDraft} onChange={event => setStoryCommentDraft(event.target.value)} placeholder="Adicione um comentário..." aria-label="Adicionar comentário" maxLength={300} /><button type="submit" disabled={!storyCommentDraft.trim()}>Enviar</button></form></section></div>}</section></div>}

{composerOpen && <div className="overlay" onClick={event => { if (event.target === event.currentTarget) setComposerOpen(false); }}><section className={`composer ${createMode === "hub" ? "create-hub-shell" : ""}`} role="dialog" aria-modal="true" aria-labelledby="composer-title" style={{maxHeight:"min(88dvh,760px)",overflowY:"auto"}}><header className={createMode === "hub" ? "create-hub-header" : ""}><div><small>NEXORA · CREATIVE STUDIO</small><h2 id="composer-title">{createMode === "hub" ? "Dê vida às suas ideias" : createMode === "post" ? "Nova publicação" : createMode === "reel" ? "Criar Reel" : "Preparar Live"}</h2>{createMode === "hub" && <p>Escolha como você quer criar hoje</p>}</div><button onClick={() => {setComposerOpen(false);setCreateMode("hub");}} aria-label="Fechar">×</button></header>
        {createMode === "hub" ? <div className="create-hub-grid">
          {[
            {mode:"story",icon:"◉",title:"Story",desc:"Momentos que ficam por 24 horas",tone:"story"},
            {mode:"post",icon:"▧",title:"Publicação",desc:"Compartilhe fotos e carrosséis",tone:"post"},
            {mode:"reel",icon:"▶",title:"Reels",desc:"Crie vídeos e edite seus clipes",tone:"reel"},
            {mode:"planning",icon:"✦",title:"Planejamento",desc:"Organize ideias e rascunhos",tone:"planning"}
          ].map(item => <button key={item.mode} type="button" className={`create-hub-card create-hub-${item.tone}`} onClick={() => {
            const section = item.mode === "planning" ? "calendar" : item.mode === "reel" ? "reels" : item.mode;
            window.location.href = `/creator-studio?section=${section}`;
          }}>
            <span className="create-hub-art" aria-hidden="true"><i>{item.icon}</i><b /></span>
            <span className="create-hub-copy"><strong>{item.title}</strong><small>{item.desc}</small></span>
            <span className="create-hub-arrow" aria-hidden="true">↗</span>
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
      <LanguageWelcome />
      <PulseGlobalFloat />
      <PrimaryNav active={messagesOpen ? "mensagens" : "inicio"} />
      <style jsx global>{`
        .chat-input-wrap .chat-translate-toggle{display:inline-flex;align-items:center;justify-content:center;gap:3px;flex:0 0 auto;min-width:42px;max-width:84px;height:32px;padding:0 6px;border:1px solid rgba(92,207,255,.24);border-radius:12px;background:linear-gradient(135deg,rgba(40,117,255,.13),rgba(151,69,255,.15));color:#9feeff;font-size:14px;line-height:1;white-space:nowrap;cursor:pointer;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease}
        .chat-input-wrap .chat-translate-toggle .chat-translate-label{font-size:9px;font-weight:750;letter-spacing:-.15px}
        .chat-input-wrap .chat-translate-toggle.is-open{border-color:rgba(81,231,255,.7);box-shadow:0 0 0 2px rgba(81,231,255,.1),0 0 15px rgba(48,197,255,.18)}
        .chat-translation-panel{position:absolute;left:10px;right:10px;bottom:calc(100% + 9px);z-index:24;padding:13px;border:1px solid rgba(107,151,255,.3);border-radius:17px;background:linear-gradient(145deg,rgba(19,24,46,.98),rgba(18,12,34,.98));box-shadow:0 16px 42px rgba(0,0,0,.42),0 0 24px rgba(76,115,255,.12);backdrop-filter:blur(18px);color:#f5f6ff}
        .chat-translation-panel-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.chat-translation-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:linear-gradient(135deg,rgba(48,211,255,.2),rgba(160,83,255,.24));color:#a8f1ff;font-size:17px}.chat-translation-panel-head>div{display:grid;gap:3px;flex:1}.chat-translation-panel-head strong{font-size:12px}.chat-translation-panel-head small,.chat-translation-panel>p{font-size:10px;color:#aab3d1}.chat-translation-panel-head>button{width:28px;height:28px;border:1px solid #ffffff20;border-radius:50%;background:#ffffff0b;color:#fff;font-size:18px}.chat-translation-language{display:grid;gap:6px;font-size:10px;font-weight:750;color:#cbd4ef}.chat-translation-language select{width:100%;height:39px;padding:0 11px;border:1px solid #ffffff20;border-radius:11px;background:#0b1020;color:#f7f8ff;font-size:12px;outline:none}.chat-translation-auto{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:9px;padding:10px 0;border:0;border-top:1px solid #ffffff12;background:transparent;color:#fff;text-align:left}.chat-translation-auto span{display:grid;gap:3px}.chat-translation-auto strong{font-size:11px}.chat-translation-auto small{font-size:10px;color:#9da8c8}.chat-translation-panel>p{margin:8px 0 0;line-height:1.5}
        .chat-input-wrap .chat-translate-toggle i{font-style:normal;font-size:8px;font-weight:900;color:#8b91a8}
        .chat-input-wrap .chat-translate-toggle.is-active{border-color:rgba(81,231,255,.75);background:linear-gradient(110deg,rgba(31,205,255,.22),rgba(154,75,255,.25));box-shadow:0 0 12px rgba(48,197,255,.15);color:#e5fcff}
        .chat-input-wrap .chat-translate-toggle.is-active i{color:#6fffd7}
        .chat-input-wrap>button[aria-label="Emojis"]{flex:0 0 auto;padding:0 1px}
        .nexora-aura-hint{position:relative;display:flex;align-items:center;gap:10px;margin:8px 12px;padding:11px 12px;border:1px solid rgba(255,166,78,.42);border-radius:15px;background:linear-gradient(110deg,rgba(255,111,42,.2),rgba(152,79,255,.18),rgba(32,207,255,.1));box-shadow:0 0 22px rgba(255,112,49,.12);color:#fff;font-size:11px;line-height:1.45;animation:nexora-aura-hint-in .32s cubic-bezier(.2,.8,.2,1) both}.nexora-aura-hint>span:nth-child(2){flex:1}.nexora-aura-hint button{flex:0 0 26px;width:26px;height:26px;border:1px solid #ffffff22;border-radius:50%;background:#ffffff10;color:#fff;font-size:20px;line-height:1;cursor:pointer}.nexora-aura-hint-spark{font-size:23px;color:#ffd56a;text-shadow:0 0 12px #ff7438;animation:nexora-aura-spark .9s ease-in-out infinite alternate}.nexora-aura-flame,.nexora-aura-profile-emblem{position:relative;isolation:isolate;display:inline-grid;place-items:center;flex:0 0 46px;width:46px;height:46px;border:1px solid rgba(119,105,255,.7);border-radius:50%;background:radial-gradient(circle at 50% 48%,rgba(255,136,53,.24) 0 19%,rgba(147,75,255,.24) 42%,rgba(30,203,255,.16) 65%,rgba(7,12,34,.92) 78%);box-shadow:0 0 12px rgba(255,112,49,.28),0 0 24px rgba(125,73,255,.28),inset 0 0 14px rgba(50,209,255,.22);transform-origin:center;animation:nexora-aura-stage-pulse 1.4s ease-in-out infinite;will-change:transform,filter}.nexora-aura-flame:before,.nexora-aura-profile-emblem:before{content:"";position:absolute;inset:4px;border-radius:50%;border:1px solid rgba(57,220,255,.55);box-shadow:inset 0 0 10px rgba(61,211,255,.2),0 0 12px rgba(107,84,255,.3);animation:nexora-aura-orbit 4s linear infinite}.nexora-aura-flame:after,.nexora-aura-profile-emblem:after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1px solid rgba(192,81,255,.28);filter:blur(.25px);animation:nexora-aura-halo 2.4s ease-in-out infinite alternate;pointer-events:none}.nexora-aura-glyph{position:relative;z-index:2;font-size:25px;line-height:1;filter:drop-shadow(0 0 4px #ff8a39) drop-shadow(0 0 8px #9c58ff);animation:nexora-aura-glyph 1.1s ease-in-out infinite alternate}.nexora-aura-spark{position:absolute;z-index:3;font-style:normal;color:#b9f7ff;text-shadow:0 0 7px #22d7ff,0 0 13px #a04cff;line-height:1;pointer-events:none}.nexora-aura-spark.spark-one{top:1px;right:3px;font-size:12px;animation:nexora-aura-spark-float 1.4s ease-in-out infinite}.nexora-aura-spark.spark-two{bottom:3px;left:1px;font-size:13px;color:#ffd17b;animation:nexora-aura-spark-float 1.8s ease-in-out infinite reverse}.nexora-aura-spark.spark-three{top:7px;left:4px;font-size:21px;color:#ffad63;animation:nexora-aura-spark-float 1.2s ease-in-out infinite}.nexora-aura-profile-emblem{width:52px;height:52px;flex-basis:52px}.nexora-aura-profile-emblem .nexora-aura-glyph{font-size:29px}.aura-stage-0{animation:nexora-aura-stage-0 1.8s ease-in-out infinite}.aura-stage-1{animation:nexora-aura-stage-1 1.35s ease-in-out infinite}.aura-stage-2{animation:nexora-aura-stage-2 1.2s ease-in-out infinite}.aura-stage-3{animation:nexora-aura-stage-3 1.05s ease-in-out infinite}.aura-stage-4{animation:nexora-aura-stage-4 .9s ease-in-out infinite}.aura-stage-5{animation:nexora-aura-stage-5 .78s ease-in-out infinite}.aura-stage-6{animation:nexora-aura-stage-6 .68s ease-in-out infinite}.aura-stage-7{animation:nexora-aura-stage-7 .55s ease-in-out infinite}.nexora-aura-hint-in{animation:nexora-aura-hint-in .32s cubic-bezier(.2,.8,.2,1) both}@keyframes nexora-aura-orbit{to{transform:rotate(360deg)}}@keyframes nexora-aura-halo{from{transform:scale(.94);opacity:.45}to{transform:scale(1.12);opacity:1}}@keyframes nexora-aura-glyph{from{transform:translateY(1px) scale(.94);filter:drop-shadow(0 0 4px #ff8a39) drop-shadow(0 0 7px #9c58ff)}to{transform:translateY(-2px) scale(1.08);filter:drop-shadow(0 0 8px #ffb347) drop-shadow(0 0 12px #22d7ff)}}@keyframes nexora-aura-spark-float{0%,100%{transform:translate(0,2px) scale(.75);opacity:.6}50%{transform:translate(2px,-4px) scale(1.25);opacity:1}}@keyframes nexora-aura-hint-in{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes nexora-aura-spark{from{transform:scale(.75) rotate(-15deg);opacity:.65}to{transform:scale(1.2) rotate(18deg);opacity:1}}@keyframes nexora-aura-stage-0{0%,100%{transform:scale(.88);filter:drop-shadow(0 0 3px #ff9b4a);opacity:.85}50%{transform:scale(1.02);filter:drop-shadow(0 0 9px #9b6cff);opacity:1}}@keyframes nexora-aura-stage-1{0%,100%{transform:scale(.92) rotate(-5deg);filter:drop-shadow(0 0 5px #ff8138)}50%{transform:scale(1.13) rotate(5deg);filter:drop-shadow(0 0 12px #ffc34f)}}@keyframes nexora-aura-stage-2{0%,100%{transform:scale(.95) rotate(-7deg);filter:drop-shadow(0 0 6px #ff8138)}50%{transform:scale(1.16) rotate(7deg);filter:drop-shadow(0 0 13px #ffcf54) drop-shadow(0 0 5px #a16bff)}}@keyframes nexora-aura-stage-3{0%,100%{transform:scale(.94) rotate(-8deg);filter:drop-shadow(0 0 7px #ff7638)}50%{transform:scale(1.2) rotate(8deg);filter:drop-shadow(0 0 15px #ffc34f) drop-shadow(0 0 7px #a16bff)}}@keyframes nexora-aura-stage-4{0%,100%{transform:scale(.95) rotate(-9deg);filter:drop-shadow(0 0 8px #ff7638)}50%{transform:scale(1.24) rotate(9deg);filter:drop-shadow(0 0 17px #ffc34f) drop-shadow(0 0 8px #8c5cff)}}@keyframes nexora-aura-stage-5{0%,100%{transform:scale(.94) rotate(-10deg);filter:drop-shadow(0 0 9px #ff7638)}50%{transform:scale(1.28) rotate(10deg);filter:drop-shadow(0 0 19px #ffc34f) drop-shadow(0 0 10px #20cfff)}}@keyframes nexora-aura-stage-6{0%,100%{transform:scale(.94) rotate(-11deg);filter:drop-shadow(0 0 10px #ff7638)}50%{transform:scale(1.32) rotate(11deg);filter:drop-shadow(0 0 22px #ffc34f) drop-shadow(0 0 12px #20cfff)}}@keyframes nexora-aura-stage-7{0%,100%{transform:scale(.9) rotate(-8deg);filter:drop-shadow(0 0 12px #ff7638) drop-shadow(0 0 7px #a16bff)}50%{transform:scale(1.38) rotate(8deg);filter:drop-shadow(0 0 26px #ffc34f) drop-shadow(0 0 17px #20cfff) drop-shadow(0 0 12px #d84cff)}
        .nexora-farma-card{position:relative;overflow:hidden;margin:16px 0;padding:17px;border:1px solid rgba(116,146,255,.28);border-radius:21px;background:radial-gradient(ellipse at 12% 0%,rgba(35,203,255,.18),transparent 48%),radial-gradient(ellipse at 100% 100%,rgba(166,67,255,.2),transparent 48%),linear-gradient(145deg,#101b32,#17152d 65%,#211632);box-shadow:0 16px 36px rgba(0,0,0,.2);text-align:left}
        .nexora-farma-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.nexora-farma-kicker{font-size:9px;letter-spacing:.16em;font-weight:900;color:#82ddff}.nexora-farma-head h3{margin:5px 0 2px;font-size:19px;color:#f7f8ff}.nexora-farma-head p{margin:0;color:#aeb9d4;font-size:11px}.nexora-farma-level{padding:6px 9px;border:1px solid rgba(116,202,255,.28);border-radius:10px;background:rgba(70,169,255,.1);font-size:10px;font-weight:900;color:#a8eaff;white-space:nowrap}
        .nexora-farma-core-wrap{display:flex;align-items:center;gap:13px;margin:17px 0}.nexora-farma-core-wrap>div{min-width:0}.nexora-farma-core-wrap strong{font-size:15px;color:#fff}.nexora-farma-core-wrap p{margin:4px 0;color:#bac4dc;font-size:10px;line-height:1.45}.nexora-farma-core-wrap small{font-size:9px;color:#83dfff}
        .nexora-farma-progress-label{display:flex;justify-content:space-between;margin-bottom:7px;font-size:9px;letter-spacing:.08em;color:#aebbd7}.nexora-farma-progress-label b{color:#bceeff}.nexora-farma-track{height:7px;overflow:hidden;border-radius:9px;background:rgba(255,255,255,.09)}.nexora-farma-track span{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#2ed5ee,#687cff 55%,#d36cff);box-shadow:0 0 14px #61caff80;transition:width .35s}
        .nexora-farma-stages{display:grid;grid-template-columns:repeat(8,1fr);gap:5px;margin:9px 0 13px}.nexora-farma-stages span{display:grid;place-items:center;height:21px;border-radius:7px;background:rgba(255,255,255,.045);color:#67718c;font-size:12px}.nexora-farma-stages span.reached{background:linear-gradient(135deg,rgba(46,213,238,.2),rgba(168,94,255,.22));color:#a7eaff}
        .nexora-farma-rule{display:flex;gap:9px;padding:10px;border:1px solid rgba(137,156,211,.15);border-radius:12px;background:rgba(255,255,255,.035)}.nexora-farma-rule>span{font-size:17px;color:#92dfff}.nexora-farma-rule p{margin:0;color:#b7c2d9;font-size:9px;line-height:1.5}.nexora-farma-rule strong{color:#e6eaff}
        .nexora-farma-foot{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:10px;color:#8e9bb8;font-size:9px}.nexora-farma-link{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:11px;border-top:1px solid rgba(148,166,221,.14);color:#9ce8ff;text-decoration:none;font-size:10px;font-weight:900}
        .chat-media-library{padding:18px 14px 26px}
        .chat-media-summary{display:flex;align-items:center;gap:12px;margin:14px 0;padding:14px;border:1px solid rgba(117,155,255,.2);border-radius:17px;background:linear-gradient(120deg,rgba(41,187,255,.09),rgba(138,83,255,.1))}
        .chat-media-summary>span{display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:linear-gradient(135deg,#37d8ed35,#8c6aff45);color:#a6eaff;font-size:22px}
        .chat-media-summary div{display:grid;gap:4px}.chat-media-summary strong{font-size:12px;color:#f5f6ff}.chat-media-summary small{font-size:10px;color:#aab5d1}
        .chat-media-library-grid{display:grid;gap:8px}
        .chat-media-library-item{display:flex;align-items:center;gap:11px;width:100%;padding:9px;border:1px solid rgba(144,158,210,.14);border-radius:15px;background:rgba(255,255,255,.035);color:#f5f6ff;text-align:left}
        .chat-media-library-item>img,.chat-media-library-placeholder{width:54px;height:54px;flex:0 0 54px;object-fit:cover;border-radius:11px}
        .chat-media-library-placeholder{display:grid;place-items:center;background:linear-gradient(145deg,#1b829e,#6340a2 75%,#a34b91);font-size:22px;color:#fff}
        .chat-media-library-item>span:nth-child(2){display:grid;gap:5px;flex:1}.chat-media-library-item strong{font-size:11px}.chat-media-library-item small{font-size:9px;color:#9eabc9}.chat-media-library-item>b{font-size:19px;color:#9eb6ff}
        .chat-media-empty{display:grid;justify-items:center;gap:7px;padding:35px 15px;border:1px dashed rgba(145,160,220,.22);border-radius:17px;color:#aeb8d0;text-align:center}.chat-media-empty>span{font-size:28px;color:#8cdfff}.chat-media-empty strong{font-size:12px;color:#f3f5ff}.chat-media-empty small{font-size:10px}
        .chat-media-library-note{margin:14px 2px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.035);font-size:10px;line-height:1.5;color:#9daac8}
        .chat-media-back{width:100%;padding:12px;border:1px solid rgba(133,155,255,.25);border-radius:13px;background:linear-gradient(100deg,rgba(51,187,255,.14),rgba(134,89,255,.16));color:#eaf3ff;font-weight:800}
        .settings-quick-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0 16px}
        .settings-quick-grid>button{position:relative;display:flex;min-width:0;flex-direction:column;align-items:flex-start;gap:5px;padding:11px 9px;border:1px solid rgba(137,153,255,.2);border-radius:15px;background:linear-gradient(145deg,rgba(37,48,82,.72),rgba(15,19,39,.92));color:#f5f6ff;text-align:left;box-shadow:inset 0 1px 0 #ffffff0b}
        .settings-quick-icon{display:grid;place-items:center;width:29px;height:29px;border-radius:10px;font-size:16px;margin-bottom:2px}.settings-quick-icon.aura{color:#ffd18c;background:linear-gradient(135deg,#ff8b3b38,#a15bff35)}.settings-quick-icon.translate{color:#8ceaff;background:linear-gradient(135deg,#24d7d035,#4b8dff35)}.settings-quick-icon.call{color:#d8c0ff;background:linear-gradient(135deg,#855cff42,#d44fcf30)}
        .settings-quick-grid strong{font-size:10px;white-space:nowrap}.settings-quick-grid small{font-size:9px;line-height:1.35;color:#aeb8d2;min-height:24px}.settings-quick-grid b{position:absolute;right:8px;top:10px;color:#a9b9ff;font-size:17px}
        .chat-profile-topline{width:100%;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;color:#8f9cbd;font-size:9px;font-weight:900;letter-spacing:.14em}.chat-profile-topline button{width:30px;height:30px;border:1px solid #ffffff20;border-radius:50%;background:#ffffff0a;color:#fff;font-size:19px}
        @media(max-width:370px){.settings-quick-grid{gap:5px}.settings-quick-grid>button{padding:9px 6px}.settings-quick-grid strong{font-size:9px}.settings-quick-grid small{font-size:8px}}
        .call-choice-trigger{background:linear-gradient(135deg,rgba(46,197,255,.16),rgba(145,82,255,.2));border:1px solid rgba(112,185,255,.28);box-shadow:inset 0 1px 0 #ffffff12,0 0 14px rgba(80,125,255,.1)}
        .nexora-call-choice-backdrop{position:fixed;inset:0;z-index:10020;display:flex;align-items:flex-end;justify-content:center;padding:14px;background:rgba(2,5,15,.68);backdrop-filter:blur(9px)}
        .nexora-call-choice{width:min(460px,100%);padding:12px 16px 18px;border:1px solid rgba(133,154,255,.25);border-radius:25px;background:radial-gradient(ellipse at 0 0,rgba(46,197,255,.13),transparent 48%),radial-gradient(ellipse at 100% 0,rgba(174,73,255,.16),transparent 48%),linear-gradient(145deg,#141b31,#0b1020 70%,#130d25);box-shadow:0 24px 80px rgba(0,0,0,.55),0 0 35px rgba(89,103,255,.13);color:#f7f8ff;animation:nexora-call-sheet-in .24s cubic-bezier(.2,.8,.2,1) both}
        .nexora-call-choice-grabber{width:38px;height:4px;border-radius:9px;background:#ffffff35;margin:0 auto 15px}
        .nexora-call-choice-heading{display:flex;align-items:center;gap:11px;margin-bottom:14px}
        .nexora-call-choice-mark{display:grid;place-items:center;width:39px;height:39px;border-radius:13px;background:linear-gradient(135deg,#42dfff,#8b65ff 62%,#d64dcb);color:#07101f;font-weight:950;box-shadow:0 0 18px #6a8cff55}
        .nexora-call-choice-heading>div{display:grid;gap:3px;flex:1}.nexora-call-choice-heading strong{font-size:14px}.nexora-call-choice-heading small,.nexora-call-choice>p{font-size:10px;color:#aab4d0}
        .nexora-call-choice-heading>button{width:30px;height:30px;border:1px solid #ffffff1d;border-radius:50%;background:#ffffff0a;color:#fff;font-size:20px}
        .nexora-call-choice-option{display:flex;align-items:center;gap:12px;width:100%;padding:12px;margin:7px 0;border:1px solid rgba(133,154,255,.18);border-radius:16px;background:linear-gradient(110deg,rgba(255,255,255,.055),rgba(255,255,255,.018));color:#fff;text-align:left}
        .nexora-call-choice-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;font-size:20px}.nexora-call-choice-icon.audio{background:linear-gradient(135deg,#25d6ca35,#328dff35);color:#8ff7ed}.nexora-call-choice-icon.video{background:linear-gradient(135deg,#8b5cff40,#e34fcb35);color:#d9baff}
        .nexora-call-choice-option>span:nth-child(2){display:grid;gap:4px;flex:1}.nexora-call-choice-option strong{font-size:12px}.nexora-call-choice-option small{font-size:10px;color:#aab4d0}.nexora-call-choice-option>i{font-style:normal;font-size:22px;color:#9eafff}
        .nexora-call-choice>p{margin:12px 2px 0;line-height:1.5}
        @keyframes nexora-call-sheet-in{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
        @media(min-width:700px){.nexora-call-choice-backdrop{align-items:center}.nexora-call-choice{border-radius:25px}}
        .chat-reaction-burst{position:absolute;z-index:15;left:50%;top:34%;pointer-events:none;font-size:clamp(34px,9vw,54px);line-height:1;filter:drop-shadow(0 4px 12px rgba(96,100,255,.48));animation:nexora-chat-story-reaction .92s cubic-bezier(.18,.75,.25,1) both}
        @keyframes nexora-chat-story-reaction{0%{opacity:0;transform:translate(-50%,20px) scale(.28) rotate(-18deg)}18%{opacity:1;transform:translate(-50%,0) scale(1.28) rotate(7deg)}38%{transform:translate(-50%,-7px) scale(.94) rotate(-4deg)}68%{opacity:1;transform:translate(-50%,-33px) scale(1.08) rotate(3deg)}100%{opacity:0;transform:translate(-50%,-62px) scale(.72) rotate(0)}}
        @media(max-width:430px){.chat-composer{gap:6px;padding-inline:9px}.chat-add,.chat-send{width:35px;height:35px}.chat-input-wrap{gap:3px;padding-left:9px;padding-right:6px}.chat-input-wrap .chat-translate-toggle{gap:2px;min-width:34px;padding-inline:4px}.chat-input-wrap .chat-translate-toggle .chat-translate-label{font-size:8px}.chat-input-wrap .chat-translate-toggle i{font-size:7px}}
        @media(prefers-reduced-motion:reduce){.chat-reaction-burst,.nexora-aura-flame,.nexora-aura-profile-emblem,.nexora-aura-glyph,.nexora-aura-spark,.nexora-aura-flame:before,.nexora-aura-profile-emblem:before,.nexora-aura-flame:after,.nexora-aura-profile-emblem:after,.nexora-aura-hint-spark,.nexora-aura-hint{animation-duration:.01ms;animation-iteration-count:1}}
/* Nexora chat list + original image presentation */
.messages-list{display:flex;flex-direction:column;gap:7px;padding:8px 12px 18px}.message-row{display:flex;align-items:center;gap:12px;width:100%;min-height:76px;padding:11px 13px;border:1px solid rgba(151,166,210,.09);border-radius:17px;background:linear-gradient(115deg,rgba(20,27,48,.92),rgba(15,18,34,.88));color:#f5f6ff;text-align:left;transition:background .18s,border-color .18s,transform .18s}.message-row:active{transform:scale(.99)}.message-row.is-selected{border-color:rgba(91,151,255,.48);background:linear-gradient(110deg,rgba(27,52,91,.62),rgba(36,24,67,.7))}.message-row.has-unread .message-row-copy>strong{color:#fff}.message-row-copy{min-width:0;flex:1;display:flex;flex-direction:column;gap:6px}.message-row-copy>strong{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:750}.message-row-copy>span{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#aeb8d0;font-size:12px}.message-row-meta{display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:7px;min-width:35px}.message-row-meta time{font-size:10px;color:#8490aa}.message-row-meta i{display:grid;place-items:center;min-width:19px;height:19px;padding:0 5px;border-radius:20px;background:linear-gradient(135deg,#278dff,#8060ff);color:#fff;font-size:10px;font-style:normal;font-weight:800}.message-avatar{position:relative;flex:none;width:49px;height:49px}.message-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover}.message-avatar i{position:absolute;right:0;bottom:1px;width:12px;height:12px;border:2px solid #111629;border-radius:50%;background:#32d69a}.messages-empty{display:flex;flex-direction:column;gap:6px;align-items:center;padding:28px 16px;color:#eef1ff}.messages-empty small{color:#929db6;font-size:12px}.chat-image-bubble{width:fit-content;max-width:min(92vw,640px);padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important}.chat-image-content{display:flex;flex-direction:column;gap:7px}.chat-image-open{display:block;max-width:100%;padding:0;border:0!important;outline:0;background:transparent;line-height:0;cursor:zoom-in}.chat-image-open img{display:block;width:auto;height:auto;max-width:min(92vw,640px);max-height:none;object-fit:contain;border:0;border-radius:0;box-shadow:none}.chat-image-caption{margin:0;color:#f4f5ff;font-size:13px;line-height:1.45}.chat-image-viewer{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.96)}.chat-image-viewer img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}.chat-image-viewer-close{position:absolute;top:calc(16px + env(safe-area-inset-top));right:18px;width:42px;height:42px;border:0;border-radius:50%;background:#ffffff18;color:#fff;font-size:30px}

.chat-attach-image{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;border:0;border-radius:12px;background:linear-gradient(135deg,rgba(61,163,255,.17),rgba(151,93,255,.2));color:#a9dfff;cursor:pointer}.chat-attach-image:active{transform:scale(.94)}
      `}
</style>
    {sharedStoryViewing?.storyUrl && <div role="dialog" aria-modal="true" aria-label="Visualização do Story compartilhado" onClick={() => setSharedStoryViewing(null)} style={{position:"fixed",inset:0,zIndex:9999,background:"#050509",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <button type="button" onClick={() => setSharedStoryViewing(null)} aria-label="Fechar Story" style={{position:"absolute",top:24,right:24,zIndex:2,width:42,height:42,borderRadius:"50%",border:"1px solid #ffffff55",background:"#111827cc",color:"#fff",fontSize:26,cursor:"pointer"}}>×</button>
        <div onClick={event => event.stopPropagation()} style={{width:"min(440px,100%)",height:"min(820px,92dvh)",position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",overflow:"hidden",borderRadius:18,background:"#111"}}>
          <img src={sharedStoryViewing.storyUrl} alt={sharedStoryViewing.storyTitle || "Story compartilhado"} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
          <div style={{position:"absolute",left:12,right:12,bottom:12,display:"flex",alignItems:"center",gap:8,padding:10,borderRadius:16,background:"linear-gradient(180deg,transparent,rgba(0,0,0,.88))",color:"white"}}>
            <button type="button" aria-label="Curtir Story" onClick={()=>setSharedStoryViewing(current=>current?({...current,reactions:[...(current.reactions||[]),"❤️"]}):current)} style={{border:0,background:"#ffffff20",borderRadius:22,padding:"9px 12px",color:"#ff7ca8",fontSize:18,cursor:"pointer"}}>❤️</button>
            <form onSubmit={event=>{event.preventDefault();const message=storyQuickComment.trim();if(!message)return;setChatThreads(current=>current.map(thread=>thread.id===activeChatId?({...thread,messages:[...thread.messages,{id:Date.now(),text:message,mine:true,time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),kind:"story",storyTitle:sharedStoryViewing.storyTitle||"Story respondido",storyUrl:sharedStoryViewing.storyUrl}],preview:"Você respondeu a um Story",time:"Agora"}):thread));setStoryQuickComment("");setNotice("Resposta ao Story enviada com o Story anexado à conversa.");}} style={{display:"flex",flex:1,gap:6}}>
              <input value={storyQuickComment} onChange={event=>setStoryQuickComment(event.target.value)} placeholder="Responder ao Story..." maxLength={300} style={{flex:1,minWidth:0,padding:"10px 12px",border:"1px solid #ffffff35",borderRadius:22,background:"#101018dd",color:"#fff",outline:"none"}}/>
              <button type="submit" disabled={!storyQuickComment.trim()} style={{border:0,borderRadius:22,padding:"0 12px",background:"linear-gradient(100deg,#50e5ff,#9a67ff)",color:"#080916",fontWeight:800}}>Enviar</button>
            </form>
          </div>
        </div>
      </div>}
      </main>
  );
}
