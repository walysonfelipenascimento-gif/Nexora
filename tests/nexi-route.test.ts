import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/nexi/chat/route.ts";

const originalFetch = globalThis.fetch;
const originalApiKey = process.env.OPENAI_API_KEY;
const originalProvider = process.env.NEXI_ENGINE_PROVIDER;
let ipCounter = 20;

function request(body, ip = String(ipCounter++)) {
  return new Request("http://localhost/api/nexi/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": `198.51.100.${ip}`
    },
    body: JSON.stringify(body)
  });
}

function validBody(extra = {}) {
  return {
    messages: [{ role: "user", content: "Olá, Nexi!" }],
    ...extra
  };
}

test.afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalApiKey;
  if (originalProvider === undefined) delete process.env.NEXI_ENGINE_PROVIDER;
  else process.env.NEXI_ENGINE_PROVIDER = originalProvider;
});

test("OpenAI: gera resposta e envia store:false", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "openai";
  process.env.OPENAI_API_KEY = "test-key-not-real";
  let captured;
  globalThis.fetch = async (url, init) => {
    captured = { url, init, body: JSON.parse(init.body) };
    return Response.json({ output_text: "Olá! Sou a Nexi." });
  };

  const response = await POST(request(validBody()));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.reply, "Olá! Sou a Nexi.");
  assert.equal(data.searched, false);
  assert.equal(captured.url, "https://api.openai.com/v1/responses");
  assert.equal(captured.body.store, false);
  assert.equal(captured.init.headers.Authorization, "Bearer test-key-not-real");
});

test("OpenAI: habilita web_search e retorna citações", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "openai";
  process.env.OPENAI_API_KEY = "test-key-not-real";
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    assert.deepEqual(body.tools, [{ type: "web_search" }]);
    return Response.json({
      output_text: "Encontrei uma fonte.",
      output: [{ content: [{ type: "output_text", text: "Encontrei uma fonte.", annotations: [
        { type: "url_citation", url: "https://example.com/artigo", title: "Artigo de teste" }
      ] }] }]
    });
  };

  const response = await POST(request(validBody({ webSearch: true })));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.searched, true);
  assert.deepEqual(data.citations, [{ title: "Artigo de teste", url: "https://example.com/artigo" }]);
});

test("rejeita corpo inválido com 400", async () => {
  const response = await POST(request({ messages: "não é uma lista" }));
  assert.equal(response.status, 400);
});

test("retorna erro de configuração quando falta a chave", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "openai";
  delete process.env.OPENAI_API_KEY;
  globalThis.fetch = async () => { throw new Error("fetch não deveria ser chamado"); };

  const response = await POST(request(validBody()));
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /OPENAI_API_KEY/);
});

test("retorna 504 quando o provedor excede o tempo", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "openai";
  process.env.OPENAI_API_KEY = "test-key-not-real";
  globalThis.fetch = async () => { throw new DOMException("timed out", "TimeoutError"); };

  const response = await POST(request(validBody()));
  assert.equal(response.status, 504);
});

test("Ollama: conversa com endpoint compatível e identifica motor", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "ollama";
  process.env.NEXI_ENGINE_URL = "https://engine.example.test/";
  process.env.NEXI_ENGINE_MODEL = "qwen-test";
  let captured;
  globalThis.fetch = async (url, init) => {
    captured = { url, body: JSON.parse(init.body) };
    return Response.json({ message: { content: "Resposta local simulada." } });
  };
  const response = await POST(request(validBody()));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.reply, "Resposta local simulada.");
  assert.equal(data.engine, "self-hosted");
  assert.equal(captured.url, "https://engine.example.test/api/chat");
  assert.equal(captured.body.model, "qwen-test");
});

test("Ollama: pesquisa web não suportada retorna 501 sem chamar motor", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "ollama";
  process.env.NEXI_ENGINE_URL = "https://engine.example.test";
  globalThis.fetch = async () => { throw new Error("fetch não deveria ser chamado"); };
  const response = await POST(request(validBody({ webSearch: true })));
  assert.equal(response.status, 501);
});

test("Ollama: JSON inválido do motor retorna 502", async () => {
  process.env.NEXI_ENGINE_PROVIDER = "ollama";
  process.env.NEXI_ENGINE_URL = "https://engine.example.test";
  globalThis.fetch = async () => new Response("não é json", { status: 200 });
  const response = await POST(request(validBody()));
  assert.equal(response.status, 502);
});
