import { useState, useEffect, useMemo, useRef } from "react";

const SEED_ARTISTS = [
  { name: "Shovkat Mirzayev", country: "Uzbekistan", flag: "🇺🇿", genre: "Shashmaqam / Classical Central Asian", youtubeId: "cq6pNzmNjrA", youtubeSearch: "Shovkat Mirzayev Uzbek music" },
  { name: "Tinariwen", country: "Mali / Sahara", flag: "🇲🇱", genre: "Tuareg Desert Blues", youtubeId: "5LkMtmVBDlg", youtubeSearch: "Tinariwen Amassakoul" },
  { name: "Huun-Huur-Tu", country: "Tuva, Russia", flag: "🇷🇺", genre: "Tuvan Throat Singing", youtubeId: "R2ovoRyv4mo", youtubeSearch: "Huun Huur Tu throat singing" },
  { name: "Byambasuren Sharav", country: "Mongolia", flag: "🇲🇳", genre: "Urtiin Duu / Long Song", youtubeId: "d7VkHdVbBhU", youtubeSearch: "Mongolian long song urtiin duu" },
  { name: "Susheela Raman", country: "Tamil Nadu / UK", flag: "🇮🇳", genre: "Tamil Folk Fusion", youtubeId: "3DxFAi4HGWA", youtubeSearch: "Susheela Raman Salt Rain" },
  { name: "Trio Mandili", country: "Georgia", flag: "🇬🇪", genre: "Georgian Polyphonic Folk", youtubeId: "rB2RzNgVMAs", youtubeSearch: "Trio Mandili Georgian folk" },
  { name: "Bombino", country: "Niger", flag: "🇳🇪", genre: "Tuareg Guitar / Agadez Rock", youtubeId: "6lMvhCB0zAA", youtubeSearch: "Bombino Niger Tuareg guitar" },
  { name: "Vieux Farka Touré", country: "Mali", flag: "🇲🇱", genre: "Saharan Blues", youtubeId: "kqMSrLOcUkc", youtubeSearch: "Vieux Farka Touré blues" },
  { name: "Tanya Tagaq", country: "Canada (Inuit)", flag: "🇨🇦", genre: "Inuit Throat Singing / Experimental", youtubeId: "XVUcwBSI8qs", youtubeSearch: "Tanya Tagaq throat singing experimental" },
  { name: "Kayhan Kalhor", country: "Iran", flag: "🇮🇷", genre: "Persian Classical / Kamancheh", youtubeId: "VBVk1GmomYk", youtubeSearch: "Kayhan Kalhor kamancheh Persian" },
  { name: "Oumou Sangaré", country: "Mali", flag: "🇲🇱", genre: "Wassoulou / West African Soul", youtubeId: "dZ7TbS9PZXM", youtubeSearch: "Oumou Sangaré wassoulou" },
  { name: "Stella Chiweshe", country: "Zimbabwe", flag: "🇿🇼", genre: "Mbira / Shona Spirit Music", youtubeId: "Q4qk4QPZSHE", youtubeSearch: "Stella Chiweshe mbira Zimbabwe" },
  { name: "Lila Downs", country: "Oaxaca, Mexico", flag: "🇲🇽", genre: "Zapotec / Mexican Folk", youtubeId: "1_-3pZAZz-M", youtubeSearch: "Lila Downs Oaxacan folk" },
  { name: "Amara Toure", country: "Senegal", flag: "🇸🇳", genre: "Afro-Cuban / Senegalese 70s Soul", youtubeId: "kGHGI7q8AkA", youtubeSearch: "Amara Toure Senegal soul" },
  { name: "Nusrat Fateh Ali Khan", country: "Pakistan", flag: "🇵🇰", genre: "Qawwali / Sufi Devotional", youtubeId: "qKeF8J0YDXI", youtubeSearch: "Nusrat Fateh Ali Khan qawwali" },
  { name: "Mari Boine", country: "Norway (Sámi)", flag: "🇳🇴", genre: "Sámi Joik / Arctic Folk", youtubeId: "0ueqPMVP_0k", youtubeSearch: "Mari Boine Sami joik Norway" },
  { name: "Aurelio Martinez", country: "Honduras", flag: "🇭🇳", genre: "Garifuna / Punta", youtubeId: "vBHKbilrqGs", youtubeSearch: "Aurelio Martinez Garifuna Honduras" },
  { name: "Ballaké Sissoko", country: "Mali", flag: "🇲🇱", genre: "Kora / West African Classical", youtubeId: "Cs5zFfBmFkg", youtubeSearch: "Ballaké Sissoko kora Mali" },
  { name: "Aziza Mustafa Zadeh", country: "Azerbaijan", flag: "🇦🇿", genre: "Jazz / Mugham Fusion", youtubeId: "MFnFCHWGDnc", youtubeSearch: "Aziza Mustafa Zadeh Azerbaijan jazz" },
  { name: "Anouar Brahem", country: "Tunisia", flag: "🇹🇳", genre: "Oud / North African Jazz", youtubeId: "jPU2P5aSKDo", youtubeSearch: "Anouar Brahem oud Tunisia" },
  { name: "Rokia Traoré", country: "Mali", flag: "🇲🇱", genre: "Mande Folk / Alternative African", youtubeId: "FpZiNyHmHOA", youtubeSearch: "Rokia Traoré Mali folk" },
  { name: "Hassan Hakmoun", country: "Morocco", flag: "🇲🇦", genre: "Gnawa / Trance Music", youtubeId: "JmBfKVCNw8k", youtubeSearch: "Hassan Hakmoun Gnawa Morocco" },
  { name: "Sainkho Namtchylak", country: "Tuva", flag: "🇷🇺", genre: "Experimental Throat Singing", youtubeId: "6yXAv7IEpFY", youtubeSearch: "Sainkho Namtchylak experimental" },
  { name: "Trad.Attack!", country: "Estonia", flag: "🇪🇪", genre: "Estonian Folk / Electronic", youtubeId: "bOAHoJxkqG4", youtubeSearch: "Trad.Attack Estonia folk electronic" },
  { name: "Tamikrest", country: "Mali / Algeria", flag: "🇲🇱", genre: "Tuareg Rock", youtubeId: "B4gD_LvKD1c", youtubeSearch: "Tamikrest Tuareg rock" },
  { name: "Susana Baca", country: "Peru", flag: "🇵🇪", genre: "Afro-Peruvian / Festejo", youtubeId: "dGTwvHIf3-k", youtubeSearch: "Susana Baca Afro Peruvian" },
  { name: "Emel Mathlouthi", country: "Tunisia", flag: "🇹🇳", genre: "Arab Alternative / Protest Folk", youtubeId: "hFQlFJCTxHo", youtubeSearch: "Emel Mathlouthi Kelmti Horra" },
  { name: "Altın Gün", country: "Turkey / Netherlands", flag: "🇹🇷", genre: "Anatolian Psych Rock", youtubeId: "c5XuiJbqX0Y", youtubeSearch: "Altın Gün Anatolian psychedelic" },
  { name: "Noura Mint Seymali", country: "Mauritania", flag: "🇲🇷", genre: "Moorish Griot / Desert Blues", youtubeId: "6XUPB7lFCGg", youtubeSearch: "Noura Mint Seymali Mauritania" },
  { name: "Mahsa Vahdat", country: "Iran", flag: "🇮🇷", genre: "Persian Classical Voice", youtubeId: "DY25l0GmJLo", youtubeSearch: "Mahsa Vahdat Persian classical" },
  { name: "Hukwe Zawose", country: "Tanzania", flag: "🇹🇿", genre: "Gogo Music / Ilimba", youtubeId: "VBLX3LWsYoU", youtubeSearch: "Hukwe Zawose Tanzania Gogo music" },
  { name: "Imarhan", country: "Algeria", flag: "🇩🇿", genre: "Tuareg Rock / Tamasheq", youtubeId: "9E7EWzCxEiU", youtubeSearch: "Imarhan Algeria Tuareg" },
  { name: "Khun Narin's Electric Phin Band", country: "Thailand", flag: "🇹🇭", genre: "Thai Phin / Psychedelic Folk", youtubeId: "iw6DEhJFJms", youtubeSearch: "Khun Narin electric phin Thailand" },
  { name: "Djivan Gasparyan", country: "Armenia", flag: "🇦🇲", genre: "Armenian Duduk / Folk", youtubeId: "D5qSjrX6Hgc", youtubeSearch: "Djivan Gasparyan duduk Armenia" },
  { name: "Dobet Gnahoré", country: "Côte d'Ivoire", flag: "🇨🇮", genre: "Afro-Soul / Acoustic African", youtubeId: "7sPHqFO-J0Y", youtubeSearch: "Dobet Gnahoré Côte d'Ivoire" },
  { name: "Balkan Beat Box", country: "Israel / Balkans", flag: "🇮🇱", genre: "Balkan / Middle Eastern Electronic", youtubeId: "FQZ5wc0c7WY", youtubeSearch: "Balkan Beat Box electronic" },
  { name: "Sona Jobarteh", country: "Gambia / UK", flag: "🇬🇲", genre: "Kora / Griot / West African", youtubeId: "FdBMikCt_6Y", youtubeSearch: "Sona Jobarteh kora Gambia" },
  { name: "Sevara Nazarkhan", country: "Uzbekistan", flag: "🇺🇿", genre: "Uzbek Folk Pop / Shashmaqam", youtubeId: "9S-Wd6WZP6s", youtubeSearch: "Sevara Nazarkhan Uzbekistan folk" },
  { name: "Taraf de Haïdouks", country: "Romania", flag: "🇷🇴", genre: "Romani Violin / Lăutari", youtubeId: "9txl_JQM30o", youtubeSearch: "Taraf de Haidouks Romanian Romani" },
  { name: "Mariem Hassan", country: "Western Sahara", flag: "🇪🇭", genre: "Sahrawi Folk / Haul", youtubeId: "CRg83hCqzk4", youtubeSearch: "Mariem Hassan Sahrawi Western Sahara" },
  { name: "Kimmo Pohjonen", country: "Finland", flag: "🇫🇮", genre: "Experimental Accordion / Nordic", youtubeId: "Wh6jO9Rxhio", youtubeSearch: "Kimmo Pohjonen accordion Finland" },
  { name: "Ebo Taylor", country: "Ghana", flag: "🇬🇭", genre: "Highlife / Afrobeat", youtubeId: "6fJl3gVi2Fk", youtubeSearch: "Ebo Taylor Ghana highlife" },
  { name: "Ensemble Al-Kindī", country: "Syria", flag: "🇸🇾", genre: "Sufi Sama / Classical Arab", youtubeId: "phlL8BtGHNo", youtubeSearch: "Ensemble Al-Kindi Syrian Sufi" },
];

const STORAGE_KEY = "twp_artists_v1";
const EXPAND_THRESHOLD = 150;
const EXPAND_BATCH = 25;
const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

const palette = {
  deepBlue: "#22577a",
  teal: "#38a3a5",
  mint: "#57cc99",
  lightMint: "#80ed99",
  paleMint: "#c7f9cc",
  white: "#f8fffb",
};

function isValidYoutubeId(youtubeId) {
  return typeof youtubeId === "string" && YOUTUBE_ID_REGEX.test(youtubeId.trim());
}

function normalizeArtist(input) {
  if (!input || typeof input !== "object") return null;

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const country = typeof input.country === "string" ? input.country.trim() : "";
  const genre = typeof input.genre === "string" ? input.genre.trim() : "";

  if (!name || !country || !genre) return null;

  const youtubeIdRaw = typeof input.youtubeId === "string" ? input.youtubeId.trim() : "";
  const youtubeId = isValidYoutubeId(youtubeIdRaw) ? youtubeIdRaw : "";
  const youtubeSearch = typeof input.youtubeSearch === "string" && input.youtubeSearch.trim()
    ? input.youtubeSearch.trim()
    : `${name} ${country} ${genre}`;
  const flag = typeof input.flag === "string" && input.flag.trim() ? input.flag.trim() : "🌍";

  return { name, country, flag, genre, youtubeId, youtubeSearch };
}

function dedupeArtists(artists) {
  const unique = [];
  const seen = new Set();

  for (const candidate of artists) {
    const artist = normalizeArtist(candidate);
    if (!artist) continue;
    const key = artist.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(artist);
  }

  return unique;
}

function loadStoredArtists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? dedupeArtists(parsed) : [];
  } catch {
    return [];
  }
}

function saveStoredArtists(artists) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dedupeArtists(artists)));
  } catch {
    // Ignore storage quota/errors to avoid breaking render
  }
}

function getAllArtists() {
  const stored = loadStoredArtists();
  return dedupeArtists([...SEED_ARTISTS, ...stored]);
}

function getDailyArtist(artists) {
  const safeArtists = Array.isArray(artists) && artists.length > 0 ? artists : SEED_ARTISTS;
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return safeArtists[seed % safeArtists.length];
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildFallbackStory(artist) {
  return [
    `${artist.name} from ${artist.country} brings a deeply rooted ${artist.genre.toLowerCase()} voice that feels both local and timeless. Their music carries the textures of place, language, and memory in a way that invites slow listening.`,
    `Across recordings and live sessions, ${artist.name} has shaped a distinct artistic path by balancing tradition with personal expression. The result is music that feels handcrafted, intimate, and emotionally direct.`,
    `Today’s discovery is a reminder that incredible music scenes thrive far beyond the global mainstream. If this artist is new to you, you have just opened a door to a much larger world of sound.`,
  ].join("\n\n");
}

async function fetchArtistStory(artist) {
  try {
    const res = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: artist.name, country: artist.country, genre: artist.genre }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return buildFallbackStory(artist);
    }

    return typeof data.story === "string" && data.story.trim()
      ? data.story
      : buildFallbackStory(artist);
  } catch {
    return buildFallbackStory(artist);
  }
}

async function expandArtistList(existingNames) {
  try {
    const res = await fetch("/api/expand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ existingNames, count: EXPAND_BATCH }),
    });

    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    if (!Array.isArray(data.artists)) return [];
    return dedupeArtists(data.artists);
  } catch {
    return [];
  }
}

export default function App() {
  const [allArtists, setAllArtists] = useState(() => getAllArtists());
  const [story, setStory] = useState("");
  const [loadingStory, setLoadingStory] = useState(true);
  const [expanding, setExpanding] = useState(false);
  const [newlyAdded, setNewlyAdded] = useState(0);
  const expandingRef = useRef(false);

  const artist = useMemo(() => getDailyArtist(allArtists), [allArtists]);

  useEffect(() => {
    let mounted = true;
    setLoadingStory(true);

    fetchArtistStory(artist).then((nextStory) => {
      if (!mounted) return;
      setStory(nextStory);
      setLoadingStory(false);
    });

    return () => {
      mounted = false;
    };
  }, [artist]);

  useEffect(() => {
    const current = getAllArtists();
    if (current.length >= EXPAND_THRESHOLD || expandingRef.current) return;

    expandingRef.current = true;
    setExpanding(true);

    expandArtistList(current.map((a) => a.name)).then((newOnes) => {
      const seedAndCurrentNames = new Set(current.map((a) => a.name.toLowerCase()));
      const toAdd = newOnes.filter((a) => !seedAndCurrentNames.has(a.name.toLowerCase()));

      if (toAdd.length > 0) {
        const stored = loadStoredArtists();
        const updated = dedupeArtists([...stored, ...toAdd]);
        saveStoredArtists(updated);

        const refreshed = getAllArtists();
        setAllArtists(refreshed);
        setNewlyAdded(toAdd.length);
        setTimeout(() => setNewlyAdded(0), 5000);
      }

      setExpanding(false);
      expandingRef.current = false;
    });
  }, []);

  const hasPlayableVideo = isValidYoutubeId(artist.youtubeId);
  const countries = useMemo(() => new Set(allArtists.map((a) => a.country)).size, [allArtists]);

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${palette.paleMint} 0%, #e9fff1 100%)`,
      color: palette.deepBlue,
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      padding: "32px 16px 56px",
    }}>
      <main style={{ maxWidth: "760px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "24px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", letterSpacing: "0.08em", color: palette.teal, textTransform: "uppercase" }}>
            Daily discovery
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 48px)", lineHeight: 1.1 }}>The World Plays</h1>
          <p style={{ margin: "10px 0 0", color: palette.teal }}>{formatDate()}</p>
        </header>

        <section style={{
          background: palette.white,
          border: `1px solid ${palette.lightMint}`,
          borderRadius: "18px",
          boxShadow: "0 16px 40px rgba(34, 87, 122, 0.08)",
          padding: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>{artist.flag}</span>
            <span style={{ fontSize: "12px", color: palette.teal, fontWeight: 600 }}>{artist.country}</span>
            <span style={{ fontSize: "12px", color: palette.deepBlue, background: "#ecfff2", padding: "4px 10px", borderRadius: "999px" }}>{artist.genre}</span>
          </div>

          <h2 style={{ textAlign: "center", margin: "0 0 20px", fontSize: "clamp(24px, 5vw, 36px)", lineHeight: 1.2 }}>{artist.name}</h2>

          <div style={{ borderRadius: "12px", overflow: "hidden", border: `1px solid ${palette.lightMint}`, marginBottom: "20px", background: "#dfffe9" }}>
            {hasPlayableVideo ? (
              <div style={{ position: "relative", paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${artist.youtubeId}?rel=0&modestbranding=1`}
                  title={`${artist.name} music`}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Video preview unavailable</p>
                <p style={{ margin: 0, color: palette.teal }}>Open YouTube search for this artist instead.</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(artist.youtubeSearch)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                textDecoration: "none",
                color: "#ffffff",
                background: palette.teal,
                borderRadius: "999px",
                padding: "10px 18px",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Explore more on YouTube
            </a>
          </div>

          <section>
            {loadingStory ? (
              <p style={{ margin: 0, textAlign: "center", color: palette.teal }}>Generating story…</p>
            ) : (
              story.split("\n\n").filter(Boolean).map((paragraph, index) => (
                <p key={index} style={{ margin: "0 0 14px", lineHeight: 1.7, color: index === 0 ? palette.deepBlue : "#356a70" }}>
                  {paragraph}
                </p>
              ))
            )}
          </section>
        </section>

        <footer style={{ marginTop: "18px", textAlign: "center", color: "#2f7f84" }}>
          <p style={{ margin: 0, fontSize: "13px" }}>
            {allArtists.length} artists · {countries} countries · 1 per day
            {expanding && <span> · discovering more…</span>}
          </p>
          {newlyAdded > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: palette.mint }}>
              +{newlyAdded} new artists added to your local rotation
            </p>
          )}
        </footer>
      </main>
    </div>
  );
}
