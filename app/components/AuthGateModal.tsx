"use client";

import { useState } from "react";
import { signInNexora, signUpNexora } from "../../lib/reelsRepository";

type Props = { open: boolean; onClose: () => void; onSuccess: () => void };

export default function AuthGateModal({ open, onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "signin") {
        await signInNexora(email, password);
        onSuccess();
        onClose();
      } else {
        if (username.trim().length < 3) throw new Error("O @ precisa ter pelo menos 3 caracteres.");
        const result = await signUpNexora(email, password, username, displayName || username);
        if (result.needsEmailConfirmation) {
          setNotice("Conta criada. Confirme o e-mail enviado e depois entre na Nexora.");
        } else {
          onSuccess();
          onClose();
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível concluir. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div role="presentation" onClick={onClose} style={{position:"fixed",inset:0,zIndex:9999,display:"grid",placeItems:"center",padding:18,background:"#03040bd9",backdropFilter:"blur(16px)"}}>
      <section role="dialog" aria-modal="true" aria-labelledby="nexora-auth-title" onClick={(event)=>event.stopPropagation()} style={{width:"min(100%,420px)",border:"1px solid #ffffff1f",borderRadius:24,padding:22,color:"#f8f8ff",background:"linear-gradient(145deg,#151628,#090a12)",boxShadow:"0 25px 90px #000a"}}>
        <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:18}}>
          <div><div style={{fontSize:11,fontWeight:900,letterSpacing:2,color:"#62e8ff"}}>NEXORA</div><h2 id="nexora-auth-title" style={{fontSize:23,margin:"6px 0 0",letterSpacing:-.6}}>{mode==="signin"?"Entre na sua conta":"Crie sua conta"}</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar" style={{width:36,height:36,borderRadius:12,border:"1px solid #ffffff22",background:"#ffffff0b",color:"white",fontSize:20}}>×</button>
        </header>
        <p style={{fontSize:13,lineHeight:1.5,color:"#b8bad2",margin:"0 0 18px"}}>Para publicar, curtir, comentar e guardar Reels entre dispositivos, entre na sua conta da Nexora.</p>
        <form onSubmit={submit} style={{display:"grid",gap:11}}>
          {mode==="signup"&&<><input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Nome de exibição" maxLength={80} required style={fieldStyle}/><input value={username} onChange={e=>setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g,"").slice(0,30))} placeholder="Nome de usuário (@)" minLength={3} maxLength={30} required style={fieldStyle}/></>}
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu e-mail" autoComplete="email" required style={fieldStyle}/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha (mínimo 8 caracteres)" autoComplete={mode==="signin"?"current-password":"new-password"} minLength={8} required style={fieldStyle}/>
          {error&&<p role="alert" style={{margin:0,color:"#ff9db5",fontSize:12,lineHeight:1.45}}>{error}</p>}
          {notice&&<p role="status" style={{margin:0,color:"#7deac7",fontSize:12,lineHeight:1.45}}>{notice}</p>}
          <button type="submit" disabled={busy} style={{marginTop:3,padding:"13px 15px",border:0,borderRadius:14,color:"#080914",fontWeight:900,background:"linear-gradient(100deg,#5be9ff,#a17aff)",opacity:busy ? 0.7 : 1}}>{busy?"Aguarde…":mode==="signin"?"Entrar":"Criar conta"}</button>
        </form>
        <button type="button" onClick={()=>{setMode(mode==="signin"?"signup":"signin");setError("");setNotice("");}} style={{marginTop:15,width:"100%",padding:9,border:0,background:"transparent",color:"#bcb9ff",fontSize:12,fontWeight:750}}>{mode==="signin"?"Ainda não tem conta? Criar conta":"Já tem conta? Entrar"}</button>
      </section>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {width:"100%",boxSizing:"border-box",padding:"13px 14px",border:"1px solid #ffffff20",borderRadius:13,background:"#080912",color:"#fff",fontSize:14,outline:"none"};
