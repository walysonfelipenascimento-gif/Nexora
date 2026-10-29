import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const provider = (process.env.NEXI_ENGINE_PROVIDER || "openai").toLowerCase();

  if (provider !== "ollama") {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({
        provider: "external",
        ready: false,
        message: "Motor externo sem chave configurada",
      }, { headers: { "Cache-Control": "no-store" } });
    }

    // Check provider authentication without sending a user prompt or generating tokens.
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: { Authorization: "Bearer " + apiKey },
        signal: AbortSignal.timeout(5000),
        cache: "no-store",
      });
      if (response.ok) {
        return NextResponse.json({
          provider: "external",
          ready: true,
          message: "Autenticação do provedor aceita; geração de respostas ainda precisa ser testada",
        }, { headers: { "Cache-Control": "no-store" } });
      }
      return NextResponse.json({
        provider: "external",
        ready: false,
        message: response.status === 401 || response.status === 403
          ? "O provedor recusou a autenticação do motor"
          : response.status === 429
            ? "O provedor está limitando solicitações no momento"
            : "O provedor de IA está temporariamente indisponível",
      }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return NextResponse.json({
        provider: "external",
        ready: false,
        message: "Não foi possível alcançar o provedor de IA",
      }, { headers: { "Cache-Control": "no-store" } });
    }
  }

  const baseUrl = process.env.NEXI_ENGINE_URL?.trim().replace(/\/$/, "");
  const model = process.env.NEXI_ENGINE_MODEL?.trim() || "qwen2.5:1.5b";
  if (!baseUrl) {
    return NextResponse.json({
      provider: "self-hosted",
      ready: false,
      model,
      message: "Servidor do motor próprio ainda não configurado",
    }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("engine unavailable");
    const data = await response.json();
    const models = Array.isArray(data?.models) ? data.models : [];
    const modelReady = models.some((entry: { name?: string; model?: string }) =>
      entry.name === model || entry.model === model
    );
    return NextResponse.json({
      provider: "self-hosted",
      ready: modelReady,
      model,
      message: modelReady ? "Motor próprio acessível e modelo encontrado" : "Servidor acessível, mas o modelo configurado não foi encontrado",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({
      provider: "self-hosted",
      ready: false,
      model,
      message: "Servidor do motor próprio inacessível",
    }, { headers: { "Cache-Control": "no-store" } });
  }
}
