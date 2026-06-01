export const config = { runtime: "edge" };

function buildFallbackStory({ name, country, genre }) {
  return [
    `${name} from ${country} carries a distinct ${genre.toLowerCase()} tradition with a sound shaped by local culture, language, and rhythm.`,
    `${name}'s journey reflects the power of artists who keep regional forms alive while adding a personal voice that speaks to modern listeners.`,
    `Even without major global visibility, this artist expands how we understand world music: specific, rooted, and deeply human.`,
  ].join("\n\n");
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let safeArtist = { name: "Unknown artist", country: "an unknown place", genre: "traditional music" };

  try {
    const { name, country, genre } = await req.json();
    safeArtist = {
      name: typeof name === "string" && name.trim() ? name.trim() : "Unknown artist",
      country: typeof country === "string" && country.trim() ? country.trim() : "an unknown place",
      genre: typeof genre === "string" && genre.trim() ? genre.trim() : "traditional music",
    };

    const fallbackStory = buildFallbackStory(safeArtist);

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ story: fallbackStory, source: "fallback-no-api-key", warning: "ANTHROPIC_API_KEY is not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a passionate, knowledgeable world music guide writing for an audience discovering underground artists for the first time. Write a compelling 3-paragraph story about the artist "${safeArtist.name}" from ${safeArtist.country} who plays ${safeArtist.genre}.

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

    const data = await response.json().catch((error) => ({ parseError: String(error) }));
    if (data.parseError) {
      return new Response(JSON.stringify({ story: fallbackStory, source: "fallback-parse-error", error: data.parseError }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      return new Response(JSON.stringify({ story: fallbackStory, source: "fallback-api-error" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const story = typeof data.content?.[0]?.text === "string" && data.content[0].text.trim()
      ? data.content[0].text
      : fallbackStory;

    return new Response(JSON.stringify({ story }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const fallbackStory = buildFallbackStory(safeArtist);
    return new Response(JSON.stringify({ error: "Failed to fetch story", story: fallbackStory, source: "fallback-exception" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
