"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// O cadastro e o login ficam temporariamente fora do caminho principal.
// A rota permanece disponível e volta à página inicial até a etapa de autenticação.
export default function EntrarPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return (
    <main className="auth-page">
      <section className="auth-card" aria-live="polite">
        <h1>Bem-vindo à Nexora</h1>
        <p>O cadastro e o login serão finalizados em uma etapa posterior.</p>
        <a className="auth-back" href="/">Continuar para a Nexora</a>
      </section>
    </main>
  );
}
