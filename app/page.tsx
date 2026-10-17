
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/nexora/supabase-client";
import { calculateProfileStats, filterFeedPosts, toggleListItem } from "../lib/nexora/feed-utils";
import type { Post, Story } from "../lib/nexora/types";
import { initialPosts, navigation, stories } from "../lib/nexora/demo-data";

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
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [databaseFeedLoaded, setDatabaseFeedLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    async function loadPublicFeed() {
      const { data, error } = await supabase!
        .from("posts")
        .select("id, caption, image_url, created_at, profiles!posts_user_id_fkey(username, display_name, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error || !data?.length || cancelled) return;

      const rows = data as unknown as Array<{
        id: string;
        caption: string;
        image_url: string | null;
        created_at: string;
        profiles: { username: string; display_name: string; avatar_url: string | null } | Array<{ username: string; display_name: string; avatar_url: string | null }> | null;
      }>;
      const ids = rows.map((row) => row.id);
      const [likesResult, commentsResult] = await Promise.all([
        supabase!.from("likes").select("post_id").in("post_id", ids),
        supabase!.from("comments").select("post_id, body").in("post_id", ids).order("created_at", { ascending: true }),
      ]);
      if (cancelled) return;

      const likeCounts = new Map<string, number>();
      (likesResult.data ?? []).forEach((like: { post_id: string }) => {
        likeCounts.set(like.post_id, (likeCounts.get(like.post_id) ?? 0) + 1);
      });
      const commentsByPost = new Map<string, string[]>();
      (commentsResult.data ?? []).forEach((comment: { post_id: string; body: string }) => {
        commentsByPost.set(comment.post_id, [...(commentsByPost.get(comment.post_id) ?? []), comment.body]);
      });

      const databasePosts: Post[] = rows.map((row) => {
        const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        const username = profile?.username || "pessoa-nexora";
        return {
          id: row.id,
          name: profile?.display_name || username,
          username,
          avatar: profile?.avatar_url || "",
          image: row.image_url || "",
          location: "Na Nexora",
          caption: row.caption,
          likes: likeCounts.get(row.id) ?? 0,
          liked: false,
          comments: commentsByPost.get(row.id) ?? [],
        };
      });
      setPosts(databasePosts);
      setDatabaseFeedLoaded(true);
    }

    void loadPublicFeed();
    return () => { cancelled = true; };
  }, []);

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

  const visiblePosts = filterFeedPosts(posts, searchQuery, activeFeed, followedUsers);
  const profileStats = calculateProfileStats(posts, followedUsers, savedPosts);

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
                    onClick={() => setActiveStory(story)}
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
                      {!post.isOwn && <button className={`follow-button ${followedUsers.includes(post.username) ? "is-following" : ""}`} onClick={() => setFollowedUsers((current) => toggleListItem(current, post.username))}>{followedUsers.includes(post.username) ? "Seguindo" : "Seguir"}</button>}
                      <button className="more-button" aria-label="Mais opções" onClick={() => setSavedPosts((current) => toggleListItem(current, post.id))}>{savedPosts.includes(post.id) ? "◆" : "⋯"}</button>
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
            <p className="demo-notice">{databaseFeedLoaded ? "Feed carregado do banco de dados da Nexora. Publicar e interagir ainda depende da etapa de autenticação." : "As publicações de exemplo são demonstrativas. O feed real será exibido quando houver publicações no banco; publicar e interagir com persistência depende da etapa de autenticação."}</p>
          </>
        ) : activeTab === "explorar" ? (
          <section className="explore-section">
            <p className="eyebrow">DESCUBRA ALGO NOVO</p><h1>Explore a Nexora</h1><p className="explore-intro">Encontre conversas, criadores e ideias que combinam com você.</p>
            <label className="feed-search explore-search"><span>⌕</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="O que você quer descobrir?" aria-label="Buscar publicações" /></label>
            <div className="explore-chips"><button onClick={() => setSearchQuery("")}>✦ Em alta</button><button onClick={() => setSearchQuery("fotografia")}>▧ Fotografia</button><button onClick={() => setSearchQuery("oportunidades")}>↗ Oportunidades</button><button onClick={() => setSearchQuery("ideias")}>◇ Ideias</button></div>
            <div className="explore-grid">{visiblePosts.map((post) => <button className="explore-card" key={post.id} onClick={() => { setActiveTab("inicio"); setActiveFeed("for-you"); }}><span className="explore-card-art">{post.image ? <img src={post.image} alt="" /> : <span>✦</span>}</span><strong>{post.caption}</strong><small>@{post.username}</small></button>)}</div>
            {visiblePosts.length === 0 && <div className="no-results"><h2>Sem resultados ainda</h2><p>Experimente outra palavra-chave.</p></div>}
          </section>
        ) : activeTab === "perfil" ? (
          <section className="profile-reference">
            <div className="profile-identity">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop" alt="Foto de perfil demonstrativa" />
              <div className="profile-name-block"><h1>Licinhosz.bb</h1><p>@licinhosz.bb</p><div className="profile-buttons"><button onClick={() => alert("A edição de perfil será conectada na próxima etapa.")}>Editar perfil</button><button onClick={() => alert("Mensagens serão conectadas na próxima etapa.")}>Mensagem</button></div></div>
            </div>
            <div className="profile-stats"><div><strong>{profileStats.ownPosts.toLocaleString("pt-BR")}</strong><span>Posts seus</span></div><div><strong>{profileStats.following.toLocaleString("pt-BR")}</strong><span>Seguindo</span></div><div><strong>{profileStats.saved.toLocaleString("pt-BR")}</strong><span>Salvos</span></div><div><strong>{profileStats.feedLikes.toLocaleString("pt-BR")}</strong><span>Curtidas no feed</span></div></div>
            <div className="profile-bio"><p>🚀 Criador digital | Construindo conexões</p><p>🌐 Conectando pessoas, marcas e oportunidades</p><p>✨ Bem-vindo ao meu espaço na Nexora</p></div>
            <div className="profile-grid-tabs"><span>▦ Publicações</span><span>▣ Vídeos</span><span>♡ Curtidas</span><span>▢ Salvos</span></div>
            <div className="profile-post-grid">{posts.filter(post => post.image).map(post => <button key={post.id} onClick={() => setActiveTab("inicio")}><img src={post.image} alt={post.caption} /></button>)}</div>
          </section>
        ) : activeTab === "curtidas" ? (
          <section className="empty-section"><div className="empty-icon">♡</div><p className="eyebrow">COMMUNITY</p><h1>Suas curtidas</h1><p>As publicações que você curtir aparecerão nesta área quando sua conta estiver conectada.</p><button className="primary-button" onClick={() => setActiveTab("inicio")}>Voltar à comunidade</button></section>
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

      {activeStory && <div className="story-viewer-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setActiveStory(null); }}><section className="story-viewer" role="dialog" aria-modal="true" aria-label={`Story de ${activeStory.name}`} style={{backgroundImage: `linear-gradient(180deg,#10091555,#10091508 45%,#100915d9),url(${activeStory.own ? "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&h=1500&fit=crop" : activeStory.image.replace("w=160&h=160","w=900&h=1500")})`}}><div className="story-progress"><span /></div><header className="story-viewer-header"><img src={activeStory.image || "/nexora-logo.svg"} alt="" /><div><strong>{activeStory.own ? "Seu story" : activeStory.name}</strong><small>{activeStory.own ? "Agora mesmo" : "há 12 min"}</small></div><button onClick={() => setActiveStory(null)} aria-label="Fechar story">×</button></header><div className="story-viewer-bottom"><label><input placeholder="Adicionar um comentário..." aria-label="Adicionar comentário" /><button onClick={() => alert("Os comentários de stories serão salvos quando a conta estiver conectada.")}>Enviar</button></label><button className="story-heart" onClick={() => alert("Curtida registrada nesta demonstração.")} aria-label="Curtir story">♡</button></div></section></div>}

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
