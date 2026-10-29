"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PrimaryNav from "../components/PrimaryNav";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

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
  const [webSearch, setWebSearch] = useState(false);
  const [citations, setCitations] = useState<{ title: string; url: string }[]>([]);
  const [engineStatus, setEngineStatus] = useState("Verificando motor da Nexi...");
  const [signedInUserId, setSignedInUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [memory, setMemory] = useState("");
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memoryReady, setMemoryReady] = useState(false);
  const [memoryOwnerId, setMemoryOwnerId] = useState<string | null>(null);

  useEffect(() => {
    setMemoryReady(false);
    setMemoryOwnerId(null);
    if (!signedInUserId) {
      setMemory("");
      setMemoryReady(true);
      return;
    }
    try {
      const stored = window.localStorage.getItem("nexi-memory-" + signedInUserId);
      setMemory(stored || "");
      setMemoryOwnerId(signedInUserId);
    } catch {
      setMemory("");
      setMemoryOwnerId(signedInUserId);
    }
    setMemoryReady(true);
  }, [signedInUserId]);

  useEffect(() => {
    if (!memoryReady || !signedInUserId || memoryOwnerId !== signedInUserId) return;
    try {
      if (memory.trim()) window.localStorage.setItem("nexi-memory-" + signedInUserId, memory.slice(0, 4000));
      else window.localStorage.removeItem("nexi-memory-" + signedInUserId);
    } catch {
      setNotice("Não foi possível guardar a memória neste navegador.");
    }
  }, [memory, memoryReady, memoryOwnerId, signedInUserId]);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data, error }) => {
        if (active && !error) setSignedInUserId(data.user?.id ?? null);
      }).catch(() => { if (active) setSignedInUserId(null); });
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) setSignedInUserId(session?.user?.id ?? null);
      });
      fetch("/api/nexi/status", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!active) return;
        setEngineStatus(typeof data.message === "string" ? data.message : "Status do motor indisponível");
      })
      .catch(() => {
        if (active) setEngineStatus("Não foi possível verificar o motor agora");
      });
      return () => { active = false; authListener.subscription.unsubscribe(); };
    }
    fetch("/api/nexi/status", { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (active) setEngineStatus(typeof data.message === "string" ? data.message : "Status do motor indisponível"); })
      .catch(() => { if (active) setEngineStatus("Não foi possível verificar o motor agora"); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!signedInUserId) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;
    async function restoreLatestConversation() {
      const { data: conversation, error: conversationError } = await supabase
        .from("nexi_conversations")
        .select("id")
        .eq("user_id", signedInUserId)
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active || conversationError || !conversation?.id) return;
      const { data: savedMessages, error: messagesError } = await supabase
        .from("nexi_messages")
        .select("role, content")
        .eq("conversation_id", conversation.id)
        .eq("user_id", signedInUserId)
        .order("created_at", { ascending: true })
        .limit(100);
      if (!active || messagesError || !Array.isArray(savedMessages) || savedMessages.length === 0) return;
      setMessages(current => current.length === 0
        ? savedMessages.filter((item): item is { role: "user" | "assistant"; content: string } =>
            (item.role === "user" || item.role === "assistant") && typeof item.content === "string"
          )
        : current);
      setConversationId(current => current ?? conversation.id);
    }
    void restoreLatestConversation();
    return () => { active = false; };
  }, [signedInUserId]);

  function startNewConversation() {
    if (sending) return;
    setMessages([]);
    setConversationId(null);
    setPrompt("");
    setNotice("");
    setCitations([]);
  }

  async function submitPrompt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = prompt.trim();
    if (!text || sending) return;
    const nextMessages: NexiMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setPrompt("");
    setNotice("");
    setCitations([]);
    setSending(true);
    let activeConversationId = conversationId;
    let persistenceWarning = false;
    const supabase = getSupabaseBrowserClient();
    try {
      if (supabase && signedInUserId) {
        if (!activeConversationId) {
          const { data: created, error: createError } = await supabase.from("nexi_conversations").insert({ user_id: signedInUserId, title: text.slice(0, 80) }).select("id").single();
          if (createError || !created?.id) persistenceWarning = true;
          else { activeConversationId = created.id as string; setConversationId(activeConversationId); }
        }
        if (activeConversationId) {
          const { error: userSaveError } = await supabase.from("nexi_messages").insert({ conversation_id: activeConversationId, user_id: signedInUserId, role: "user", content: text });
          if (userSaveError) persistenceWarning = true;
          else {
            const { error: touchError } = await supabase.from("nexi_conversations").update({ updated_at: new Date().toISOString() }).eq("id", activeConversationId).eq("user_id", signedInUserId);
            if (touchError) persistenceWarning = true;
          }
        }
      }
      const response = await fetch("/api/nexi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-12), webSearch, memory: memory.slice(0, 4000) }),
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
      if (supabase && signedInUserId && activeConversationId) {
        const { error: assistantSaveError } = await supabase.from("nexi_messages").insert({ conversation_id: activeConversationId, user_id: signedInUserId, role: "assistant", content: data.reply });
        if (assistantSaveError) persistenceWarning = true;
        else {
          const { error: touchError } = await supabase.from("nexi_conversations").update({ updated_at: new Date().toISOString() }).eq("id", activeConversationId).eq("user_id", signedInUserId);
          if (touchError) persistenceWarning = true;
        }
      }
      if (persistenceWarning) setNotice("Resposta recebida, mas o histórico não foi salvo. Confira se sua sessão está ativa e se as políticas do Supabase estão configuradas.");
      else if (!signedInUserId) setNotice("Você pode conversar normalmente, mas o histórico ainda não será salvo nesta sessão. Entre na sua conta Nexora para usar o histórico persistente.");
      if (Array.isArray(data.citations)) {
        const validCitations = data.citations.filter((item: Record<string, unknown>) => typeof item.title === "string" && typeof item.url === "string" && (item.url.startsWith("https://") || item.url.startsWith("http://"))) as { title: string; url: string }[];
        setCitations(validCitations);
      }
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
            <span className="nexi-mark" aria-hidden="true"><svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><defs><linearGradient id="nexi-mark-gradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#57e9ff"/><stop offset=".56" stop-color="#a99aff"/><stop offset="1" stop-color="#f29bff"/></linearGradient></defs><path d="M7 24V8l18 16V8" fill="none" stroke="url(#nexi-mark-gradient)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="25" cy="7" r="2.2" fill="#8ff5ff"/><path d="M4 27h8" stroke="#c49aff" stroke-width="2" stroke-linecap="round"/></svg></span>
            <span><strong>NEXI</strong><small>INTELIGÊNCIA DA NEXORA</small></span>
          </Link>
          <div className="nexi-header-actions">
            {messages.length > 0 && <button className="nexi-new-chat" type="button" onClick={startNewConversation} disabled={sending}>＋ Nova conversa</button>}
            <span className="nexi-status" title={engineStatus}><i /> {engineStatus}</span>
          </div>
        </header>

        <section className="nexi-hero">
          <div className="nexi-orb" aria-hidden="true"><svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><linearGradient id="nexi-core-gradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#56e8ff"/><stop offset=".52" stop-color="#9b8aff"/><stop offset="1" stop-color="#f29bff"/></linearGradient></defs><path d="M13 48V16l38 32V16" fill="none" stroke="url(#nexi-core-gradient)" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 53h17" fill="none" stroke="#71eaff" stroke-width="2.5" stroke-linecap="round"/><circle cx="51" cy="13" r="4" fill="#a9f6ff"/><circle cx="51" cy="13" r="7" fill="none" stroke="#a9f6ff" stroke-opacity=".35" stroke-width="1.2"/></svg><i /><b /></div>
          <p className="nexi-eyebrow">SUA IDEIA É O COMEÇO DE TUDO</p>
          <h1>Olá! Eu sou a <span>Nexi.</span></h1>
          <p className="nexi-subtitle">Conectando ideias. Criando possibilidades.</p>
          <p className="nexi-description">Uma nova forma de criar, descobrir e organizar ideias — integrada à experiência Nexora.</p>
        </section>

        <section className="nexi-memory-panel" aria-label="Memória da Nexi">
          <button className="nexi-memory-toggle" type="button" onClick={() => setMemoryOpen(value => !value)} aria-expanded={memoryOpen}>
            <span aria-hidden="true">◇</span> Memória inteligente <small>{signedInUserId ? "Privada neste navegador · controlada por você" : "Entre na conta para usar memória por conta"}</small><b>{memoryOpen ? "−" : "+"}</b>
          </button>
          {memoryOpen && <div className="nexi-memory-editor">
            <p>Adicione preferências e informações que você quer que a Nexi considere em novas conversas. Esse texto fica neste navegador e é enviado junto com suas mensagens para dar contexto; não é uma memória automática nem sincronizada entre dispositivos.</p>
            <textarea value={memory} onChange={event => setMemory(event.target.value.slice(0, 4000))} maxLength={4000} rows={4} placeholder="Ex.: prefiro respostas em português brasileiro; estou criando a Nexora; gosto de ideias originais para Reels..." disabled={!signedInUserId} />
            <div><span>{memory.length}/4.000</span><button type="button" onClick={() => setMemory("")} disabled={!signedInUserId || !memory}>Limpar memória</button></div>
          </div>}
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
                <span className="nexi-message-author">{message.role === "assistant" ? "NEXI · IA DA NEXORA" : "VOCÊ"}</span>
                <p>{message.content}</p>
              </article>
            ))}
            {sending && <div className="nexi-thinking"><span /> {webSearch ? "A Nexi está pesquisando e pensando..." : "A Nexi está pensando..."}</div>}
            {citations.length > 0 && <aside className="nexi-citations" aria-label="Fontes consultadas"><strong>Fontes consultadas</strong>{citations.map((citation) => <a href={citation.url} key={citation.url} target="_blank" rel="noreferrer">{citation.title} <span aria-hidden="true">↗</span></a>)}</aside>}
          </section>
        )}

        <form className="nexi-composer" onSubmit={submitPrompt}>
          <label htmlFor="nexi-prompt">O que você quer fazer hoje?</label>
          <button className={"nexi-search-toggle" + (webSearch ? " active" : "")} type="button" onClick={() => setWebSearch(value => !value)} aria-pressed={webSearch} disabled={sending}><span aria-hidden="true">⌕</span> {webSearch ? "Pesquisa na internet ativada" : "Ativar pesquisa na internet"} <small>{webSearch ? "A Nexi poderá buscar fontes atuais" : "Opcional · pesquisar na web"}</small></button>
          <textarea id="nexi-prompt" value={prompt} onChange={(event) => { setPrompt(event.target.value); setNotice(""); }} placeholder="Escreva uma ideia, uma dúvida ou algo que queira criar..." maxLength={2000} rows={3} disabled={sending} />
          <div className="nexi-composer-footer">
            <span>{prompt.length}/2.000 caracteres</span>
            <button type="submit" disabled={!prompt.trim() || sending}>{sending ? "Pensando..." : "Enviar para Nexi"} <span aria-hidden="true">{sending ? "…" : "↗"}</span></button>
          </div>
          {notice && <p className="nexi-notice" role="status">{notice}</p>}
        </form>

        <p className="nexi-disclaimer"><span>✧</span> A Nexi usa o motor configurado no servidor. O histórico depende de uma sessão Nexora ativa; recursos como memória de longo prazo e motor próprio exigem integração e testes adicionais.</p>      </div>
      <PrimaryNav active="nexi" />
      <style jsx>{`
        .nexi-page{min-height:100dvh;padding:16px 14px 112px;color:#f7f7ff;background:radial-gradient(ellipse at 50% 5%,rgba(87,67,190,.19),transparent 42%),radial-gradient(ellipse at 8% 35%,rgba(29,194,237,.08),transparent 36%),#070914;font-family:Inter,system-ui,-apple-system,sans-serif}
        .nexi-shell{max-width:850px;margin:0 auto}
        .nexi-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 2px 18px;border-bottom:1px solid rgba(173,157,255,.14)}
        .nexi-brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}
        .nexi-mark{width:43px;height:43px;border-radius:15px;display:grid;place-items:center;color:#c9f8ff;background:linear-gradient(145deg,rgba(46,212,255,.22),rgba(157,91,255,.28));border:1px solid rgba(122,220,255,.35);box-shadow:0 0 25px rgba(85,122,255,.14)}
        .nexi-mark svg{width:29px;height:29px;display:block;filter:drop-shadow(0 0 7px rgba(91,226,255,.25))}
        .nexi-brand strong{display:block;font-size:16px;letter-spacing:2.3px;background:linear-gradient(95deg,#72f2ff,#b5a0ff 60%,#f0a5ff);color:transparent;background-clip:text}
        .nexi-brand small{display:block;margin-top:4px;font-size:8px;letter-spacing:1.4px;color:#9299bd}
        .nexi-header-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}.nexi-new-chat{border:1px solid rgba(150,164,255,.28);border-radius:999px;padding:8px 10px;background:rgba(109,91,205,.12);color:#dcd8ff;font:inherit;font-size:10px;font-weight:750;cursor:pointer}.nexi-new-chat:hover,.nexi-new-chat:focus-visible{border-color:rgba(106,224,255,.6);outline:none}.nexi-new-chat:disabled{opacity:.45;cursor:not-allowed}
        .nexi-status{display:flex;align-items:center;gap:7px;font-size:9px;font-weight:800;letter-spacing:1px;color:#a6eaf7;border:1px solid rgba(105,221,255,.2);background:rgba(49,166,222,.07);padding:8px 10px;border-radius:999px}
        .nexi-status i{width:6px;height:6px;border-radius:50%;background:#6deaff;box-shadow:0 0 10px #6deaff}
        .nexi-hero{text-align:center;padding:31px 0 27px}
        .nexi-orb{width:90px;height:90px;border-radius:30px;margin:0 auto 22px;display:grid;place-items:center;position:relative;background:radial-gradient(circle at 30% 25%,rgba(89,241,255,.3),rgba(106,82,232,.16) 48%,rgba(220,90,255,.13));border:1px solid rgba(157,179,255,.4);box-shadow:0 0 55px rgba(85,114,255,.18),inset 0 0 25px rgba(124,209,255,.09);transform:rotate(-8deg)}
        .nexi-orb svg{width:58px;height:58px;transform:rotate(8deg);filter:drop-shadow(0 0 9px rgba(104,225,255,.38))}
        .nexi-orb i,.nexi-orb b{position:absolute;width:7px;height:7px;border-radius:50%;background:#a5f5ff;box-shadow:0 0 15px #73eaff}
        .nexi-orb i{right:-7px;top:14px}.nexi-orb b{left:8px;bottom:-5px;width:5px;height:5px;background:#d9a4ff}
        .nexi-eyebrow{font-size:9px;letter-spacing:2.3px;font-weight:850;color:#91ddf8;margin:0 0 12px}
        .nexi-hero h1{font-size:clamp(31px,7vw,49px);line-height:1.08;letter-spacing:-1.8px;margin:0}
        .nexi-hero h1 span{background:linear-gradient(100deg,#6beaff,#b1a0ff 56%,#f29bff);color:transparent;background-clip:text}
        .nexi-subtitle{font-size:14px;color:#c6b9ff;margin:13px 0 8px}
        .nexi-description{max-width:440px;margin:0 auto;color:#9298b4;font-size:12px;line-height:1.7}
        .nexi-memory-panel{margin:0 0 13px;border:1px solid rgba(130,190,255,.2);border-radius:15px;background:rgba(16,21,43,.72);overflow:hidden}
        .nexi-memory-toggle{width:100%;display:flex;align-items:center;gap:9px;text-align:left;padding:12px 14px;border:0;background:transparent;color:#c9d9ff;font:inherit;font-size:11px;font-weight:800;cursor:pointer}
        .nexi-memory-toggle>span{font-size:17px;color:#8ceeff}.nexi-memory-toggle small{margin-left:auto;color:#818cad;font-size:9px;font-weight:500}.nexi-memory-toggle>b{color:#92edff;font-size:16px}
        .nexi-memory-editor{padding:0 12px 12px}.nexi-memory-editor p{font-size:10px;line-height:1.6;color:#9099b8;margin:0 0 8px}.nexi-memory-editor textarea{box-sizing:border-box;width:100%;resize:vertical;padding:10px;border:1px solid rgba(155,170,230,.2);border-radius:10px;background:#080b18;color:#eef2ff;font:inherit;font-size:11px;line-height:1.6}.nexi-memory-editor textarea:focus{outline:1px solid #7beaff}.nexi-memory-editor textarea:disabled{opacity:.5}.nexi-memory-editor>div{display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:9px;color:#7d86a8}.nexi-memory-editor button{border:1px solid rgba(150,164,255,.25);border-radius:8px;background:rgba(109,91,205,.12);color:#c9c4ff;padding:6px 9px;font:inherit;cursor:pointer}.nexi-memory-editor button:disabled{opacity:.4;cursor:not-allowed}
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
        .nexi-citations{display:flex;flex-direction:column;gap:7px;align-self:stretch;padding:12px 14px;border:1px solid rgba(105,220,255,.2);border-radius:13px;background:rgba(20,35,57,.55)}.nexi-citations strong{font-size:10px;letter-spacing:.8px;color:#91eaff;text-transform:uppercase}.nexi-citations a{font-size:11px;line-height:1.5;color:#c7c8ff;text-decoration:none;overflow-wrap:anywhere}.nexi-citations a:hover{text-decoration:underline;color:#a5f4ff}
        .nexi-thinking{align-self:flex-start;display:flex;align-items:center;gap:9px;padding:10px 12px;color:#a9b0d1;font-size:11px}
        .nexi-thinking span{width:7px;height:7px;border-radius:50%;background:#83eaff;box-shadow:0 0 12px #83eaff;animation:nexi-thinking-pulse 1s ease-in-out infinite alternate}
        @keyframes nexi-thinking-pulse{to{opacity:.25;transform:scale(.7)}}
        .nexi-composer{padding:16px;border:1px solid rgba(125,158,255,.25);border-radius:20px;background:linear-gradient(145deg,rgba(18,22,44,.96),rgba(11,13,27,.98));box-shadow:0 18px 55px rgba(0,0,0,.16)}
        .nexi-composer label{display:block;font-size:12px;font-weight:800;margin-bottom:10px;color:#e5e7ff}
        .nexi-search-toggle{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 10px;padding:9px 11px;border:1px solid rgba(150,160,220,.2);border-radius:11px;background:rgba(15,18,38,.9);color:#b8c3e5;font:inherit;font-size:10px;font-weight:750;cursor:pointer}.nexi-search-toggle>span{font-size:17px;color:#8feaff}.nexi-search-toggle small{margin-left:auto;color:#7d86a8;font-size:9px;font-weight:500}.nexi-search-toggle.active{border-color:rgba(100,229,255,.55);background:linear-gradient(100deg,rgba(41,172,221,.12),rgba(151,104,255,.13));color:#a4f1ff}.nexi-search-toggle:disabled{opacity:.5;cursor:not-allowed}
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
        @media(max-width:540px){.nexi-page{padding:12px 12px 108px}.nexi-header{padding-bottom:14px}.nexi-status{font-size:8px;letter-spacing:.5px;padding:7px 8px}.nexi-new-chat{font-size:9px;padding:7px 9px}.nexi-suggestions{grid-template-columns:1fr;gap:8px}.nexi-suggestion{min-height:0;display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:6px 10px;padding:12px}.nexi-suggestion-icon{grid-row:span 2}.nexi-suggestion strong{grid-column:2}.nexi-suggestion>span:not(.nexi-suggestion-icon){grid-column:2}.nexi-suggestion>b{right:14px;top:18px}.nexi-hero{padding-top:25px}.nexi-orb{width:76px;height:76px;border-radius:25px}.nexi-orb svg{width:49px;height:49px}.nexi-composer{padding:13px}.nexi-composer-footer button{padding:10px 11px;font-size:10px}}
      `}</style>
    </main>
  );
}
