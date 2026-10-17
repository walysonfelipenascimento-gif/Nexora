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

type ChatMessage = { id: number; text: string; mine: boolean; time: string; kind?: "text" | "audio" | "image" };
type ChatThread = { id: string; name: string; username: string; avatar: string; online?: boolean; group?: boolean; members?: number; unread?: number; preview: string; time: string; messages: ChatMessage[] };
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
  const [chatDetail, setChatDetail] = useState<"chat" | "media" | "profile">("chat");
  const [chatEmojiOpen, setChatEmojiOpen] = useState(false);
  const activeChat = chatThreads.find(chat => chat.id === activeChatId) || null;
  const filteredChats = chatThreads.filter(chat => chat.name.toLowerCase().includes(chatSearch.toLowerCase()) || chat.preview.toLowerCase().includes(chatSearch.toLowerCase()));
  function openChat(chatId: string) {
    setActiveChatId(chatId);
    setChatDetail("chat");
    setChatThreads(current => current.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat));
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
    if (!activeStory || isStoryPaused || activeStory.mediaType === "video") return;
    const timer = window.setTimeout(() => goNextStory(), 6000);
    return () => window.clearTimeout(timer);
  }, [activeStory, activeStoryIndex, isStoryPaused, stories]);

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
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 3 10.2l7.1 2.1L12.2 20 21 3Z"/><path d="m10.1 12.3 5-5"/></svg>
          </button>
          <button className="round-action" aria-label="Favoritos" onClick={() => setNotice(saved.length ? `Você salvou ${saved.length} publicação(ões) nesta sessão.` : "Suas publicações salvas aparecerão aqui.")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg>
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
          {activeChat ? <><button className="messages-back" onClick={() => { setActiveChatId(null); setChatDetail("chat"); }} aria-label="Voltar às conversas">‹</button><button className="messages-person" onClick={() => setChatDetail("profile")}><img src={activeChat.avatar} alt="" /><span><strong>{activeChat.name}</strong><small className={activeChat.online ? "online" : ""}>{activeChat.group ? `${activeChat.members || 8} membros` : activeChat.online ? "Online" : "@"+activeChat.username}</small></span></button><button className="messages-head-action" aria-label="Áudios" onClick={() => setNotice("A chamada de áudio será conectada quando o serviço de conversas estiver integrado.")}>☎</button><button className="messages-head-action" aria-label="Vídeo" onClick={() => setNotice("A chamada de vídeo será conectada quando o serviço de conversas estiver integrado.")}>▣</button><button className="messages-head-action" aria-label="Mídias e detalhes" onClick={() => setChatDetail(chatDetail === "media" ? "chat" : "media")}>⋮</button></>
          : <><div className="messages-title"><button className="messages-close" onClick={() => setMessagesOpen(false)} aria-label="Voltar ao feed">‹</button><div><h1>Mensagens</h1><p>Conecte-se com quem importa.</p></div></div><button className="messages-new" aria-label="Nova conversa" onClick={() => setNotice("Para iniciar conversas reais, precisamos conectar a autenticação e o backend de mensagens.")}>＋</button></>}
        </header>
        {!activeChat && <><label className="messages-search"><span>⌕</span><input value={chatSearch} onChange={event => setChatSearch(event.target.value)} placeholder="Buscar conversas..." aria-label="Buscar conversas" />{chatSearch && <button onClick={() => setChatSearch("")} aria-label="Limpar busca">×</button>}</label><div className="messages-stories"><button className="message-story" onClick={() => { setMessagesOpen(false); setStoryComposerOpen(true); }}><span className="message-story-ring own"><b>＋</b></span><small>Seu story</small></button>{initialChats.filter(chat => !chat.group).slice(0,4).map(chat => <button className="message-story" key={chat.id} onClick={() => openChat(chat.id)}><span className="message-story-ring"><img src={chat.avatar} alt="" />{chat.online && <i />}</span><small>{chat.name.split(" ")[0]}</small></button>)}</div><div className="messages-list-heading"><strong>Conversas</strong><button onClick={() => setNotice("Os pedidos de mensagem serão habilitados com as contas reais.")}>Pedidos</button></div><div className="messages-list">{filteredChats.map(chat => <button className="message-row" key={chat.id} onClick={() => openChat(chat.id)}><span className="message-avatar"><img src={chat.avatar} alt="" />{chat.online && <i />}</span><span className="message-row-copy"><strong>{chat.name}{chat.group && <small className="group-tag">GRUPO</small>}</strong><span>{chat.preview}</span></span><span className="message-row-meta"><small>{chat.time}</small>{Boolean(chat.unread) && <i>{chat.unread}</i>}</span></button>)}{filteredChats.length === 0 && <div className="messages-empty">Nenhuma conversa encontrada.</div>}</div></>}
        {activeChat && <>{chatDetail === "chat" ? <><div className="chat-thread-topline">{activeChat.group ? "🔒 Conversa em grupo · " + (activeChat.members || 8) + " membros" : "🔒 Suas mensagens são privadas nesta demonstração"}</div><div className="chat-messages" key={activeChat.id}>{activeChat.messages.map(message => <div className={`chat-message-line ${message.mine ? "mine" : "theirs"}`} key={message.id}>{!message.mine && activeChat.group && <small className="chat-sender">{message.id % 2 ? "Lucas" : "Fernanda"}</small>}<div className={`chat-bubble ${message.kind === "image" ? "chat-image-bubble" : ""}`}>{message.kind === "image" ? <><div className="chat-city-image" role="img" aria-label="Foto de uma rua iluminada à noite"></div><span>{message.text}</span></> : message.text}<small>{message.time}{message.mine && <b> ✓✓</b>}</small></div></div>)}</div><form className="chat-composer" onSubmit={event => { event.preventDefault(); sendChatMessage(); }}><button type="button" className="chat-add" onClick={() => setNotice("O envio de arquivos será conectado ao armazenamento da Nexora.")} aria-label="Anexar arquivo">＋</button><div className="chat-input-wrap"><input value={chatDraft} onChange={event => setChatDraft(event.target.value)} placeholder="Digite uma mensagem..." aria-label="Digite uma mensagem" maxLength={2000} /><button type="button" onClick={() => setChatEmojiOpen(!chatEmojiOpen)} aria-label="Emojis">☺</button></div><button type="submit" className="chat-send" disabled={!chatDraft.trim()} aria-label="Enviar mensagem">➤</button>{chatEmojiOpen && <div className="chat-emoji-tray">{["😀","😍","😂","🥹","❤️","🔥","💜","🫶"].map(emoji => <button type="button" key={emoji} onClick={() => setChatDraft(value => value + emoji)}>{emoji}</button>)}</div>}</form></> : chatDetail === "media" ? <div className="chat-info-panel"><h2>Mídia, links e documentos</h2><p>Conteúdos compartilhados nesta conversa</p><div className="chat-media-grid"><div className="chat-city-image" /><div className="chat-city-image second" /><div className="chat-city-image third" /></div><button onClick={() => setNotice("O salvamento de mídia estará disponível com o armazenamento conectado.")}>⇩ Salvar na galeria</button><button onClick={() => setNotice("O compartilhamento de mídia será habilitado nesta etapa.")}>↗ Compartilhar</button><button onClick={() => setChatDetail("chat")}>Voltar à conversa</button></div> : <div className="chat-profile-panel"><img src={activeChat.avatar} alt="" /><h2>{activeChat.name}</h2><p>@{activeChat.username} · {activeChat.online ? "Online" : "Nexora"}</p><div className="chat-profile-actions"><button onClick={() => setChatDetail("chat")}>Mensagem</button><button onClick={() => setChatDetail("media")}>Mídias</button></div><div className="chat-profile-option">♧ Notificações da conversa <span>●</span></div><div className="chat-profile-option">ⓘ Informações e participantes</div><button className="chat-block-button" onClick={() => setNotice("O bloqueio de contas será ativado junto ao sistema de usuários.")}>Bloquear usuário</button></div>}</>}
        <footer className="messages-footer"><span>N</span> Nexora <small>Conectando pessoas, marcas e oportunidades.</small></footer>
      </section>}

      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso">×</button></div>}

      {activeStory && <div className="story-overlay" onClick={event => { if (event.target === event.currentTarget) closeStoryViewer(); }}><section className="story-viewer" role="dialog" aria-modal="true" aria-label={`Story de ${activeStory.name}`}><div key={activeStory.id || activeStory.name} className={`story-progress ${isStoryPaused ? "is-paused" : ""}`}><span /></div><header><img src={activeStory.image} alt="" /><strong>{activeStory.name} <small>· agora</small></strong><button className="story-pause-button" onClick={toggleStoryPlayback} aria-label={isStoryPaused ? "Continuar Story" : "Pausar Story"} title={isStoryPaused ? "Continuar" : "Pausar"}>{isStoryPaused ? "▶" : "Ⅱ"}</button><button onClick={closeStoryViewer} aria-label="Fechar">×</button></header>{activeStory.mediaType === "video" ? <video ref={storyVideoRef} className="story-full-image" src={activeStory.image} autoPlay={!isStoryPaused} playsInline onClick={handleStoryVideoTap} onEnded={goNextStory} /> : <img className="story-full-image" src={activeStory.image.replace("w=180&h=180", "w=900&h=1500")} alt={activeStory.caption || `Story de ${activeStory.name}`} onClick={handleStoryMediaTap} />}{showStoryHeart && <div className="story-heart-burst" aria-hidden="true">❤️</div>}{storyFloatingReaction && <div key={`reaction-${storyFeedbackId}`} className="story-floating-reaction" aria-hidden="true">{storyFloatingReaction}</div>}{storyQuickCommentVisible && <div key={`comment-${storyFeedbackId}`} className="story-quick-comment" aria-live="polite"><span className="story-quick-comment-avatar">L</span><span><strong>Licinhosz.bb</strong><small>{storyQuickComment}</small></span></div>}{isStoryPaused && <button className="story-resume-overlay" onClick={toggleStoryPlayback} aria-label="Continuar Story">▶</button>}{activeStory.caption && <p className="story-caption">{activeStory.caption}</p>}<button className="story-hit story-hit-prev" aria-label="Story anterior" onClick={goPreviousStory} /><button className="story-hit story-hit-next" aria-label="Próximo Story" onClick={goNextStory} /><aside className="story-action-rail" aria-label="Interações do Story"><div className="story-reaction-anchor">{showStoryReactions && <div className="story-reaction-picker" role="group" aria-label="Escolha uma reação">{["🫦","🤌","😍","🔥","🫶"].map(emoji => <button key={emoji} onClick={() => toggleStoryLike(emoji)} aria-label={`Reagir com ${emoji}`}>{emoji}</button>)}</div>}<button className={`story-action-button ${likedStories.includes(currentStoryKey()) ? "liked" : ""}`} aria-label="Curtir Story; segure para escolher emoji" onPointerDown={startReactionHold} onPointerUp={endReactionHold} onPointerLeave={endReactionHold} onContextMenu={event => { event.preventDefault(); setShowStoryReactions(true); }} onClick={event => { event.stopPropagation(); if (reactionHeldRef.current) { reactionHeldRef.current = false; return; } toggleStoryLike(); }}><span className="story-action-icon">{storyReactions[currentStoryKey()] || (likedStories.includes(currentStoryKey()) ? "❤️" : "♡")}</span><small>{likedStories.includes(currentStoryKey()) ? "Curtido" : "Curtir"}</small></button></div><button className="story-action-button" aria-label="Comentar Story" onClick={event => { event.stopPropagation(); setStoryCommentsOpen(true); }}><span className="story-action-icon">▢</span><small>Comentar</small></button><button className="story-action-button" aria-label="Compartilhar Story" onClick={event => { event.stopPropagation(); shareStory(); }}><span className="story-action-icon">↗</span><small>Enviar</small></button></aside><div className="story-bottom-bubbles" aria-label="Navegar entre Stories">{stories.filter(item => !item.own || item.image).map(story => <button key={story.id || story.name} className={`story-bubble ${story.name === activeStory.name && story.image === activeStory.image ? "active" : ""}`} onClick={event => { event.stopPropagation(); const index = stories.indexOf(story); setActiveStoryIndex(index); setActiveStory(story); setIsStoryPaused(false); setShowStoryReactions(false); }}><span><img src={story.image} alt="" /></span><small>{story.name}</small></button>)}</div>{storyCommentsOpen && <div className="story-comments-backdrop" onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) setStoryCommentsOpen(false); }}><section className="story-comments-sheet" role="dialog" aria-modal="true" aria-label="Comentários do Story"><header><div><strong>Comentários</strong><small>Converse com respeito, do seu jeito</small></div><button onClick={() => setStoryCommentsOpen(false)} aria-label="Fechar comentários">×</button></header><div className="story-comments-list">{(storyComments[currentStoryKey()] || []).length ? (storyComments[currentStoryKey()] || []).map((comment, index) => <p key={index}><span className="story-comment-avatar">L</span><span><strong>Licinhosz.bb</strong>{comment}</span></p>) : <div className="story-comments-empty"><span>✦</span><strong>Comece a conversa</strong><small>Seja a primeira pessoa a comentar neste Story.</small></div>}</div><form onSubmit={addStoryComment}><span className="story-comment-avatar">L</span><input autoFocus value={storyCommentDraft} onChange={event => setStoryCommentDraft(event.target.value)} placeholder="Adicione um comentário..." aria-label="Adicionar comentário" maxLength={300} /><button type="submit" disabled={!storyCommentDraft.trim()}>Enviar</button></form></section></div>}</section></div>}

{storyComposerOpen && <div className="overlay story-composer-overlay" onClick={event => { if (event.target === event.currentTarget) setStoryComposerOpen(false); }}><section className="composer story-composer" role="dialog" aria-modal="true" aria-labelledby="story-composer-title"><header><div><small>NEXORA · STORIES</small><h2 id="story-composer-title">Criar Story</h2></div><button onClick={() => setStoryComposerOpen(false)} aria-label="Fechar">×</button></header><input ref={storyInputRef} className="story-file-input" type="file" accept="image/*,video/*" onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) { setNotice("Escolha uma foto ou vídeo."); return; } if (file.size > 50 * 1024 * 1024) { setNotice("O arquivo deve ter até 50 MB."); return; } setStoryFile(file); setStoryPreview(URL.createObjectURL(file)); }} /><button className="story-media-picker" onClick={() => storyInputRef.current?.click()}>{storyPreview ? (storyFile?.type.startsWith("video/") ? <video src={storyPreview} muted playsInline /> : <img src={storyPreview} alt="Prévia do Story" />) : <span><b>＋</b>Escolher foto ou vídeo</span>}</button><textarea value={storyCaption} onChange={event => setStoryCaption(event.target.value)} maxLength={180} placeholder="Adicione uma legenda (opcional)..." /><footer><span>{storyCaption.length}/180</span><button disabled={!storyFile || !storyPreview} onClick={() => { if (!storyFile || !storyPreview) return; const ownStory: StoryItem = { name: "Licinhosz.bb", own: true, image: storyPreview, mediaType: storyFile.type.startsWith("video/") ? "video" : "image", caption: storyCaption.trim(), id: `local-${Date.now()}` }; setStories(current => [current[0], ownStory, ...current.slice(1).filter(item => !item.own || !item.image)]); setActiveStoryIndex(1); setActiveStory(ownStory); setStoryComposerOpen(false); setStoryFile(null); setStoryPreview(""); setStoryCaption(""); setNotice("Story publicado nesta sessão do navegador."); }}>Publicar Story ↗</button></footer><p>O Story fica nesta sessão do navegador; a sincronização entre contas será conectada ao backend na etapa de persistência.</p></section></div>}

      {composerOpen && <div className="overlay" onClick={event => { if (event.target === event.currentTarget) setComposerOpen(false); }}><section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title"><header><div><small>NEXORA · SUA COMUNIDADE</small><h2 id="composer-title">Criar publicação</h2></div><button onClick={() => setComposerOpen(false)} aria-label="Fechar">×</button></header><textarea value={composerText} onChange={event => setComposerText(event.target.value)} maxLength={1000} placeholder="Compartilhe algo com o mundo..." /><footer><span>{composerText.length}/1000</span><button disabled={!composerText.trim()} onClick={publish}>Publicar ↗</button></footer><p>Esta primeira etapa é uma demonstração visual; publicações e interações ainda não são sincronizadas com outras contas.</p></section></div>}

      <nav className="bottom-nav" aria-label="Navegação principal">
        <button className="nav-active" aria-label="Início" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z"/></svg></button>
        <button aria-label="Explorar" onClick={() => setNotice("A página Explorar será construída na próxima etapa.")}><svg viewBox="0 0 24 24"><path d="m4 19 4-11 12-3-3 12-11 4-2-2Z"/><path d="m8 8 8 8"/></svg></button>
        <button className="nav-create" aria-label="Criar publicação" onClick={() => setComposerOpen(true)}><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
        <button aria-label="Mensagens" onClick={() => { setMessagesOpen(true); setActiveChatId(null); }}><svg viewBox="0 0 24 24"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg></button>
        <button aria-label="Perfil" onClick={() => setNotice("A página de perfil será construída em uma próxima etapa.")}><svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/></svg></button>
      </nav>
    </main>
  );
}
