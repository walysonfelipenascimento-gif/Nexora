"use client";

import { useState, useRef, useEffect } from "react";

type FeedPost = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  image: string;
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

const chatBubbleStyles = [
  { name: "Bob Esponja", sample: "linear-gradient(135deg,#f5c842,#e99b19)" },
  { name: "Cobra Neon", sample: "linear-gradient(135deg,#14532d,#22c55e)" },
  { name: "Nuvem", sample: "linear-gradient(135deg,#dbeafe,#8bb8e8)" },
  { name: "Quadrinhos", sample: "linear-gradient(135deg,#f97316,#ef4444)" },
  { name: "Gelatina", sample: "linear-gradient(135deg,#ec4899,#a855f7)" },
  { name: "Gota d’água", sample: "linear-gradient(135deg,#0891b2,#2563eb)" },
  { name: "Pixel", sample: "linear-gradient(135deg,#365314,#84cc16)" },
  { name: "Bala de goma", sample: "linear-gradient(135deg,#fb7185,#f472b6)" },
  { name: "Lua mágica", sample: "linear-gradient(135deg,#7c3aed,#c4b5fd)" },
  { name: "Nexora 3D", sample: "linear-gradient(135deg,#087fba,#6b38cc)" },
];

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
  const [posts, setPosts] = useState(initialPosts);
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [commentsOpen, setCommentsOpen] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, string[]>>({});
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState("");
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
  const [storyComposerOpen, setStoryComposerOpen] = useState(false);
  const [storyPreview, setStoryPreview] = useState("");
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyCaption, setStoryCaption] = useState("");
  const storyInputRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatSearch, setChatSearch] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(initialChats);
  const [chatDetail, setChatDetail] = useState<"chat" | "media" | "profile" | "settings" | "wallpaper">("chat");
  const [chatWallpaperById, setChatWallpaperById] = useState<Record<string, number>>({});
  const [chatBubbleStyleById, setChatBubbleStyleById] = useState<Record<string, number>>({});
  const [reactionPickerFor, setReactionPickerFor] = useState<number | null>(null);
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
  useEffect(() => {
    try {
      const savedWallpapers = window.localStorage.getItem("nexora-chat-wallpapers-v1");
      const savedThreads = window.localStorage.getItem("nexora-chat-threads-v1");
      const savedBubbleStyles = window.localStorage.getItem("nexora-chat-bubble-styles-v1");
      const savedSettings = window.localStorage.getItem("nexora-chat-settings-v1");
      if (savedWallpapers) {
        const parsed = JSON.parse(savedWallpapers) as Record<string, number>;
        const safe: Record<string, number> = {};
        Object.entries(parsed).forEach(([id, index]) => { if (typeof index === "number" && Number.isInteger(index) && index >= 0 && index < chatWallpapers.length) safe[id] = index; });
        setChatWallpaperById(safe);
      }
      if (savedBubbleStyles) {
        const parsed = JSON.parse(savedBubbleStyles) as Record<string, number>;
        const safe: Record<string, number> = {};
        Object.entries(parsed).forEach(([id, index]) => { if (typeof index === "number" && Number.isInteger(index) && index >= 0 && index < chatBubbleStyles.length) safe[id] = index; });
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
  useEffect(() => {
    if (!chatStorageReady) return;
    try {
      window.localStorage.setItem("nexora-chat-wallpapers-v1", JSON.stringify(chatWallpaperById));
      window.localStorage.setItem("nexora-chat-bubble-styles-v1", JSON.stringify(chatBubbleStyleById));
      window.localStorage.setItem("nexora-chat-threads-v1", JSON.stringify(chatThreads));
      window.localStorage.setItem("nexora-chat-settings-v1", JSON.stringify({ muted: chatMuted, readReceipts: chatReadReceipts, saveMedia: chatSaveMedia, groupOnlyAdmins }));
    } catch { setNotice("O navegador não permitiu salvar as preferências localmente."); }
  }, [chatStorageReady, chatWallpaperById, chatBubbleStyleById, chatThreads, chatMuted, chatReadReceipts, chatSaveMedia, groupOnlyAdmins]);
  const activeChat = chatThreads.find(chat => chat.id === activeChatId) || null;
  const filteredChats = chatThreads.filter(chat => chat.name.toLowerCase().includes(chatSearch.toLowerCase()) || chat.preview.toLowerCase().includes(chatSearch.toLowerCase()));
  function openChat(chatId: string) {
    setActiveChatId(chatId);
    setChatDetail("chat");
    setChatThreads(current => current.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat));
  }
  function toggleMessageReaction(messageId: number, emoji: string) {
    if (!activeChat) return;
    setChatThreads(current => current.map(chat => chat.id !== activeChat.id ? chat : { ...chat, messages: chat.messages.map(message => message.id !== messageId ? message : { ...message, reactions: (message.reactions || []).includes(emoji) ? (message.reactions || []).filter(item => item !== emoji) : [...(message.reactions || []), emoji] }) }));
    setReactionPickerFor(null);
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
    if (!caption) return;
    setPosts(current => [{
      id: Date.now(), name: "Licinhosz.bb", username: "licinhosz.bb",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces",
      image: "", caption, likes: 0, comments: 0, shares: 0, saved: 0
    }, ...current]);
    setComposerText("");
    setComposerOpen(false);
    setNotice("Publicação adicionada nesta demonstração visual.");
    window.setTimeout(() => setNotice(""), 2800);
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
    setStoryComments(current => ({ ...current, [key]: [...(current[key] || []), value] }));
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
    setComments(current => ({ ...current, [id]: [...(current[id] || []), value] }));
    setDrafts(current => ({ ...current, [id]: "" }));
  }

  return (
    <main className="nexora-app">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Nexora início">
          <img className="brand-symbol" src="/nexora-logo.svg" alt="" />
          <span>Nexora</span>
        </a>
        <div className="topbar-actions">
          <button className="round-action" aria-label="Mensagens" onClick={() => { setMessagesOpen(true); setActiveChatId(null); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 3 3 10.2l7.1 2.1L12.2 20 21 3Z"/><path d="m10.1 12.3 5-5"/></svg>
          </button>
          <button className="round-action" aria-label="Favoritos" onClick={() => setNotice(saved.length ? `Você salvou ${saved.length} publicação(ões) nesta sessão.` : "Suas publicações salvas aparecerão aqui.")}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg>
          </button>
        </div>
      </header>

      <section className="stories-rail" aria-label="Stories">
        {stories.map((story) => (
          <button className="story" key={story.name} onClick={() => { if (story.own) setStoryComposerOpen(true); else { setActiveStoryIndex(stories.indexOf(story)); setActiveStory(story); } }}>
            <span className={`story-ring ${story.own ? "story-own" : ""}`}>
              {story.own ? <span className="story-plus">＋</span> : <img src={story.image} alt="" />}
            </span>
            <span className="story-name">{story.name}{story.verified && <Verified />}</span>
          </button>
        ))}
      </section>

      <section className="feed" aria-label="Feed social">
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            <header className="post-header">
              <img className="avatar" src={post.avatar} alt="" />
              <div className="post-author">
                <strong>{post.name} {post.verified && <Verified />}</strong>
                <span>@{post.username}</span>
              </div>
              <button className="more-button" aria-label="Mais opções" onClick={() => setNotice("Mais opções de publicação serão adicionadas.")}>⋮</button>
            </header>
            {post.image ? <img className="post-image" src={post.image} alt={`Publicação de ${post.name}`} /> : <div className="text-post-visual"><span>NEXORA ✦</span><p>{post.caption}</p></div>}
            <div className="post-bottom">
              <div className="post-actions">
                <button className={`post-action ${liked.includes(post.id) ? "is-liked" : ""}`} aria-label="Curtir" onClick={() => setLiked(current => current.includes(post.id) ? current.filter(id => id !== post.id) : [...current, post.id])}>
                  <svg viewBox="0 0 24 24"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg><span>{(post.likes + (liked.includes(post.id) ? 1 : 0)).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 })}</span>
                </button>
                <button className="post-action" aria-label="Comentários" onClick={() => setCommentsOpen(commentsOpen === post.id ? null : post.id)}>
                  <svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.2-.6L4 20l1.4-4A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg><span>{(post.comments + (comments[post.id]?.length || 0)).toLocaleString("en-US")}</span>
                </button>
                <button className="post-action" aria-label="Compartilhar" onClick={() => { if (navigator.share) void navigator.share({ title: `Nexora · @${post.username}`, text: post.caption }).catch(() => undefined); else { void navigator.clipboard?.writeText(post.caption); setNotice("Legenda copiada para compartilhar."); } }}>
                  <svg viewBox="0 0 24 24"><path d="m21 3-7.2 18-3.5-7.3L3 10.2 21 3Z"/><path d="m10.3 13.7 5-5"/></svg><span>{post.shares}</span>
                </button>
                <button className={`post-action bookmark-action ${saved.includes(post.id) ? "is-saved" : ""}`} aria-label="Salvar publicação" onClick={() => setSaved(current => current.includes(post.id) ? current.filter(id => id !== post.id) : [...current, post.id])}>
                  <svg viewBox="0 0 24 24"><path d="M6 3.5h12v17l-6-4-6 4v-17Z"/></svg><span>{post.saved + (saved.includes(post.id) ? 1 : 0)}</span>
                </button>
              </div>
              <p className="post-caption">{post.caption}</p>
              {commentsOpen === post.id && <div className="comments-panel">
                {(comments[post.id] || []).map((comment, index) => <p key={index}><strong>Você</strong> {comment}</p>)}
                <form onSubmit={event => { event.preventDefault(); addComment(post.id); }}>
                  <input value={drafts[post.id] || ""} onChange={event => setDrafts(current => ({ ...current, [post.id]: event.target.value }))} placeholder="Adicione um comentário..." aria-label="Comentário" />
                  <button type="submit">Enviar</button>
                </form>
              </div>}
            </div>
          </article>
        ))}
      </section>


      {messagesOpen && <section className="messages-app" aria-label="Mensagens Nexora">
        <header className="messages-topbar">
          {activeChat ? <><button className="messages-back" onClick={() => { setActiveChatId(null); setChatDetail("chat"); }} aria-label="Voltar às conversas">‹</button><button className="messages-person" onClick={() => setChatDetail("profile")}><img src={activeChat.avatar} alt="" /><span><strong>{activeChat.name}</strong><small className={activeChat.online ? "online" : ""}>{activeChat.group ? `${activeChat.members || 8} membros` : activeChat.online ? "Online" : "@"+activeChat.username}</small></span></button><button className="messages-head-action call-action" aria-label="Chamada de áudio" title="Chamada de áudio" style={{width:40,height:40,minWidth:40,borderRadius:14,border:"1px solid rgba(116,211,255,.28)",background:"linear-gradient(145deg,rgba(49,130,255,.24),rgba(147,83,255,.22))",boxShadow:"inset 0 1px 0 rgba(255,255,255,.10),0 5px 18px rgba(44,101,255,.12)",display:"grid",placeItems:"center",padding:0,color:"#e9faff",flexShrink:0}} onClick={() => setNotice("A chamada de áudio ficará disponível quando o serviço de conversas em tempo real for integrado.")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3.8h3.2l1.6 4.1-2.1 1.7a13.8 13.8 0 0 0 3.7 3.7l1.7-2.1 4.1 1.6V16a2 2 0 0 1-2 2A13.2 13.2 0 0 1 5 5.8a2 2 0 0 1 2-2Z"/></svg></button><button className="messages-head-action call-action" aria-label="Chamada de vídeo" title="Chamada de vídeo" style={{width:40,height:40,minWidth:40,borderRadius:14,border:"1px solid rgba(116,211,255,.28)",background:"linear-gradient(145deg,rgba(49,130,255,.24),rgba(147,83,255,.22))",boxShadow:"inset 0 1px 0 rgba(255,255,255,.10),0 5px 18px rgba(44,101,255,.12)",display:"grid",placeItems:"center",padding:0,color:"#e9faff",flexShrink:0}} onClick={() => setNotice("A chamada de vídeo ficará disponível quando o serviço de conversas em tempo real for integrado.")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="6" width="12" height="12" rx="2.5"/><path d="m15 10 6-3v10l-6-3Z"/></svg></button><button className="messages-head-action" aria-label="Mídias e detalhes" onClick={() => setChatDetail(chatDetail === "media" ? "chat" : "media")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></button><button className="messages-head-action" aria-label="Configurações da conversa" onClick={() => setChatDetail(chatDetail === "settings" ? "chat" : "settings")}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 3.1-.2-.1a1.7 1.7 0 0 0-1.9.1 1.7 1.7 0 0 0-.9 1.5v.2h-3.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8-.1l-.2.1-1.8-3.1.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-.9H5v-3.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.1-1.8l-.1-.2 3.1-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 .9-1.5V4h3.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.1l.2-.1 1.8 3.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5.9h.2v3.6h-.2a1.7 1.7 0 0 0-1.5.9Z"/></svg></button></>
          : <><div className="messages-title"><button className="messages-close" onClick={() => setMessagesOpen(false)} aria-label="Voltar ao feed">‹</button><div><h1>Mensagens</h1><p>Conecte-se com quem importa.</p></div></div><button className="messages-new" aria-label="Nova conversa" onClick={() => setNotice("Para iniciar conversas reais, precisamos conectar a autenticação e o backend de mensagens.")}>＋</button></>}
        </header>
        {!activeChat && <><label className="messages-search"><span>⌕</span><input value={chatSearch} onChange={event => setChatSearch(event.target.value)} placeholder="Buscar conversas..." aria-label="Buscar conversas" />{chatSearch && <button onClick={() => setChatSearch("")} aria-label="Limpar busca">×</button>}</label><div className="messages-notes-head"><strong>Notas</strong><span>Compartilhe o que está na sua vibe</span></div><div className="messages-notes"><button className="note-person own-note" onClick={() => setNotesComposerOpen(true)}><span className={`note-bubble note-style-${noteStyle}`}>{myNote || "O que tá rolando? ✨"}</span><span className="note-person-avatar"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces" alt="" /><i>＋</i></span><small>Sua nota</small></button>{initialChats.filter(chat => !chat.group).slice(0,3).map((chat,index) => <button className="note-person" key={chat.id} onClick={() => openChat(chat.id)}><span className={`note-bubble note-style-${(index+1)%4}`}>{["Só vivendo 💜","Qual a boa? 🎧","✨ no meu mundo"][index]}</span><span className="note-person-avatar"><img src={chat.avatar} alt="" />{chat.online && <i />}</span><small>{chat.name.split(" ")[0]}</small></button>)}</div><div className="messages-list-heading"><strong>Conversas</strong><div className="messages-heading-actions"><button className="create-channel-trigger" onClick={() => setChannelModalOpen(true)}><span aria-hidden="true">▤</span><span>Criar canal</span><small>Oficial</small></button><button onClick={() => setNotice("Os pedidos de mensagem serão habilitados com as contas reais.")}>Pedidos</button></div></div><div className="messages-list">{filteredChats.map(chat => <button className="message-row" key={chat.id} onClick={() => openChat(chat.id)}><span className="message-avatar"><img src={chat.avatar} alt="" />{chat.online && <i />}</span><span className="message-row-copy"><strong>{chat.name}{chat.group && <small className="group-tag">GRUPO</small>}</strong><span>{chat.preview}</span></span><span className="message-row-meta"><small>{chat.time}</small>{Boolean(chat.unread) && <i>{chat.unread}</i>}</span></button>)}{filteredChats.length === 0 && <div className="messages-empty">Nenhuma conversa encontrada.</div>}</div></>}
        {activeChat && <>{chatDetail === "chat" ? <><div className="chat-thread-topline">{activeChat.group ? "🔒 Conversa em grupo · " + (activeChat.members || 8) + " membros" : "🔒 Suas mensagens são privadas nesta demonstração"}</div><div className="chat-messages" key={activeChat.id} style={{ background: chatWallpapers[chatWallpaperById[activeChat.id] ?? 0].preview, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>{activeChat.messages.map(message => <div className={`chat-message-line ${message.mine ? "mine" : "theirs"} ${revealedTimestampId === message.id ? "time-revealed" : ""}`} key={message.id} onTouchStart={event => { const touch = event.touches[0]; messageTouchStart.current = {x:touch.clientX,y:touch.clientY,id:message.id}; }} onTouchEnd={event => handleMessageTouchEnd(event,message.id)} onMouseEnter={() => setRevealedTimestampId(message.id)} onMouseLeave={() => setRevealedTimestampId(current => current === message.id ? null : current)}>{!message.mine && activeChat.group && <small className="chat-sender">{message.id % 2 ? "Lucas" : "Fernanda"}</small>}<div className={`chat-bubble chat-bubble-style-${chatBubbleStyleById[activeChat.id] ?? 0} ${message.kind === "image" ? "chat-image-bubble" : ""}`}>{message.kind === "image" ? <><div className="chat-city-image" role="img" aria-label="Foto de uma rua iluminada à noite"></div><span>{message.text}</span></> : message.text}<small>{message.time}</small></div><div className="chat-message-actions"><button type="button" className="chat-reaction-trigger" onClick={() => {setReactionPickerFor(reactionPickerFor === message.id ? null : message.id);setEmojiSearch("");}} aria-label="Reagir à mensagem" title="Reagir">☺<span>＋</span></button>{(message.reactions || []).length > 0 && <div className="chat-reaction-list">{message.reactions!.map(emoji => <button type="button" key={emoji} onClick={() => toggleMessageReaction(message.id,emoji)} aria-label={`Remover reação ${emoji}`}>{emoji}</button>)}</div>}{reactionPickerFor === message.id && <div className="chat-reaction-picker"><input value={emojiSearch} onChange={event => setEmojiSearch(event.target.value)} placeholder="Buscar emoji..." aria-label="Buscar emoji para reação" /><div className="chat-reaction-emoji-grid">{chatEmojiCatalog.filter(emoji => !emojiSearch || emoji.toLowerCase().includes(emojiSearch.toLowerCase())).map((emoji,index) => <button type="button" key={`${emoji}-${index}`} onClick={() => toggleMessageReaction(message.id,emoji)} aria-label={`Reagir com ${emoji}`}>{emoji}</button>)}</div></div>}</div></div>)}<div className="chat-read-receipt"><span className="read-receipt-dot"></span> Visto há {activeChat.id === "lary" ? "13 minutos" : "8 minutos"} · no seu ritmo, na sua Nexora</div></div><form className="chat-composer" onSubmit={event => { event.preventDefault(); sendChatMessage(); }}><button type="button" className="chat-add" onClick={() => setNotice("O envio de arquivos será conectado ao armazenamento da Nexora.")} aria-label="Anexar arquivo">＋</button><div className="chat-input-wrap"><input value={chatDraft} onChange={event => setChatDraft(event.target.value)} placeholder="Digite uma mensagem..." aria-label="Digite uma mensagem" maxLength={2000} /><button type="button" onClick={() => setChatEmojiOpen(!chatEmojiOpen)} aria-label="Emojis">☺</button></div><button type="submit" className="chat-send" disabled={!chatDraft.trim()} aria-label="Enviar mensagem">➤</button>{chatEmojiOpen && <div className="chat-emoji-tray chat-emoji-tray-full"><input value={emojiSearch} onChange={event => setEmojiSearch(event.target.value)} placeholder="Buscar emoji..." aria-label="Buscar emoji" /><div>{chatEmojiCatalog.filter(emoji => !emojiSearch || emoji.toLowerCase().includes(emojiSearch.toLowerCase())).map((emoji,index) => <button type="button" key={`${emoji}-${index}`} onClick={() => setChatDraft(value => value + emoji)}>{emoji}</button>)}</div></div>}</form></> : chatDetail === "media" ? <div className="chat-info-panel"><h2>Mídia, links e documentos</h2><p>Conteúdos compartilhados nesta conversa</p><div className="chat-media-grid"><div className="chat-city-image" /><div className="chat-city-image second" /><div className="chat-city-image third" /></div><button onClick={() => setNotice("O salvamento de mídia estará disponível com o armazenamento conectado.")}>⇩ Salvar na galeria</button><button onClick={() => setNotice("O compartilhamento de mídia será habilitado nesta etapa.")}>↗ Compartilhar</button><button onClick={() => setChatDetail("chat")}>Voltar à conversa</button></div> : chatDetail === "wallpaper" ? <div className="chat-settings-panel wallpaper-screen">
          <div className="chat-settings-heading"><div><span className="chat-settings-kicker">NEXORA ✦ PERSONALIZAÇÃO</span><h2>Papel de parede</h2><p>Escolha o clima da sua conversa.</p></div><button onClick={() => setChatDetail("settings")} aria-label="Voltar às configurações">‹</button></div>
          <div className="wallpaper-preview-live" style={{background:chatWallpapers[chatWallpaperById[activeChat.id] ?? 0].preview}}><div className="wallpaper-preview-bubble theirs">Oi! Como foi seu dia?</div><div className="wallpaper-preview-bubble mine">Foi ótimo 💜<small>Agora</small></div><span>PRÉ-VISUALIZAÇÃO</span></div>
          <section className="chat-settings-section"><div className="chat-settings-section-title"><strong>Escolha um fundo</strong><small>{chatWallpapers.length} estilos</small></div><p>O fundo aparece atrás das mensagens. Seus balões e textos continuam em destaque.</p><div className="wallpaper-grid">{chatWallpapers.map((wallpaper,index) => <button key={wallpaper.name} className={`wallpaper-choice ${(chatWallpaperById[activeChat.id] ?? 0) === index ? "selected" : ""}`} onClick={() => setChatWallpaperById(current => ({...current,[activeChat.id]:index}))}><span style={{background:wallpaper.preview}}>{index===18 ? "✦ 🔥 ✧" : index===19 ? "✨ 💜 🌙" : ""}</span><small>{wallpaper.name}</small>{(chatWallpaperById[activeChat.id] ?? 0) === index && <i>✓</i>}</button>)}</div></section>
          <button className="wallpaper-done-button" onClick={() => setChatDetail("chat")}>Aplicar papel de parede <span>✓</span></button>
        </div> : chatDetail === "settings" ? <div className="chat-settings-panel">
          <div className="chat-settings-heading"><div><span className="chat-settings-kicker">NEXORA ✦ CONVERSA</span><h2>Configurações</h2><p>Personalize esta conversa do seu jeito.</p></div><button onClick={() => setChatDetail("chat")} aria-label="Fechar configurações">✕</button></div>
          <section className="chat-settings-profile"><img src={activeChat.avatar} alt="" /><div><strong>{activeChat.name}</strong><small>{activeChat.group ? `Grupo · ${activeChat.members || 8} membros` : `@${activeChat.username}`}</small></div><button onClick={() => setChatDetail("profile")}>Perfil ↗</button></section>
          <button className="settings-navigation-row" onClick={() => setChatDetail("wallpaper")}><span className="settings-row-icon">✧</span><span className="settings-row-copy"><strong>Papel de parede</strong><small>Escolha um fundo para esta conversa</small></span><span className="settings-row-preview" style={{background:chatWallpapers[chatWallpaperById[activeChat.id] ?? 0].preview}}/><b>›</b></button>
          <section className="chat-settings-section bubble-style-section"><div className="chat-settings-section-title"><strong>Estilo dos balões</strong><small>10 estilos</small></div><p>Personalize a aparência dos balões nesta conversa.</p><div className="chat-bubble-style-grid">{chatBubbleStyles.map((style,index) => <button type="button" key={style.name} className={`chat-bubble-style-choice ${(chatBubbleStyleById[activeChat.id] ?? 0) === index ? "selected" : ""}`} onClick={() => setChatBubbleStyleById(current => ({...current,[activeChat.id]:index}))}><span className={`chat-bubble-style-sample-${index} chat-bubble-style-${index}`} style={{background:style.sample}}>Aa</span><small>{style.name}</small>{(chatBubbleStyleById[activeChat.id] ?? 0) === index && <i>✓</i>}</button>)}</div></section>
          <section className="chat-settings-section"><div className="chat-settings-section-title"><strong>Preferências da conversa</strong><small>Ative ou desative</small></div>
            <button className="chat-setting-row" onClick={() => setChatMuted(!chatMuted)}><span>🔔 Silenciar notificações<small>Sem perder as mensagens</small></span><i className={chatMuted?"toggle on":"toggle"} /></button>
            <button className="chat-setting-row" onClick={() => setChatReadReceipts(!chatReadReceipts)}><span>👁 Confirmações de leitura<small>Controle sua privacidade</small></span><i className={chatReadReceipts?"toggle on":"toggle"} /></button>
            <button className="chat-setting-row" onClick={() => setChatSaveMedia(!chatSaveMedia)}><span>📥 Salvar mídias automaticamente<small>Fotos e vídeos recebidos</small></span><i className={chatSaveMedia?"toggle on":"toggle"} /></button>
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

      {channelModalOpen && <div className="notes-composer-backdrop" onClick={event => {if(event.target===event.currentTarget)setChannelModalOpen(false);}}><section className="notes-composer-card channel-create-card" role="dialog" aria-modal="true" aria-label="Criar canal Nexora"><header><div><strong><span className="channel-official-mark">✓</span> Criar canal</strong><small>Um espaço oficial para sua comunidade e seus seguidores.</small></div><button onClick={() => setChannelModalOpen(false)} aria-label="Fechar">×</button></header><div className="channel-requirement-card"><span>📣</span><div><strong>15.000 seguidores</strong><small>Requisito para criar um canal público.</small></div><b>{myFollowerCount.toLocaleString("pt-BR")} / 15K</b></div>{myFollowerCount >= 15000 ? <><input className="channel-name-input" value={channelName} onChange={event => setChannelName(event.target.value)} maxLength={40} placeholder="Nome do canal" /><button className="notes-publish" disabled={!channelName.trim()} onClick={() => {setChannelModalOpen(false);setNotice("Nome de canal preparado. A criação real será ativada quando o sistema de seguidores e canais estiver conectado.");}}>Continuar</button></> : <><div className="channel-progress"><span style={{width:`${Math.min(100,myFollowerCount/15000*100)}%`}} /></div><p className="channel-gate-copy">Você ainda precisa de {(15000-myFollowerCount).toLocaleString("pt-BR")} seguidores para desbloquear a criação de canais. Estamos deixando a experiência preparada para essa etapa.</p><button className="notes-publish" onClick={() => setChannelModalOpen(false)}>Entendi</button></>}</section></div>}\n      {notesComposerOpen && <div className="notes-composer-backdrop" onClick={event => { if (event.target === event.currentTarget) setNotesComposerOpen(false); }}><section className="notes-composer-card" role="dialog" aria-modal="true" aria-label="Criar nota"><header><div><strong>Sua nota</strong><small>Uma ideia rápida, do seu jeito.</small></div><button onClick={() => setNotesComposerOpen(false)} aria-label="Fechar">×</button></header><textarea value={notesDraft} onChange={event => setNotesDraft(event.target.value)} maxLength={60} placeholder="O que você quer compartilhar?" autoFocus /><div className="notes-style-label">Escolha seu neon</div><div className="notes-style-picker">{[0,1,2,3].map(style => <button type="button" key={style} className={`note-style-swatch note-style-${style} ${noteStyle===style ? "selected" : ""}`} onClick={() => setNoteStyle(style)} aria-label={`Estilo de nota ${style+1}`}>{["Néon","Aurora","Cosmos","Pulse"][style]}</button>)}</div><button className="notes-music-button" onClick={() => setNotice("A interface de música está preparada; a conexão com catálogo musical ficará para a próxima etapa.")}>♫ Adicionar música <small>Em breve</small></button><button className="notes-publish" disabled={!notesDraft.trim()} onClick={() => { setMyNote(notesDraft.trim()); setNotesComposerOpen(false); setNotesDraft(""); setNotice("Sua nota foi atualizada nesta demonstração."); }}>Compartilhar nota</button></section></div>}\n      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso">×</button></div>}

      {activeStory && <div className="story-overlay" onClick={event => { if (event.target === event.currentTarget) closeStoryViewer(); }}><section className="story-viewer" role="dialog" aria-modal="true" aria-label={`Story de ${activeStory.name}`} onTouchStart={event => { const touch = event.touches[0]; storyTouchStartRef.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={event => { const start = storyTouchStartRef.current; storyTouchStartRef.current = null; if (!start || storyCommentsOpen || showStoryReactions) return; const touch = event.changedTouches[0]; const dx = touch.clientX - start.x; const dy = touch.clientY - start.y; const target = event.target as HTMLElement; if (target.closest("button, input, textarea, form, .story-comments-sheet, .story-action-rail, .story-bottom-bubbles")) return; if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) { if (dx < 0) goNextStory(); else goPreviousStory(); } }}><div key={activeStory.id || activeStory.name} className={`story-progress ${isStoryPaused || storyCommentsOpen || showStoryReactions ? "is-paused" : ""}`}><span /></div><header><img src={activeStory.image} alt="" /><strong>{activeStory.name} <small>· agora</small></strong><button className="story-pause-button" onClick={toggleStoryPlayback} aria-label={isStoryPaused ? "Continuar Story" : "Pausar Story"} title={isStoryPaused ? "Continuar" : "Pausar"}>{isStoryPaused ? "▶" : "Ⅱ"}</button><button onClick={closeStoryViewer} aria-label="Fechar">×</button></header>{activeStory.mediaType === "video" ? <video ref={storyVideoRef} className="story-full-image" src={activeStory.image} autoPlay={!isStoryPaused && !storyCommentsOpen && !showStoryReactions} playsInline onClick={handleStoryVideoTap} onEnded={goNextStory} /> : <img className="story-full-image" src={activeStory.image.replace("w=180&h=180", "w=900&h=1500")} alt={activeStory.caption || `Story de ${activeStory.name}`} onClick={handleStoryMediaTap} />}{showStoryHeart && <div className="story-heart-burst" aria-hidden="true">❤️</div>}{storyFloatingReaction && <div key={`reaction-${storyFeedbackId}`} className="story-floating-reaction" aria-hidden="true">{storyFloatingReaction}</div>}{storyQuickCommentVisible && <div key={`comment-${storyFeedbackId}`} className="story-quick-comment" aria-live="polite"><span className="story-quick-comment-avatar">L</span><span><strong>Licinhosz.bb</strong><small>{storyQuickComment}</small></span></div>}{isStoryPaused && !storyCommentsOpen && !showStoryReactions && <button className="story-resume-overlay" onClick={toggleStoryPlayback} aria-label="Continuar Story">▶</button>}{activeStory.caption && <p className="story-caption">{activeStory.caption}</p>}<button className="story-hit story-hit-prev" aria-label="Story anterior" onClick={goPreviousStory} /><button className="story-hit story-hit-next" aria-label="Próximo Story" onClick={goNextStory} /><aside className="story-action-rail" aria-label="Interações do Story"><div className="story-reaction-anchor">{showStoryReactions && <div className="story-reaction-picker" role="group" aria-label="Escolha uma reação">{["🫦","🤌","😍","🔥","🫶"].map(emoji => <button key={emoji} onClick={() => toggleStoryLike(emoji)} aria-label={`Reagir com ${emoji}`}>{emoji}</button>)}</div>}<button className={`story-action-button ${likedStories.includes(currentStoryKey()) ? "liked" : ""}`} aria-label="Curtir Story; segure para escolher emoji" onPointerDown={startReactionHold} onPointerUp={endReactionHold} onPointerLeave={endReactionHold} onContextMenu={event => { event.preventDefault(); setShowStoryReactions(true); }} onClick={event => { event.stopPropagation(); if (reactionHeldRef.current) { reactionHeldRef.current = false; return; } toggleStoryLike(); }}><span className="story-action-icon">{storyReactions[currentStoryKey()] || (likedStories.includes(currentStoryKey()) ? "❤️" : "♡")}</span><small>{likedStories.includes(currentStoryKey()) ? "Curtido" : "Curtir"}</small></button></div><button className="story-action-button" aria-label="Comentar Story" onClick={event => { event.stopPropagation(); setStoryCommentsOpen(true); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h8M8 14h5"/></svg></span><small>Comentar</small></button><button className="story-action-button" aria-label="Enviar mensagem privada para quem publicou o Story" onClick={event => { event.stopPropagation(); messageStoryUser(); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5Z"/><path d="m5 6 7 6 7-6"/></svg></span><small>Mensagem</small></button><button className="story-action-button" aria-label="Compartilhar Story" onClick={event => { event.stopPropagation(); shareStory(); }}><span className="story-action-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 3-7.5 18-3.2-7.3L3 10.5 21 3Z"/><path d="M10.3 13.7 15 9"/></svg></span><small>Enviar</small></button></aside><div className="story-bottom-bubbles" aria-label="Navegar entre Stories">{stories.filter(item => !item.own || item.image).map(story => <button key={story.id || story.name} className={`story-bubble ${story.name === activeStory.name && story.image === activeStory.image ? "active" : ""}`} onClick={event => { event.stopPropagation(); const index = stories.indexOf(story); setActiveStoryIndex(index); setActiveStory(story); setIsStoryPaused(false); setShowStoryReactions(false); }}><span><img src={story.image} alt="" /></span><small>{story.name}</small></button>)}</div>{storyCommentsOpen && <div className="story-comments-backdrop" onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) setStoryCommentsOpen(false); }}><section className="story-comments-sheet" role="dialog" aria-modal="true" aria-label="Comentários do Story"><header><div><strong>Comentários</strong><small>Converse com respeito, do seu jeito</small></div><button onClick={() => setStoryCommentsOpen(false)} aria-label="Fechar comentários">×</button></header><div className="story-comments-list">{(storyComments[currentStoryKey()] || []).length ? (storyComments[currentStoryKey()] || []).map((comment, index) => <p key={index}><span className="story-comment-avatar">L</span><span><strong>Licinhosz.bb</strong>{comment}</span></p>) : <div className="story-comments-empty"><span>✦</span><strong>Comece a conversa</strong><small>Seja a primeira pessoa a comentar neste Story.</small></div>}</div><form onSubmit={addStoryComment}><span className="story-comment-avatar">L</span><input autoFocus value={storyCommentDraft} onChange={event => setStoryCommentDraft(event.target.value)} placeholder="Adicione um comentário..." aria-label="Adicionar comentário" maxLength={300} /><button type="submit" disabled={!storyCommentDraft.trim()}>Enviar</button></form></section></div>}</section></div>}

{storyComposerOpen && <div className="overlay story-composer-overlay" onClick={event => { if (event.target === event.currentTarget) setStoryComposerOpen(false); }}><section className="composer story-composer" role="dialog" aria-modal="true" aria-labelledby="story-composer-title"><header><div><small>NEXORA · STORIES</small><h2 id="story-composer-title">Criar Story</h2></div><button onClick={() => setStoryComposerOpen(false)} aria-label="Fechar">×</button></header><input ref={storyInputRef} className="story-file-input" type="file" accept="image/*,video/*" onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) { setNotice("Escolha uma foto ou vídeo."); return; } if (file.size > 50 * 1024 * 1024) { setNotice("O arquivo deve ter até 50 MB."); return; } setStoryFile(file); setStoryPreview(URL.createObjectURL(file)); }} /><button className="story-media-picker" onClick={() => storyInputRef.current?.click()}>{storyPreview ? (storyFile?.type.startsWith("video/") ? <video src={storyPreview} muted playsInline /> : <img src={storyPreview} alt="Prévia do Story" />) : <span><b>＋</b>Escolher foto ou vídeo</span>}</button><textarea value={storyCaption} onChange={event => setStoryCaption(event.target.value)} maxLength={180} placeholder="Adicione uma legenda (opcional)..." /><footer><span>{storyCaption.length}/180</span><button disabled={!storyFile || !storyPreview} onClick={() => { if (!storyFile || !storyPreview) return; const ownStory: StoryItem = { name: "Licinhosz.bb", own: true, image: storyPreview, mediaType: storyFile.type.startsWith("video/") ? "video" : "image", caption: storyCaption.trim(), id: `local-${Date.now()}` }; setStories(current => [current[0], ownStory, ...current.slice(1).filter(item => !item.own || !item.image)]); setActiveStoryIndex(1); setActiveStory(ownStory); setStoryComposerOpen(false); setStoryFile(null); setStoryPreview(""); setStoryCaption(""); setNotice("Story publicado nesta sessão do navegador."); }}>Publicar Story ↗</button></footer><p>O Story fica nesta sessão do navegador; a sincronização entre contas será conectada ao backend na etapa de persistência.</p></section></div>}

      {composerOpen && <div className="overlay" onClick={event => { if (event.target === event.currentTarget) setComposerOpen(false); }}><section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title"><header><div><small>NEXORA · SUA COMUNIDADE</small><h2 id="composer-title">Criar publicação</h2></div><button onClick={() => setComposerOpen(false)} aria-label="Fechar">×</button></header><textarea value={composerText} onChange={event => setComposerText(event.target.value)} maxLength={1000} placeholder="Compartilhe algo com o mundo..." /><footer><span>{composerText.length}/1000</span><button disabled={!composerText.trim()} onClick={publish}>Publicar ↗</button></footer><p>Esta primeira etapa é uma demonstração visual; publicações e interações ainda não são sincronizadas com outras contas.</p></section></div>}

      <nav className="bottom-nav" aria-label="Navegação principal">
        <button className="nav-active" aria-label="Início" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z"/></svg></button>
        <button aria-label="Reels" onClick={() => { window.location.href = "/reels"; }}><svg viewBox="0 0 24 24"><path d="M7 4.5 19 12 7 19.5Z"/><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="none"/></svg></button>
        <button aria-label="Explorar" onClick={() => setNotice("A página Explorar será construída na próxima etapa.")}><svg viewBox="0 0 24 24"><path d="m4 19 4-11 12-3-3 12-11 4-2-2Z"/><path d="m8 8 8 8"/></svg></button>
        <button className="nav-create" aria-label="Criar publicação" onClick={() => setComposerOpen(true)}><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
        <button aria-label="Mensagens" onClick={() => { setMessagesOpen(true); setActiveChatId(null); }}><svg viewBox="0 0 24 24"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg></button>
        <button aria-label="Perfil" onClick={() => setNotice("A página de perfil será construída em uma próxima etapa.")}><svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/></svg></button>
      </nav>
    </main>
  );
}
