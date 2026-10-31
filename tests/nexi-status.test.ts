import test from "node:test";
import assert from "node:assert/strict";
import { GET } from "../app/api/nexi/status/route.ts";

const originalFetch = globalThis.fetch;
const originalApiKey = process.env.OPENAI_API_KEY;
const originalProvider = process.env.NEXI_ENGINE_PROVIDER;
const originalUrl = process.env.NEXI_ENGINE_URL;
const originalModel = process.env.NEXI_ENGINE_MODEL;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of [
    ["OPENAI_API_KEY", originalApiKey],
    ["NEXI_ENGINE_PROVIDER", originalProvider],
    ["NEXI_ENGINE_URL", originalUrl],
    ["NEXI_ENGINE_MODEL", originalModel],
  ]) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("status OpenAI sem chave indica não pronto", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "openai";
  delete process.env.OPENAI_API_KEY;
  const response = await GET();
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.provider, "external");
  assert.equal(data.ready, false);
});

test("status OpenAI testa somente autenticação, sem geração", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "openai";
  process.env.OPENAI_API_KEY = "fake-test-key";
  let calledUrl;
  globalThis.fetch = async (url) => {
    calledUrl = url;
    return Response.json({ data: [] });
  };
  const data = await (await GET()).json();
  assert.equal(data.ready, true);
  assert.equal(calledUrl, "https://api.openai.com/v1/models");
  assert.match(data.message, /ainda precisa ser testada/);
});

test("status Ollama detecta modelo disponível", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "ollama";
  process.env.NEXI_ENGINE_URL = "https://local-engine.example/";
  process.env.NEXI_ENGINE_MODEL = "qwen-lab";
  globalThis.fetch = async (url) => {
    assert.equal(url, "https://local-engine.example/api/tags");
    return Response.json({ models: [{ name: "qwen-lab" }] });
  };
  const data = await (await GET()).json();
  assert.equal(data.provider, "self-hosted");
  assert.equal(data.ready, true);
  assert.equal(data.model, "qwen-lab");
});

test("status Ollama diferencia servidor acessível sem modelo", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "ollama";
  process.env.NEXI_ENGINE_URL = "https://local-engine.example";
  process.env.NEXI_ENGINE_MODEL = "missing-model";
  globalThis.fetch = async () => Response.json({ models: [{ name: "another-model" }] });
  const data = await (await GET()).json();
  assert.equal(data.ready, false);
  assert.match(data.message, /modelo configurado não foi encontrado/);
});
