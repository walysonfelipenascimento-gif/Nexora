
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
  { id: "oportunidades", label: "Oportunidades", icon: "◇" },
  { id: "perfil", label: "Perfil", icon: "○" },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState("inicio");
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

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

  function handleNavigation(tab: string) {
    if (tab === "criar") {
      alert("A publicação de fotos e vídeos será implementada na próxima etapa.");
      return;
    }

    setActiveTab(tab);

    if (tab === "perfil") {
      alert("Os perfis pessoais serão conectados na próxima etapa.");
    }
  }

  return (
    <main className="nexora-app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-symbol">N</div>
          <span>Nexora</span>
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
            aria-label="Notificações"
            onClick={() =>
              alert("As notificações serão implementadas na próxima etapa.")
            }
          >
            ♡
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
                <p className="eyebrow">SUA COMUNIDADE</p>
                <h1>Seu feed</h1>
              </div>
              <span className="live-indicator">
                <span /> Descubra novidades
              </span>
            </section>

            <div className="posts-list">
              {posts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-header">
                    <img
                      className="avatar"
                      src={post.avatar}
                      alt={`Foto de ${post.name}`}
                    />

                    <div className="post-author">
                      <strong>{post.name}</strong>
                      <span>
                        @{post.username} · {post.location}
                      </span>
                    </div>

                    <button
                      className="more-button"
                      aria-label="Mais opções"
                      onClick={() =>
                        alert("As opções de denúncia e bloqueio serão implementadas na próxima etapa.")
                      }
                    >
                      ⋯
                    </button>
                  </div>

                  <img
                    className="post-image"
                    src={post.image}
                    alt={`Publicação de ${post.name}`}
                  />

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

                      <button
                        className="action-button"
                        aria-label="Compartilhar"
                        onClick={() =>
                          alert("O compartilhamento será implementado na próxima etapa.")
                        }
                      >
                        ↗
                      </button>

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

            <p className="demo-notice">
              Você está visualizando publicações demonstrativas. Elas ainda não
              representam usuários reais da Nexora.
            </p>
          </>
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
