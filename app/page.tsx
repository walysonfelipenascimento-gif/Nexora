"use client";

import { useState } from "react";

type Story = { name: string; image: string; own?: boolean };
type Post = {
  id: number; name: string; username: string; avatar: string; image: string;
  location: string; caption: string; likes: number; liked: boolean; comments: string[];
};

const stories: Story[] = [
  { name: "Seu story", image: "", own: true },
  { name: "mariana", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop" },
  { name: "gabriel", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop" },
  { name: "isabela", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop" },
  { name: "lucas", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop" },
  { name: "ana", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop" },
];

const initialPosts: Post[] = [
  {
    id: 1, name: "Mariana Costa", username: "marianacosta",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&h=1800&fit=crop",
    location: "Recife, PE",
    caption: "Às vezes, tudo o que a gente precisa é desacelerar e aproveitar o caminho. ✨",
    likes: 248, liked: false, comments: ["Que lugar lindo! 💙", "A energia dessa foto é incrível!"],
  },
  {
    id: 2, name: "Gabriel Oliveira", username: "gabrieloliveira",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=1800&fit=crop",
    location: "Brasil",
    caption: "Colecionando momentos, conhecendo pessoas e criando novas oportunidades. 🌎",
    likes: 126, liked: false, comments: ["Fotografia maravilhosa! 🔥"],
  },
];

const suggestedPeople = [
  { id: "antonio", name: "Antonio", username: "@antonio", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&h=320&fit=crop", mutual: "10 conexões em comum" },
  { id: "edu", name: "Edu Lizar", username: "@edu.lizar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&h=320&fit=crop", mutual: "8 conexões em comum" },
  { id: "isabela", name: "Isabela", username: "@isabela", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&h=320&fit=crop", mutual: "6 conexões em comum" },
];

const navigation = [
  { id: "inicio", label: "Início", icon: "⌂" },
  { id: "reels", label: "Reels", icon: "▶" },
  { id: "explorar", label: "Explorar", icon: "⌕" },
  { id: "criar", label: "Criar", icon: "+" },
  { id: "oportunidades", label: "Oportunidades", icon: "◇" },
  { id: "perfil", label: "Perfil", icon: "○" },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState("inicio");
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [followed, setFollowed] = useState<string[]>([]);
  const [hiddenSuggestions, setHiddenSuggestions] = useState<string[]>([]);
  const [saved, setSaved] = useState<number[]>([]);

  function toggleLike(postId: number) {
    setPosts((current) => current.map((post) => post.id === postId
      ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
      : post));
  }

  function addComment(postId: number) {
    const text = (drafts[postId] || "").trim();
    if (!text) return;
    setPosts((current) => current.map((post) => post.id === postId
      ? { ...post, comments: [...post.comments, text] } : post));
    setDrafts((current) => ({ ...current, [postId]: "" }));
  }

  function handleNavigation(tab: string) {
    if (tab === "reels") { window.location.href = "/reels"; return; }
    if (tab === "criar") { alert("A criação de publicações será conectada ao Estúdio Nexora."); return; }
    setActiveTab(tab);
  }

  return (
    <main className="nexora-app nx-feed-v2">
      <header className="topbar">
        <div className="brand"><div className="brand-symbol">N</div><span>Nexora</span></div>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Pesquisar" onClick={() => setActiveTab("explorar")}>⌕</button>
          <button className="icon-button" aria-label="Notificações" onClick={() => alert("As notificações serão conectadas nesta etapa.")}>♡</button>
        </div>
      </header>

      <section className="feed-container">
        {activeTab === "inicio" ? (
          <>
            <section className="stories-section">
              <div className="section-heading"><h2>Stories</h2><span>Momentos da comunidade</span></div>
              <div className="stories-list">
                {stories.map((story) => (
                  <button className="story" key={story.name} onClick={() => alert(story.own ? "Abra o Criador Nexora para publicar seu Story." : `O Story de ${story.name} estará disponível quando o perfil estiver conectado.`)}>
                    <div className={`story-ring ${story.own ? "own-story" : ""}`}>
                      {story.own ? <div className="own-story-inner">+</div> : <img src={story.image} alt={`Story de ${story.name}`} />}
                    </div>
                    <span>{story.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="feed-heading">
              <div><p className="eyebrow">SUA COMUNIDADE</p><h1>Seu feed</h1></div>
              <span className="live-indicator"><span /> Novidades para descobrir</span>
            </section>

            <div className="posts-list">
              {posts.map((post, index) => (
                <div className="feed-sequence" key={post.id}>
                  <article className="post-card nx-immersive-post">
                    <img className="post-image" src={post.image} alt={`Publicação de ${post.name}`} />
                    <div className="post-image-shade" />
                    <div className="post-header nx-overlay-header">
                      <img className="avatar" src={post.avatar} alt={`Foto de ${post.name}`} />
                      <div className="post-author"><strong>{post.name} <span className="nx-verified">✦</span></strong><span>@{post.username} · {post.location}</span></div>
                      <button className="follow-creator" onClick={() => setFollowed((current) => current.includes(post.username) ? current.filter((id) => id !== post.username) : [...current, post.username])}>
                        {followed.includes(post.username) ? "Seguindo" : "Seguir"}
                      </button>
                      <button className="more-button" aria-label="Mais opções" onClick={() => alert("As opções de publicação serão conectadas nesta etapa.")}>⋯</button>
                    </div>

                    <div className="nx-post-overlay">
                      <div className="nx-post-copy"><span className="nx-content-tag">NEXORA · MOMENTOS</span><p><strong>@{post.username}</strong> {post.caption}</p></div>
                      <div className="nx-post-actions">
                        <button className={`nx-round-action ${post.liked ? "is-liked" : ""}`} aria-label={post.liked ? "Descurtir" : "Curtir"} onClick={() => toggleLike(post.id)}><span>{post.liked ? "♥" : "♡"}</span><small>{post.likes.toLocaleString("pt-BR")}</small></button>
                        <button className="nx-round-action" aria-label="Comentários" onClick={() => setOpenComments(openComments === post.id ? null : post.id)}><span>◯</span><small>{post.comments.length}</small></button>
                        <button className="nx-round-action" aria-label="Compartilhar" onClick={() => alert("O compartilhamento será conectado nesta etapa.")}><span>↗</span><small>Enviar</small></button>
                        <button className={`nx-round-action nx-save-action ${saved.includes(post.id) ? "is-saved" : ""}`} aria-label="Salvar" onClick={() => setSaved((current) => current.includes(post.id) ? current.filter((id) => id !== post.id) : [...current, post.id])}><span>{saved.includes(post.id) ? "◆" : "◇"}</span><small>{saved.includes(post.id) ? "Salvo" : "Salvar"}</small></button>
                      </div>
                    </div>

                    {openComments === post.id && (
                      <div className="nx-comments-panel">
                        <div className="nx-comments-heading"><strong>Comentários</strong><button onClick={() => setOpenComments(null)} aria-label="Fechar comentários">×</button></div>
                        <div className="nx-comments-list">{post.comments.map((comment, commentIndex) => <p className="comment" key={`${post.id}-${commentIndex}`}>{comment}</p>)}</div>
                        <form className="comment-form" onSubmit={(event) => { event.preventDefault(); addComment(post.id); }}>
                          <input type="text" placeholder="Escreva um comentário..." value={drafts[post.id] || ""} onChange={(event) => setDrafts((current) => ({ ...current, [post.id]: event.target.value }))} />
                          <button type="submit">Enviar</button>
                        </form>
                      </div>
                    )}
                  </article>

                  {index === 0 && suggestedPeople.some((person) => !hiddenSuggestions.includes(person.id)) && (
                    <section className="nx-discovery-block">
                      <div className="nx-discovery-heading"><div><span className="nx-discovery-kicker">EXPANDA SEU UNIVERSO</span><h2>Pessoas para conhecer</h2><p>Conexões que podem combinar com você</p></div><button onClick={() => setHiddenSuggestions(suggestedPeople.map((person) => person.id))}>Ver tudo <span>↗</span></button></div>
                      <div className="nx-suggestion-track">
                        {suggestedPeople.filter((person) => !hiddenSuggestions.includes(person.id)).map((person) => (
                          <article className="nx-person-card" key={person.id}>
                            <button className="nx-dismiss-person" aria-label={`Dispensar sugestão de ${person.name}`} onClick={() => setHiddenSuggestions((current) => [...current, person.id])}>×</button>
                            <img src={person.avatar} alt={`Foto de ${person.name}`} />
                            <strong>{person.name}</strong><span className="nx-person-handle">{person.username}</span>
                            <span className="nx-mutual">{person.mutual}</span>
                            <button className={`nx-follow-button ${followed.includes(person.id) ? "following" : ""}`} onClick={() => setFollowed((current) => current.includes(person.id) ? current.filter((id) => id !== person.id) : [...current, person.id])}>{followed.includes(person.id) ? "Seguindo" : "Seguir"}</button>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ))}
            </div>
            <p className="demo-notice">Você está visualizando publicações e sugestões demonstrativas. Elas ainda não representam usuários reais da Nexora.</p>
          </>
        ) : (
          <section className="empty-section">
            <div className="empty-icon">{navigation.find((item) => item.id === activeTab)?.icon || "N"}</div>
            <p className="eyebrow">NEXORA</p>
            <h1>{activeTab === "explorar" ? "Explore novas ideias" : activeTab === "oportunidades" ? "Oportunidades para você" : "Seu espaço na Nexora"}</h1>
            <p>Esta área está sendo preparada. Na próxima etapa, vamos desenvolver as funções reais desta seção.</p>
            <button className="primary-button" onClick={() => setActiveTab("inicio")}>Voltar ao início</button>
          </section>
        )}
      </section>

      <nav className="bottom-nav" aria-label="Navegação principal">
        {navigation.map((item) => <button key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => handleNavigation(item.id)}><span className="nav-icon">{item.icon}</span><span className="nav-label">{item.label}</span></button>)}
      </nav>
    </main>
  );
}
