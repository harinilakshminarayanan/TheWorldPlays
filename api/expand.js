export const config = { runtime: "edge" };

// Seed list used only as a reference to avoid duplicates when generating new ones
const SEED_ARTISTS = [
  "Shovkat Mirzayev", "Tinariwen", "Huun-Huur-Tu", "Byambasuren Sharav",
  "Susheela Raman", "Trio Mandili", "Bombino", "Vieux Farka Touré",
  "Tanya Tagaq", "Kayhan Kalhor", "Oumou Sangaré", "Stella Chiweshe",
  "Lila Downs", "Amara Toure", "Nusrat Fateh Ali Khan", "Mari Boine",
  "Aurelio Martinez", "Ballaké Sissoko", "Aziza Mustafa Zadeh",
  "Anouar Brahem", "Rokia Traoré", "Hassan Hakmoun", "Sainkho Namtchylak",
  "Trad.Attack!", "Tamikrest", "Susana Baca", "Emel Mathlouthi",
  "Altın Gün", "Noura Mint Seymali", "Mahsa Vahdat", "Hukwe Zawose",
  "Imarhan", "Khun Narin's Electric Phin Band", "Djivan Gasparyan",
  "Dobet Gnahoré", "Balkan Beat Box", "Sona Jobarteh", "Sevara Nazarkhan",
  "Taraf de Haïdouks", "Mariem Hassan", "Kimmo Pohjonen", "Ebo Taylor",
  "Ensemble Al-Kindī",
];

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const MAX_EXPAND_COUNT = 30;

function normalizeArtist(input) {
  if (!input || typeof input !== "object") return null;

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const country = typeof input.country === "string" ? input.country.trim() : "";
  const genre = typeof input.genre === "string" ? input.genre.trim() : "";
  if (!name || !country || !genre) return null;

  const youtubeIdRaw = typeof input.youtubeId === "string" ? input.youtubeId.trim() : "";
  const youtubeId = YOUTUBE_ID_REGEX.test(youtubeIdRaw) ? youtubeIdRaw : "";
  const flag = typeof input.flag === "string" && input.flag.trim() ? input.flag.trim() : "🌍";
  const youtubeSearch = typeof input.youtubeSearch === "string" && input.youtubeSearch.trim()
    ? input.youtubeSearch.trim()
    : `${name} ${country} ${genre}`;

  return { name, country, genre, flag, youtubeId, youtubeSearch };
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { existingNames = [], count = 20 } = await req.json();
    const requestCount = Number.isInteger(count) ? Math.max(1, Math.min(count, MAX_EXPAND_COUNT)) : 20;
    const knownNames = [
      ...SEED_ARTISTS,
      ...existingNames.filter((name) => typeof name === "string"),
    ];
    const allKnownNames = [...new Set(knownNames)];

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ artists: [], source: "skip-no-api-key" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a world music expert and ethnomusicologist. Generate ${requestCount} underground, obscure, or underrepresented artists from around the world that most Western listeners have never heard of.

STRICT RULES:
- NO mainstream or widely-known artists (no Taylor Swift, no BTS, no Drake, etc.)
- NO artists already in this list: ${allKnownNames.join(", ")}
- Prioritize: Central Asia, Southeast Asia, Sub-Saharan Africa, Middle East, Indigenous music from any continent, Eastern Europe, Pacific Islands, South America (non-Brazilian), Caribbean (non-reggae), Caucasus region
- Each artist must be REAL and verifiable
- Include a real YouTube video ID for each artist (a real video that exists on YouTube)
- Vary genres widely: throat singing, oud, kora, gamelan, sitar, mbira, duduk, flute traditions, folk, devotional, protest music, ritual music, etc.

Respond ONLY with a valid JSON array. No preamble, no explanation, no markdown fences. Just the raw JSON array.

Each object must have exactly these fields:
{
  "name": "Artist Name",
  "country": "Country or Region",
  "flag": "🏳️ (correct country flag emoji)",
  "genre": "Genre / Style description",
  "youtubeId": "REAL_VIDEO_ID_11_CHARS",
  "youtubeSearch": "search terms to find them on YouTube"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return new Response(JSON.stringify({ artists: [], error: "Anthropic request failed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const raw = typeof data.content?.[0]?.text === "string" ? data.content[0].text : "[]";

    // Safely parse — strip any accidental markdown fences
    const cleaned = raw.replace(/```json|```/g, "").trim();
    let newArtists = [];
    try {
      newArtists = JSON.parse(cleaned);
    } catch {
      return new Response(JSON.stringify({ artists: [], error: "Parse failed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(newArtists)) {
      return new Response(JSON.stringify({ artists: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Filter out duplicates and malformed artists
    const existingLower = new Set(allKnownNames.map((n) => n.toLowerCase()));
    const filtered = [];
    const seen = new Set();

    for (const rawArtist of newArtists) {
      const artist = normalizeArtist(rawArtist);
      if (!artist) continue;
      const lowered = artist.name.toLowerCase();
      if (existingLower.has(lowered) || seen.has(lowered)) continue;
      seen.add(lowered);
      filtered.push(artist);
    }

    return new Response(JSON.stringify({ artists: filtered }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
