export const config = { runtime: "edge" };

function buildFallbackDetails({ name, country, genre, pieceTitle }) {
  const bio = `${name} is a ${genre.toLowerCase()} artist from ${country} whose work carries the feel of place, memory, and lived tradition. Their music stands out for its texture and emotional directness, balancing inherited forms with a recognisable personal voice. Listening to ${name} is a reminder that major musical histories are never limited to the global mainstream. Artists like this keep regional sound worlds active, flexible, and contemporary, inviting new listeners into scenes shaped by language, ritual, movement, and community. Even a single performance can open a wider map of culture, influence, and feeling than most familiar playlists ever suggest.`;
  const pieceLead = pieceTitle ? `"${pieceTitle}"` : "This featured performance";
  const pieceNote = `${pieceLead} offers a focused way into ${name}'s sound. Listen for how the phrasing, pulse, and instrumental colour reveal the character of ${genre.toLowerCase()} without losing the intimacy of a live human voice.`;

  return { bio, pieceNote };
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let safeArtist = {
    name: "Unknown artist",
    country: "an unknown place",
    genre: "traditional music",
    pieceTitle: "",
    youtubeSearch: "",
  };

  try {
    const {
      name,
      country,
      genre,
      pieceTitle,
      youtubeSearch,
    } = await req.json();

    safeArtist = {
      name: typeof name === "string" && name.trim() ? name.trim() : "Unknown artist",
      country: typeof country === "string" && country.trim() ? country.trim() : "an unknown place",
      genre: typeof genre === "string" && genre.trim() ? genre.trim() : "traditional music",
      pieceTitle: typeof pieceTitle === "string" && pieceTitle.trim() ? pieceTitle.trim() : "",
      youtubeSearch: typeof youtubeSearch === "string" && youtubeSearch.trim() ? youtubeSearch.trim() : "",
    };

    const fallbackDetails = buildFallbackDetails(safeArtist);

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ ...fallbackDetails, source: "fallback-no-api-key", warning: "ANTHROPIC_API_KEY is not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a knowledgeable world music editor writing homepage copy.

Artist: ${safeArtist.name}
Country/region: ${safeArtist.country}
Style: ${safeArtist.genre}
Featured recording label: ${safeArtist.pieceTitle || safeArtist.youtubeSearch || "Unknown"}

Respond ONLY with valid JSON in this exact shape:
{
  "bio": "single paragraph, 90 to 110 words, warm and specific, about the artist",
  "pieceNote": "2 short sentences, under 55 words total, about what to listen for in the featured recording or performance"
}

Rules:
- No markdown fences
- No extra keys
- If the exact song title is uncertain, describe the performance without inventing facts
- Keep the tone vivid but grounded`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json().catch((error) => ({ parseError: String(error) }));
    if (data.parseError) {
      return new Response(JSON.stringify({ ...fallbackDetails, source: "fallback-parse-error", error: data.parseError }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ ...fallbackDetails, source: "fallback-api-error" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const raw = typeof data.content?.[0]?.text === "string" ? data.content[0].text : "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed = null;
    try {
      parsed = cleaned ? JSON.parse(cleaned) : null;
    } catch {
      parsed = null;
    }

    const bio = typeof parsed?.bio === "string" && parsed.bio.trim()
      ? parsed.bio.trim()
      : fallbackDetails.bio;
    const pieceNote = typeof parsed?.pieceNote === "string" && parsed.pieceNote.trim()
      ? parsed.pieceNote.trim()
      : fallbackDetails.pieceNote;

    return new Response(JSON.stringify({ bio, pieceNote }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const fallbackDetails = buildFallbackDetails(safeArtist);
    return new Response(JSON.stringify({ error: "Failed to fetch story", ...fallbackDetails, source: "fallback-exception" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
