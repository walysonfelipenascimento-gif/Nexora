"use client";

import { useEffect, useState } from "react";

type Candidate = {
  providerId: string;
  title: string;
  artist: string;
  album: string | null;
  durationSeconds: number | null;
  imageUrl: string | null;
  previewUrl: string | null;
  licenseUrl: string | null;
  sourceUrl: string;
  genres: string[];
  canUseInPosts: false;
  notice: string;
};

export default function JamendoDiscovery() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);

  async function search(term = query) {
    setLoading(true);
    setMessage("");
    try {
      const params = new URLSearchParams();
      if (term.trim()) params.set("q", term.trim());
      const response = await fetch(`/api/musicas/jamendo?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        setItems([]);
        setMessage(data.message || "Catálogo externo ainda não configurado.");
        return;
      }
      setItems(data.tracks || []);
      if (!data.tracks?.length) setMessage("Nenhuma faixa encontrada nesta pesquisa.");
    } catch {
      setItems([]);
      setMessage("Não foi possível consultar o catálogo externo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void search(""); }, []);

  return <section style={{ margin: "0 0 24px", padding: 18, borderRadius: 18, border: "1px solid #49c9ff45", background: "linear-gradient(130deg,#101a30,#101020)" }}>
    <small style={{ color: "#72dfff", letterSpacing: 1.5, fontWeight: 800 }}>DESCOBERTA MUSICAL · JAMENDO</small>
    <h3 style={{ margin: "8px 0", fontSize: 20 }}>Pesquisar novas músicas</h3>
    <p style={{ color: "#aeb8d5", fontSize: 12, lineHeight: 1.7 }}>Aqui aparecem faixas encontradas no Jamendo para ouvir e analisar. Elas não ficam automaticamente liberadas para publicações: cada licença precisa ser conferida antes do uso na Nexora.</p>
    <form onSubmit={(event) => { event.preventDefault(); void search(); }} style={{ display: "flex", gap: 8, margin: "14px 0" }}>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar artista, música ou estilo..." aria-label="Pesquisar no Jamendo" style={{ minWidth: 0, flex: 1, border: "1px solid #ffffff22", borderRadius: 12, background: "#080c18", color: "white", padding: "12px", fontSize: 13 }} />
      <button disabled={loading} type="submit" style={{ border: 0, borderRadius: 12, padding: "0 15px", background: "linear-gradient(100deg,#08a9d6,#6849e7)", color: "white", fontWeight: 700 }}>{loading ? "Buscando…" : "Buscar"}</button>
    </form>
    {message && <p role="status" style={{ color: "#f0c8a8", fontSize: 12 }}>{message}</p>}
    {items.length > 0 && <div style={{ display: "grid", gap: 9 }}>
      {items.map((track) => <article key={track.providerId} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 12, background: "#080c18", border: "1px solid #ffffff16", flexWrap: "wrap" }}>
        {track.imageUrl ? <img src={track.imageUrl} alt="" width="46" height="46" style={{ objectFit: "cover", borderRadius: 9 }} /> : <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 9, background: "#25345a" }}>♫</span>}
        <div style={{ flex: 1, minWidth: 130 }}>
          <strong style={{ display: "block", fontSize: 13 }}>{track.title}</strong>
          <small style={{ display: "block", color: "#aab4d2", marginTop: 4 }}>{track.artist}{track.genres.length ? ` · ${track.genres.slice(0, 2).join(", ")}` : ""}</small>
          <small style={{ display: "block", color: "#f3c17b", marginTop: 4 }}>Ainda não liberada para publicações</small>
        </div>
        {track.previewUrl && <button type="button" onClick={() => setPlaying(playing === track.providerId ? null : track.providerId)} style={{ border: 0, borderRadius: 20, width: 36, height: 36, background: "#315fbd", color: "white" }}>{playing === track.providerId ? "Ⅱ" : "▶"}</button>}
        <a href={track.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#82dfff", fontSize: 11 }}>Fonte ↗</a>
        {track.licenseUrl && <a href={track.licenseUrl} target="_blank" rel="noreferrer" style={{ color: "#c4b3ff", fontSize: 11 }}>Licença ↗</a>}
        {playing === track.providerId && track.previewUrl && <audio controls autoPlay src={track.previewUrl} onEnded={() => setPlaying(null)} style={{ width: "100%" }} />}
      </article>)}
    </div>}
  </section>;
}
