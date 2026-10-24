import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CategoryName =
  | "harassment"
  | "harassment_threatening"
  | "hate"
  | "hate_threatening"
  | "illicit"
  | "illicit_violent"
  | "self_harm"
  | "self_harm_instructions"
  | "self_harm_intent"
  | "sexual"
  | "sexual_minors"
  | "violence"
  | "violence_graphic";

type ModerationResult = {
  flagged: boolean;
  categories: Partial<Record<CategoryName, boolean>>;
  category_scores: Partial<Record<CategoryName, number>>;
};

const CATEGORY_LABELS: Record<CategoryName, string> = {
  harassment: "assédio",
  harassment_threatening: "ameaça ou assédio ameaçador",
  hate: "discurso de ódio",
  hate_threatening: "discurso de ódio com ameaça",
  illicit: "atividade ilícita",
  illicit_violent: "atividade ilícita violenta",
  self_harm: "conteúdo relacionado a autolesão",
  self_harm_instructions: "instruções de autolesão",
  self_harm_intent: "intenção de autolesão",
  sexual: "conteúdo sexual",
  sexual_minors: "conteúdo sexual envolvendo menores",
  violence: "violência",
  violence_graphic: "violência gráfica",
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * First-stage moderation helper for Nexora reports.
 * This endpoint does not make enforcement decisions or store reports.
 * A future review queue must combine this signal with human review and appeals.
 */
export async function POST(request: NextRequest) {
  let body: { content?: unknown; context?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("O pedido de análise está inválido.", 400);
  }

  if (typeof body.content !== "string" || !body.content.trim()) {
    return jsonError("Informe o conteúdo que precisa ser analisado.", 400);
  }
  if (body.content.length > 12000) {
    return jsonError("O conteúdo excede o limite de 12.000 caracteres.", 413);
  }
  const context = typeof body.context === "string" ? body.context.slice(0, 300) : "denúncia de conteúdo na Nexora";
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonError("A análise automática ainda não está configurada. Nenhuma decisão foi tomada.", 503);
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "omni-moderation-latest",
        input: [{ type: "text", text: "Contexto: " + context + "\nConteúdo denunciado:\n" + body.content }],
      }),
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      if (upstream.status === 401 || upstream.status === 403) {
        return jsonError("A credencial do serviço de análise precisa ser revisada. Nenhuma decisão foi tomada.", 503);
      }
      if (upstream.status === 429) {
        return jsonError("A análise automática está temporariamente indisponível por limite do provedor. A denúncia deve permanecer pendente para revisão, sem punição automática.", 503);
      }
      return jsonError("Não foi possível concluir a análise automática. A denúncia deve permanecer pendente para revisão.", 502);
    }

    const payload = await upstream.json();
    const result = payload?.results?.[0] as ModerationResult | undefined;
    if (!result || typeof result.flagged !== "boolean") {
      return jsonError("O serviço retornou um resultado de análise inválido. Nenhuma decisão foi tomada.", 502);
    }

    const flaggedCategories = (Object.entries(result.categories ?? {}) as [CategoryName, boolean][])
      .filter(([category, flagged]) => flagged && CATEGORY_LABELS[category])
      .map(([category]) => CATEGORY_LABELS[category]);

    const scores = Object.entries(result.category_scores ?? {})
      .filter((entry): entry is [string, number] => typeof entry[1] === "number")
      .map(([category, score]) => ({ category, score: Math.round(score * 1000) / 1000 }));

    return NextResponse.json({
      analyzed: true,
      flagged: result.flagged,
      categories: flaggedCategories,
      scores,
      recommendation: result.flagged
        ? "REVIEW_REQUIRED"
        : "NO_FLAG_DETECTED",
      enforcement: "NONE",
      note: "Este é apenas um sinal automatizado. Não determina culpa nem aplica punições; decisões de moderação exigem contexto e revisão humana.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return jsonError("A análise automática falhou por conexão ou tempo limite. Nenhuma decisão foi tomada.", 504);
  }
}
