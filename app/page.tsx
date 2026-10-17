
"use client";

import { useState } from "react";

type Story = {
  name: string;
  image: string;
  own?: boolean;
};

type Post = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  image: string;
  location: string;
  caption: string;
  likes: number;
  liked: boolean;
  comments: string[];
  isOwn?: boolean;
};

const stories: Story[] = [
  {
    name: "Seu story",
    image: "",
    own: true,
  },
  {
    name: "mariana",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop",
  },
  {
    name: "gabriel",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
  },
  {
    name: "isabela",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop",
  },
  {
    name: "lucas",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop",
  },
  {
    name: "ana",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop",
  },
];

const initialPosts: Post[] = [
  {
    id: 1,
    name: "Mariana Costa",
    username: "marianacosta",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&h=1100&fit=crop",
    location: "Recife, PE",
    caption:
      "Às vezes, tudo o que a gente precisa é desacelerar e aproveitar o caminho. ✨",
    likes: 248,
    liked: false,
    comments: [
      "Que lugar lindo! 💙",
      "A energia dessa foto é incrível!",
    ],
  },
  {
    id: 2,
    name: "Gabriel Oliveira",
    username: "gabrieloliveira",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&h=1100&fit=crop",
    location: "Brasil",
    caption:
      "Colecionando momentos, conhecendo pessoas e criando novas oportunidades. 🌎",
    likes: 126,
    liked: false,
    comments: ["Fotografia maravilhosa! 🔥"],
  },
];

const navigation = [
  { id: "inicio", label: "Início", icon: "⌂" },
  { id: "explorar", label: "Explorar", icon: "⌕" },
  { id: "criar", label: "Criar", icon: "+" },
  { id: "oportunidades", label: "Oportunidades", icon: "✧" },
  { id: "perfil", label: "Perfil", icon: "○" },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState("inicio");
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [activeFeed, setActiveFeed] = useState<"for-you" | "following">("for-you");
  const [searchQuery, setSearchQuery] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>(["marianacosta"]);

  function toggleLike(postId: number) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post
      )
    );
  }

  function addComment(postId: number) {
    const text = (drafts[postId] || "").trim();

    if (!text) return;

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, text] }
          : post
      )
    );

    setDrafts((current) => ({ ...current, [postId]: "" }));
  }

  function publishPost() {
    const caption = composerText.trim();
    if (!caption) return;
    const newPost: Post = {
      id: Date.now(),
      name: "Licinhosz.bb",
      username: "licinhosz.bb",
      avatar: "",
      image: "",
      location: "Na Nexora",
      caption,
      likes: 0,
      liked: false,
      comments: [],
      isOwn: true,
    };
    setPosts((current) => [newPost, ...current]);
    setComposerText("");
    setShowComposer(false);
    setActiveTab("inicio");
    setActiveFeed("for-you");
  }

  function handleNavigation(tab: string) {
    if (tab === "criar") {
      setShowComposer(true);
      return;
    }
    setActiveTab(tab);
  }

  const visiblePosts = posts.filter((post) => {
    const query = searchQuery.trim().toLocaleLowerCase("pt-BR");
    const matchesSearch = !query || `${post.name} ${post.username} ${post.caption} ${post.location}`.toLocaleLowerCase("pt-BR").includes(query);
    const matchesFeed = activeFeed === "for-you" || post.isOwn || followedUsers.includes(post.username);
    return matchesSearch && matchesFeed;
  });

  return (
    <main className="nexora-app">
      <header className="topbar">
        <div className="brand">
          <img className="brand-symbol" src="/nexora-logo.svg" alt="Nexora" />
          <span>Community</span>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-button"
            aria-label="Pesquisar"
            onClick={() => setActiveTab("explorar")}
          >
            ⌕
          </button>
          <button
            className="icon-button"
            aria-label="Criar publicação"
            onClick={() => setShowComposer(true)}
          >
            ＋
          </button>
        </div>
      </header>

      <section className="feed-container">
        {activeTab === "inicio" ? (
          <>
            <section className="stories-section">
              <div className="section-heading">
                <h2>Stories</h2>
                <span>Momentos da comunidade</span>
              </div>

              <div className="stories-list">
                {stories.map((story) => (
                  <button
                    className="story"
                    key={story.name}
                    onClick={() =>
                      alert(
                        story.own
                          ? "A criação de stories será implementada na próxima etapa."
                          : `O story de ${story.name} será disponibilizado quando os perfis estiverem conectados.`
                      )
                    }
                  >
                    <div
                      className={`story-ring ${story.own ? "own-story" : ""}`}
                    >
                      {story.own ? (
                        <div className="own-story-inner">+</div>
                      ) : (
                        <img src={story.image} alt={`Story de ${story.name}`} />
                      )}
                    </div>
                    <span>{story.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="feed-heading">
              <div>
                <p className="eyebrow">FEITO PARA DESCOBRIR</p>
                <h1>Seu feed</h1>
              </div>
              <span className="live-indicator"><span /> Comunidade em movimento</span>
            </section>

            <div className="feed-tools">
              <label className="feed-search"><span>⌕</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Buscar pessoas, ideias e publicações" aria-label="Buscar no feed" /></label>
              <div className="feed-switch" role="group" aria-label="Tipo de feed">
                <button className={activeFeed === "for-you" ? "selected" : ""} onClick={() => setActiveFeed("for-you")}>Para você</button>
                <button className={activeFeed === "following" ? "selected" : ""} onClick={() => setActiveFeed("following")}>Seguindo</button>
              </div>
            </div>

            <button className="quick-composer" onClick={() => setShowComposer(true)}>
              <span className="quick-avatar">L</span><span>Compartilhe uma ideia com a comunidade...</span><strong>＋</strong>
            </button>

            <div className="posts-list">
              {visiblePosts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-header">
                    {post.avatar ? <img className="avatar" src={post.avatar} alt={`Foto de ${post.name}`} /> : <span className="avatar avatar-fallback">{post.name.charAt(0)}</span>}

                    <div className="post-author">
                      <strong>{post.name}</strong>
                      <span>
                        @{post.username} · {post.location}
                      </span>
                    </div>

                    <div className="post-header-actions">
                      {!post.isOwn && <button className={`follow-button ${followedUsers.includes(post.username) ? "is-following" : ""}`} onClick={() => setFollowedUsers((current) => current.includes(post.username) ? current.filter((name) => name !== post.username) : [...current, post.username])}>{followedUsers.includes(post.username) ? "Seguindo" : "Seguir"}</button>}
                      <button className="more-button" aria-label="Mais opções" onClick={() => setSavedPosts((current) => current.includes(post.id) ? current.filter((id) => id !== post.id) : [...current, post.id])}>{savedPosts.includes(post.id) ? "◆" : "⋯"}</button>
                    </div>
                  </div>

                  {post.image ? <img className="post-image" src={post.image} alt={`Publicação de ${post.name}`} /> : <div className="text-post-visual"><span>✦ NEXORA</span><p>{post.caption}</p><small>Uma ideia compartilhada pela comunidade</small></div>}

                  <div className="post-content">
                    <div className="post-actions">
                      <button
                        className={`action-button ${post.liked ? "liked" : ""}`}
                        aria-label={post.liked ? "Descurtir" : "Curtir"}
                        onClick={() => toggleLike(post.id)}
                      >
                        {post.liked ? "♥" : "♡"}
                      </button>

                      <button
                        className="action-button"
                        aria-label="Comentários"
                        onClick={() =>
                          setOpenComments(
                            openComments === post.id ? null : post.id
                          )
                        }
                      >
                        ◯
                      </button>

                      <button className={`action-button ${savedPosts.includes(post.id) ? "liked" : ""}`} aria-label={savedPosts.includes(post.id) ? "Remover dos salvos" : "Salvar publicação"} onClick={() => setSavedPosts((current) => current.includes(post.id) ? current.filter((id) => id !== post.id) : [...current, post.id])}>{savedPosts.includes(post.id) ? "◆" : "◇"}</button>
                      <button className="action-button" aria-label="Compartilhar" onClick={() => { if (typeof navigator !== "undefined" && navigator.share) { navigator.share({ title: `Nexora · @${post.username}`, text: post.caption }).catch(() => undefined); } else if (typeof navigator !== "undefined" && navigator.clipboard) { navigator.clipboard.writeText(post.caption).then(() => alert("Texto da publicação copiado!")).catch(() => alert(post.caption)); } else { alert(post.caption); } }}>↗</button>

                      <span className="post-action-spacer" />

                      <span className="post-counter">
                        {post.likes.toLocaleString("pt-BR")} curtidas
                      </span>
                    </div>

                    <p className="post-caption">
                      <strong>@{post.username}</strong> {post.caption}
                    </p>

                    <button
                      className="view-comments"
                      onClick={() =>
                        setOpenComments(
                          openComments === post.id ? null : post.id
                        )
                      }
                    >
                      Ver comentários ({post.comments.length})
                    </button>

                    {openComments === post.id && (
                      <div className="comments-area">
                        {post.comments.map((comment, index) => (
                          <p className="comment" key={`${post.id}-${index}`}>
                            {comment}
                          </p>
                        ))}

                        <form
                          className="comment-form"
                          onSubmit={(event) => {
                            event.preventDefault();
                            addComment(post.id);
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Adicione um comentário..."
                            value={drafts[post.id] || ""}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [post.id]: event.target.value,
                              }))
                            }
                          />
                          <button type="submit">Publicar</button>
                        </form>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {visiblePosts.length === 0 && <div className="no-results"><span>⌕</span><h2>Nada por aqui ainda</h2><p>Tente outra busca ou publique a primeira ideia com esse tema.</p><button className="primary-button" onClick={() => { setSearchQuery(""); setActiveFeed("for-you"); }}>Limpar filtros</button></div>}
            <p className="demo-notice">As publicações de exemplo são demonstrativas. Novos posts criados nesta sessão aparecem no feed, mas ainda não ficam salvos em uma conta ou banco de dados.</p>
          </>
        ) : activeTab === "explorar" ? (
          <section className="explore-section">
            <p className="eyebrow">DESCUBRA ALGO NOVO</p><h1>Explore a Nexora</h1><p className="explore-intro">Encontre conversas, criadores e ideias que combinam com você.</p>
            <label className="feed-search explore-search"><span>⌕</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="O que você quer descobrir?" aria-label="Buscar publicações" /></label>
            <div className="explore-chips"><button onClick={() => setSearchQuery("")}>✦ Em alta</button><button onClick={() => setSearchQuery("fotografia")}>▧ Fotografia</button><button onClick={() => setSearchQuery("oportunidades")}>↗ Oportunidades</button><button onClick={() => setSearchQuery("ideias")}>◇ Ideias</button></div>
            <div className="explore-grid">{visiblePosts.map((post) => <button className="explore-card" key={post.id} onClick={() => { setActiveTab("inicio"); setActiveFeed("for-you"); }}><span className="explore-card-art">{post.image ? <img src={post.image} alt="" /> : <span>✦</span>}</span><strong>{post.caption}</strong><small>@{post.username}</small></button>)}</div>
            {visiblePosts.length === 0 && <div className="no-results"><h2>Sem resultados ainda</h2><p>Experimente outra palavra-chave.</p></div>}
          </section>
        ) : (
          <section className="empty-section">
            <div className="empty-icon">
              {navigation.find((item) => item.id === activeTab)?.icon || "N"}
            </div>
            <p className="eyebrow">NEXORA</p>
            <h1>
              {activeTab === "explorar"
                ? "Explore novas ideias"
                : activeTab === "oportunidades"
                  ? "Oportunidades para você"
                  : "Seu espaço na Nexora"}
            </h1>
            <p>
              Esta área está sendo preparada. Na próxima etapa, vamos
              desenvolver as funções reais desta seção.
            </p>
            <button
              className="primary-button"
              onClick={() => setActiveTab("inicio")}
            >
              Voltar ao início
            </button>
          </section>
        )}
      </section>

      {showComposer && <div className="composer-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowComposer(false); }}><section className="composer-modal" role="dialog" aria-modal="true" aria-labelledby="composer-title"><div className="composer-title-row"><div><p className="eyebrow">SUA VOZ, SEU ESPAÇO</p><h2 id="composer-title">Criar publicação</h2></div><button className="composer-close" onClick={() => setShowComposer(false)} aria-label="Fechar">×</button></div><div className="composer-user"><span className="quick-avatar">L</span><div><strong>Licinhosz.bb</strong><small>Compartilhando com a comunidade</small></div></div><form onSubmit={(event) => { event.preventDefault(); publishPost(); }}><textarea autoFocus value={composerText} onChange={(event) => setComposerText(event.target.value)} maxLength={1000} placeholder="O que você quer compartilhar hoje?" aria-label="Texto da publicação" /><div className="composer-footer"><span>{composerText.length}/1000</span><button className="primary-button" type="submit" disabled={!composerText.trim()}>Publicar agora ↗</button></div><p className="composer-note">Nesta etapa, você já pode publicar texto no feed desta sessão. Fotos, vídeos e salvamento permanente entram na integração de backend.</p></form></section></div>}

      <nav className="bottom-nav" aria-label="Navegação principal">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => handleNavigation(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
   }
