import test from "node:test";
import assert from "node:assert/strict";
import { NEXI_TOOL_REGISTRY, getNexiTool, validateNexiToolInput, requiresUserConfirmation } from "../lib/nexi/tools.ts";

test("registry IDs are unique and bounded", () => {
  const ids = NEXI_TOOL_REGISTRY.map((tool) => tool.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const tool of NEXI_TOOL_REGISTRY) {
    assert.ok(tool.timeoutMs > 0 && tool.timeoutMs <= 30_000);
    assert.ok(tool.maxOutputChars > 0 && tool.maxOutputChars <= 12_000);
    assert.ok(tool.input.required.every((key) => key in tool.input.properties));
  }
});

test("strict validator accepts valid input and trims values", () => {
  const tool = getNexiTool("web_research");
  assert.ok(tool);
  assert.deepEqual(validateNexiToolInput(tool, { query: "  Nexora  " }), { ok: true, value: { query: "Nexora" } });
});

test("validator rejects missing, extra, oversized, wrongly typed, and non-object fields", () => {
  const tool = getNexiTool("web_research");
  assert.ok(tool);
  assert.equal(validateNexiToolInput(tool, {}).ok, false);
  assert.equal(validateNexiToolInput(tool, { query: "ok", url: "https://unsafe.test" }).ok, false);
  assert.equal(validateNexiToolInput(tool, { query: "x".repeat(501) }).ok, false);
  assert.equal(validateNexiToolInput(tool, { query: 123 }).ok, false);
  assert.equal(validateNexiToolInput(tool, null).ok, false);
});

test("external/write tool categories are confirmation-gated", () => {
  const web = getNexiTool("web_research");
  const draft = getNexiTool("nexora_content_draft");
  assert.ok(web && draft);
  assert.equal(requiresUserConfirmation(web), true);
  assert.equal(requiresUserConfirmation(draft), false);
});
