"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import PrimaryNav from "../../components/PrimaryNav";

type Listing = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  link?: string;
  image?: string;
  variants?: string;
  sellerName?: string;
};

type StoreReview = { id: number; author: string; rating: number; text: string; createdAt: string };
type StoreEngagement = { favorite: boolean; reviews: StoreReview[] };
type StoreData = {
  listings?: Listing[];
  storeProfileName?: string;
  storeLogo?: string;
  storeOfficial?: boolean;
};

const money = (value: number) =>
  Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function PublicStorePreviewPage() {
  const [data, setData] = useState<StoreData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [engagement, setEngagement] = useState<StoreEngagement>({ favorite: false, reviews: [] });
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Informação incorreta");
  const [reportDetails, setReportDetails] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nexora-loja-local-v1");
      if (raw) setData(JSON.parse(raw) as StoreData);
    } catch {
      setData(null);
    }
    setLoaded(true);
  }, []);

  const storeName = data?.storeProfileName?.trim() || "Minha loja Nexora";
  const saveEngagement = (next: StoreEngagement) => {
    setEngagement(next);
    try {
      const all = JSON.parse(localStorage.getItem("nexora-store-engagement-v1") || "{}");
      all[window.location.pathname] = next;
      localStorage.setItem("nexora-store-engagement-v1", JSON.stringify(all));
    } catch { /* armazenamento local pode estar indisponível */ }
  };
  const averageRating = engagement.reviews.length ? engagement.reviews.reduce((sum, review) => sum + review.rating, 0) / engagement.reviews.length : 0;
  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = reviewText.trim();
    if (!text) return;
    const next = { ...engagement, reviews: [{ id: Date.now(), author: reviewAuthor.trim() || "Visitante", rating: reviewRating, text, createdAt: new Date().toLocaleDateString("pt-BR") }, ...engagement.reviews].slice(0, 100) };
    saveEngagement(next); setReviewText(""); setReviewAuthor("");
  };

  const products = useMemo(
    () => data?.listings || [],
    [data, storeName]
  );

  return (
    <main style={{ minHeight: "100dvh", padding: "24px 16px 110px", color: "#f7f9ff", background: "radial-gradient(ellipse at 10% 0%,#123e6440,transparent 38%),#080b14", fontFamily: "Inter,system-ui,sans-serif" }}>
      <style jsx global>{`
        .public-store-wrap{max-width:960px;margin:0 auto}
        .public-store-card{border:1px solid #ffffff18;border-radius:20px;background:linear-gradient(160deg,#141e30,#0c111d);overflow:hidden}
        .public-store-button{display:inline-flex;align-items:center;justify-content:center;padding:11px 15px;border-radius:12px;border:1px solid #64dfff55;background:#12283b;color:#dffaff;text-decoration:none;font-size:12px;font-weight:750}
        .public-store-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}
        @media(max-width:700px){.public-store-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:430px){.public-store-grid{grid-template-columns:1fr}}
      `}</style>
      <div className="public-store-wrap">
        <Link href="/loja" style={{ color: "#9feaff", textDecoration: "none", fontSize: 12 }}>← Voltar à Nexora Loja</Link>
        {!loaded ? <p style={{ color: "#aebbd0", marginTop: 30 }}>Carregando vitrine…</p> : (
          <>
            <section className="public-store-card" style={{ marginTop: 18, padding: 22, background: "linear-gradient(125deg,#12304a,#17152d 68%,#32163c)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 15, flexWrap: "wrap" }}>
                {data?.storeLogo ? <img src={data.storeLogo} alt={"Logo de " + storeName} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 20, border: "1px solid #ffffff30" }} /> : <div style={{ width: 76, height: 76, borderRadius: 20, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#4ddfff,#8667ff)", color: "#08111d", fontSize: 30, fontWeight: 900 }}>N</div>}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ color: "#7deaff", fontSize: 10, letterSpacing: 2, fontWeight: 850 }}>VITRINE NEXORA</div>
                  <h1 style={{ fontSize: "clamp(25px,5vw,38px)", margin: "7px 0" }}>{storeName}</h1>
                  <div style={{ color: "#aebbd0", fontSize: 11 }}>{data?.storeOfficial ? "Loja oficial · aguardando análise" : "Vendedor independente"} · Verificação pendente</div>
                </div>
              </div>
              <p style={{ color: "#bdc9dc", fontSize: 13, lineHeight: 1.7, maxWidth: 650, margin: "18px 0" }}>Conheça os produtos e opções desta loja na comunidade Nexora.</p>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, margin: "12px 0 18px" }}>
                <span style={{ color: "#f7d879", fontSize: 13 }}>{averageRating ? "★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating)) : "☆☆☆☆☆"}</span>
                <span style={{ color: "#c4d1e2", fontSize: 11 }}>{engagement.reviews.length ? averageRating.toFixed(1).replace(".", ",") + " · " + engagement.reviews.length + " avaliação(ões) locais" : "Ainda sem avaliações"}</span>
                <button type="button" className="public-store-button" onClick={() => saveEngagement({ ...engagement, favorite: !engagement.favorite })}>{engagement.favorite ? "♥ Vitrine salva" : "♡ Favoritar vitrine"}</button>
                <button type="button" className="public-store-button" onClick={() => setReportOpen(true)}>⚑ Denunciar vitrine</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center" }}>
                <span style={{ display: "inline-block", padding: "7px 10px", borderRadius: 999, background: "#ffffff0d", border: "1px solid #ffffff20", color: "#b9d8ed", fontSize: 10 }}>Prévia local · não visível para outros usuários</span>
                <button type="button" onClick={async () => { const url = window.location.href; try { if (navigator.share) await navigator.share({ title: storeName + " · Nexora", text: "Conheça a vitrine " + storeName + " na Nexora.", url }); else { await navigator.clipboard.writeText(url); alert("Link da vitrine copiado."); } } catch (error) { if (error instanceof Error && error.name !== "AbortError") { try { await navigator.clipboard.writeText(url); alert("Link da vitrine copiado."); } catch { alert("Não foi possível compartilhar neste navegador."); } } } }} className="public-store-button">↗ Compartilhar vitrine</button>
                <button type="button" onClick={() => { const text = "Conheça a vitrine " + storeName + " na Nexora: " + window.location.href; window.location.href = "/?tab=mensagens&loja=" + encodeURIComponent(storeName) + "&pedido=" + encodeURIComponent(text); }} className="public-store-button">Enviar na conversa</button>
                <button type="button" onClick={() => { window.location.href = "/?nexoraShare=story&title=" + encodeURIComponent(storeName) + "&description=" + encodeURIComponent("Conheça esta vitrine na Nexora") + "&link=" + encodeURIComponent(window.location.href); }} className="public-store-button">Criar Story</button>
                <button type="button" onClick={() => { window.location.href = "/?nexoraShare=reel&title=" + encodeURIComponent(storeName) + "&description=" + encodeURIComponent("Conheça esta vitrine na Nexora") + "&link=" + encodeURIComponent(window.location.href); }} className="public-store-button">Preparar Reel</button>
                <button type="button" onClick={() => { window.location.href = "/?nexoraShare=post&title=" + encodeURIComponent(storeName) + "&description=" + encodeURIComponent("Conheça esta vitrine na Nexora") + "&link=" + encodeURIComponent(window.location.href); }} className="public-store-button">Publicação</button>
              </div>
            </section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, margin: "25px 0 13px" }}>
              <h2 style={{ margin: 0, fontSize: 19 }}>Produtos da loja</h2>
              <span style={{ color: "#91a4bd", fontSize: 11 }}>{products.length} anúncio(s)</span>
            </div>
            {products.length ? <section className="public-store-grid">
              {products.map((item) => <article className="public-store-card" key={item.id}>
                {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: 175, objectFit: "cover" }} /> : <div style={{ height: 145, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#172f48,#33204e)", fontSize: 42 }}>✦</div>}
                <div style={{ padding: 14 }}>
                  <div style={{ color: "#83e4ff", fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>{item.category}</div>
                  <h3 style={{ fontSize: 15, margin: "8px 0" }}>{item.name}</h3>
                  <p style={{ minHeight: 42, color: "#aebbd0", fontSize: 11, lineHeight: 1.55 }}>{item.description}</p>
                  {item.variants && <p style={{ color: "#9cecff", fontSize: 10, lineHeight: 1.5 }}>Opções: {item.variants}</p>}
                  <strong style={{ display: "block", fontSize: 18, margin: "10px 0" }}>{money(item.price)}</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    <a className="public-store-button" href={item.link || "#"} onClick={(event) => { if (!item.link) { event.preventDefault(); window.location.href = "/?tab=mensagens&loja=" + encodeURIComponent(storeName) + "&pedido=" + encodeURIComponent("Olá! Tenho interesse em " + item.name + ".\nOpções: " + (item.variants || "A combinar") + "\nQuantidade: 1. Pode confirmar disponibilidade e entrega?"); } }} target={item.link ? "_blank" : undefined} rel={item.link ? "noreferrer" : undefined}>{item.link ? "Ver produto ↗" : "Consultar pelo chat"}</a>
                    <button type="button" className="public-store-button" onClick={() => { window.location.href = "/?tab=mensagens&loja=" + encodeURIComponent(storeName) + "&pedido=" + encodeURIComponent("Olha este produto da " + storeName + ": " + item.name + "\\n" + (item.description || "") + "\\n" + money(item.price) + "\\n" + (item.link || window.location.href)); }}>Conversa</button>
                    <button type="button" className="public-store-button" onClick={() => { window.location.href = "/?nexoraShare=story&title=" + encodeURIComponent(item.name) + "&description=" + encodeURIComponent((item.description || "") + " · " + money(item.price)) + "&link=" + encodeURIComponent(item.link || window.location.href); }}>Story</button>
                    <button type="button" className="public-store-button" onClick={() => { window.location.href = "/?nexoraShare=reel&title=" + encodeURIComponent(item.name) + "&description=" + encodeURIComponent((item.description || "") + " · " + money(item.price)) + "&link=" + encodeURIComponent(item.link || window.location.href); }}>Reel</button>
                    <button type="button" className="public-store-button" onClick={() => { window.location.href = "/?nexoraShare=post&title=" + encodeURIComponent(item.name) + "&description=" + encodeURIComponent((item.description || "") + " · " + money(item.price)) + "&link=" + encodeURIComponent(item.link || window.location.href); }}>Publicação</button>
                  </div>
                </div>
              </article>)}
            </section> : <section className="public-store-card" style={{ padding: 25, textAlign: "center", color: "#aebbd0", fontSize: 12 }}>
              Ainda não há anúncios desta loja nesta prévia. Cadastre o nome da loja e os produtos em <Link href="/loja" style={{ color: "#7deaff" }}>Minha Nexora Loja</Link>.
            </section>}
            <section className="public-store-card" style={{ padding: 20, marginTop: 25 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 19 }}>Avaliações da vitrine</h2>
              <p style={{ color: "#91a4bd", fontSize: 11, marginTop: 0 }}>Prévia local neste dispositivo. Avaliações verificadas e compartilhadas exigem contas reais.</p>
              <form onSubmit={submitReview} style={{ display: "grid", gap: 9, maxWidth: 620 }}>
                <input value={reviewAuthor} onChange={event => setReviewAuthor(event.target.value)} maxLength={40} placeholder="Seu nome (opcional)" style={{ padding: 11, borderRadius: 10, background: "#080e19", border: "1px solid #ffffff22", color: "#fff" }} />
                <label style={{ color: "#c8d5e7", fontSize: 12 }}>Sua nota
                  <select value={reviewRating} onChange={event => setReviewRating(Number(event.target.value))} style={{ display: "block", marginTop: 6, padding: 10, borderRadius: 9, background: "#080e19", color: "#fff", border: "1px solid #ffffff22" }}>
                    <option value={5}>★★★★★ · Excelente</option><option value={4}>★★★★☆ · Muito boa</option><option value={3}>★★★☆☆ · Boa</option><option value={2}>★★☆☆☆ · Precisa melhorar</option><option value={1}>★☆☆☆☆ · Ruim</option>
                  </select>
                </label>
                <textarea required value={reviewText} onChange={event => setReviewText(event.target.value)} maxLength={500} rows={3} placeholder="Conte como foi sua experiência..." style={{ padding: 11, borderRadius: 10, background: "#080e19", border: "1px solid #ffffff22", color: "#fff", resize: "vertical" }} />
                <button type="submit" className="public-store-button" style={{ justifySelf: "start" }}>Adicionar avaliação local</button>
              </form>
              <div style={{ display: "grid", gap: 10, marginTop: 17 }}>
                {engagement.reviews.map(review => <article key={review.id} style={{ borderTop: "1px solid #ffffff14", paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}><strong style={{ fontSize: 12 }}>{review.author}</strong><span style={{ color: "#f7d879", fontSize: 12 }}>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></div>
                  <p style={{ color: "#c5d1e1", fontSize: 12, lineHeight: 1.6, margin: "6px 0" }}>{review.text}</p><small style={{ color: "#8193aa" }}>{review.createdAt} · não verificada</small>
                </article>)}
              </div>
            </section>
            {reportOpen && <div role="dialog" aria-modal="true" aria-label="Denunciar vitrine" onClick={event => { if (event.target === event.currentTarget) setReportOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 10020, display: "grid", placeItems: "center", padding: 18, background: "#030711d9", backdropFilter: "blur(9px)" }}>
              <section className="public-store-card" style={{ width: "min(100%,480px)", padding: 20 }}>
                <h2 style={{ marginTop: 0 }}>Denunciar vitrine</h2><p style={{ color: "#aebbd0", fontSize: 12 }}>Selecione o motivo. Nesta versão, o registro fica somente neste dispositivo e não é enviado à moderação.</p>
                <select value={reportReason} onChange={event => setReportReason(event.target.value)} style={{ width: "100%", padding: 11, borderRadius: 10, background: "#080e19", color: "#fff", border: "1px solid #ffffff22" }}>
                  <option>Informação incorreta</option><option>Possível fraude ou golpe</option><option>Produto proibido ou perigoso</option><option>Uso indevido de marca ou imagem</option><option>Conteúdo ofensivo</option><option>Outro motivo</option>
                </select>
                <textarea value={reportDetails} onChange={event => setReportDetails(event.target.value)} maxLength={400} rows={3} placeholder="Detalhes adicionais (opcional)" style={{ width: "100%", marginTop: 10, padding: 11, borderRadius: 10, background: "#080e19", border: "1px solid #ffffff22", color: "#fff" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                  <button type="button" className="public-store-button" onClick={() => setReportOpen(false)}>Cancelar</button>
                  <button type="button" className="public-store-button" onClick={() => { try { const reports = JSON.parse(localStorage.getItem("nexora-store-reports-local-v1") || "[]"); reports.unshift({ store: storeName, reason: reportReason, details: reportDetails.trim(), createdAt: new Date().toISOString() }); localStorage.setItem("nexora-store-reports-local-v1", JSON.stringify(reports.slice(0,50))); } catch {} setReportOpen(false); setReportDetails(""); alert("Registro de demonstração salvo neste dispositivo. Nenhuma denúncia foi enviada à Nexora."); }}>Salvar registro local</button>
                </div>
              </section>
            </div>}
            <p style={{ color: "#8292a9", fontSize: 10, lineHeight: 1.7, marginTop: 22 }}>Esta vitrine usa os dados salvos neste navegador. Para que outros usuários vejam a loja, será necessário conectar perfis e produtos a um backend compartilhado e aplicar as regras de publicação e moderação.</p>
          </>
        )}
      </div>
      <PrimaryNav active="loja" />
    </main>
  );
}
