"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function EntrarPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        const normalizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
        if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
          throw new Error("Escolha um nome de usuário de 3 a 30 caracteres, usando letras, números ou _.");
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: normalizedUsername,
              display_name: displayName.trim() || normalizedUsername,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.session && data.user) {
          await ensureProfile(data.user);
          setMessage("Conta criada! Você já está conectado. Pode voltar para a Nexora.");
        } else {
          setMessage("Quase lá! Confira seu e-mail para confirmar a conta. Depois, volte aqui e entre na Nexora.");
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;
        if (data.user) await ensureProfile(data.user);
        setMessage("Login realizado! Sua sessão está ativa neste dispositivo.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível concluir. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link href="/" className="auth-brand" aria-label="Voltar para a Nexora">
          <img src="/nexora-logo.svg" alt="" />
          <span>Nexora</span>
        </Link>

        <p className="eyebrow">SUA PRÓXIMA CONEXÃO COMEÇA AQUI</p>
        <h1>{mode === "login" ? "Que bom ter você de volta." : "Crie seu espaço."}</h1>
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
              <span className="auth-hint">Use de 3 a 30 caracteres. Letras, números e _.</span>
            </>
          )}

          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" />

          <label htmlFor="password">Senha</label>
          <input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Pelo menos 8 caracteres" />

          {error && <p className="auth-feedback error" role="alert">{error}</p>}
          {message && <p className="auth-feedback success" role="status">{message}</p>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? "Aguarde..." : mode === "login" ? "Entrar na Nexora" : "Criar minha conta"}
          </button>
        </form>

        <p className="auth-footnote">Ao continuar, você concorda em usar a plataforma com respeito e responsabilidade.</p>
        <Link href="/" className="auth-back">← Voltar para o feed</Link>
      </section>
    </main>
  );
}
