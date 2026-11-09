"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Message = { id: number; from: "me" | "them"; type: "text" | "image" | "audio"; text?: string; time: string; duration?: string; image?: string };
type Chat = { id: string; name: string; handle: string; avatar: string; online?: boolean; unread: number; preview: string; time: string; messages: Message[] };

const people = [
  { name: "Jenny Wilson", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces" },
  { name: "Guy Hawkins", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994e43e?w=160&h=160&fit=crop&crop=faces" },
  { name: "Kristin Watson", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop&crop=faces" },
  { name: "Arlene McCoy", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop&crop=faces" },
  { name: "Daniel Garcia", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces" },
  { name: "Sophia Miller", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop&crop=faces" },
  { name: "Noah Bennett", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces" },
  { name: "Olivia Davis", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces" }
];

const initialChats: Chat[] = [
  { id: "jenny", name: "Jenny Wilson", handle: "@jennywilson", avatar: people[0].avatar, online: true, unread: 2, preview: "Sure, I'll be there in a few minutes", time: "2mins ago", messages: [
    { id: 1, from: "them", type: "text", text: "Hey! How are you today?", time: "09:38" },
    { id: 2, from: "me", type: "text", text: "I'm good. How about you?", time: "09:40" },
    { id: 3, from: "them", type: "text", text: "Sure, I'll be there in a few minutes", time: "09:41" }
  ]},
  { id: "guy", name: "Guy Hawkins", handle: "@guyhawkins", avatar: people[1].avatar, unread: 0, preview: "I'll get back to you on that", time: "08:24", messages: [
    { id: 4, from: "them", type: "text", text: "Did you see the latest update?", time: "08:20" },
    { id: 5, from: "me", type: "text", text: "Yes! I'll get back to you on that.", time: "08:24" }
  ]},
  { id: "kristin", name: "Kristin Watson", handle: "@kristinwatson", avatar: people[2].avatar, unread: 0, preview: "Keep you in the loop!", time: "09:45", messages: [
    { id: 6, from: "them", type: "text", text: "I'll keep you in the loop!", time: "09:45" }
  ]},
  { id: "arlene", name: "Arlene McCoy", handle: "@arlenemccoy", avatar: people[3].avatar, unread: 0, preview: "I'll take a peek, but no promises", time: "Yesterday", messages: [
    { id: 7, from: "them", type: "text", text: "I'll take a peek, but no promises.", time: "Yesterday" }
  ]},
  { id: "daniel", name: "Daniel Garcia", handle: "@danielgarcia", avatar: people[4].avatar, online: true, unread: 1, preview: "That sounds great! ✨", time: "Yesterday", messages: [
    { id: 8, from: "them", type: "text", text: "Hi 👋 It's good. Yours?", time: "10:12" },
    { id: 9, from: "me", type: "text", text: "It seems we have a lot common and have a lot interest in each other 😊", time: "10:14" },
    { id: 10, from: "them", type: "image", image: "art", time: "10:15" },
    { id: 11, from: "them", type: "audio", duration: "0:48", time: "10:16" },
    { id: 12, from: "me", type: "text", text: "Good! Great!", time: "10:18" }
  ]}
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  if (name === "back") return <svg {...common}><path d="m15 18-6-6 6-6" /></svg>;
  if (name === "more") return <svg {...common}><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>;
  if (name === "video") return <svg {...common}><rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3z"/></svg>;
  if (name === "phone") return <svg {...common}><path d="M5 4h4l2 5-2.5 1.5a15 15 0 0 0 5 5L15 13l5 2v4c0 1-1 2-2 2C10 20 4 14 3 6c0-1 1-2 2-2Z"/></svg>;
  if (name === "plus") return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
  if (name === "send") return <svg {...common}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
  if (name === "mic") return <svg {...common}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></svg>;
  if (name === "search") return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>;
  if (name === "close") return <svg {...common}><path d="m18 6-12 12M6 6l12 12"/></svg>;
  if (name === "speaker") return <svg {...common}><path d="M4 10v4h4l5 4V6l-5 4z"/><path d="M17 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
}

export default function MessagesPage() {
  const [view, setView] = useState<"inbox" | "chat" | "call">("inbox");
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeId, setActiveId] = useState("daniel");
  const [tab, setTab] = useState<"inbox" | "unread" | "requests">("inbox");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteColor, setNoteColor] = useState("#173452");
  const [noteMusic, setNoteMusic] = useState("");
  const [noteFont, setNoteFont] = useState("classic");
  const [rotationIndex, setRotationIndex] = useState(0);
  const orbitPeople = [people[5], people[6], people[2], people[7]];
  const orbitNotes = ["No melhor ritmo ✨", "Café e ideias ☕", "Dia de criar algo novo", "Uma música boa muda tudo"];
  const noteColors = ["#173452", "#512b75", "#7b304f", "#1c625c", "#7a5524", "#242b43"];
  const [newOpen, setNewOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [callMode, setCallMode] = useState<"voice" | "video">("video");
  const [callNotice, setCallNotice] = useState(false);
  const [recording, setRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const active = chats.find((chat) => chat.id === activeId) || chats[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexora-reference-messages-v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setChats(parsed);
      }
      setNote(localStorage.getItem("nexora-chat-note-v1") || "");
      setNoteColor(localStorage.getItem("nexora-note-color-v1") || "#173452");
      setNoteMusic(localStorage.getItem("nexora-note-music-v1") || "");
      setNoteFont(localStorage.getItem("nexora-note-font-v1") || "classic");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("nexora-reference-messages-v1", JSON.stringify(chats));
      localStorage.setItem("nexora-chat-note-v1", note);
      localStorage.setItem("nexora-note-color-v1", noteColor);
      localStorage.setItem("nexora-note-music-v1", noteMusic);
      localStorage.setItem("nexora-note-font-v1", noteFont);
    } catch {}
  }, [chats, note]);

  useEffect(() => {
    const timer = window.setInterval(() => setRotationIndex((value) => (value + 1) % orbitPeople.length), 3600);
    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => chats.filter((chat) => {
    const matches = (chat.name + " " + chat.preview + " " + chat.handle).toLowerCase().includes(search.toLowerCase());
    if (!matches) return false;
    if (tab === "requests") return false;
    return tab !== "unread" || chat.unread > 0;
  }), [chats, search, tab]);

  function openChat(id: string) {
    setActiveId(id);
    setChats((current) => current.map((chat) => chat.id === id ? { ...chat, unread: 0 } : chat));
    setView("chat");
  }

  function sendMessage(text?: string, type: "text" | "audio" = "text") {
    if (!active) return;
    const value = (text ?? draft).trim();
    if (type === "text" && !value) return;
    const message: Message = { id: Date.now(), from: "me", type, text: value, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), duration: type === "audio" ? "0:08" : undefined };
    setChats((current) => current.map((chat) => chat.id === active.id ? { ...chat, preview: type === "audio" ? "Voice message" : value, time: "now", messages: [...chat.messages, message] } : chat));
    setDraft("");
    setRecording(false);
  }

  function attachImage(file?: File) {
    if (!file || !active || !file.type.startsWith("image/")) return;
    const image = URL.createObjectURL(file);
    const message: Message = { id: Date.now(), from: "me", type: "image", image, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    setChats((current) => current.map((chat) => chat.id === active.id ? { ...chat, preview: "Photo", time: "now", messages: [...chat.messages, message] } : chat));
  }

  function startCall(mode: "voice" | "video") {
    setCallMode(mode);
    setCallNotice(true);
    setView("call");
  }

  return (
    <>
    <main className="msg-app">
      <div className="msg-device">
        {view === "inbox" && <header className="msg-topbar">
          <button className="msg-icon-btn" onClick={() => window.history.back()} aria-label="Voltar"><Icon name="back" /></button>
          <div className="msg-top-title">{view === "inbox" ? "Message" : view === "chat" ? active.name : callMode === "video" ? "Video call" : "Voice call"}</div>
          <button className="msg-icon-btn" onClick={() => setMenuOpen((value) => !value)} aria-label="Mais opções"><Icon name="more" /></button>
          {menuOpen && <div className="msg-menu"><button onClick={() => { setSearchOpen((value) => !value); setMenuOpen(false); }}>Search messages</button><button onClick={() => { setSearch(""); setSearchOpen(false); setMenuOpen(false); }}>Clear search</button><button onClick={() => { setTab("inbox"); setMenuOpen(false); }}>All messages</button><button onClick={() => { setNoteOpen(true); setMenuOpen(false); }}>Edit my note</button></div>}
        </header>}

        {view === "inbox" && (
          <section className="msg-inbox">
            <div className="msg-note-stage">
              <button className="msg-add-note" onClick={() => { setNoteDraft(note); setNoteOpen(true); }}>Add note</button>
              <div className="msg-note-orbit" aria-label="Notas dos contatos">
                {orbitPeople.map((person, index) => {
                  const slot = (index - rotationIndex + orbitPeople.length) % orbitPeople.length;
                  const positions = ["orbit-one", "orbit-two", "orbit-three", "orbit-four"];
                  const chatIds = ["jenny", "guy", "kristin", "arlene"];
                  return <button className={"msg-orbit-avatar " + positions[slot]} key={person.name} onClick={() => openChat(chatIds[index])} aria-label={"Abrir conversa com " + person.name}>
                    <span className="msg-orbit-note" style={{ background: noteColors[index % noteColors.length] }}>{orbitNotes[index]}</span>
                    <img src={person.avatar} alt={person.name}/><span>{person.name.split(" ")[0]}</span>
                  </button>;
                })}
                <button className={"msg-own-note " + (note ? "has-note" : "")} onClick={() => { setNoteDraft(note); setNoteOpen(true); }} aria-label={note ? "Editar sua nota" : "Adicionar sua nota"}>
                  {note && <span className="msg-own-note-text" style={{ background: noteColor }}>{note}</span>}
                  <img src={people[4].avatar} alt="Seu perfil"/>
                  {!note && <span className="msg-own-plus"><Icon name="plus" size={13}/></span>}
                </button>
              </div>
            </div>
            <div className="msg-tabs">
              <button className={tab === "inbox" ? "selected" : ""} onClick={() => setTab("inbox")}>Inbox <b>{chats.length + 21}</b></button>
              <button className={tab === "unread" ? "selected" : ""} onClick={() => setTab("unread")}>Unread</button>
              <button className={tab === "requests" ? "selected" : ""} onClick={() => setTab("requests")}>Requests</button>
            </div>
            {searchOpen && <div className="msg-search"><Icon name="search" size={17}/><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages"/></div>}
            <div className="msg-list">
              {filtered.map((chat) => (
                <button className="msg-row" key={chat.id} onClick={() => openChat(chat.id)}>
                  <span className="msg-avatar"><img src={chat.avatar} alt=""/>{chat.online && <i/>}</span>
                  <span className="msg-row-copy"><strong>{chat.name}</strong><small>{chat.preview}</small></span>
                  <span className="msg-row-meta"><small>{chat.time}</small>{chat.unread > 0 && <i>{chat.unread}</i>}</span>
                </button>
              ))}
              {filtered.length === 0 && <div className="msg-empty">No conversations here yet.</div>}
            </div>
            <div className="msg-inbox-compose">
              <button onClick={() => setNewOpen(true)}><Icon name="plus" size={17}/> <span>New</span></button>
              <button className="msg-round-action" onClick={() => setRecording((value) => !value)} aria-label="Gravar áudio"><Icon name="mic"/></button>
              <button className="msg-round-action msg-send-action" onClick={() => setNewOpen(true)} aria-label="Nova mensagem"><Icon name="send" size={18}/></button>
            </div>
          </section>
        )}

        {view === "chat" && active && (
          <section className="msg-chat">
            <div className="msg-chat-profile">
              <span className="msg-avatar msg-chat-avatar"><img src={active.avatar} alt=""/>{active.online && <i/>}</span>
              <span className="msg-contact-name"><strong>{active.name}</strong><small>{active.online ? "Online" : "Active recently"}</small></span>
              <button className="msg-call-btn" onClick={() => startCall("video")} aria-label="Videochamada"><Icon name="video"/></button>
              <button className="msg-call-btn" onClick={() => startCall("voice")} aria-label="Chamada de voz"><Icon name="phone"/></button>
            </div>
            <div className="msg-chat-history">
              {active.messages.map((message) => (
                <div className={"msg-bubble-row " + (message.from === "me" ? "mine" : "theirs")} key={message.id}>
                  {message.from === "them" && <img className="msg-bubble-avatar" src={active.avatar} alt=""/>}
                  <div className={"msg-bubble " + (message.type === "image" ? "image-bubble" : "")}>
                    {message.type === "text" && <span>{message.text}</span>}
                    {message.type === "image" && (message.image === "art" ? <div className="msg-art-image"/> : <img className="msg-sent-image" src={message.image} alt="Imagem enviada"/>)}
                    {message.type === "audio" && <div className="msg-audio"><span className="msg-wave">{Array.from({ length: 25 }, (_, index) => <i key={index} style={{ height: (7 + ((index * 13) % 19)) + "px" }}/>)}</span><small>{message.duration || "0:24"}</small><button aria-label="Reproduzir áudio">▶</button></div>}
                    <small className="msg-time">{message.time}{message.from === "me" ? "  ✓✓" : ""}</small>
                  </div>
                  {message.from === "me" && <img className="msg-bubble-avatar" src={people[4].avatar} alt=""/>}
                </div>
              ))}
            </div>
            <div className="msg-chat-composer">
              <button className="msg-compose-plus" onClick={() => fileRef.current?.click()} aria-label="New attachment"><Icon name="plus" size={15}/><span>New</span></button>
              <div className="msg-input-wrap"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Type Message..."/><button onClick={() => setRecording((value) => !value)} aria-label="Microfone"><Icon name="mic" size={18}/></button></div>
              <button className="msg-send" onClick={() => recording ? sendMessage("Voice message", "audio") : sendMessage()} aria-label="Enviar"><Icon name="send" size={18}/></button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => { attachImage(event.target.files?.[0]); event.currentTarget.value = ""; }}/>
            </div>
            {recording && <div className="msg-recording">Recording preview · tap send to add a voice message</div>}
          </section>
        )}

        {view === "call" && (
          <section className="msg-call-screen">
            <button className="msg-call-back" onClick={() => setView("chat")} aria-label="Voltar à conversa"><Icon name="back"/></button><div className="msg-call-time"><span/> 12:47</div>
            <div className="msg-call-grid">
              {people.concat(people.slice(0, 4)).map((person, index) => <button className="msg-call-person" key={index}><img src={person.avatar} alt=""/><span>{["Oliver","Evelyn","Amelia","Sophie","Emma","NoahB","Isabella","Elijah","Lucas","Ava","Harry","Olivia"][index]}</span><i className={index % 3 === 0 ? "speaking" : ""}/></button>)}
            </div>
            <div className="msg-reactions">{["😮","😍","🙌","👏","💛"].map((emoji) => <button key={emoji} onClick={() => setCallNotice(true)}>{emoji}</button>)}<button onClick={() => setCallNotice(true)}>•••</button></div>
            <div className="msg-call-controls">
              <button onClick={() => setCallNotice(true)}><Icon name="speaker" size={21}/></button>
              <button onClick={() => setCallNotice(true)}><Icon name="mic" size={21}/></button>
              <button className="msg-hangup" onClick={() => { setView("chat"); setCallNotice(false); }}><Icon name="phone" size={21}/></button>
            </div>
            {callNotice && <div className="msg-call-notice">Call interface preview · live audio/video will be connected later</div>}
          </section>
        )}
      </div>

      {noteOpen && <div className="msg-note-editor-backdrop" onClick={() => setNoteOpen(false)}>
        <section className="msg-note-editor" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Criar ou editar nota">
          <header className="msg-note-glass-top">
            <button onClick={() => setNoteOpen(false)} aria-label="Fechar editor"><Icon name="close" size={22}/></button>
            <button onClick={() => setMenuOpen((value) => !value)} aria-label="Mais opções"><Icon name="more" size={22}/></button>
            {menuOpen && <div className="msg-note-options"><button onClick={() => { setNote(""); setNoteDraft(""); setNoteMusic(""); setMenuOpen(false); setNoteOpen(false); }}>Remover nota</button><button onClick={() => setMenuOpen(false)}>Continuar editando</button></div>}
          </header>
          <div className="msg-note-glass-workspace">
            <div className="msg-note-glass-preview" style={{ background: "linear-gradient(135deg," + noteColor + "55,rgba(15,25,43,.24) 55%,rgba(93,185,226,.20))" }}>
              <span className={"msg-note-glass-preview-text font-" + noteFont}>{noteDraft || "Sua ideia começa aqui..."}</span>
              {noteMusic && <small>♫ {noteMusic}</small>}
            </div>
            <div className="msg-note-glass-composer">
              <textarea autoFocus maxLength={70} value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Escreva uma nota..." />
              <div className="msg-note-glass-tools">
                <button aria-label="Cores" onClick={() => setMenuOpen((value) => !value)}><span className="msg-note-tool-dot" style={{ background: noteColor }}/></button>
                <button aria-label="Estilo clássico" className={noteFont === "classic" ? "active" : ""} onClick={() => setNoteFont("classic")}>Aa</button>
                <button aria-label="Estilo elegante" className={noteFont === "serif" ? "active serif" : "serif"} onClick={() => setNoteFont("serif")}>Aa</button>
                <button aria-label="Estilo forte" className={noteFont === "bold" ? "active bold" : "bold"} onClick={() => setNoteFont("bold")}>Aa</button>
                <button aria-label="Selecionar música" onClick={() => setNoteMusic(noteMusic ? "" : "Aurora — Nexora Mix")}>♫</button>
                <span className="msg-note-glass-counter">{noteDraft.length}/70</span>
                <button className="msg-note-glass-publish" disabled={!noteDraft.trim()} onClick={() => { setNote(noteDraft.trim()); setNoteOpen(false); setMenuOpen(false); }}>Publicar</button>
              </div>
              <div className="msg-note-glass-palette">{noteColors.map((color) => <button key={color} className={noteColor === color ? "active" : ""} style={{ background: color }} onClick={() => setNoteColor(color)} aria-label={"Selecionar cor " + color}/>)}</div>
              {noteMusic && <div className="msg-note-glass-music">♫ {noteMusic} <button onClick={() => setNoteMusic("")}>×</button><small>Catálogo musical será conectado posteriormente</small></div>}
            </div>
          </div>
        </section>
      </div>}
      {newOpen && <div className="msg-modal-backdrop"><section className="msg-modal msg-new-modal"><button className="msg-modal-close" onClick={() => setNewOpen(false)}><Icon name="close"/></button><h2>New message</h2>{people.slice(0, 5).map((person, index) => <button className="msg-new-person" key={person.name} onClick={() => { const target = ["jenny","guy","kristin","arlene","daniel"][index]; setNewOpen(false); openChat(target); }}><img src={person.avatar} alt=""/><span>{person.name}</span><Icon name="back"/></button>)}</section></div>}
    </main>
    <MessagesStyles />
    </>
  );
}

const styles = `
*{box-sizing:border-box}
.msg-app{height:100dvh;min-height:590px;width:100%;overflow:hidden;background:#030711;color:#f4f7ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.msg-device{position:relative;isolation:isolate;display:flex;flex-direction:column;width:100%;max-width:560px;height:100%;margin:0 auto;overflow:hidden;background:radial-gradient(ellipse at 50% -12%,rgba(150,220,255,.25),transparent 38%),radial-gradient(ellipse at 100% 48%,rgba(54,116,255,.09),transparent 42%),radial-gradient(ellipse at 0% 78%,rgba(55,190,238,.08),transparent 38%),#020914;border-inline:1px solid rgba(145,205,255,.12)}.msg-device:before{content:"";position:absolute;inset:0;pointer-events:none;z-index:-1;background:linear-gradient(145deg,rgba(160,222,255,.035),transparent 35%,rgba(89,139,255,.035));}
.msg-topbar{height:65px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:8px 18px;background:linear-gradient(180deg,rgba(0,173,218,.12),rgba(3,11,24,.12));position:relative;z-index:3}
.msg-icon-btn{display:grid;place-items:center;width:37px;height:37px;border:1px solid rgba(190,220,255,.12);border-radius:50%;background:rgba(255,255,255,.055);color:#e6f5ff}
.msg-top-title{font-size:13px;font-weight:600;letter-spacing:.15px;color:#eaf7ff}
.msg-menu{position:absolute;right:15px;top:53px;z-index:9;display:flex;flex-direction:column;min-width:155px;padding:7px;border:1px solid #33476b;border-radius:14px;background:#101a2b;box-shadow:0 15px 40px #000b}
.msg-menu button{padding:10px;border:0;background:none;color:#eaf2ff;text-align:left;font-size:11px}
.msg-inbox{display:flex;flex:1;min-height:0;flex-direction:column;padding:0 19px 13px}
.msg-note-stage{position:relative;display:flex;align-items:center;flex-direction:column;height:202px;flex:none;padding-top:2px}
.msg-add-note{z-index:2;padding:7px 17px;border:0;border-radius:20px;background:linear-gradient(110deg,#713cff,#148bff,#25d5e6);box-shadow:0 4px 22px rgba(43,107,255,.28);color:white;font-size:9px;font-weight:700}
.msg-note-orbit{position:relative;width:100%;height:166px;margin-top:3px}
.msg-orbit-avatar{position:absolute;display:flex;align-items:center;flex-direction:column;gap:4px;padding:0;border:0;background:none;color:#cbd9ee}
.msg-orbit-avatar img{width:42px;height:42px;object-fit:cover;border:2px solid #0a192b;border-radius:50%;outline:1.5px solid rgba(157,225,255,.88);outline-offset:1px;box-shadow:0 0 0 4px rgba(102,194,255,.10),0 0 18px rgba(100,190,255,.34);transition:transform .25s ease,box-shadow .25s ease}.msg-orbit-avatar:active img{transform:scale(1.07);box-shadow:0 0 0 5px rgba(142,214,255,.16),0 0 23px rgba(115,203,255,.48)}
.msg-orbit-avatar span{font-size:8px}
.orbit-one{left:8%;top:21px}.orbit-two{left:23%;top:63px}.orbit-three{right:23%;top:63px}.orbit-four{right:8%;top:21px}
.msg-own-note{position:absolute;left:50%;top:66px;transform:translateX(-50%);width:72px;height:72px;padding:3px;border:2px solid #b6efff;border-radius:50%;background:linear-gradient(145deg,#9a8aff,#70eaff,#438cff);box-shadow:0 0 0 4px rgba(151,218,255,.12),0 0 0 7px rgba(95,161,255,.08),0 0 30px rgba(126,211,255,.42);animation:msgAura 4s ease-in-out infinite}
.msg-own-note img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.msg-own-plus{position:absolute;right:-3px;bottom:-5px;display:grid;place-items:center;width:22px;height:22px;border:2px solid #06101f;border-radius:50%;background:#f3fbff;color:#17233b}
.msg-note-preview{position:absolute;bottom:0;max-width:190px;overflow:hidden;padding:5px 11px;border:1px solid #3a5076;border-radius:15px;background:#111b2c;color:#d9e9ff;font-size:9px;text-overflow:ellipsis;white-space:nowrap}
.msg-tabs{display:flex;align-self:center;gap:5px;padding:5px;border:1px solid rgba(154,182,230,.08);border-radius:30px;background:#111a2a}
.msg-tabs button{padding:9px 15px;border:0;border-radius:22px;background:transparent;color:#8c9cb6;font-size:9px}
.msg-tabs button.selected{background:linear-gradient(105deg,#713cff,#168df5,#26cce5);box-shadow:0 3px 13px #3269f955;color:white}
.msg-tabs b{margin-left:3px;font-size:8px}
.msg-search{display:flex;align-items:center;gap:9px;margin:14px 0 4px;padding:0 12px;height:37px;border:1px solid rgba(128,170,230,.1);border-radius:12px;background:rgba(15,27,45,.66);color:#7f9fc6}
.msg-search input{width:100%;border:0;outline:0;background:transparent;color:#f4f7ff;font-size:10px}
.msg-search input::placeholder{color:#71839e}
.msg-list{flex:1;min-height:0;overflow:auto;padding:0 1px}
.msg-row{position:relative;display:flex;align-items:center;gap:12px;width:100%;padding:12px 4px;border:0;border-bottom:1px solid rgba(148,195,235,.09);border-radius:13px;background:transparent;color:white;text-align:left;transition:background .2s ease,transform .2s ease}.msg-row:active{background:linear-gradient(100deg,rgba(128,203,255,.11),rgba(105,143,255,.06));transform:scale(.992)}
.msg-avatar{position:relative;display:block;width:44px;height:44px;flex:none;padding:2.5px;border-radius:50%;background:conic-gradient(from 210deg,#8beaff,#4b91ff,#9b7cff,#e2a7ff,#8beaff);box-shadow:0 0 0 1px rgba(177,226,255,.52),0 0 0 3px rgba(111,185,255,.10),0 0 17px rgba(100,184,255,.22);transition:box-shadow .25s ease,transform .25s ease}.msg-row:active .msg-avatar{transform:scale(1.045);box-shadow:0 0 0 1.5px #b7edff,0 0 0 4px rgba(112,190,255,.18),0 0 22px rgba(113,194,255,.42)}
.msg-avatar img{width:100%;height:100%;object-fit:cover;border:2px solid #071426;border-radius:50%}
.msg-avatar i{position:absolute;right:-1px;bottom:0;width:12px;height:12px;border:2px solid #071426;border-radius:50%;background:#55efb0;box-shadow:0 0 0 1px rgba(85,239,176,.45),0 0 10px rgba(85,239,176,.55)}
.msg-row-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:5px}
.msg-row-copy strong{font-size:11px;font-weight:650}
.msg-row-copy small{overflow:hidden;color:#899bb8;font-size:9px;text-overflow:ellipsis;white-space:nowrap}
.msg-row-meta{display:flex;align-items:flex-end;flex-direction:column;gap:6px;color:#8292ad}
.msg-row-meta small{font-size:8px}
.msg-row-meta i{display:grid;place-items:center;min-width:16px;height:16px;padding:0 4px;border-radius:20px;background:#20c7e9;color:#06101c;font-size:8px;font-style:normal}
.msg-empty{padding:25px;text-align:center;color:#8294b2;font-size:11px}
.msg-inbox-compose{display:flex;align-items:center;align-self:center;gap:9px;margin-top:8px;padding:5px 9px;border:1px solid rgba(142,169,220,.1);border-radius:30px;background:rgba(24,34,52,.88)}
.msg-inbox-compose button{display:flex;align-items:center;gap:5px;padding:7px 9px;border:0;border-radius:20px;background:transparent;color:#c4d8f5;font-size:9px}
.msg-inbox-compose .msg-round-action{display:grid;place-items:center;width:34px;height:34px;padding:0;border:1px solid rgba(164,187,230,.09);background:#202b40;color:#c9d8f1}
.msg-inbox-compose .msg-send-action{background:linear-gradient(130deg,#5848dc,#168ddc);color:white}
.msg-chat{display:flex;flex:1;min-height:0;flex-direction:column;overflow:hidden;background:radial-gradient(ellipse at 50% -8%,rgba(166,224,255,.20),transparent 36%),radial-gradient(ellipse at 100% 55%,rgba(79,130,255,.10),transparent 43%),#020914}
.msg-chat-profile{position:relative;display:flex;align-items:center;gap:10px;flex:none;height:84px;padding:8px 17px 16px;border-bottom:1px solid rgba(166,220,255,.18);background:linear-gradient(180deg,rgba(151,219,255,.17),rgba(70,138,255,.055) 58%,rgba(5,15,30,.02));backdrop-filter:blur(16px);border-radius:0 0 48% 10% / 0 0 16% 8%;box-shadow:0 8px 28px rgba(89,174,255,.07)}
.msg-chat-avatar{width:40px;height:40px}
.msg-contact-name{display:flex;flex:1;flex-direction:column;gap:4px}
.msg-contact-name strong{font-size:11px}
.msg-contact-name small{color:#35e5a1;font-size:8px}
.msg-call-btn{display:grid;place-items:center;width:37px;height:37px;border:1px solid rgba(177,225,255,.25);border-radius:50%;background:linear-gradient(145deg,rgba(160,220,255,.15),rgba(105,151,255,.07));box-shadow:inset 0 0 12px rgba(160,220,255,.06),0 0 14px rgba(100,184,255,.08);color:#c9efff;transition:transform .2s ease,box-shadow .2s ease}.msg-call-btn:active{transform:scale(.94);box-shadow:0 0 18px rgba(137,211,255,.3)}
.msg-chat-history{display:flex;flex:1;min-height:0;flex-direction:column;gap:19px;overflow:auto;padding:22px 15px 17px}
.msg-date-pill{align-self:center;padding:5px 11px;border:1px solid rgba(140,178,225,.1);border-radius:20px;background:#111d2d;color:#8197b6;font-size:8px}
.msg-bubble-row{display:flex;align-items:flex-end;gap:8px;max-width:91%}
.msg-bubble-row.mine{align-self:flex-end;flex-direction:row-reverse}
.msg-bubble-avatar{width:33px;height:33px;flex:none;object-fit:cover;border:2px solid #0b1a2d;outline:1px solid rgba(167,225,255,.86);outline-offset:1px;border-radius:50%;box-shadow:0 0 12px rgba(119,202,255,.24)}
.msg-bubble{max-width:calc(100% - 40px);padding:10px 12px 7px;border:1px solid rgba(166,211,255,.15);border-radius:17px 17px 17px 5px;background:linear-gradient(145deg,rgba(31,51,76,.98),rgba(20,33,53,.98));box-shadow:0 5px 18px rgba(0,0,0,.12),0 0 16px rgba(119,191,255,.045);color:#edf6ff;font-size:10px;line-height:1.55;overflow-wrap:anywhere}
.msg-bubble-row.mine .msg-bubble{border-color:rgba(150,218,255,.28);border-radius:17px 17px 5px 17px;background:linear-gradient(125deg,#214a70,#30305f 72%,#273d68);box-shadow:0 5px 20px rgba(35,105,190,.16),0 0 19px rgba(125,205,255,.09);color:#f5f9ff}
.msg-time{display:block;margin-top:5px;color:#8194b2;font-size:7px;text-align:right}
.msg-art-image{width:118px;height:86px;border-radius:13px;background:radial-gradient(ellipse at 25% 30%,#f4a6d4 0,transparent 43%),radial-gradient(ellipse at 72% 65%,#7e7bff 0,transparent 45%),linear-gradient(135deg,#d8a6e9,#5268b9 55%,#f3b4d8);box-shadow:inset 0 0 22px #fff6}
.msg-sent-image{display:block;max-width:175px;max-height:190px;object-fit:contain;border-radius:12px}
.msg-bubble.image-bubble{padding:4px;background:transparent;border:0}
.msg-bubble.image-bubble .msg-time{padding:0 5px}
.msg-audio{display:flex;align-items:center;gap:8px;min-width:170px}
.msg-wave{display:flex;align-items:center;gap:2px;height:27px}
.msg-wave i{display:block;width:2px;border-radius:3px;background:linear-gradient(180deg,#42d8ef,#8767ff)}
.msg-audio small{color:#c3d6f0;font-size:8px}
.msg-audio button{display:grid;place-items:center;width:23px;height:23px;border:0;border-radius:50%;background:linear-gradient(130deg,#4c4cf2,#18c8e8);color:white;font-size:9px}
.msg-chat-composer{display:flex;align-items:center;gap:7px;flex:none;padding:9px 10px max(10px,env(safe-area-inset-bottom));border-top:1px solid rgba(163,218,255,.16);background:linear-gradient(180deg,rgba(9,23,41,.94),rgba(5,14,27,.99));box-shadow:0 -8px 28px rgba(89,175,255,.055);backdrop-filter:blur(16px)}
.msg-compose-plus,.msg-send{display:flex;align-items:center;justify-content:center;gap:4px;width:55px;height:36px;flex:none;border:1px solid rgba(133,168,221,.14);border-radius:22px;background:#18263a;color:#8dcfff}.msg-compose-plus span{font-size:9px}
.msg-input-wrap{display:flex;align-items:center;flex:1;min-width:0;height:39px;padding:0 8px 0 13px;border:1px solid rgba(142,177,225,.12);border-radius:24px;background:#131f32}
.msg-input-wrap input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:white;font-size:10px}
.msg-input-wrap input::placeholder{color:#8192ad}
.msg-input-wrap button{display:grid;place-items:center;width:27px;height:30px;flex:none;border:0;background:transparent;color:#9eb2d0}
.msg-send{border:0;background:linear-gradient(130deg,#5148e8,#178ee7,#1cc9df);color:white}
.msg-recording{padding:0 16px 8px;background:#060f1d;color:#64dfff;font-size:8px}
.msg-call-screen{position:relative;display:flex;flex:1;min-height:0;flex-direction:column;padding:18px 16px 16px;background:radial-gradient(ellipse at 50% -12%,rgba(0,204,238,.3),transparent 35%),#020812}
.msg-call-back{position:absolute;top:21px;left:17px;display:grid;place-items:center;width:36px;height:36px;border:1px solid rgba(190,220,255,.12);border-radius:50%;background:rgba(255,255,255,.055);color:#e6f5ff}.msg-call-time{align-self:center;display:flex;align-items:center;gap:6px;margin:5px 0 23px;padding:7px 14px;border:1px solid rgba(109,164,255,.22);border-radius:22px;background:linear-gradient(100deg,#533ee8,#1c9ee7);font-size:9px;color:white}
.msg-call-time span{width:6px;height:6px;border-radius:50%;background:#ff4b65;box-shadow:0 0 8px #ff4b65}
.msg-call-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px 9px;align-content:start;flex:1}
.msg-call-person{position:relative;display:flex;align-items:center;flex-direction:column;gap:7px;border:0;background:none;color:#dce9fa}
.msg-call-person img{width:clamp(47px,13vw,65px);height:clamp(47px,13vw,65px);object-fit:cover;border:2px solid rgba(94,218,255,.46);border-radius:50%;box-shadow:0 0 15px rgba(68,150,255,.12)}
.msg-call-person span{font-size:8px}
.msg-call-person i{position:absolute;top:43px;right:calc(50% - 34px);width:10px;height:10px;border:2px solid #06101d;border-radius:50%;background:#56647b}
.msg-call-person i.speaking{background:#35e69a;box-shadow:0 0 8px #35e69a}
.msg-reactions{display:flex;align-items:center;align-self:center;gap:5px;margin:4px 0 20px;padding:7px 10px;border:1px solid rgba(151,171,212,.11);border-radius:30px;background:#172237}
.msg-reactions button{border:0;background:transparent;color:#e8f2ff;font-size:17px}
.msg-reactions button:last-child{font-size:12px;color:#a9bad3}
.msg-call-controls{display:flex;align-items:center;justify-content:center;gap:14px;padding:12px 0 0;border-top:1px solid rgba(148,183,224,.08)}
.msg-call-controls button{display:grid;place-items:center;width:46px;height:46px;border:1px solid rgba(160,180,218,.09);border-radius:50%;background:#1a2639;color:#dceaff}
.msg-call-controls .msg-hangup{background:#f32c3b;color:white;border:0}
.msg-hangup svg{transform:rotate(135deg)}
.msg-call-notice{position:absolute;left:50%;bottom:82px;transform:translateX(-50%);width:max-content;max-width:90%;padding:9px 12px;border:1px solid #41678b;border-radius:12px;background:#111d2d;color:#c9e9ff;font-size:8px;text-align:center}
.msg-modal-backdrop{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:rgba(0,4,12,.78);backdrop-filter:blur(10px)}
.msg-modal{position:relative;width:min(370px,100%);padding:23px;border:1px solid rgba(103,174,255,.35);border-radius:21px;background:#0c1729;color:white;box-shadow:0 20px 80px #000b}
.msg-modal h2{margin:0 0 15px;font-size:17px}
.msg-modal-close{position:absolute;top:15px;right:15px;border:0;background:none;color:#c8d8ee}
.msg-modal textarea{width:100%;min-height:90px;padding:12px;border:1px solid #344969;border-radius:12px;outline:0;background:#07111f;color:white;font:12px inherit;resize:vertical}
.msg-modal>small{display:block;margin-top:5px;color:#91a6c5;font-size:9px;text-align:right}
.msg-modal-save{width:100%;margin-top:13px;padding:11px;border:0;border-radius:13px;background:linear-gradient(100deg,#6745ef,#168ee9,#1cc9df);color:white;font-size:11px;font-weight:700}
.msg-new-person{display:flex;align-items:center;gap:11px;width:100%;padding:10px 0;border:0;border-bottom:1px solid #ffffff12;background:none;color:white;text-align:left}
.msg-new-person img{width:37px;height:37px;object-fit:cover;border-radius:50%}
.msg-new-person span{flex:1;font-size:11px}
.msg-new-person svg{transform:rotate(180deg);color:#7e9dbf}
/* Notes orbit and full-screen editor */
.msg-orbit-avatar{transition:left .65s cubic-bezier(.2,.8,.2,1),right .65s cubic-bezier(.2,.8,.2,1),top .65s cubic-bezier(.2,.8,.2,1),transform .65s cubic-bezier(.2,.8,.2,1)}
.msg-orbit-note{position:absolute;z-index:2;top:-28px;left:50%;max-width:112px;overflow:hidden;padding:5px 8px;border:1px solid rgba(190,230,255,.32);border-radius:12px;color:#fff;font-size:8px;line-height:1.2;text-overflow:ellipsis;white-space:nowrap;transform:translateX(-50%);box-shadow:0 5px 16px #0007}
.msg-own-note.has-note{border-color:#b6efff}
.msg-own-note-text{position:absolute;z-index:2;left:50%;top:-34px;max-width:160px;overflow:hidden;padding:6px 10px;border:1px solid #a9e8ff66;border-radius:13px;color:white;font-size:9px;text-overflow:ellipsis;white-space:nowrap;transform:translateX(-50%);box-shadow:0 5px 18px #0008}
.msg-note-editor-backdrop{position:fixed;inset:0;z-index:12000;display:flex;align-items:stretch;justify-content:center;padding:0;background:rgba(2,8,18,.42);backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px)}
.msg-note-editor{display:flex;flex-direction:column;width:min(100%,560px);height:100dvh;overflow:auto;background:linear-gradient(180deg,#0b1728f2,#050d1bf7);color:#f4f8ff;border-inline:1px solid #a5dfff18}
.msg-note-editor-head{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:42px 1fr 82px;align-items:center;min-height:62px;padding:8px 15px;border-bottom:1px solid #b4dcff18;background:#0a1526ed;backdrop-filter:blur(18px)}
.msg-note-editor-head>button{display:grid;place-items:center;width:38px;height:38px;border:1px solid #b7dfff22;border-radius:50%;background:#ffffff08;color:#eaf6ff}
.msg-note-editor-head>span{text-align:center;font-size:14px;font-weight:700}
.msg-note-editor-head .msg-note-publish{width:78px;height:36px;border:0;border-radius:22px;background:linear-gradient(110deg,#6745ef,#168ee9,#1cc9df);font-size:11px;font-weight:700}
.msg-note-editor-head .msg-note-publish:disabled{opacity:.4}
.msg-note-editor-main{display:flex;flex:1;flex-direction:column;gap:15px;padding:20px 20px max(24px,env(safe-area-inset-bottom))}
.msg-note-live-preview{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;min-height:150px;padding:20px;border:1px solid #c4e9ff38;border-radius:24px;box-shadow:0 12px 34px #0004,inset 0 0 35px #ffffff0b}
.msg-note-live-text{max-width:100%;overflow-wrap:anywhere;color:white;font-size:23px;font-weight:600;text-align:center;line-height:1.25}
.msg-note-live-text.font-serif{font-family:Georgia,serif;font-weight:500}
.msg-note-live-text.font-bold{font-weight:850;letter-spacing:-.5px}
.msg-note-live-preview small{color:#d5eaff;font-size:10px}
.msg-note-editor-main textarea{width:100%;min-height:105px;padding:16px;border:1px solid #8fcfff35;border-radius:17px;outline:none;background:#0d1b2e;color:#fff;font-family:inherit;font-size:16px;line-height:1.5;resize:none}
.msg-note-editor-main textarea:focus{border-color:#69d8ff;box-shadow:0 0 0 3px #4cbfff1a}
.msg-note-counter{margin-top:-10px;color:#91a8c6;font-size:10px;text-align:right}
.msg-note-tool-section{display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid #a5dfff16;border-radius:17px;background:#ffffff06}
.msg-note-tool-section>strong{font-size:12px;color:#eaf5ff}
.msg-note-color-row,.msg-note-font-row,.msg-note-music-row{display:flex;flex-wrap:wrap;gap:9px}
.msg-note-color-row button{width:32px;height:32px;border:2px solid #ffffff55;border-radius:50%;box-shadow:0 3px 9px #0005}
.msg-note-color-row button.active{outline:2px solid #a9edff;outline-offset:3px}
.msg-note-font-row button,.msg-note-music-row button{padding:9px 12px;border:1px solid #b4dfff24;border-radius:20px;background:#13243a;color:#cbdcf1;font-size:10px}
.msg-note-font-row button.active,.msg-note-music-row button.active{border-color:#6fdcff;background:#173d5c;color:#fff}
.msg-note-music-hint{color:#8299b8;font-size:9px;line-height:1.4}
.msg-note-delete{align-self:center;padding:9px 15px;border:1px solid #ff7c8a55;border-radius:20px;background:#a5283a18;color:#ffb5bf;font-size:10px}
@media(max-width:430px){.msg-note-editor-main{padding:16px 16px max(20px,env(safe-area-inset-bottom))}.msg-note-live-preview{min-height:135px}.msg-note-live-text{font-size:21px}}
@keyframes msgAura{0%,100%{box-shadow:0 0 0 4px rgba(151,218,255,.12),0 0 0 7px rgba(95,161,255,.08),0 0 25px rgba(126,211,255,.34)}50%{box-shadow:0 0 0 5px rgba(151,218,255,.18),0 0 0 9px rgba(95,161,255,.11),0 0 34px rgba(126,211,255,.52)}}
.msg-row-copy strong{letter-spacing:.08px}.msg-row-copy small{line-height:1.4}
@media(min-width:700px){.msg-app{padding:16px 0;background:radial-gradient(ellipse at 50% 0,#152b50,#030711 65%)}.msg-device{height:calc(100dvh - 32px);max-width:430px;border:1px solid rgba(126,181,255,.18);border-radius:27px;box-shadow:0 25px 90px #000b}}
@media(max-width:390px){.msg-inbox{padding-inline:13px}.msg-note-stage{height:190px}.msg-orbit-avatar img{width:37px;height:37px}.msg-own-note{width:65px;height:65px}.msg-tabs button{padding-inline:11px}.msg-chat-history{padding-inline:10px}.msg-call-grid{gap:18px 5px}}

/* Nexora Messages — refinement pass: readability, interaction states and motion safety */
.msg-app{min-height:100svh;min-height:100dvh;overscroll-behavior:none}
.msg-device{min-height:0}
.msg-row{min-height:68px}
.msg-row-copy strong{font-size:12px;line-height:1.25;color:#f2f7ff}
.msg-row-copy small{font-size:10.5px;line-height:1.4;color:#a8bad3}
.msg-row-meta small{font-size:9px;color:#9aacc7}
.msg-tabs button{min-height:38px;font-size:10px}
.msg-search{min-height:42px}
.msg-search input,.msg-input-wrap input{font-size:12px}
.msg-input-wrap{min-height:42px}
.msg-chat-history{scroll-behavior:smooth;overscroll-behavior:contain}
.msg-bubble{font-size:12px;line-height:1.55}
.msg-time{font-size:9px}
.msg-contact-name strong{font-size:13px}
.msg-contact-name small{font-size:10px}
.msg-call-btn{width:42px;height:42px}
.msg-compose-plus,.msg-send{height:42px}
.msg-inbox-compose button{min-height:40px}
.msg-icon-btn,.msg-call-back{width:42px;height:42px}
.msg-menu{backdrop-filter:blur(18px);border-color:rgba(166,220,255,.2)}
.msg-input-wrap:focus-within,.msg-search:focus-within{border-color:rgba(151,220,255,.58);box-shadow:0 0 0 3px rgba(119,195,255,.10),0 0 20px rgba(119,195,255,.09)}
.msg-row:focus-visible,.msg-orbit-avatar:focus-visible,.msg-tabs button:focus-visible,.msg-call-btn:focus-visible,.msg-icon-btn:focus-visible,.msg-compose-plus:focus-visible,.msg-send:focus-visible,.msg-menu button:focus-visible{outline:2px solid #a8e8ff;outline-offset:3px}
.msg-avatar img,.msg-orbit-avatar img,.msg-bubble-avatar{display:block}
.msg-avatar{filter:saturate(1.04)}
.msg-chat-profile:after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:linear-gradient(110deg,transparent 15%,rgba(190,235,255,.055) 48%,transparent 78%)}
.msg-chat-profile>*{position:relative;z-index:1}
.msg-chat-profile:after{z-index:0}
.msg-chat-composer{padding-bottom:max(12px,env(safe-area-inset-bottom))}
.msg-list,.msg-chat-history{scrollbar-width:thin;scrollbar-color:rgba(133,190,235,.22) transparent}
.msg-list::-webkit-scrollbar,.msg-chat-history::-webkit-scrollbar{width:4px}
.msg-list::-webkit-scrollbar-thumb,.msg-chat-history::-webkit-scrollbar-thumb{border-radius:8px;background:rgba(133,190,235,.2)}
@media(hover:hover){
 .msg-row:hover{background:linear-gradient(100deg,rgba(128,203,255,.075),rgba(105,143,255,.035))}
 .msg-call-btn:hover,.msg-icon-btn:hover{border-color:rgba(177,225,255,.48);box-shadow:0 0 18px rgba(137,211,255,.16)}
 .msg-tabs button:not(.selected):hover{color:#e4f4ff;background:rgba(150,205,255,.07)}
}
@media(max-width:430px){
 .msg-inbox{padding-inline:16px}
 .msg-note-stage{height:194px}
 .msg-row{gap:13px;padding-inline:5px}
 .msg-avatar{width:46px;height:46px}
 .msg-row-copy strong{font-size:12.5px}
 .msg-row-copy small{font-size:10.5px}
 .msg-chat-history{gap:16px;padding:18px 12px 14px}
 .msg-bubble{font-size:12px;padding:11px 13px 8px}
 .msg-chat-composer{gap:6px;padding-inline:9px}
 .msg-compose-plus{width:43px}
 .msg-send{width:43px}
}
@media(prefers-reduced-motion:reduce){
 .msg-device *,.msg-device *:before,.msg-device *:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}


/* Notes editor — translucent floating glass, following the supplied visual reference */
.msg-note-editor-backdrop{position:fixed;inset:0;z-index:12000;display:flex;justify-content:center;padding:0;background:rgba(0,3,10,.48);backdrop-filter:blur(19px) saturate(1.18);-webkit-backdrop-filter:blur(19px) saturate(1.18)}
.msg-note-editor{position:relative;display:flex;flex-direction:column;width:min(100%,560px);height:100dvh;overflow:hidden;background:linear-gradient(145deg,rgba(5,13,25,.20),rgba(3,8,17,.12));color:#f5fbff;border-inline:1px solid rgba(205,237,255,.08)}
.msg-note-glass-top{position:relative;z-index:4;display:flex;align-items:center;justify-content:space-between;flex:none;padding:calc(18px + env(safe-area-inset-top)) 20px 12px}
.msg-note-glass-top>button{display:grid;place-items:center;width:48px;height:48px;border:1px solid rgba(231,246,255,.13);border-radius:50%;background:rgba(225,241,255,.13);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);color:#fff;box-shadow:inset 0 1px rgba(255,255,255,.10),0 5px 22px rgba(0,0,0,.16)}
.msg-note-options{position:absolute;top:calc(76px + env(safe-area-inset-top));right:20px;display:flex;flex-direction:column;min-width:180px;padding:7px;border:1px solid rgba(210,237,255,.18);border-radius:16px;background:rgba(24,34,49,.62);backdrop-filter:blur(24px);box-shadow:0 12px 35px #0006}
.msg-note-options button{padding:12px;border:0;background:transparent;color:#f3f8ff;text-align:left;font-size:12px}
.msg-note-glass-workspace{position:relative;display:flex;flex:1;min-height:0;flex-direction:column;justify-content:space-between;padding:clamp(35px,10vh,100px) 18px max(22px,env(safe-area-inset-bottom))}
.msg-note-glass-preview{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;width:100%;min-height:150px;padding:24px 20px;border:1px solid rgba(225,244,255,.18);border-radius:27px;background-color:rgba(230,246,255,.055)!important;backdrop-filter:blur(28px) saturate(1.35);-webkit-backdrop-filter:blur(28px) saturate(1.35);box-shadow:inset 0 1px rgba(255,255,255,.14),0 15px 45px rgba(0,0,0,.14)}
.msg-note-glass-preview-text{max-width:100%;overflow-wrap:anywhere;color:#fff;font-size:clamp(22px,6vw,30px);font-weight:600;line-height:1.25;text-align:center;text-shadow:0 2px 16px #0005}
.msg-note-glass-preview-text.font-serif{font-family:Georgia,serif;font-weight:500}
.msg-note-glass-preview-text.font-bold{font-weight:850;letter-spacing:-.6px}
.msg-note-glass-preview small{color:#e7f6ff;font-size:11px}
.msg-note-glass-composer{display:flex;flex-direction:column;gap:10px;padding:15px 14px 12px;border:1px solid rgba(224,243,255,.19);border-radius:28px;background:rgba(210,232,255,.105);backdrop-filter:blur(30px) saturate(1.4);-webkit-backdrop-filter:blur(30px) saturate(1.4);box-shadow:inset 0 1px rgba(255,255,255,.13),0 12px 40px rgba(0,0,0,.20)}
.msg-note-glass-composer textarea{width:100%;min-height:84px;max-height:150px;padding:7px 9px;border:0;outline:0;resize:none;background:transparent;color:#fff;font:400 17px/1.45 inherit}
.msg-note-glass-composer textarea::placeholder{color:rgba(237,247,255,.75)}
.msg-note-glass-tools{display:flex;align-items:center;gap:7px;min-width:0}
.msg-note-glass-tools>button:not(.msg-note-glass-publish){display:grid;place-items:center;width:36px;height:36px;flex:none;border:1px solid rgba(227,244,255,.12);border-radius:50%;background:rgba(220,240,255,.10);color:#f5fbff;font-size:14px}
.msg-note-glass-tools>button.active{border-color:rgba(124,226,255,.72);background:rgba(40,176,221,.25);box-shadow:0 0 14px rgba(57,193,239,.15)}
.msg-note-glass-tools .serif{font-family:Georgia,serif}
.msg-note-glass-tools .bold{font-weight:850}
.msg-note-tool-dot{width:16px;height:16px;border:1px solid #fff8;border-radius:50%}
.msg-note-glass-counter{margin-left:auto;color:rgba(238,248,255,.68);font-size:10px;white-space:nowrap}
.msg-note-glass-publish{height:36px;padding:0 15px;border:0;border-radius:22px;background:linear-gradient(110deg,#6554e9,#168fe7,#25c9df);color:#fff;font-size:11px;font-weight:700;box-shadow:0 4px 16px rgba(27,145,222,.22)}
.msg-note-glass-publish:disabled{opacity:.42}
.msg-note-glass-palette{display:flex;gap:11px;padding:3px 8px 2px}
.msg-note-glass-palette button{width:22px;height:22px;border:1px solid rgba(255,255,255,.55);border-radius:50%;box-shadow:0 2px 8px #0005}
.msg-note-glass-palette button.active{outline:2px solid #b9edff;outline-offset:3px}
.msg-note-glass-music{display:flex;align-items:center;gap:7px;flex-wrap:wrap;color:#f1f9ff;font-size:11px}
.msg-note-glass-music button{border:0;background:transparent;color:white;font-size:17px}
.msg-note-glass-music small{flex-basis:100%;color:rgba(232,245,255,.62);font-size:9px}
@media(max-width:430px){.msg-note-glass-workspace{padding-inline:14px}.msg-note-glass-tools{gap:5px}.msg-note-glass-tools>button:not(.msg-note-glass-publish){width:33px;height:33px}.msg-note-glass-publish{padding-inline:12px}}

`;

function MessagesStyles() {
  return <style jsx global>{styles}</style>;
}
