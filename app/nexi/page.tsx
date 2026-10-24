"use client";

import { useState } from "react";
import Link from "next/link";
import PrimaryNav from "../components/PrimaryNav";

type NexiMessage = { role: "user" | "assistant"; content: string };

const suggestions = [
  { icon: "✦", title: "Criar conteúdo", detail: "Legendas, memes e ideias para Reels", prompt: "Me ajude a criar uma ideia original para um Reel." },
  { icon: "⌕", title: "Pesquisar e aprender", detail: "Organizar dúvidas e explorar assuntos", prompt: "Quero entender um assunto e organizar as informações principais." },
  { icon: "◇", title: "Desenvolver uma ideia", detail: "Transformar inspiração em um plano", prompt: "Me ajude a transformar uma ideia em um plano de ação." },
];

export default function NexiPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<NexiMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  async function submitPrompt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = prompt.trim();
    if (!text || sending) return;
    const nextMessages: NexiMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setPrompt("");
    setNotice("");
    setSending(true);
    try {
      const response = await fetch("/api/nexi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-12) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setNotice(typeof data.error === "string" ? data.error : "Não consegui responder agora. Tente novamente em instantes.");
        return;
      }
      if (typeof data.reply !== "string" || !data.reply.trim()) {
        setNotice("A Nexi não recebeu uma resposta válida. Tente novamente.");
        return;
      }
      setMessages(current => [...current, { role: "assistant", content: data.reply }]);
    } catch {
      setNotice("Não foi possível alcançar o serviço da Nexi. Verifique sua conexão e tente novamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="nexi-page">
      <div className="nexi-shell">
        <header className="nexi-header">
          <Link className="nexi-brand" href="/" aria-label="Voltar à Nexora">
            <span className="nexi-mark" aria-hidden="true">✦</span>
            <span><strong>NEXI</strong><small>INTELIGÊNCIA DA NEXORA</small></span>
          </Link>
          <span className="nexi-status"><i /> NOVA EXPERIÊNCIA</span>
        </header>

        <section className="nexi-hero">
          <div className="nexi-orb" aria-hidden="true"><span>✦</span><i /><b /></div>
          <p className="nexi-eyebrow">SUA IDEIA É O COMEÇO DE TUDO</p>
          <h1>Olá! Eu sou a <span>Nexi.</span></h1>
          <p className="nexi-subtitle">Conectando ideias. Criando possibilidades.</p>
          <p className="nexi-description">Uma nova forma de criar, descobrir e organizar ideias — integrada à experiência Nexora.</p>
        </section>

        <section className="nexi-suggestions" aria-label="Sugestões para começar">
          {suggestions.map((item) => (
            <button className="nexi-suggestion" key={item.title} type="button" onClick={() => { setPrompt(item.prompt); setNotice(""); }}>
              <span className="nexi-suggestion-icon">{item.icon}</span>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
              <b aria-hidden="true">↗</b>
            </button>
          ))}
        </section>

        {messages.length > 0 && (
          <section className="nexi-conversation" aria-label="Conversa com a Nexi" aria-live="polite">
            {messages.map((message, index) => (
              <article className={"nexi-message " + message.role} key={index + "-" + message.role}>
                <span className="nexi-message-author">{message.role === "assistant" ? "✦ NEXI" : "VOCÊ"}</span>
                <p>{message.content}</p>
              </article>
            ))}
            {sending && <div className="nexi-thinking"><span /> A Nexi está pensando...</div>}
          </section>
        )}

        <form className="nexi-composer" onSubmit={submitPrompt}>
          <label htmlFor="nexi-prompt">O que você quer fazer hoje?</label>
          <textarea id="nexi-prompt" value={prompt} onChange={(event) => { setPrompt(event.target.value); setNotice(""); }} placeholder="Escreva uma ideia, uma dúvida ou algo que queira criar..." maxLength={2000} rows={3} disabled={sending} />
          <div className="nexi-composer-footer">
            <span>{prompt.length}/2.000 caracteres</span>
            <button type="submit" disabled={!prompt.trim() || sending}>{sending ? "Pensando..." : "Enviar para Nexi"} <span aria-hidden="true">{sending ? "…" : "↗"}</span></button>
          </div>
          {notice && <p className="nexi-notice" role="status">{notice}</p>}
        </form>

        <p className="nexi-disclaimer"><span>✧</span> A conversa não é salva no banco nesta etapa. Quando configurado, o modelo externo processará apenas as mensagens enviadas para responder.</p>      </div>
      <PrimaryNav active="nexi" />
      <style jsx>{`
        .nexi-page{min-height:100dvh;padding:16px 14px 112px;color:#f7f7ff;background:radial-gradient(ellipse at 50% 5%,rgba(87,67,190,.19),transparent 42%),radial-gradient(ellipse at 8% 35%,rgba(29,194,237,.08),transparent 36%),#070914;font-family:Inter,system-ui,-apple-system,sans-serif}
        .nexi-shell{max-width:850px;margin:0 auto}
        .nexi-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 2px 18px;border-bottom:1px solid rgba(173,157,255,.14)}
        .nexi-brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}
        .nexi-mark{width:43px;height:43px;border-radius:15px;display:grid;place-items:center;font-size:25px;color:#c9f8ff;background:linear-gradient(145deg,rgba(46,212,255,.22),rgba(157,91,255,.28));border:1px solid rgba(122,220,255,.35);box-shadow:0 0 25px rgba(85,122,255,.14)}
        .nexi-brand strong{display:block;font-size:16px;letter-spacing:2.3px;background:linear-gradient(95deg,#72f2ff,#b5a0ff 60%,#f0a5ff);color:transparent;background-clip:text}
        .nexi-brand small{display:block;margin-top:4px;font-size:8px;letter-spacing:1.4px;color:#9299bd}
        .nexi-status{display:flex;align-items:center;gap:7px;font-size:9px;font-weight:800;letter-spacing:1px;color:#a6eaf7;border:1px solid rgba(105,221,255,.2);background:rgba(49,166,222,.07);padding:8px 10px;border-radius:999px}
        .nexi-status i{width:6px;height:6px;border-radius:50%;background:#6deaff;box-shadow:0 0 10px #6deaff}
        .nexi-hero{text-align:center;padding:31px 0 27px}
        .nexi-orb{width:90px;height:90px;border-radius:30px;margin:0 auto 22px;display:grid;place-items:center;position:relative;background:radial-gradient(circle at 30% 25%,rgba(89,241,255,.3),rgba(106,82,232,.16) 48%,rgba(220,90,255,.13));border:1px solid rgba(157,179,255,.4);box-shadow:0 0 55px rgba(85,114,255,.18),inset 0 0 25px rgba(124,209,255,.09);transform:rotate(-8deg)}
        .nexi-orb span{font-size:43px;color:#c8f7ff;text-shadow:0 0 22px rgba(104,225,255,.8);transform:rotate(8deg)}
        .nexi-orb i,.nexi-orb b{position:absolute;width:7px;height:7px;border-radius:50%;background:#a5f5ff;box-shadow:0 0 15px #73eaff}
        .nexi-orb i{right:-7px;top:14px}.nexi-orb b{left:8px;bottom:-5px;width:5px;height:5px;background:#d9a4ff}
        .nexi-eyebrow{font-size:9px;letter-spacing:2.3px;font-weight:850;color:#91ddf8;margin:0 0 12px}
        .nexi-hero h1{font-size:clamp(31px,7vw,49px);line-height:1.08;letter-spacing:-1.8px;margin:0}
        .nexi-hero h1 span{background:linear-gradient(100deg,#6beaff,#b1a0ff 56%,#f29bff);color:transparent;background-clip:text}
        .nexi-subtitle{font-size:14px;color:#c6b9ff;margin:13px 0 8px}
        .nexi-description{max-width:440px;margin:0 auto;color:#9298b4;font-size:12px;line-height:1.7}
        .nexi-suggestions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 15px}
        .nexi-suggestion{position:relative;text-align:left;display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-height:145px;padding:15px 13px;border:1px solid rgba(155,160,255,.16);border-radius:18px;background:linear-gradient(145deg,rgba(24,28,58,.82),rgba(12,14,29,.94));color:#f3f4ff;cursor:pointer;transition:border-color .18s,transform .18s}
        .nexi-suggestion:focus-visible,.nexi-suggestion:hover{border-color:rgba(106,224,255,.55);transform:translateY(-2px);outline:none}
        .nexi-suggestion-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:10px;color:#9aefff;background:linear-gradient(135deg,rgba(64,205,255,.15),rgba(164,103,255,.19));font-size:18px}
        .nexi-suggestion strong{font-size:12px}
        .nexi-suggestion>span:not(.nexi-suggestion-icon){font-size:10px;line-height:1.55;color:#9ca4c2}
        .nexi-suggestion>b{position:absolute;right:13px;top:16px;color:#7fe9ff;font-size:14px}
        .nexi-conversation{display:flex;flex-direction:column;gap:10px;margin:0 0 14px}
        .nexi-message{max-width:92%;padding:12px 14px;border:1px solid rgba(130,160,255,.18);border-radius:16px;background:rgba(18,22,44,.86);color:#e9ecff}
        .nexi-message.user{align-self:flex-end;border-color:rgba(111,215,255,.28);background:linear-gradient(135deg,rgba(19,51,78,.82),rgba(39,23,72,.9))}
        .nexi-message.assistant{align-self:flex-start}
        .nexi-message-author{display:block;margin-bottom:6px;color:#8feaff;font-size:9px;font-weight:900;letter-spacing:1px}
        .nexi-message p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;line-height:1.7}
        .nexi-thinking{align-self:flex-start;display:flex;align-items:center;gap:9px;padding:10px 12px;color:#a9b0d1;font-size:11px}
        .nexi-thinking span{width:7px;height:7px;border-radius:50%;background:#83eaff;box-shadow:0 0 12px #83eaff;animation:nexi-thinking-pulse 1s ease-in-out infinite alternate}
        @keyframes nexi-thinking-pulse{to{opacity:.25;transform:scale(.7)}}
        .nexi-composer{padding:16px;border:1px solid rgba(125,158,255,.25);border-radius:20px;background:linear-gradient(145deg,rgba(18,22,44,.96),rgba(11,13,27,.98));box-shadow:0 18px 55px rgba(0,0,0,.16)}
        .nexi-composer label{display:block;font-size:12px;font-weight:800;margin-bottom:10px;color:#e5e7ff}
        .nexi-composer textarea{display:block;box-sizing:border-box;width:100%;resize:vertical;min-height:78px;padding:13px 14px;border:1px solid rgba(158,166,218,.16);border-radius:13px;outline:none;background:#080b18;color:#f8f8ff;font:inherit;font-size:12px;line-height:1.6}
        .nexi-composer textarea:disabled{opacity:.7}
        .nexi-composer textarea:focus{border-color:rgba(93,220,255,.55);box-shadow:0 0 0 3px rgba(67,185,255,.07)}
        .nexi-composer textarea::placeholder{color:#6f789a}
        .nexi-composer-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}
        .nexi-composer-footer>span{font-size:10px;color:#777f9f}
        .nexi-composer-footer button{border:0;border-radius:12px;padding:11px 14px;display:flex;align-items:center;gap:10px;background:linear-gradient(100deg,#75eaff,#b7a1ff 65%,#e4a4ff);color:#0b0c1c;font-size:11px;font-weight:900;cursor:pointer}
        .nexi-composer-footer button:disabled{opacity:.42;cursor:not-allowed}
        .nexi-notice{margin:12px 0 0;padding:11px 12px;border:1px solid rgba(255,196,120,.3);border-radius:12px;background:rgba(255,196,120,.06);color:#f2d7a8;font-size:11px;line-height:1.6}
        .nexi-disclaimer{text-align:center;max-width:550px;margin:17px auto 0;color:#737b9a;font-size:10px;line-height:1.7}
        .nexi-disclaimer span{color:#8c8eff;margin-right:4px}
        @media(prefers-reduced-motion:reduce){.nexi-thinking span{animation:none}}
        @media(max-width:540px){.nexi-page{padding:12px 12px 108px}.nexi-header{padding-bottom:14px}.nexi-status{font-size:8px;letter-spacing:.5px;padding:7px 8px}.nexi-suggestions{grid-template-columns:1fr;gap:8px}.nexi-suggestion{min-height:0;display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:6px 10px;padding:12px}.nexi-suggestion-icon{grid-row:span 2}.nexi-suggestion strong{grid-column:2}.nexi-suggestion>span:not(.nexi-suggestion-icon){grid-column:2}.nexi-suggestion>b{right:14px;top:18px}.nexi-hero{padding-top:25px}.nexi-orb{width:76px;height:76px;border-radius:25px}.nexi-orb span{font-size:36px}.nexi-composer{padding:13px}.nexi-composer-footer button{padding:10px 11px;font-size:10px}}
      `}</style>
    </main>
  );
}
