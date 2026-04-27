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
  "Ensemble Al-Kindī", "Vieux Farka Touré", "Stella Chiweshe",
];

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { existingNames = [], count = 20 } = await req.json();

    const allKnownNames = [...new Set([...SEED_ARTISTS, ...existingNames])];

    const prompt = `You are a world music expert and ethnomusicologist. Generate ${count} underground, obscure, or underrepresented artists from around the world that most Western listeners have never heard of.

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

    const data = await response.json();
    const raw = data.content?.[0]?.text || "[]";

    // Safely parse — strip any accidental markdown fences
    const cleaned = raw.replace(/```json|```/g, "").trim();
    let newArtists = [];
    try {
      newArtists = JSON.parse(cleaned);
    } catch {
      return new Response(JSON.stringify({ error: "Parse failed", raw }), { status: 500 });
    }

    // Filter out any that duplicated existing names (case-insensitive)
    const existingLower = new Set(allKnownNames.map((n) => n.toLowerCase()));
    const filtered = newArtists.filter(
      (a) => a.name && !existingLower.has(a.name.toLowerCase())
    );

    return new Response(JSON.stringify({ artists: filtered }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
