import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders as sdkCors } from "npm:@supabase/supabase-js@2/cors";
import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";

const corsHeaders = {
  ...sdkCors,
  "Access-Control-Allow-Headers": `${sdkCors["Access-Control-Allow-Headers"]}, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version`,
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { mood } = await req.json().catch(() => ({}));
    if (typeof mood !== "string" || mood.trim().length < 3 || mood.length > 1000)
      return json({ error: "Tell us a little about what you'd like to read (3 to 1000 characters)." }, 400);
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
    const books: { id: string; title: string; author: string; genre: string[] }[] = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb.from("books").select("id,title,author,genre")
        .eq("is_published", true).order("created_at").order("id").range(from, from + 999);
      if (error) throw error;
      books.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    if (!books.length) return json({ picks: [] });
    const catalog = books.map((b, i) => `${i}|${b.title}|${b.author}|${(b.genre || []).join(",")}`).join("\n");

    let runId: string | undefined;
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: async (input, init) => {
        const headers = new Headers(init?.headers);
        if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
        const r = await fetch(input, { ...init, headers });
        runId ??= r.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
        return r;
      },
    });
    const result = streamText({
      model: provider.responses("openai/gpt-6.1-sol"),
      system: "You are a warm bookseller at Bookberries, an Algerian bookstore. Recommend ONLY books from the catalog (format: index|title|author|genres). Reply with JSON only: {\"picks\":[{\"i\":<index>,\"why\":\"<one friendly sentence>\"}]} with 3 to 6 picks. Reply 'why' in the shopper's language.",
      messages: [{ role: "user", content: `Catalog:\n${catalog}\n\nShopper: ${mood.trim()}` }],
      abortSignal: req.signal,
      providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", include: ["reasoning.encrypted_content"] } },
    });
    let text = "";
    try { text = await result.text; } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode ?? 500;
      const msg = status === 429 ? "Our bookseller is busy, please try again in a moment."
        : status === 402 ? "AI credits have run out. The shop owner needs to add credits." : "Couldn't get recommendations right now.";
      return json({ error: msg }, status);
    }
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : { picks: [] };
    const picks = (parsed.picks ?? [])
      .filter((p: { i: number }) => books[p.i])
      .slice(0, 6)
      .map((p: { i: number; why: string }) => ({ id: books[p.i].id, why: String(p.why ?? "") }));
    return json({ picks });
  } catch (e) {
    console.error(e);
    return json({ error: "Couldn't get recommendations right now." }, 500);
  }
});
