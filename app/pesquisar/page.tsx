"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import PrimaryNav from "../components/PrimaryNav";

type Profile = { id: string; username: string; display_name: string | null; bio: string | null; avatar_url: string | null };
type Post = { id: string; user_id: string; caption: string | null; image_url: string | null; created_at: string };
type Kind = "todos" | "pessoas" | "posts" | "reels";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase: SupabaseClient | null = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function Magnifier({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>;
}
function VerifiedMark() { return <span className="discover-verified" aria-label="Verificado">✓</span>; }
function Avatar({ profile }: { profile: Profile }) {
  return profile.avatar_url
    ? <img className="discover-avatar" src={profile.avatar_url} alt="" />
    : <span className="discover-avatar discover-avatar-fallback">{(profile.display_name || profile.username || "N").slice(0,1).toUpperCase()}</span>;
}

export default function PesquisarPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind>("todos");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postAuthors, setPostAuthors] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    let active = true;
    if (!supabase || query.trim().length < 2) {
      setProfiles([]); setPosts([]); setPostAuthors({}); setLoading(false); setError(""); setSearched(false);
      return () => { active = false; };
    }
    const timer = window.setTimeout(async () => {
      setLoading(true); setError(""); setSearched(true);
      try {
        const term = query.trim().replace(/[,%()]/g, " ");
        const shouldFindPeople = kind === "todos" || kind === "pessoas";
        const shouldFindPosts = kind === "todos" || kind === "posts" || kind === "reels";
        const [profileResult, postResult] = await Promise.all([
          shouldFindPeople ? supabase.from("profiles").select("id,username,display_name,bio,avatar_url").or(`username.ilike.%${term}%,display_name.ilike.%${term}%`).order("display_name").limit(30) : Promise.resolve({ data: [], error: null }),
          shouldFindPosts ? supabase.from("posts").select("id,user_id,caption,image_url,created_at").ilike("caption", `%${term}%`).order("created_at", { ascending: false }).limit(30) : Promise.resolve({ data: [], error: null })
        ]);
        if (!active) return;
        if (profileResult.error || postResult.error) throw new Error("Não foi possível consultar os resultados agora. Verifique a conexão e as permissões públicas de leitura.");
        const foundPosts = (postResult.data || []) as Post[];
        const authorIds = [...new Set(foundPosts.map(post => post.user_id))];
        let authorMap: Record<string, Profile> = {};
        if (authorIds.length) {
          const authors = await supabase.from("profiles").select("id,username,display_name,bio,avatar_url").in("id", authorIds);
          if (authors.error) throw new Error("Não foi possível carregar os perfis das publicações.");
          authorMap = Object.fromEntries(((authors.data || []) as Profile[]).map(profile => [profile.id, profile]));
        }
        setProfiles((profileResult.data || []) as Profile[]);
        setPosts(kind === "reels" ? foundPosts.filter(post => Boolean(post.image_url)) : foundPosts);
        setPostAuthors(authorMap);
      } catch (caught) {
        if (active) { setError(caught instanceof Error ? caught.message : "Ocorreu um erro na pesquisa."); setProfiles([]); setPosts([]); }
      } finally { if (active) setLoading(false); }
    }, 260);
    return () => { active = false; window.clearTimeout(timer); };
  }, [query, kind]);

  const showPeople = kind === "todos" || kind === "pessoas";
  const showPosts = kind === "todos" || kind === "posts" || kind === "reels";
  const hasResults = (showPeople && profiles.length > 0) || (showPosts && posts.length > 0);
  const heading = useMemo(() => query.trim() ? `Resultados para “${query.trim()}”` : "Descubra a Nexora", [query]);

  return <main className="discover-page">
    <header className="discover-header">
      <Link href="/" className="discover-back" aria-label="Voltar ao início">‹</Link>
      <div><p className="discover-eyebrow">NEXORA · EXPLORAR</p><h1>Descobrir</h1></div>
      <span className="discover-brand-mark">N</span>
    </header>

    <section className="discover-search-wrap" aria-label="Pesquisar na Nexora">
      <div className="discover-search"><Magnifier size={22}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Pesquise pessoas, posts e Reels" aria-label="Pesquisar pessoas, posts e Reels" autoComplete="off"/>{query && <button onClick={() => setQuery("")} aria-label="Limpar pesquisa">×</button>}</div>
      <p className="discover-hint">Encontre criadores, perfis e publicações em um só lugar.</p>
    </section>

    <div className="discover-tabs" role="tablist" aria-label="Tipo de resultado">
      {([{id:"todos",label:"Tudo"},{id:"pessoas",label:"Pessoas"},{id:"posts",label:"Posts"},{id:"reels",label:"Reels"}] as {id:Kind;label:string}[]).map(tab =>
        <button key={tab.id} role="tab" aria-selected={kind === tab.id} className={kind === tab.id ? "selected" : ""} onClick={() => setKind(tab.id)}>{tab.label}</button>
      )}
    </div>

    <section className="discover-content">
      <div className="discover-section-title"><div><span className="discover-spark">✦</span><h2>{heading}</h2></div>{query.trim().length >= 2 && <span className="discover-count">{loading ? "Buscando…" : hasResults ? "Encontrado" : ""}</span>}</div>
      {!supabase && <div className="discover-state"><span className="discover-state-icon">⌕</span><h3>A pesquisa está pronta para conectar</h3><p>Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no serviço para carregar perfis e publicações reais.</p></div>}
      {supabase && query.trim().length < 2 && <div className="discover-welcome"><div className="discover-orbit"><Magnifier size={34}/></div><h3>O que você quer descobrir?</h3><p>Digite pelo menos 2 caracteres para pesquisar perfis e publicações da Nexora.</p><div className="discover-shortcuts"><span>✦ Criadores</span><span>▣ Publicações</span><span>▶ Reels</span></div></div>}
      {loading && <div className="discover-loading"><span/><span/><span/></div>}
      {error && <div className="discover-state"><h3>Não conseguimos pesquisar</h3><p>{error}</p></div>}
      {supabase && searched && !loading && !error && !hasResults && <div className="discover-state"><span className="discover-state-icon">⌕</span><h3>Nenhum resultado por enquanto</h3><p>Tente outro nome, @usuário ou palavra da publicação.</p></div>}

      {supabase && !loading && !error && showPeople && profiles.length > 0 && <section className="discover-results-section"><h3 className="discover-subheading">Pessoas <span>{profiles.length}</span></h3><div className="discover-people-list">{profiles.map(profile => <article className="discover-person" key={profile.id}><Link href={`/perfil?username=${encodeURIComponent(profile.username)}`} className="discover-person-main"><Avatar profile={profile}/><span className="discover-person-copy"><strong>{profile.display_name || profile.username}</strong><span>@{profile.username}</span>{profile.bio && <small>{profile.bio}</small>}</span></Link><Link className="discover-view-profile" href={`/perfil?username=${encodeURIComponent(profile.username)}`}>Ver perfil</Link></article>)}</div></section>}

      {supabase && !loading && !error && showPosts && posts.length > 0 && <section className="discover-results-section"><h3 className="discover-subheading">{kind === "reels" ? "Reels e mídias" : "Publicações"} <span>{posts.length}</span></h3>{kind === "reels" && <p className="discover-note">A estrutura atual do banco ainda não separa Reels de outras mídias; aqui aparecem publicações com mídia anexada.</p>}<div className="discover-post-grid">{posts.map(post => { const author = postAuthors[post.user_id]; return <Link href={`/perfil?username=${encodeURIComponent(author?.username || "")}`} className="discover-post" key={post.id}>{post.image_url ? <img src={post.image_url} alt={post.caption || "Publicação Nexora"} loading="lazy"/> : <div className="discover-text-post"><span>NEXORA ✦</span><p>{post.caption}</p></div>}<span className="discover-post-caption">{post.caption || "Publicação"}</span><span className="discover-post-author">@{author?.username || "criador"}</span></Link>; })}</div></section>}
    </section>
    <PrimaryNav active="inicio"/>
    <style jsx>{`
      .discover-page{min-height:100dvh;padding:0 0 112px;color:#faf7ff;background:radial-gradient(ellipse at 50% -10%,#2b0748 0,transparent 48%),#080313}
      .discover-header{display:flex;align-items:center;gap:14px;padding:24px 20px 18px;border-bottom:1px solid #8f28c52b}
      .discover-back{display:grid;place-items:center;width:44px;height:44px;border:1px solid #a000ff65;border-radius:15px;color:#fff;text-decoration:none;font-size:32px;line-height:1;background:#160923}
      .discover-eyebrow{margin:0 0 4px;color:#b68bff;font-size:10px;font-weight:800;letter-spacing:2px}
      h1{margin:0;font-size:27px;letter-spacing:-.8px;font-weight:850}
      .discover-brand-mark{display:grid;place-items:center;margin-left:auto;width:38px;height:38px;border-radius:13px;font-size:23px;font-weight:900;background:linear-gradient(140deg,#17cfff,#a000ff 55%,#f41cce);box-shadow:0 0 22px #a000ff40}
      .discover-search-wrap{padding:20px 18px 14px}
      .discover-search{display:flex;align-items:center;gap:11px;padding:0 14px;height:58px;border:1px solid #a000ff80;border-radius:19px;background:linear-gradient(110deg,#170a26,#0d0717);box-shadow:0 0 26px #8200ff12,inset 0 1px #ffffff09;color:#d9b7ff}
      .discover-search input{min-width:0;flex:1;border:0;outline:none;background:transparent;color:#fff;font-size:14px}
      .discover-search input::placeholder{color:#a997b8}
      .discover-search button{border:0;background:transparent;color:#dfc8ff;font-size:26px}
      .discover-hint{margin:10px 3px 0;color:#aa9ab9;font-size:12px}
      .discover-tabs{display:flex;gap:8px;overflow-x:auto;padding:5px 18px 17px;scrollbar-width:none}
      .discover-tabs button{flex:0 0 auto;padding:10px 17px;border:1px solid #6c318c70;border-radius:999px;background:#13091f;color:#bca9ce;font-size:13px;font-weight:700}
      .discover-tabs button.selected{border-color:#a000ff;background:linear-gradient(110deg,#7d18bd,#a11ce0);color:#fff;box-shadow:0 5px 18px #8b00ff2b}
      .discover-content{padding:0 18px}
      .discover-section-title,.discover-section-title>div{display:flex;align-items:center;justify-content:space-between;gap:10px}
      .discover-section-title{margin:6px 0 17px}
      .discover-section-title>div{justify-content:flex-start}
      .discover-spark{color:#d48aff;font-size:19px}
      .discover-section-title h2{margin:0;font-size:17px;font-weight:800;letter-spacing:-.3px}
      .discover-count{color:#b6a1c8;font-size:11px}
      .discover-welcome,.discover-state{display:flex;align-items:center;flex-direction:column;text-align:center;padding:36px 20px 32px;border:1px solid #7927a04d;border-radius:24px;background:linear-gradient(150deg,#14091f,#0d0617);box-shadow:0 16px 36px #0003}
      .discover-orbit{display:grid;place-items:center;width:76px;height:76px;border:1px solid #b042ff;border-radius:25px;background:radial-gradient(circle,#7925ba55,transparent 72%),#150823;color:#e9c7ff;box-shadow:0 0 28px #a000ff28}
      .discover-welcome h3,.discover-state h3{margin:18px 0 7px;font-size:18px}
      .discover-welcome p,.discover-state p{max-width:360px;margin:0;color:#b7a7c6;font-size:13px;line-height:1.6}
      .discover-shortcuts{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:20px}
      .discover-shortcuts span{padding:8px 10px;border:1px solid #6b3a8c80;border-radius:999px;background:#1b0c2b;color:#d9c5ec;font-size:11px}
      .discover-state-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:17px;background:#221032;color:#d5a0ff;font-size:31px}
      .discover-results-section{margin:20px 0 28px}
      .discover-subheading{display:flex;align-items:center;gap:9px;margin:0 0 12px;font-size:15px;font-weight:800}
      .discover-subheading span{display:grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:#291039;color:#d9a8ff;font-size:11px}
      .discover-people-list{display:grid;gap:10px}
      .discover-person{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #65258b65;border-radius:19px;background:linear-gradient(110deg,#170a25,#100819)}
      .discover-person-main{display:flex;align-items:center;gap:11px;min-width:0;flex:1;text-decoration:none;color:inherit}
      .discover-avatar{flex:0 0 52px;width:52px;height:52px;border-radius:50%;border:2px solid #bc48ff;padding:2px;object-fit:cover;background:#160820}
      .discover-avatar-fallback{display:grid;place-items:center;background:linear-gradient(145deg,#1d8dcb,#8e1bda);font-size:21px;font-weight:800}
      .discover-person-copy{display:flex;flex-direction:column;min-width:0;gap:3px}
      .discover-person-copy strong{display:flex;align-items:center;gap:5px;font-size:13px}
      .discover-person-copy>span{color:#b8a3ca;font-size:12px}
      .discover-person-copy small{max-width:200px;overflow:hidden;color:#d4c7df;font-size:11px;text-overflow:ellipsis;white-space:nowrap}
      .discover-view-profile{flex:0 0 auto;padding:9px 11px;border:1px solid #a000ff80;border-radius:12px;background:#241032;color:#f6eaff;text-decoration:none;font-size:11px;font-weight:750}
      .discover-verified{display:inline-grid;place-items:center;width:15px;height:15px;border-radius:50%;background:#149de8;color:white;font-size:10px}
      .discover-post-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .discover-post{position:relative;display:flex;min-width:0;flex-direction:column;gap:5px;overflow:hidden;padding:0 0 11px;border:1px solid #67268c65;border-radius:17px;background:#12091d;color:inherit;text-decoration:none}
      .discover-post>img{width:100%;aspect-ratio:4/4.5;object-fit:cover;background:#1a0d27}
      .discover-text-post{display:flex;flex-direction:column;justify-content:center;gap:12px;min-height:180px;padding:15px;background:radial-gradient(circle at 100% 0,#6325a65c,transparent 50%),linear-gradient(145deg,#190d2b,#0b1325)}
      .discover-text-post span{font-size:9px;letter-spacing:2px;color:#c994ff;font-weight:900}
      .discover-text-post p{display:-webkit-box;overflow:hidden;margin:0;color:#fff;font-size:13px;font-weight:750;line-height:1.4;-webkit-box-orient:vertical;-webkit-line-clamp:5}
      .discover-post-caption{display:-webkit-box;overflow:hidden;margin:5px 10px 0;font-size:12px;line-height:1.4;-webkit-box-orient:vertical;-webkit-line-clamp:2}
      .discover-post-author{margin:0 10px;color:#b9a2cf;font-size:11px}
      .discover-note{margin:-3px 0 12px;color:#b5a3c4;font-size:11px;line-height:1.5}
      .discover-loading{display:flex;gap:8px;justify-content:center;padding:36px}
      .discover-loading span{width:8px;height:8px;border-radius:50%;background:#c46bff;animation:discoverPulse 1s infinite alternate}
      .discover-loading span:nth-child(2){animation-delay:.2s}.discover-loading span:nth-child(3){animation-delay:.4s}
      @keyframes discoverPulse{to{opacity:.25;transform:translateY(-4px)}}
      @media(min-width:700px){.discover-page{max-width:720px;margin:0 auto;border-left:1px solid #8f28c52b;border-right:1px solid #8f28c52b}.discover-content{padding:0 28px}.discover-search-wrap{padding-inline:28px}.discover-header{padding-inline:28px}.discover-post-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    `}</style>
  </main>;
}
