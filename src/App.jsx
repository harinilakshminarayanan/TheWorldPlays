import { useState, useEffect, useMemo, useRef } from "react";
import { dedupeArtists, isValidYoutubeId } from "../shared/artist.js";

const SEED_ARTISTS = [
  { name: "Shovkat Mirzayev", country: "Uzbekistan", flag: "🇺🇿", genre: "Shashmaqam / Classical Central Asian", youtubeId: "cq6pNzmNjrA", youtubeSearch: "Shovkat Mirzayev Uzbek music" },
  { name: "Tinariwen", country: "Mali / Sahara", flag: "🇲🇱", genre: "Tuareg Desert Blues", youtubeId: "5LkMtmVBDlg", youtubeSearch: "Tinariwen Amassakoul", pieceTitle: "Amassakoul" },
  { name: "Huun-Huur-Tu", country: "Tuva, Russia", flag: "🇷🇺", genre: "Tuvan Throat Singing", youtubeId: "R2ovoRyv4mo", youtubeSearch: "Huun Huur Tu throat singing" },
  { name: "Byambasuren Sharav", country: "Mongolia", flag: "🇲🇳", genre: "Urtiin Duu / Long Song", youtubeId: "d7VkHdVbBhU", youtubeSearch: "Mongolian long song urtiin duu" },
  { name: "Susheela Raman", country: "Tamil Nadu / UK", flag: "🇮🇳", genre: "Tamil Folk Fusion", youtubeId: "3DxFAi4HGWA", youtubeSearch: "Susheela Raman Salt Rain", pieceTitle: "Salt Rain" },
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
  { name: "Emel Mathlouthi", country: "Tunisia", flag: "🇹🇳", genre: "Arab Alternative / Protest Folk", youtubeId: "hFQlFJCTxHo", youtubeSearch: "Emel Mathlouthi Kelmti Horra", pieceTitle: "Kelmti Horra" },
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

const palette = {
  ink: "#183b4d",
  teal: "#2b7a78",
  seaGlass: "#7ad8c6",
  butter: "#fff6cf",
  coral: "#ffb38a",
  mist: "#f4fbff",
  white: "#ffffff",
  border: "rgba(24, 59, 77, 0.12)",
};

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

function toTitleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function derivePieceTitle(artist) {
  if (artist.pieceTitle) return artist.pieceTitle;

  const search = typeof artist.youtubeSearch === "string" ? artist.youtubeSearch.trim() : "";
  if (!search) return "Featured performance";

  const normalizedArtistName = artist.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const stripped = search
    .replace(new RegExp(normalizedArtistName, "ig"), "")
    .replace(/\s+/g, " ")
    .trim();

  if (!stripped || stripped.toLowerCase() === artist.country.toLowerCase()) {
    return `Featured ${artist.genre.split("/")[0].trim()} performance`;
  }

  return toTitleCase(stripped);
}

function buildFallbackDetails(artist) {
  const pieceTitle = derivePieceTitle(artist);

  return {
    bio: `${artist.name} is a ${artist.genre.toLowerCase()} artist from ${artist.country} whose work carries the atmosphere of place, memory, and lived tradition. Their performances feel both rooted and immediate, drawing listeners into a musical language shaped by local history while still sounding vividly personal. What makes ${artist.name} exciting is the way technique and emotion stay tightly connected: every phrase feels inhabited rather than polished for distance. For listeners discovering them for the first time, this is not just a new name but a new musical map, one that opens onto scenes, stories, and cultural textures rarely centered in mainstream listening.`,
    pieceNote: artist.pieceDescription || `${pieceTitle} gives you a direct entry point into ${artist.name}'s world. Listen for the rhythmic feel, the grain of the voice or lead instrument, and the way ${artist.genre.toLowerCase()} carries both movement and atmosphere.`,
  };
}

function buildWatchUrl(youtubeId) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

function buildEmbedUrl(youtubeId) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
}

async function fetchArtistDetails(artist) {
  try {
    const res = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: artist.name,
        country: artist.country,
        genre: artist.genre,
        pieceTitle: derivePieceTitle(artist),
        youtubeSearch: artist.youtubeSearch,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return buildFallbackDetails(artist);
    }

    const fallback = buildFallbackDetails(artist);

    return {
      bio: typeof data.bio === "string" && data.bio.trim() ? data.bio.trim() : fallback.bio,
      pieceNote: typeof data.pieceNote === "string" && data.pieceNote.trim() ? data.pieceNote.trim() : fallback.pieceNote,
    };
  } catch {
    return buildFallbackDetails(artist);
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
  const [details, setDetails] = useState(() => buildFallbackDetails(getDailyArtist(getAllArtists())));
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [expanding, setExpanding] = useState(false);
  const [newlyAdded, setNewlyAdded] = useState(0);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const expandingRef = useRef(false);

  const artist = useMemo(() => getDailyArtist(allArtists), [allArtists]);
  const pieceTitle = useMemo(() => derivePieceTitle(artist), [artist]);
  const hasValidYoutubeId = isValidYoutubeId(artist.youtubeId);
  const countries = useMemo(() => new Set(allArtists.map((a) => a.country)).size, [allArtists]);
  const watchUrl = hasValidYoutubeId
    ? buildWatchUrl(artist.youtubeId)
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(artist.youtubeSearch)}`;

  useEffect(() => {
    let mounted = true;
    setLoadingDetails(true);
    setPlayerLoaded(false);

    fetchArtistDetails(artist).then((nextDetails) => {
      if (!mounted) return;
      setDetails(nextDetails);
    }).catch(() => {
      if (!mounted) return;
      setDetails(buildFallbackDetails(artist));
    }).finally(() => {
      if (!mounted) return;
      setLoadingDetails(false);
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

    }).catch(() => {
      // Ignore network/API errors; the next page load can retry expansion.
    }).finally(() => {
      setExpanding(false);
      expandingRef.current = false;
    });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: palette.mist,
      backgroundImage: [
        "radial-gradient(circle at 20px 20px, rgba(24, 59, 77, 0.08) 1.6px, transparent 0)",
        "radial-gradient(circle at top left, rgba(122, 216, 198, 0.32), transparent 34%)",
        "radial-gradient(circle at bottom right, rgba(255, 179, 138, 0.22), transparent 28%)",
        "linear-gradient(180deg, #fffef7 0%, #f4fbff 55%, #eefaf5 100%)",
      ].join(", "),
      backgroundSize: "24px 24px, auto, auto, auto",
      color: palette.ink,
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      padding: "32px 16px 56px",
    }}>
      <main style={{ maxWidth: "960px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "24px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", letterSpacing: "0.12em", color: palette.teal, textTransform: "uppercase", fontWeight: 700 }}>
            Daily discovery
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 52px)", lineHeight: 1.1 }}>The World Plays</h1>
          <p style={{ margin: "10px auto 0", color: palette.teal, maxWidth: "640px", lineHeight: 1.6 }}>
            One artist, one featured recording, and a quick way into a corner of the world you may not have heard before.
          </p>
          <p style={{ margin: "10px 0 0", color: palette.teal }}>{formatDate()}</p>
        </header>

        <section style={{
          background: "rgba(255, 255, 255, 0.86)",
          border: `1px solid ${palette.border}`,
          borderRadius: "28px",
          boxShadow: "0 20px 50px rgba(24, 59, 77, 0.10)",
          padding: "28px",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>{artist.flag}</span>
            <span style={{ fontSize: "12px", color: palette.teal, fontWeight: 700 }}>{artist.country}</span>
            <span style={{ fontSize: "12px", color: palette.ink, background: palette.butter, padding: "6px 12px", borderRadius: "999px", border: `1px solid ${palette.border}` }}>{artist.genre}</span>
          </div>

          <h2 style={{ textAlign: "center", margin: "0 0 6px", fontSize: "clamp(24px, 5vw, 38px)", lineHeight: 1.2 }}>{artist.name}</h2>
          <p style={{ textAlign: "center", margin: "0 0 24px", color: "#476d72" }}>
            Featured piece: <strong>{pieceTitle}</strong>
          </p>

          <div style={{ borderRadius: "22px", overflow: "hidden", border: `1px solid ${palette.border}`, marginBottom: "24px", background: "#dff7f3" }}>
            {hasValidYoutubeId ? (
              playerLoaded ? (
                <div style={{ position: "relative", paddingBottom: "56.25%" }}>
                  <iframe
                    src={buildEmbedUrl(artist.youtubeId)}
                    title={`${artist.name} – ${pieceTitle}`}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayerLoaded(true)}
                  style={{
                    width: "100%",
                    minHeight: "320px",
                    border: "none",
                    cursor: "pointer",
                    padding: "36px 24px",
                    color: "#ffffff",
                    backgroundImage: `linear-gradient(180deg, rgba(24, 59, 77, 0.18), rgba(24, 59, 77, 0.76)), url(https://i.ytimg.com/vi/${artist.youtubeId}/hqdefault.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                  }}
                >
                  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "12px", maxWidth: "480px" }}>
                    <span style={{ width: "74px", height: "74px", borderRadius: "999px", background: "rgba(255,255,255,0.92)", color: palette.ink, display: "grid", placeItems: "center", fontSize: "30px", boxShadow: "0 10px 26px rgba(0,0,0,0.18)" }}>
                      ▶
                    </span>
                    <span style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700 }}>
                      Play the featured recording
                    </span>
                    <span style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(255,255,255,0.92)" }}>
                      Click to load the embedded YouTube player for <strong>{pieceTitle}</strong>.
                    </span>
                  </span>
                </button>
              )
            ) : (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 700 }}>Embedded player unavailable</p>
                <p style={{ margin: 0, color: palette.teal }}>Use the YouTube links below to hear the featured piece.</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                textDecoration: "none",
                color: "#ffffff",
                background: palette.teal,
                borderRadius: "999px",
                padding: "12px 18px",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 12px 24px rgba(43, 122, 120, 0.18)",
              }}
            >
              Watch this recording on YouTube
            </a>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(artist.youtubeSearch)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                textDecoration: "none",
                color: palette.ink,
                background: palette.butter,
                border: `1px solid ${palette.border}`,
                borderRadius: "999px",
                padding: "12px 18px",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Explore more on YouTube
            </a>
          </div>

          <section style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <article style={{ background: "#fff9e8", border: `1px solid ${palette.border}`, borderRadius: "22px", padding: "20px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: palette.teal, fontWeight: 700 }}>
                About the piece
              </p>
              <h3 style={{ margin: "0 0 10px", fontSize: "22px", lineHeight: 1.3 }}>{pieceTitle}</h3>
              {loadingDetails ? (
                <p style={{ margin: 0, color: palette.teal, lineHeight: 1.7 }}>Writing a quick listening note…</p>
              ) : (
                <p style={{ margin: 0, color: "#476d72", lineHeight: 1.7 }}>{details.pieceNote}</p>
              )}
            </article>

            <article style={{ background: "#f8fffe", border: `1px solid ${palette.border}`, borderRadius: "22px", padding: "20px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: palette.teal, fontWeight: 700 }}>
                100-word artist bio
              </p>
              {loadingDetails ? (
                <p style={{ margin: 0, color: palette.teal, lineHeight: 1.7 }}>Writing the bio…</p>
              ) : (
                <p style={{ margin: 0, color: "#38575f", lineHeight: 1.8 }}>{details.bio}</p>
              )}
            </article>
          </section>
        </section>

        <footer style={{ marginTop: "18px", textAlign: "center", color: "#2f7f84" }}>
          <p style={{ margin: 0, fontSize: "13px" }}>
            {allArtists.length} artists · {countries} countries · 1 per day
            {expanding && <span> · discovering more…</span>}
          </p>
          {newlyAdded > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: palette.teal }}>
              +{newlyAdded} new artists added to your local rotation
            </p>
          )}
        </footer>
      </main>
    </div>
  );
}
