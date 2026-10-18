"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase";

type Track = {
  id: string; title: string; album: string | null; genre: string | null;
  duration_seconds: number | null; preview_url: string | null; audio_url: string | null; artist: string;
};

function duration(seconds: number | null) {
  return seconds && seconds > 0 ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : "—";
}

export default function MusicasPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (active) { setError("O catálogo seguro ainda não está conectado. Nenhuma faixa será exibida como liberada."); setLoading(false); }
        return;
      }
      try {
        const { data: rows, error: trackError } = await supabase.from("nexora_music_tracks")
          .select("id,title,album,genre,duration_seconds,preview_url,audio_url,artist_id,license_id")
          .eq("is_available", true).not("license_id", "is", null);
        if (trackError) throw trackError;
        const list = rows || [];
        if (!list.length) { if (active) setTracks([]); return; }
        const licenseIds = [...new Set(list.map((r: any) => r.license_id).filter(Boolean))];
        const artistIds = [...new Set(list.map((r: any) => r.artist_id).filter(Boolean))];
        const [licenseResult, artistResult] = await Promise.all([
          supabase.from("nexora_music_licenses").select("id,artist_id,status,recording_rights_confirmed,composition_rights_confirmed,social_video_use_confirmed,commercial_use_confirmed,evidence_reference,starts_at,expires_at,permitted_surfaces").in("id", licenseIds),
          supabase.from("nexora_music_artists").select("id,name").in("id", artistIds),
        ]);
        if (licenseResult.error || artistResult.error) throw new Error("Não foi possível validar os direitos.");
        const now = Date.now();
        const valid = new Map((licenseResult.data || []).filter((l: any) => {
          const starts = l.starts_at ? new Date(l.starts_at).getTime() : 0;
          const expires = l.expires_at ? new Date(l.expires_at).getTime() : Infinity;
          return l.status === "active" && l.recording_rights_confirmed === true &&
            l.composition_rights_confirmed === true && l.social_video_use_confirmed === true &&
            l.commercial_use_confirmed === true && Boolean(l.evidence_reference) &&
            starts <= now && expires > now && Array.isArray(l.permitted_surfaces) && l.permitted_surfaces.length > 0;
        }).map((l: any) => [l.id, l]));
        const names = new Map((artistResult.data || []).map((a: any) => [a.id, a.name]));
        const safe: Track[] = list.filter((r: any) => {
          const l = valid.get(r.license_id);
          return Boolean(l && l.artist_id === r.artist_id && names.has(r.artist_id));
        }).map((r: any) => ({
          id: r.id, title: r.title, album: r.album || null, genre: r.genre || "Outros",
          duration_seconds: r.duration_seconds || null, preview_url: r.preview_url || r.audio_url || null,
          audio_url: r.audio_url || null, artist: String(names.get(r.artist_id) || "Artista"),
        }));
        if (active) setTracks(safe);
      } catch {
        if (active) setError("Não foi possível validar as licenças agora. Por segurança, nenhuma faixa será exibida como liberada.");
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  const genres = useMemo(() => ["Todos", ...Array.from(new Set(tracks.map(t => t.genre || "Outros"))).sort()], [tracks]);
  const filtered = useMemo(() => tracks.filter(t =>
    `${t.title} ${t.artist} ${t.genre || ""} ${t.album || ""}`.toLowerCase().includes(query.toLowerCase()) &&
    (genre === "Todos" || t.genre === genre)
  ), [tracks, query, genre]);

  return <main className="page">
    <header className="top"><a href="/" className="brand"><b>N</b><span>NEXORA<small>MÚSICA</small></span></a><a href="/">← Voltar ao feed</a></header>
    <section className="hero"><small>♫ CATÁLOGO AUTORIZADO</small><h1>Sua música.<br/><span>Seu momento.</span></h1><p>Somente faixas com licença ativa, comprovação dos direitos da gravação e composição e autorização comercial registrada podem aparecer aqui.</p></section>
    <section className="notice"><strong>© Direitos autorais em primeiro lugar</strong><p>Estar na lista de artistas desejados não libera suas músicas. Crédito não substitui autorização. Se a licença não puder ser validada, a faixa não será exibida como disponível.</p></section>
    <section className="catalog"><div className="heading"><div><small>PARA USAR NAS PUBLICAÇÕES</small><h2>Músicas disponíveis</h2></div><span>{filtered.length} faixas</span></div>
      <input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar música, artista ou estilo..."/>
      <div className="filters">{genres.map(g => <button key={g} className={genre === g ? "active" : ""} onClick={() => setGenre(g)}>{g}</button>)}</div>
      {loading && <div className="empty">Verificando as licenças das músicas…</div>}
      {!loading && error && <div className="empty"><b>Catálogo temporariamente indisponível</b><p>{error}</p></div>}
      {!loading && !error && filtered.length === 0 && <div className="empty"><span>♫</span><b>Nenhuma música liberada ainda</b><p>Quando a Nexora registrar faixas com todas as autorizações necessárias, elas aparecerão aqui para ouvir e selecionar.</p></div>}
      {!loading && !error && filtered.length > 0 && <div className="tracks">{filtered.map(t => <article className="track" key={t.id}><div className="cover">♫</div><div className="info"><b>{t.title}</b><p>{t.artist} · {t.genre}</p>{t.album && <small>{t.album}</small>}<small className="rights">✓ Licença validada para uso comercial</small></div><small>{duration(t.duration_seconds)}</small>{t.preview_url && <button className="play" onClick={() => setPlayingId(playingId === t.id ? null : t.id)} aria-label={playingId === t.id ? "Pausar prévia" : "Ouvir prévia"}>{playingId === t.id ? "Ⅱ" : "▶"}</button>}{playingId === t.id && t.preview_url && <audio className="audio" controls autoPlay src={t.preview_url} onEnded={() => setPlayingId(null)}/>}</article>)}</div>}
    </section>
    <footer>NEXORA · Conectando pessoas, marcas e oportunidades. <span>Somente faixas autorizadas são exibidas como disponíveis.</span></footer>
    <style jsx>{`
      :global(*){box-sizing:border-box}:global(body){margin:0;background:#070912;color:#f5f6ff;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
      .page{min-height:100vh;padding:0 22px 50px;background:radial-gradient(ellipse at 18% 5%,#2648be30,transparent 34%),radial-gradient(ellipse at 90% 24%,#9330cf22,transparent 31%),#070912}
      .top,.hero,.notice,.catalog,footer{max-width:1060px;margin:auto}.top{height:76px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff14}.top a{color:#c4c8e9;text-decoration:none;font-size:12px}.brand{display:flex;align-items:center;gap:10px;font-weight:900!important;letter-spacing:1.5px}.brand b{display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#04d9ff,#5262ff 56%,#d946ef);font-size:23px}.brand small{display:block;font-size:9px;color:#9ba7ff;letter-spacing:3px}
      .hero{padding:65px 0 30px}.hero>small,.heading small{font-size:10px;font-weight:800;letter-spacing:2px;color:#a6b7ff}.hero h1{font-size:clamp(42px,8vw,76px);line-height:1;letter-spacing:-3px;margin:22px 0 18px}.hero h1 span{background:linear-gradient(90deg,#42d9ff,#7e81ff 53%,#e47cff);-webkit-background-clip:text;background-clip:text;color:transparent}.hero p{max-width:650px;color:#a9afca;font-size:14px;line-height:1.8}
      .notice{padding:18px;border-radius:18px;background:linear-gradient(110deg,#14203b,#161326);border:1px solid #8c9dff38}.notice strong{font-size:13px}.notice p{font-size:12px;line-height:1.7;color:#b6bdd7;margin:6px 0 0}.catalog{padding-top:48px}.heading{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:18px}.heading h2{font-size:27px;margin:7px 0 0}.heading>span{font-size:11px;color:#9da6ca;padding:7px 10px;background:#ffffff0a;border-radius:15px}
      .search{width:100%;height:49px;border:1px solid #ffffff1b;background:#0e1221;border-radius:14px;padding:0 15px;color:#fff;font:inherit;font-size:13px;outline:none}.search::placeholder{color:#747d9e}.filters{display:flex;gap:8px;overflow:auto;padding:15px 0 20px}.filters button{border:1px solid #ffffff18;background:#0e1221;color:#aeb6d4;border-radius:20px;padding:8px 14px;font-size:11px;white-space:nowrap}.filters button.active{background:linear-gradient(100deg,#1b79ce,#6a4be2);color:#fff;border-color:transparent}
      .empty{padding:36px 20px;text-align:center;border:1px dashed #ffffff25;border-radius:17px;background:#ffffff04;color:#aeb6d4;font-size:13px;line-height:1.7}.empty b{display:block;color:#f3f5ff;font-size:15px}.empty p{max-width:540px;margin:8px auto 0}.empty span{display:block;font-size:30px;color:#78dfff;margin-bottom:9px}.tracks{display:grid;gap:10px}.track{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:13px;border:1px solid #ffffff15;background:linear-gradient(120deg,#121729,#0b0e19);border-radius:15px}.cover{display:grid;place-items:center;width:54px;height:54px;border-radius:12px;background:linear-gradient(135deg,#0a91cb,#6d48d9,#bd4cbd);font-size:26px}.info{flex:1;min-width:120px}.info b{font-size:14px}.info p{font-size:11px;color:#a5afd1;margin:4px 0}.info small{display:block;font-size:10px;color:#7d89ab;margin-top:3px}.info .rights{color:#76e0bc}.play{width:37px;height:37px;border:0;border-radius:50%;background:linear-gradient(135deg,#11bfe9,#7159ed);color:white}.audio{flex-basis:100%;width:100%}
      footer{border-top:1px solid #ffffff12;margin-top:48px;padding-top:20px;color:#8791b4;font-size:10px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}footer span{color:#616c8e}@media(max-width:580px){.page{padding-left:15px;padding-right:15px}.top{height:66px}.hero{padding-top:48px}.hero h1{letter-spacing:-2px}.hero p{font-size:13px}.heading h2{font-size:23px}.track{gap:10px}.info{min-width:110px}}
    `}</style>
  </main>;
}
