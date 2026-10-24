import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const provider = (process.env.NEXI_ENGINE_PROVIDER || "openai").toLowerCase();

  if (provider !== "ollama") {
    return NextResponse.json({
      provider: "external",
      ready: Boolean(process.env.OPENAI_API_KEY),
      message: process.env.OPENAI_API_KEY
        ? "Motor externo configurado"
        : "Motor externo sem chave configurada",
    }, { headers: { "Cache-Control": "no-store" } });
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
