import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };
const requestWindows = new Map<string, { startedAt: number; count: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const now = Date.now();
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip") || "unknown";
  const windowState = requestWindows.get(clientKey);
  if (windowState && now - windowState.startedAt < WINDOW_MS && windowState.count >= MAX_REQUESTS_PER_WINDOW) {
    return jsonError("Você enviou muitas mensagens em pouco tempo. Aguarde um minuto e tente novamente.", 429);
  }
  if (!windowState || now - windowState.startedAt >= WINDOW_MS) {
    requestWindows.set(clientKey, { startedAt: now, count: 1 });
  } else {
    windowState.count += 1;
  }
  if (requestWindows.size > 5000) {
    for (const [key, value] of requestWindows) {
      if (now - value.startedAt >= WINDOW_MS) requestWindows.delete(key);
    }
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("Não consegui ler sua mensagem. Confira o texto e tente novamente.", 400);
  }

  if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 12) {
    return jsonError("Envie uma conversa válida com até 12 mensagens recentes.", 400);
  }

  const messages: ChatMessage[] = [];
  let totalLength = 0;
  for (const item of body.messages) {
    if (!item || typeof item !== "object") return jsonError("Uma das mensagens está em formato inválido.", 400);
    const candidate = item as Record<string, unknown>;
    if ((candidate.role !== "user" && candidate.role !== "assistant") || typeof candidate.content !== "string") {
      return jsonError("Uma das mensagens está em formato inválido.", 400);
    }
    const text = candidate.content.trim();
    if (!text || text.length > 2000) return jsonError("Cada mensagem deve ter entre 1 e 2.000 caracteres.", 400);
    totalLength += text.length;
    if (totalLength > 12000) return jsonError("A conversa ficou muito longa. Continue em uma nova mensagem.", 400);
    messages.push({ role: candidate.role, content: text });
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return jsonError("Envie uma nova mensagem para a Nexi antes de pedir uma resposta.", 400);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonError("A interface da Nexi está pronta, mas falta configurar OPENAI_API_KEY nas variáveis privadas da Render para ativar as respostas reais. Sua mensagem não foi enviada ao provedor.", 503);
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é a Nexi, assistente de inteligência artificial da plataforma Nexora. Responda em português brasileiro por padrão, com clareza, gentileza e foco prático. Ajude com criação, aprendizagem, planejamento e ideias. Não afirme ter acessado contas, navegado na internet, alterado a plataforma ou executado ações que não realizou. Se não souber algo, diga isso com honestidade. Preserve a privacidade e não peça senhas, chaves secretas ou dados pessoais desnecessários. Para pedidos que envolvam risco, priorize segurança.",
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 900,
      }),
      signal: AbortSignal.timeout(30000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      if (upstream.status === 429) return jsonError("A Nexi está recebendo muitas solicitações agora. Aguarde um pouco e tente novamente.", 429);
      if (upstream.status === 401 || upstream.status === 403) {
        return jsonError("A configuração segura do provedor de IA precisa ser revisada. A chave nunca é exibida na página.", 503);
      }
      return jsonError("O serviço de IA está indisponível no momento. Tente novamente em instantes.", 502);
    }

    const result = await upstream.json();
    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return jsonError("O modelo não retornou uma resposta válida. Tente novamente.", 502);
    }
    return NextResponse.json({ reply: reply.trim() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return jsonError("A conexão com o modelo demorou demais ou falhou. Tente novamente.", 504);
  }
}
