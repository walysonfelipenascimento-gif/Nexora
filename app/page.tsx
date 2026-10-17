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
  const storyVideoRef = useRef<HTMLVideoElement>(null);
  const [storyComposerOpen, setStoryComposerOpen] = useState(false);
  const [storyPreview, setStoryPreview] = useState("");
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyCaption, setStoryCaption] = useState("");
  const storyInputRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");

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
          <button className="round-action" aria-label="Mensagens" onClick={() => setNotice("Mensagens serão construídas em uma próxima página.")}>
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

      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso">×</button></div>}

      {activeStory && <div className="story-overlay" onClick={event => { if (event.target === event.currentTarget) closeStoryViewer(); }}><section className="story-viewer" role="dialog" aria-modal="true" aria-label={`Story de ${activeStory.name}`}><div key={activeStory.id || activeStory.name} className={`story-progress ${isStoryPaused ? "is-paused" : ""}`}><span /></div><header><img src={activeStory.image} alt="" /><strong>{activeStory.name} <small>· agora</small></strong><button className="story-pause-button" onClick={toggleStoryPlayback} aria-label={isStoryPaused ? "Continuar Story" : "Pausar Story"} title={isStoryPaused ? "Continuar" : "Pausar"}>{isStoryPaused ? "▶" : "Ⅱ"}</button><button onClick={closeStoryViewer} aria-label="Fechar">×</button></header>{activeStory.mediaType === "video" ? <video ref={storyVideoRef} className="story-full-image" src={activeStory.image} autoPlay={!isStoryPaused} playsInline onClick={toggleStoryPlayback} onEnded={goNextStory} /> : <img className="story-full-image" src={activeStory.image.replace("w=180&h=180", "w=900&h=1500")} alt={activeStory.caption || `Story de ${activeStory.name}`} />}{isStoryPaused && <button className="story-resume-overlay" onClick={toggleStoryPlayback} aria-label="Continuar Story">▶</button>}{activeStory.caption && <p className="story-caption">{activeStory.caption}</p>}<button className="story-hit story-hit-prev" aria-label="Story anterior — tocar à esquerda" onClick={goPreviousStory} /><button className="story-hit story-hit-next" aria-label="Próximo Story — tocar à direita" onClick={goNextStory} /><div className="story-bottom-bubbles" aria-label="Navegar entre Stories">{stories.filter(item => !item.own || item.image).map(story => <button key={story.id || story.name} className={`story-bubble ${story.name === activeStory.name && story.image === activeStory.image ? "active" : ""}`} onClick={() => { const index = stories.indexOf(story); setActiveStoryIndex(index); setActiveStory(story); setIsStoryPaused(false); }}><span><img src={story.image} alt="" /></span><small>{story.name}</small></button>)}</div></section></div>}

{storyComposerOpen && <div className="overlay story-composer-overlay" onClick={event => { if (event.target === event.currentTarget) setStoryComposerOpen(false); }}><section className="composer story-composer" role="dialog" aria-modal="true" aria-labelledby="story-composer-title"><header><div><small>NEXORA · STORIES</small><h2 id="story-composer-title">Criar Story</h2></div><button onClick={() => setStoryComposerOpen(false)} aria-label="Fechar">×</button></header><input ref={storyInputRef} className="story-file-input" type="file" accept="image/*,video/*" onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) { setNotice("Escolha uma foto ou vídeo."); return; } if (file.size > 50 * 1024 * 1024) { setNotice("O arquivo deve ter até 50 MB."); return; } setStoryFile(file); setStoryPreview(URL.createObjectURL(file)); }} /><button className="story-media-picker" onClick={() => storyInputRef.current?.click()}>{storyPreview ? (storyFile?.type.startsWith("video/") ? <video src={storyPreview} muted playsInline /> : <img src={storyPreview} alt="Prévia do Story" />) : <span><b>＋</b>Escolher foto ou vídeo</span>}</button><textarea value={storyCaption} onChange={event => setStoryCaption(event.target.value)} maxLength={180} placeholder="Adicione uma legenda (opcional)..." /><footer><span>{storyCaption.length}/180</span><button disabled={!storyFile || !storyPreview} onClick={() => { if (!storyFile || !storyPreview) return; const ownStory: StoryItem = { name: "Licinhosz.bb", own: true, image: storyPreview, mediaType: storyFile.type.startsWith("video/") ? "video" : "image", caption: storyCaption.trim(), id: `local-${Date.now()}` }; setStories(current => [current[0], ownStory, ...current.slice(1).filter(item => !item.own || !item.image)]); setActiveStoryIndex(1); setActiveStory(ownStory); setStoryComposerOpen(false); setStoryFile(null); setStoryPreview(""); setStoryCaption(""); setNotice("Story publicado nesta sessão do navegador."); }}>Publicar Story ↗</button></footer><p>O Story fica nesta sessão do navegador; a sincronização entre contas será conectada ao backend na etapa de persistência.</p></section></div>}

      {composerOpen && <div className="overlay" onClick={event => { if (event.target === event.currentTarget) setComposerOpen(false); }}><section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title"><header><div><small>NEXORA · SUA COMUNIDADE</small><h2 id="composer-title">Criar publicação</h2></div><button onClick={() => setComposerOpen(false)} aria-label="Fechar">×</button></header><textarea value={composerText} onChange={event => setComposerText(event.target.value)} maxLength={1000} placeholder="Compartilhe algo com o mundo..." /><footer><span>{composerText.length}/1000</span><button disabled={!composerText.trim()} onClick={publish}>Publicar ↗</button></footer><p>Esta primeira etapa é uma demonstração visual; publicações e interações ainda não são sincronizadas com outras contas.</p></section></div>}

      <nav className="bottom-nav" aria-label="Navegação principal">
        <button className="nav-active" aria-label="Início" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z"/></svg></button>
        <button aria-label="Explorar" onClick={() => setNotice("A página Explorar será construída na próxima etapa.")}><svg viewBox="0 0 24 24"><path d="m4 19 4-11 12-3-3 12-11 4-2-2Z"/><path d="m8 8 8 8"/></svg></button>
        <button className="nav-create" aria-label="Criar publicação" onClick={() => setComposerOpen(true)}><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
        <button aria-label="Atividades" onClick={() => setNotice("A página de atividades será construída na próxima etapa.")}><svg viewBox="0 0 24 24"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg></button>
        <button aria-label="Perfil" onClick={() => setNotice("A página de perfil será construída em uma próxima etapa.")}><svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/></svg></button>
      </nav>
    </main>
  );
}
