"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getNexoraCameraStream } from "../../../lib/nexora/camera";
import "./live.css";

type CommentItem = { name: string; message: string; tag?: string; avatar: string };

const initialComments: CommentItem[] = [
  { name: "GamerPro", tag: "SUB", message: "Great stream!", avatar: "G" },
  { name: "StreamMod", tag: "MOD", message: "Welcome everyone! 👋", avatar: "S" },
  { name: "Cool Viewer", message: "This is awesome!", avatar: "C" },
  { name: "FanGirl238", tag: "SUB", message: "Been waiting for this!", avatar: "F" },
];

const summaryMetrics = [
  { label: "Stream Duration", delta: "+44m from last stream", value: "47m" },
  { label: "Average Viewers", delta: "+1 from last stream", value: "2" },
  { label: "Max Viewers", delta: "+2 from last stream", value: "3" },
  { label: "Unique Viewers", delta: "+3 from last stream", value: "4" },
  { label: "Unique Chatters", delta: "+0 from last stream", value: "0" },
  { label: "Live Views", delta: "+19 from last stream", value: "20" },
  { label: "Followers", delta: "+2 from last stream", value: "2" },
  { label: "Clips", delta: "+1 from last stream", value: "1" },
];

function SummaryChart({ title, subtitle, values, max }: { title: string; subtitle: string; values: number[]; max: number }) {
  return (
    <section className="nl-chart-card">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <div className="nl-chart" role="img" aria-label={title + ": gráfico demonstrativo"}>
        {values.map((value, index) => (
          <div className="nl-chart-column" key={index}>
            <span style={{ height: (value / max) * 100 + "%" }} />
            <small>{["2:25", "2:30", "2:35", "2:40", "2:45", "2:50", "2:55", "3:00", "3:05", "3:08"][index]}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function NexoraLivePage() {
  const [screen, setScreen] = useState<"live" | "summary">("live");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [likes, setLikes] = useState(25600);
  const [gifts, setGifts] = useState(415);
  const [analyticsPage, setAnalyticsPage] = useState(0);
  const [reportIndex, setReportIndex] = useState(0);
  const reports = [{ date: "Tue, Jun 17, 2025", time: "2:21 PM - 3:08 PM", label: "17 Jun 2025" }];
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("A câmera não está disponível neste navegador.");
      return;
    }
    try {
      let stream: MediaStream;
      try {
        stream = await getNexoraCameraStream({ facingMode: "user", audio: true });
      } catch {
        stream = await getNexoraCameraStream({ facingMode: "user", audio: false });
        setCameraError("Microfone indisponível: a prévia da câmera continua funcionando sem áudio.");
      }
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraReady(true);
    } catch {
      setCameraError("Não foi possível acessar a câmera. Verifique a permissão do navegador.");
    }
  }, []);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  function finishLive() {
    stopCamera();
    setScreen("summary");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function sendComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = message.trim();
    if (!clean) return;
    setComments(current => [...current, { name: "Você", message: clean, avatar: "V" }]);
    setMessage("");
  }

  if (screen === "summary") {
    return (
      <main className="nl-summary-page">
        <header className="nl-analytics-header">
          <div className="nl-analytics-avatar">N</div>
          <h1>Analytics</h1>
          <span className="nl-calendar-icon" aria-label="Calendário">▦</span>
        </header>
        <button className="nl-back" type="button" onClick={() => { window.location.href = "/creator-studio"; }} aria-label="Voltar">‹</button>
        <section className="nl-summary-heading">
          <h2>Stream Summary</h2>
          <p>Tue, Jun 17, 2025, 2:21 PM - 3:08 PM</p>
          <div className="nl-pagination-dots" aria-hidden="true"><i/><i className="active"/><i/><i/><i/><i/><i/><i/><i/></div>
        </section>
        <div className="nl-metric-grid">
          {summaryMetrics.map((metric, index) => (
            <article className="nl-metric-card" key={metric.label}>
              <h3>{metric.label}</h3>
              <p>{metric.delta}</p>
              <strong className={index === 4 ? "neutral" : ""}>{metric.value}{index !== 4 && <span> ↑</span>}</strong>
            </article>
          ))}
        </div>
        <div className="nl-chart-grid">
          <SummaryChart title="Average Viewers" subtitle="Peaked at 3 viewers at 2:55 PM" values={[1,1,1,1,1,1,1,2,1,1]} max={2}/>
          <SummaryChart title="Live Views" subtitle="20 live views for this stream" values={[4,3,2,1,1,2,2,2,1,2]} max={4}/>
        </div>
        <div className="nl-breakdown-grid">
          <article className="nl-breakdown-card">
            <h3>Views by Platform</h3><p>20 Views</p>
            <div className="nl-breakdown-line"><span>Mobile</span><strong>100%</strong></div>
            <div className="nl-breakdown-track"><i style={{width:"100%"}}/></div>
          </article>
          <article className="nl-breakdown-card">
            <h3>Views by Location</h3><p>20 Views</p>
            <div className="nl-breakdown-line"><span>Brazil</span><strong>100%</strong></div>
            <div className="nl-breakdown-track"><i style={{width:"100%"}}/></div>
          </article>
        </div>
        <p className="nl-demo-note">Dados demonstrativos da interface. A transmissão pública e as métricas reais ainda não estão conectadas.</p>
      </main>
    );
  }

  return (
    <main className="nl-live-page">
      <div className="nl-live-video">
        <video ref={videoRef} autoPlay muted playsInline className={cameraReady ? "ready" : ""}/>
        {!cameraReady && (
          <div className="nl-camera-placeholder">
            <div className="nl-camera-orb">N</div>
            <button type="button" onClick={() => void startCamera()}>Ativar câmera</button>
            <p>Prévia local da Nexora LIVE</p>
          </div>
        )}
        <div className="nl-live-top">
          <div className="nl-live-status"><span>◉</span> Live</div>
          <div className="nl-viewer-count"><span>◉</span> 100k</div>
          <button type="button" className="nl-close-live" onClick={finishLive} aria-label="Encerrar LIVE">×</button>
        </div>
        <div className="nl-live-side">
          <div className="nl-guest-avatar">N<span>+</span></div>
          <button type="button" className="nl-heart-action" onClick={() => setLikes(value => value + 1)} aria-label="Enviar coração">♡</button>
          <span className="nl-like-count">{(likes / 1000).toFixed(1)}k</span>
          <div className="nl-round-action">☷</div>
          <span className="nl-side-count">800</span>
          <div className="nl-round-action">♧</div>
          <span className="nl-side-count">415</span>
        </div>
        <div className="nl-live-comments">
          {comments.slice(-5).map((item, index) => (
            <div className="nl-live-comment" key={index}>
              <div className="nl-comment-avatar">{item.avatar}</div>
              <div className="nl-comment-copy">
                <div><b>{item.name}</b>{item.tag && <span className={"nl-comment-tag " + item.tag.toLowerCase()}>{item.tag}</span>}</div>
                <p>{item.message}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="nl-live-input" onSubmit={sendComment}>
          <input value={message} onChange={event => setMessage(event.target.value)} placeholder="Say something nice..." aria-label="Escreva um comentário"/>
          <button type="submit" aria-label="Enviar comentário">➤</button>
          <button type="button" className="nl-gift-control" onClick={() => setGifts(value => value + 1)} aria-label="Enviar presente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7H7.5a2.5 2.5 0 1 1 2.5-2.5C10 6 12 7 12 7Zm0 0h4.5A2.5 2.5 0 1 0 14 4.5C14 6 12 7 12 7Z"/></svg><span>{gifts}</span></button>
        </form>
        {cameraError && <p className="nl-camera-error" role="status">{cameraError}</p>}
        <div className="nl-home-indicator"/>
      </div>
      <p className="nl-implementation-note">Prévia local — a transmissão pública ainda não está conectada.</p>
    </main>
  );
}
