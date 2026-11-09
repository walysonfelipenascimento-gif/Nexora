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
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
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
      setNote(localStorage.getItem("nexora-reference-note-v1") || "");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("nexora-reference-messages-v1", JSON.stringify(chats));
      localStorage.setItem("nexora-reference-note-v1", note);
    } catch {}
  }, [chats, note]);

  const filtered = useMemo(() => chats.filter((chat) => {
    const matches = (chat.name + " " + chat.preview + " " + chat.handle).toLowerCase().includes(search.toLowerCase());
    return matches && (tab !== "unread" || chat.unread > 0);
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
        <header className="msg-topbar">
          <button className="msg-icon-btn" onClick={() => view === "chat" ? setView("inbox") : view === "call" ? setView("chat") : window.history.back()} aria-label="Voltar"><Icon name="back" /></button>
          <div className="msg-top-title">{view === "inbox" ? "Message" : view === "chat" ? active.name : callMode === "video" ? "Video call" : "Voice call"}</div>
          <button className="msg-icon-btn" onClick={() => setMenuOpen((value) => !value)} aria-label="Mais opções"><Icon name="more" /></button>
          {menuOpen && <div className="msg-menu"><button onClick={() => { setSearch(""); setMenuOpen(false); }}>Clear search</button><button onClick={() => { setTab("inbox"); setMenuOpen(false); }}>All messages</button><button onClick={() => { setNoteOpen(true); setMenuOpen(false); }}>Edit my note</button></div>}
        </header>

        {view === "inbox" && (
          <section className="msg-inbox">
            <div className="msg-note-stage">
              <button className="msg-add-note" onClick={() => { setNoteDraft(note); setNoteOpen(true); }}>Add note</button>
              <div className="msg-note-orbit">
                <button className="msg-orbit-avatar orbit-one" onClick={() => openChat("jenny")}><img src={people[5].avatar} alt="Sophia"/><span>Sophia</span></button>
                <button className="msg-orbit-avatar orbit-two" onClick={() => openChat("guy")}><img src={people[6].avatar} alt="Noah"/><span>Noah</span></button>
                <button className="msg-orbit-avatar orbit-three" onClick={() => openChat("kristin")}><img src={people[2].avatar} alt="Kristin"/><span>Kristin</span></button>
                <button className="msg-orbit-avatar orbit-four" onClick={() => openChat("arlene")}><img src={people[7].avatar} alt="Olivia"/><span>Olivia</span></button>
                <button className="msg-own-note" onClick={() => { setNoteDraft(note); setNoteOpen(true); }}><img src={people[4].avatar} alt="Seu perfil"/><span className="msg-own-plus"><Icon name="plus" size={13}/></span></button>
              </div>
              {note && <div className="msg-note-preview">{note}</div>}
            </div>
            <div className="msg-tabs">
              <button className={tab === "inbox" ? "selected" : ""} onClick={() => setTab("inbox")}>Inbox <b>{chats.length + 21}</b></button>
              <button className={tab === "unread" ? "selected" : ""} onClick={() => setTab("unread")}>Unread</button>
              <button className={tab === "requests" ? "selected" : ""} onClick={() => setTab("requests")}>Requests</button>
            </div>
            <div className="msg-search"><Icon name="search" size={17}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages"/></div>
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
              <div className="msg-date-pill">Today</div>
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
              <button className="msg-compose-plus" onClick={() => fileRef.current?.click()} aria-label="Anexar"><Icon name="plus"/></button>
              <div className="msg-input-wrap"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Type Message..."/><button onClick={() => setRecording((value) => !value)} aria-label="Microfone"><Icon name="mic" size={18}/></button></div>
              <button className="msg-send" onClick={() => recording ? sendMessage("Voice message", "audio") : sendMessage()} aria-label="Enviar"><Icon name="send" size={18}/></button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => { attachImage(event.target.files?.[0]); event.currentTarget.value = ""; }}/>
            </div>
            {recording && <div className="msg-recording">Recording preview · tap send to add a voice message</div>}
          </section>
        )}

        {view === "call" && (
          <section className="msg-call-screen">
            <div className="msg-call-time"><span/> 12:47</div>
            <div className="msg-call-grid">
              {people.concat(people.slice(0, 4)).map((person, index) => <button className="msg-call-person" key={index}><img src={person.avatar} alt=""/><span>{["Oliver","Evelyn","Amelia","Sophie","Emma","NoahB","Isabella","Elijah","Lucas","Ava","Harry","Olivia"][index]}</span><i className={index % 3 === 0 ? "speaking" : ""}/></button>)}
            </div>
            <div className="msg-reactions">{["😮","😍","🙌","👏","💛"].map((emoji) => <button key={emoji} onClick={() => setCallNotice(true)}>{emoji}</button>)}<button onClick={() => setCallNotice(true)}>•••</button></div>
            <div className="msg-call-controls">
              <button onClick={() => setCallNotice(true)}><Icon name="speaker" size={21}/></button>
              <button onClick={() => setCallNotice(true)}><Icon name="mic" size={21}/></button>
              <button className="msg-hangup" onClick={() => { setView("chat"); setCallNotice(false); }}><span>⌕</span></button>
            </div>
            {callNotice && <div className="msg-call-notice">Call interface preview · live audio/video will be connected later</div>}
          </section>
        )}
      </div>

      {noteOpen && <div className="msg-modal-backdrop"><section className="msg-modal"><button className="msg-modal-close" onClick={() => setNoteOpen(false)}><Icon name="close"/></button><h2>Your note</h2><textarea maxLength={70} value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Share a thought..."/><small>{noteDraft.length}/70</small><button className="msg-modal-save" onClick={() => { setNote(noteDraft); setNoteOpen(false); }}>Save note</button></section></div>}
      {newOpen && <div className="msg-modal-backdrop"><section className="msg-modal msg-new-modal"><button className="msg-modal-close" onClick={() => setNewOpen(false)}><Icon name="close"/></button><h2>New message</h2>{people.slice(0, 5).map((person, index) => <button className="msg-new-person" key={person.name} onClick={() => { const target = ["jenny","guy","kristin","arlene","daniel"][index]; setNewOpen(false); openChat(target); }}><img src={person.avatar} alt=""/><span>{person.name}</span><Icon name="back"/></button>)}</section></div>}
    </main>
    <MessagesStyles />
    </>
  );
}

const styles = `
*{box-sizing:border-box}
.msg-app{height:100dvh;min-height:590px;width:100%;overflow:hidden;background:#030711;color:#f4f7ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.msg-device{position:relative;display:flex;flex-direction:column;width:100%;max-width:560px;height:100%;margin:0 auto;overflow:hidden;background:radial-gradient(ellipse at 50% -12%,rgba(0,190,236,.26),transparent 38%),#020914;border-inline:1px solid rgba(115,180,255,.08)}
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
.msg-orbit-avatar img{width:42px;height:42px;object-fit:cover;border:2px solid rgba(104,214,255,.62);border-radius:50%;box-shadow:0 0 13px rgba(47,157,255,.19)}
.msg-orbit-avatar span{font-size:8px}
.orbit-one{left:8%;top:21px}.orbit-two{left:23%;top:63px}.orbit-three{right:23%;top:63px}.orbit-four{right:8%;top:21px}
.msg-own-note{position:absolute;left:50%;top:66px;transform:translateX(-50%);width:72px;height:72px;padding:3px;border:2px solid #6adfff;border-radius:50%;background:linear-gradient(145deg,#6d42ff,#18c9ed);box-shadow:0 0 0 5px rgba(72,117,255,.12),0 0 26px rgba(54,167,255,.28)}
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
.msg-row{display:flex;align-items:center;gap:11px;width:100%;padding:11px 1px;border:0;border-bottom:1px solid rgba(148,177,220,.075);background:transparent;color:white;text-align:left}
.msg-avatar{position:relative;display:block;width:43px;height:43px;flex:none;padding:2px;border-radius:50%;background:linear-gradient(135deg,#11d4ec,#416dff,#bb4bdf)}
.msg-avatar img{width:100%;height:100%;object-fit:cover;border:2px solid #06101d;border-radius:50%}
.msg-avatar i{position:absolute;right:-1px;bottom:0;width:11px;height:11px;border:2px solid #07101d;border-radius:50%;background:#39e69a}
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
.msg-chat{display:flex;flex:1;min-height:0;flex-direction:column;overflow:hidden;background:radial-gradient(ellipse at 50% -8%,rgba(0,184,232,.18),transparent 35%),#020914}
.msg-chat-profile{position:relative;display:flex;align-items:center;gap:10px;flex:none;height:84px;padding:8px 17px 16px;border-bottom:1px solid rgba(140,197,255,.12);background:linear-gradient(180deg,rgba(0,175,224,.16),rgba(5,15,30,.02));border-radius:0 0 48% 10% / 0 0 16% 8%}
.msg-chat-avatar{width:40px;height:40px}
.msg-contact-name{display:flex;flex:1;flex-direction:column;gap:4px}
.msg-contact-name strong{font-size:11px}
.msg-contact-name small{color:#35e5a1;font-size:8px}
.msg-call-btn{display:grid;place-items:center;width:37px;height:37px;border:1px solid rgba(159,211,255,.17);border-radius:50%;background:rgba(123,190,255,.08);color:#bdeaff}
.msg-chat-history{display:flex;flex:1;min-height:0;flex-direction:column;gap:19px;overflow:auto;padding:22px 15px 17px}
.msg-date-pill{align-self:center;padding:5px 11px;border:1px solid rgba(140,178,225,.1);border-radius:20px;background:#111d2d;color:#8197b6;font-size:8px}
.msg-bubble-row{display:flex;align-items:flex-end;gap:8px;max-width:91%}
.msg-bubble-row.mine{align-self:flex-end;flex-direction:row-reverse}
.msg-bubble-avatar{width:33px;height:33px;flex:none;object-fit:cover;border:2px solid rgba(91,200,255,.7);border-radius:50%}
.msg-bubble{max-width:calc(100% - 40px);padding:10px 12px 7px;border:1px solid rgba(136,170,219,.1);border-radius:17px 17px 17px 5px;background:#182335;color:#e8effb;font-size:10px;line-height:1.5;overflow-wrap:anywhere}
.msg-bubble-row.mine .msg-bubble{border-color:rgba(62,154,255,.24);border-radius:17px 17px 5px 17px;background:linear-gradient(125deg,#17365a,#25234c);color:#f2f6ff}
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
.msg-chat-composer{display:flex;align-items:center;gap:7px;flex:none;padding:9px 10px max(10px,env(safe-area-inset-bottom));border-top:1px solid rgba(135,180,232,.1);background:rgba(6,15,29,.95)}
.msg-compose-plus,.msg-send{display:grid;place-items:center;width:36px;height:36px;flex:none;border:1px solid rgba(133,168,221,.14);border-radius:50%;background:#18263a;color:#8dcfff}
.msg-input-wrap{display:flex;align-items:center;flex:1;min-width:0;height:39px;padding:0 8px 0 13px;border:1px solid rgba(142,177,225,.12);border-radius:24px;background:#131f32}
.msg-input-wrap input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:white;font-size:10px}
.msg-input-wrap input::placeholder{color:#8192ad}
.msg-input-wrap button{display:grid;place-items:center;width:27px;height:30px;flex:none;border:0;background:transparent;color:#9eb2d0}
.msg-send{border:0;background:linear-gradient(130deg,#5148e8,#178ee7,#1cc9df);color:white}
.msg-recording{padding:0 16px 8px;background:#060f1d;color:#64dfff;font-size:8px}
.msg-call-screen{position:relative;display:flex;flex:1;min-height:0;flex-direction:column;padding:18px 16px 16px;background:radial-gradient(ellipse at 50% -12%,rgba(0,204,238,.3),transparent 35%),#020812}
.msg-call-time{align-self:center;display:flex;align-items:center;gap:6px;margin:5px 0 23px;padding:7px 14px;border:1px solid rgba(109,164,255,.22);border-radius:22px;background:linear-gradient(100deg,#533ee8,#1c9ee7);font-size:9px;color:white}
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
.msg-hangup span{font-size:21px;transform:rotate(135deg)}
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
@media(min-width:700px){.msg-app{padding:16px 0;background:radial-gradient(ellipse at 50% 0,#152b50,#030711 65%)}.msg-device{height:calc(100dvh - 32px);max-width:430px;border:1px solid rgba(126,181,255,.18);border-radius:27px;box-shadow:0 25px 90px #000b}}
@media(max-width:390px){.msg-inbox{padding-inline:13px}.msg-note-stage{height:190px}.msg-orbit-avatar img{width:37px;height:37px}.msg-own-note{width:65px;height:65px}.msg-tabs button{padding-inline:11px}.msg-chat-history{padding-inline:10px}.msg-call-grid{gap:18px 5px}}
`;

export function MessagesStyles() {
  return <style jsx global>{styles}</style>;
}
