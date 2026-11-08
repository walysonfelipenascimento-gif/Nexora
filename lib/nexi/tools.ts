/**
 * Nexi's declarative tool contract.
 *
 * This registry intentionally contains no executable external actions yet.
 * Every future adapter must validate input against its schema and enforce
 * authorization before execution; arbitrary URLs/code are never accepted.
 */
export type NexiPermission = "read" | "write" | "external";
export type NexiToolId = "web_research" | "nexora_content_draft" | "profile_insights";

export type NexiToolDefinition = {
  id: NexiToolId;
  description: string;
  permission: NexiPermission;
  requiresConfirmation: boolean;
  input: {
    type: "object";
    required: readonly string[];
    properties: Readonly<Record<string, { type: "string"; maxLength: number }>>;
  };
  maxOutputChars: number;
  timeoutMs: number;
};

const definitions: readonly NexiToolDefinition[] = [
  {
    id: "web_research",
    description: "Pesquisa pública na internet, com fontes e síntese.",
    permission: "external",
    requiresConfirmation: false,
    input: {
      type: "object",
      required: ["query"],
      properties: { query: { type: "string", maxLength: 500 } },
    },
    maxOutputChars: 12000,
    timeoutMs: 20000,
  },
  {
    id: "nexora_content_draft",
    description: "Cria rascunhos de conteúdo para a pessoa revisar.",
    permission: "read",
    requiresConfirmation: false,
    input: {
      type: "object",
      required: ["contentType", "brief"],
      properties: {
        contentType: { type: "string", maxLength: 40 },
        brief: { type: "string", maxLength: 2000 },
      },
    },
    maxOutputChars: 8000,
    timeoutMs: 15000,
  },
  {
    id: "profile_insights",
    description: "Analisa métricas ou dados de perfil que a pessoa forneceu.",
    permission: "read",
    requiresConfirmation: false,
    input: {
      type: "object",
      required: ["data"],
      properties: { data: { type: "string", maxLength: 6000 } },
    },
    maxOutputChars: 8000,
    timeoutMs: 15000,
  },
];

export const NEXI_TOOL_REGISTRY: readonly NexiToolDefinition[] = definitions;

export function getNexiTool(id: string): NexiToolDefinition | undefined {
  return NEXI_TOOL_REGISTRY.find((tool) => tool.id === id);
}

export type ToolValidation =
  | { ok: true; value: Record<string, string> }
  | { ok: false; error: string };

/** Strict allow-list validator: rejects unknown keys and non-string values. */
export function validateNexiToolInput(
  tool: NexiToolDefinition,
  input: unknown,
): ToolValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Entrada deve ser um objeto." };
  }
  const value = input as Record<string, unknown>;
  const allowed = Object.keys(tool.input.properties);
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) return { ok: false, error: `Campo não permitido: ${key}` };
  }
  for (const key of tool.input.required) {
    if (typeof value[key] !== "string" || !(value[key] as string).trim()) {
      return { ok: false, error: `Campo obrigatório ausente: ${key}` };
    }
  }
  const normalized: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value)) {
    const spec = tool.input.properties[key];
    if (!spec || typeof raw !== "string") return { ok: false, error: `Tipo inválido: ${key}` };
    const trimmed = raw.trim();
    if (trimmed.length > spec.maxLength) return { ok: false, error: `Campo excede o limite: ${key}` };
    normalized[key] = trimmed;
  }
  return { ok: true, value: normalized };
}

/** A future executor must call this before any write or third-party side effect. */
export function requiresUserConfirmation(tool: NexiToolDefinition): boolean {
  return tool.permission !== "read" || tool.requiresConfirmation;
}
