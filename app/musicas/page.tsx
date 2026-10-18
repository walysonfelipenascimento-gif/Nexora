"use client";

import { useEffect, useMemo, useState } from "react";

type Artist = { name: string; genre: string; status: "Aguardando licença" | "Em análise"; note: string };

const artists: Artist[] = [
  { name: "Heitor Santos", genre: "Arrocha / Sofrência", status: "Aguardando licença", note: "Artista solicitado para o catálogo Nexora" },
  { name: "Heitor Costa", genre: "Arrocha / Seresta", status: "Aguardando licença", note: "Artista solicitado para o catálogo Nexora" },
  { name: "Nadson Ferinha", genre: "Arrocha", status: "Aguardando licença", note: "Artista solicitado para o catálogo Nexora" },
  { name: "Seu Desejo", genre: "Forró / Brega romântico", status: "Aguardando licença", note: "Grupo solicitado para o catálogo Nexora" },
  { name: "Desejo de Menina", genre: "Forró romântico", status: "Aguardando licença", note: "Grupo solicitado para o catálogo Nexora" },
  { name: "Calcinha Preta", genre: "Forró eletrônico", status: "Aguardando licença", note: "Banda solicitada para o catálogo Nexora" },
  { name: "Tícia Rebbeca", genre: "Brega / Arrocha", status: "Aguardando licença", note: "Artista solicitado para o catálogo Nexora" },
  { name: "Anderson Neiff", genre: "Brega funk", status: "Aguardando licença", note: "Artista solicitado para o catálogo Nexora" },
  { name: "Oruam", genre: "Rap / Trap", status: "Aguardando licença", note: "Artista solicitado para o catálogo Nexora" },
  { name: "MCs e artistas de funk", genre: "Funk", status: "Em análise", note: "Categoria aberta para futuras solicitações" },
  { name: "Novos artistas independentes", genre: "Todos os gêneros", status: "Em análise", note: "Espaço para artistas e selos que queiram licenciar músicas" },
];

export default function MusicasPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Todos");
  const [requested, setRequested] = useState<string[]>([]);
  const [requestsReady, setRequestsReady] = useState(false);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("nexora-music-artist-interest-v1");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setRequested(parsed.filter((item): item is string => typeof item === "string" && artists.some((artist) => artist.name === item)));
      }
    } catch { /* armazenamento local indisponível: a página continua funcionando */ }
    setRequestsReady(true);
  }, []);
  useEffect(() => {
    if (!requestsReady) return;
    try { window.localStorage.setItem("nexora-music-artist-interest-v1", JSON.stringify(requested)); } catch { /* preferência opcional */ }
  }, [requested, requestsReady]);
  const filtered = useMemo(() => artists.filter((artist) => {
    const matchesQuery = (artist.name + " " + artist.genre).toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (genre === "Todos" || artist.genre.toLowerCase().includes(genre.toLowerCase()));
  }), [query, genre]);

  return (
    <main className="music-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a href="/" className="brand"><span className="brand-mark">N</span><span>NEXORA<span className="brand-sub">MÚSICA</span></span></a>
        <a href="/" className="back-link">← Voltar ao feed</a>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="pulse" /> CENTRAL MUSICAL NEXORA</div>
        <h1>Sua música.<br /><span>Seu momento.</span></h1>
        <p>Encontre artistas, acompanhe as solicitações de catálogo e prepare suas publicações, Stories, Reels e Notas para receber trilhas oficialmente licenciadas.</p>
        <div className="hero-pills"><span>♫ Publicações</span><span>◉ Stories & Reels</span><span>✦ Notas</span></div>
      </section>

      <section className="notice" role="note">
        <span className="notice-icon">©</span>
        <div><strong>Direitos autorais em primeiro lugar</strong><p>Estes artistas estão na lista de interesse da Nexora. As músicas ainda não estão liberadas para uso nesta página. Só serão ativadas depois de confirmar as autorizações necessárias; crédito ao artista, sozinho, não substitui uma licença.</p></div>
      </section>

      <section className="catalog">
        <div className="section-heading"><div><span className="kicker">EXPLORE</span><h2>Artistas desejados</h2></div><span className="count">{filtered.length} opções · {requested.length} interesses</span></div>
        <label className="searchbox"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar artista ou gênero..." aria-label="Buscar artista ou gênero" /></label>
        <div className="filters">
          {["Todos", "Arrocha", "Forró", "Funk", "Rap"].map((item) => <button key={item} onClick={() => setGenre(item)} className={genre === item ? "filter active" : "filter"}>{item}</button>)}
        </div>
        <div className="artist-grid">
          {filtered.map((artist, index) => {
            const isRequested = requested.includes(artist.name);
            return <article className="artist-card" key={artist.name}>
              <div className="artist-art" aria-hidden="true"><span className="music-note">♫</span><span className="artist-index">{String(index + 1).padStart(2, "0")}</span></div>
              <div className="artist-info"><div className="artist-meta"><span className={artist.status === "Em análise" ? "status review" : "status"}><i />{artist.status}</span></div><h3>{artist.name}</h3><p>{artist.genre}</p><small>{artist.note}</small>
              <button className="request-button" onClick={() => setRequested((old) => isRequested ? old.filter((name) => name !== artist.name) : [...old, artist.name])}>{isRequested ? "✓ Marcado como interesse" : "＋ Tenho interesse"}</button>
              </div>
            </article>;
          })}
          {filtered.length === 0 && <div className="empty">Nenhum artista encontrado. Tente outro nome ou gênero.</div>}
        </div>
      </section>

      <section className="how">
        <div className="notice" role="note" style={{marginBottom:24}}>
          <span className="notice-icon">♡</span>
          <div><strong>Seus interesses ficam salvos neste dispositivo</strong><p>Marque os artistas que você quer ver no catálogo. Essa lista é uma preferência local, não uma solicitação enviada ao artista nem uma confirmação de licença.</p></div>
        </div>
        <span className="kicker">COMO VAI FUNCIONAR</span><h2>Da escolha à publicação</h2>
        <div className="steps">
          <div><b>01</b><strong>Escolha uma faixa</strong><p>Pesquise por música, artista, álbum ou gênero e ouça apenas as prévias autorizadas.</p></div>
          <div><b>02</b><strong>Edite seu conteúdo</strong><p>Selecione o trecho e use a música nos formatos que a licença permitir.</p></div>
          <div><b>03</b><strong>Créditos automáticos</strong><p>A publicação exibirá faixa, artista e os créditos definidos pelos titulares.</p></div>
        </div>
      </section>
      <footer> NEXORA · Conectando pessoas, marcas e oportunidades. <span>Catálogo em preparação · Nenhuma faixa de áudio é distribuída nesta página.</span></footer>

      <style jsx>{`
        :global(*){box-sizing:border-box} :global(body){margin:0;background:#070912;color:#f5f6ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .music-page{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(ellipse at 18% 5%,rgba(38,72,190,.19),transparent 34%),radial-gradient(ellipse at 90% 24%,rgba(147,48,207,.13),transparent 31%),#070912;padding:0 22px 50px}
        .ambient{position:absolute;filter:blur(75px);border-radius:50%;opacity:.28;pointer-events:none}.ambient-one{width:170px;height:170px;background:#087bff;top:330px;left:-100px}.ambient-two{width:180px;height:180px;background:#a12df5;right:-120px;top:800px}
        .topbar,.hero,.notice,.catalog,.how,footer{max-width:1060px;margin-left:auto;margin-right:auto;position:relative}
        .topbar{height:76px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.08)}
        .brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-weight:900;letter-spacing:1.6px;font-size:14px}.brand-mark{display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#04d9ff,#5262ff 56%,#d946ef);box-shadow:0 0 24px #3867ff55;font-size:23px;font-style:italic}.brand-sub{display:block;font-size:9px;letter-spacing:3px;color:#9ba7ff;margin-top:2px}.back-link{font-size:12px;color:#c4c8e9;text-decoration:none;border:1px solid #ffffff1c;border-radius:20px;padding:9px 13px}
        .hero{padding:66px 0 30px}.eyebrow,.kicker{font-size:10px;font-weight:800;letter-spacing:2.3px;color:#a6b7ff}.eyebrow{display:flex;align-items:center;gap:9px}.pulse{width:7px;height:7px;border-radius:50%;background:#35e5ff;box-shadow:0 0 12px #35e5ff}.hero h1{font-size:clamp(42px,8vw,76px);line-height:.99;letter-spacing:-3px;margin:22px 0 18px;font-weight:850}.hero h1 span{background:linear-gradient(90deg,#42d9ff,#7e81ff 53%,#e47cff);-webkit-background-clip:text;background-clip:text;color:transparent}.hero p{max-width:610px;color:#a9afca;font-size:15px;line-height:1.8;margin:0}.hero-pills{display:flex;gap:9px;flex-wrap:wrap;margin-top:24px}.hero-pills span{font-size:11px;padding:9px 12px;border-radius:22px;border:1px solid #ffffff17;background:#ffffff08;color:#d8dcf8}
        .notice{display:flex;gap:15px;padding:18px;border-radius:18px;background:linear-gradient(110deg,#14203b,#161326);border:1px solid #8c9dff38;margin-top:18px}.notice-icon{flex:none;width:35px;height:35px;border-radius:11px;display:grid;place-items:center;color:#6ce8ff;background:#39d9ff17;font-size:20px}.notice strong{font-size:13px}.notice p{font-size:12px;line-height:1.7;color:#b6bdd7;margin:6px 0 0}
        .catalog{padding-top:52px}.section-heading{display:flex;align-items:end;justify-content:space-between;margin-bottom:19px}.section-heading h2,.how h2{font-size:27px;letter-spacing:-.7px;margin:7px 0 0}.count{font-size:11px;color:#9da6ca;padding:7px 10px;background:#ffffff0a;border-radius:15px}.searchbox{display:flex;align-items:center;gap:12px;border:1px solid #ffffff1b;background:#0e1221;border-radius:14px;padding:0 15px;height:49px;color:#7f8dca}.searchbox span{font-size:24px}.searchbox input{width:100%;border:0;outline:0;background:transparent;color:#fff;font:inherit;font-size:13px}.searchbox input::placeholder{color:#747d9e}.filters{display:flex;gap:8px;overflow-x:auto;padding:15px 0 20px}.filter{border:1px solid #ffffff18;background:#0e1221;color:#aeb6d4;border-radius:20px;padding:8px 14px;font-size:11px;white-space:nowrap;cursor:pointer}.filter.active{background:linear-gradient(100deg,#1b79ce,#6a4be2);color:#fff;border-color:transparent;box-shadow:0 5px 20px #4d60ff24}
        .artist-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.artist-card{overflow:hidden;border:1px solid #ffffff14;background:linear-gradient(145deg,#121729,#0b0e19);border-radius:17px;min-width:0}.artist-art{height:78px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;background:radial-gradient(circle at 30% 0%,#2d5fb4aa,transparent 50%),linear-gradient(120deg,#151c38,#231535);border-bottom:1px solid #ffffff0d}.music-note{font-size:34px;color:#b7d9ff;text-shadow:0 0 25px #4f91ff;font-weight:200}.artist-index{font-size:11px;letter-spacing:2px;color:#737ea8}.artist-info{padding:14px}.artist-meta{display:flex;align-items:center}.status{display:inline-flex;align-items:center;gap:6px;color:#ffc985;background:#ffbd5c12;border:1px solid #ffbd5c28;border-radius:12px;padding:5px 7px;font-size:9px}.status i{width:5px;height:5px;border-radius:50%;background:#ffbd5c}.status.review{color:#b9baff;background:#8c82ff12;border-color:#8c82ff2c}.status.review i{background:#a59aff}.artist-info h3{font-size:15px;margin:12px 0 5px;letter-spacing:-.2px}.artist-info p{font-size:11px;color:#9fa9d0;margin:0 0 7px}.artist-info small{font-size:10px;line-height:1.5;color:#707b9f;display:block;min-height:30px}.request-button{margin-top:13px;width:100%;border:1px solid #7e8cff3d;border-radius:10px;background:#6c75ff12;color:#dbe0ff;font-size:10px;font-weight:700;padding:10px 6px;cursor:pointer}.request-button:active{transform:scale(.98)}.empty{grid-column:1/-1;text-align:center;padding:30px;color:#9fa9d0;font-size:13px}
        .how{padding-top:55px}.how h2{margin-bottom:21px}.steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.steps>div{padding:18px;border:1px solid #ffffff13;background:#0c1020;border-radius:16px}.steps b{display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:#4f6cff22;color:#aebaff;font-size:11px;margin-bottom:17px}.steps strong{font-size:12px}.steps p{font-size:11px;line-height:1.7;color:#929cbd;margin-bottom:0}
        footer{border-top:1px solid #ffffff12;margin-top:48px;padding-top:20px;color:#8791b4;font-size:10px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}footer span{color:#616c8e}
        @media(max-width:580px){.music-page{padding-left:15px;padding-right:15px}.topbar{height:66px}.hero{padding-top:49px}.hero h1{letter-spacing:-2px}.hero p{font-size:13px}.notice{padding:14px}.artist-grid{grid-template-columns:1fr}.artist-card{display:grid;grid-template-columns:90px minmax(0,1fr)}.artist-art{height:100%;min-height:180px;display:flex;flex-direction:column;justify-content:space-around;padding:14px 0}.artist-info{padding:12px}.artist-info h3{font-size:14px}.artist-info small{min-height:0}.request-button{font-size:10px}.steps{grid-template-columns:1fr}.section-heading h2,.how h2{font-size:24px}footer{line-height:1.6}}
      `}</style>
    </main>
  );
}
