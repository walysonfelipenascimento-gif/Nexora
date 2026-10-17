"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

type Mode = "login" | "signup";

export default function EntrarPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED")) {
        router.replace("/");
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function ensureProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("A conexão com o Supabase ainda não está configurada.");

    const { data: existing, error: lookupError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (existing) return;

    const metadataUsername = typeof user.user_metadata?.username === "string"
      ? user.user_metadata.username
      : "";
    const emailPrefix = (user.email?.split("@")[0] || "pessoa_nexora")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_");
    const safeUsername = (metadataUsername || emailPrefix).slice(0, 30).padEnd(3, "_");
    const metadataName = typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : (user.email?.split("@")[0] || "Pessoa Nexora");

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      username: safeUsername,
      display_name: metadataName.slice(0, 80),
    });
    if (insertError) throw insertError;
  }

  async function handleResendConfirmation() {
    setError("");
    setMessage("");
    if (!email.trim()) {
      setError("Digite seu e-mail para enviarmos a confirmação.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("A conexão da Nexora ainda não está disponível. Tente novamente em instantes.");
      return;
    }
    setBusy(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: window.location.origin + "/entrar" },
      });
      if (resendError) throw resendError;
      setMessage("Se houver uma confirmação pendente para esse e-mail, enviaremos uma nova mensagem. Confira também o spam.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível reenviar agora. Aguarde um pouco e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordReset() {
    setError("");
    setMessage("");
    if (!email.trim()) {
      setError("Digite seu e-mail acima para receber o link de redefinição de senha.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("A conexão da Nexora ainda não está disponível. Tente novamente em instantes.");
      return;
    }
    setBusy(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + "/entrar",
      });
      if (resetError) throw resetError;
      setMessage("Se esse e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível enviar as instruções. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("A conexão da Nexora ainda não está disponível. Tente novamente em instantes.");
      setBusy(false);
      return;
    }

    try {
      if (mode === "signup") {
        const normalizedUsername = username.trim().toLowerCase();
        if (!/^[a-z0-9_.]{3,30}$/.test(normalizedUsername) || normalizedUsername.startsWith(".") || normalizedUsername.endsWith(".") || normalizedUsername.includes("..")) {
          throw new Error("Escolha um nome de usuário de 3 a 30 caracteres, usando letras, números, ponto ou _.");
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: normalizedUsername,
              display_name: displayName.trim() || normalizedUsername,
            },
            emailRedirectTo: window.location.origin + "/entrar",
          },
        });

        if (signUpError) throw signUpError;

        if (data.session && data.user) {
          await ensureProfile(data.user);
          setMessage("Conta criada! Bem-vindo à Nexora.");
          router.push("/");
        } else {
          setMessage("Cadastro iniciado! Abra o e-mail de confirmação enviado pela Nexora e toque em Confirmar conta. Depois, você voltará para a Nexora. Confira também Spam/Promoções. Se não chegar, use “Reenviar confirmação” abaixo.");
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;
        if (data.user) await ensureProfile(data.user);
        setMessage("Login realizado! Bem-vindo de volta.");
        router.push("/");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível concluir. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-hero" aria-label="Conheça a Nexora">
          <div className="auth-hero-brand">
            <img src="/nexora-logo.svg" alt="" />
            <span>Nexora</span>
          </div>
          <div className="auth-hero-copy">
            <span className="auth-hero-kicker"><span className="auth-hero-dot" /> SUA PRÓXIMA CONEXÃO COMEÇA AQUI</span>
            <h2>O seu mundo.<br /><span>Novas possibilidades.</span></h2>
            <p>Uma nova forma de compartilhar momentos, descobrir criadores, conectar marcas e encontrar oportunidades.</p>
            <div className="auth-hero-pills"><span>✦ Comunidade</span><span>◎ Criadores</span><span>↗ Oportunidades</span></div>
          </div>
          <div className="auth-hero-footer"><span>FEITA PARA CONECTAR</span><span>© NEXORA</span></div>
        </aside>
      <section className="auth-card" aria-labelledby="auth-title">
        <Link href="/" className="auth-brand" aria-label="Voltar para a Nexora">
          <img src="/nexora-logo.svg" alt="" />
          <span>Nexora</span>
        </Link>

        <p className="eyebrow">SUA PRÓXIMA CONEXÃO COMEÇA AQUI</p>
        <h1 id="auth-title">{mode === "login" ? "Que bom ter você de volta." : "Crie seu espaço."}</h1>
        <p className="auth-description">
          {mode === "login"
            ? "Entre para continuar conectado à comunidade Nexora."
            : "Crie sua conta e comece a construir suas conexões."}
        </p>

        <div className="auth-switch" role="tablist" aria-label="Tipo de acesso">
          <button type="button" className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setMessage(""); setError(""); }}>
            Entrar
          </button>
          <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => { setMode("signup"); setMessage(""); setError(""); }}>
            Criar conta
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label htmlFor="displayName">Como podemos chamar você?</label>
              <input id="displayName" autoComplete="name" maxLength={80} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Seu nome" />

              <label htmlFor="username">Nome de usuário</label>
              <input id="username" autoComplete="username" minLength={3} maxLength={30} required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="ex.: walyson_bb" />
              <span className="auth-hint">Use de 3 a 30 caracteres: letras, números, ponto ou _. Sem espaços.</span>
            </>
          )}

          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" />

          <label htmlFor="password">Senha</label>
          <div className="auth-password-wrap">
            <input id="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Pelo menos 8 caracteres" />
            <button className="auth-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? "Ocultar" : "Mostrar"}</button>
          </div>
          {mode === "login" && <button className="auth-forgot" type="button" onClick={handlePasswordReset} disabled={busy}>Esqueci minha senha</button>}
          {mode === "signup" && message.includes("Cadastro iniciado!") && <button className="auth-forgot" type="button" onClick={handleResendConfirmation} disabled={busy}>Reenviar confirmação</button>}

          {error && <p className="auth-feedback error" role="alert">{error}</p>}
          {message && <p className="auth-feedback success" role="status">{message}</p>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? "Aguarde..." : mode === "login" ? "Entrar na Nexora" : "Criar minha conta"}
          </button>
        </form>

        <p className="auth-footnote">Ao continuar, você concorda em usar a plataforma com respeito e responsabilidade.</p>
        <Link href="/" className="auth-back">← Voltar para a página inicial</Link>
      </section>
      </div>
    </main>
  );
}
