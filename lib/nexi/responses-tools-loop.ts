/**
 * Safe, bounded Responses API function-calling loop for Nexi.
 * Only registered, local tools are executable. No arbitrary URL, code,
 * database write, or external side effect is accepted.
 */
export type NexiFunctionTool = {
  type: "function";
  name: "nexora_content_draft" | "profile_insights";
  description: string;
  strict: true;
  parameters: {
    type: "object";
    properties: Record<string, { type: "string" }>;
    required: string[];
    additionalProperties: false;
  };
};

type ToolCall = {
  type: "function_call";
  name: string;
  call_id: string;
  arguments: string;
};

type ResponsesResult = {
  output?: Array<Record<string, unknown>>;
  output_text?: string;
};

const TOOL_DEFINITIONS: NexiFunctionTool[] = [
  {
    type: "function",
    name: "nexora_content_draft",
    description: "Prepare a Nexora social content draft based on the user's brief. Return a compact planning context; the model writes the actual draft.",
    strict: true,
    parameters: {
      type: "object",
      properties: { contentType: { type: "string" }, brief: { type: "string" } },
      required: ["contentType", "brief"],
      additionalProperties: false
    }
  },
  {
    type: "function",
    name: "profile_insights",
    description: "Analyze profile metrics or data explicitly supplied by the user in this conversation. Do not fetch private profile data.",
    strict: true,
    parameters: {
      type: "object",
      properties: { data: { type: "string" } },
      required: ["data"],
      additionalProperties: false
    }
  }
];

function executeLocalTool(name: string, rawArgs: string): string {
  let parsed: unknown;
  try { parsed = JSON.parse(rawArgs); }
  catch { return JSON.stringify({ ok: false, error: "JSON de argumentos inválido." }); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return JSON.stringify({ ok: false, error: "Os argumentos devem ser um objeto." });
  }
  const args = parsed as Record<string, unknown>;
  if (name === "nexora_content_draft") {
    if (Object.keys(args).some(k => k !== "contentType" && k !== "brief")
      || typeof args.contentType !== "string" || typeof args.brief !== "string"
      || !args.contentType.trim() || !args.brief.trim()
      || args.contentType.length > 40 || args.brief.length > 2000) {
      return JSON.stringify({ ok: false, error: "Parâmetros do rascunho inválidos ou fora do limite." });
    }
    return JSON.stringify({ ok: true, task: "content_draft", contentType: args.contentType.trim(),
      brief: args.brief.trim(), note: "Produza um rascunho para revisão; não publique." });
  }
  if (name === "profile_insights") {
    if (Object.keys(args).some(k => k !== "data") || typeof args.data !== "string"
      || !args.data.trim() || args.data.length > 6000) {
      return JSON.stringify({ ok: false, error: "Dados de análise inválidos ou fora do limite." });
    }
    return JSON.stringify({ ok: true, task: "profile_insights", userProvidedData: args.data.trim(),
      note: "Analise apenas os dados fornecidos; não alegue acesso ao perfil ou a métricas externas." });
  }
  return JSON.stringify({ ok: false, error: "Ferramenta não autorizada." });
}

export async function runNexiResponsesWithTools(params: {
  apiKey: string;
  model: string;
  instructions: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  webSearch: boolean;
  fetchImpl?: typeof fetch;
}): Promise<{ reply: string; citations: Array<{ title: string; url: string }>; searched: boolean }> {
  const fetchImpl = params.fetchImpl ?? fetch;
  const tools: Array<Record<string, unknown>> = [...TOOL_DEFINITIONS];
  if (params.webSearch) tools.unshift({ type: "web_search" });
  let input: Array<Record<string, unknown>> = params.messages.map(m => ({ role: m.role, content: m.content }));
  const citationMap = new Map<string, { title: string; url: string }>();

  for (let round = 0; round <= 2; round++) {
    const response = await fetchImpl("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: "Bearer " + params.apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: params.model, instructions: params.instructions, input, tools,
        tool_choice: "auto", max_output_tokens: 1100, store: false }),
      signal: AbortSignal.timeout(30000),
      cache: "no-store"
    });
    if (!response.ok) {
      const error = new Error("Nexi provider returned HTTP " + response.status);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }
    const result = await response.json() as ResponsesResult;
    const output = Array.isArray(result.output) ? result.output : [];
    for (const item of output) {
      const content = Array.isArray(item.content) ? item.content as Array<Record<string, unknown>> : [];
      for (const part of content) {
        const annotations = Array.isArray(part.annotations) ? part.annotations as Array<Record<string, unknown>> : [];
        for (const a of annotations) if (a.type === "url_citation" && typeof a.url === "string") {
          citationMap.set(a.url, { title: typeof a.title === "string" && a.title.trim() ? a.title : a.url, url: a.url });
        }
      }
    }
    const calls = output.filter((item): item is ToolCall => item.type === "function_call"
      && typeof item.name === "string" && typeof item.call_id === "string" && typeof item.arguments === "string");
    if (!calls.length) {
      const reply = typeof result.output_text === "string" ? result.output_text.trim() : "";
      if (!reply) throw new Error("Nexi model returned an empty response.");
      return { reply, citations: [...citationMap.values()], searched: params.webSearch };
    }
    if (round === 2) return { reply: "A execução atingiu o limite seguro de etapas. Peça para a Nexi continuar.",
      citations: [...citationMap.values()], searched: params.webSearch };
    input = [...input, ...output];
    for (const call of calls) input.push({ type: "function_call_output", call_id: call.call_id,
      output: executeLocalTool(call.name, call.arguments) });
  }
  throw new Error("Nexi execution loop ended unexpectedly.");
}
