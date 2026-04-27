export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { name, country, genre } = await req.json();

    const prompt = `You are a passionate, knowledgeable world music guide writing for an audience discovering underground artists for the first time. Write a compelling 3-paragraph story about the artist "${name}" from ${country} who plays ${genre}.

Paragraph 1: Their origin, cultural roots, and what makes their sound distinct.
Paragraph 2: Their journey — how they developed their art, key influences, any struggles or triumphs.
Paragraph 3: Why this artist matters — their contribution to world music and why discovering them feels like finding hidden treasure.

Be vivid, specific, and enthusiastic. Avoid clichés. Write as if you personally love this music. Keep it under 280 words total. Separate paragraphs with a blank line.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const story = data.content?.[0]?.text || "Story unavailable.";

    return new Response(JSON.stringify({ story }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch story", story: "Story unavailable." }), { status: 500 });
  }
}
