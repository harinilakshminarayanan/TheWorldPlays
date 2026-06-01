import { useState, useEffect, useMemo, useRef } from "react";
import { dedupeArtists, isValidSpotifyId } from "../shared/artist.js";

const SEED_ARTISTS = [
  { name: "Shovkat Mirzayev", country: "Uzbekistan", flag: "🇺🇿", genre: "Shashmaqam / Classical Central Asian", youtubeId: "cq6pNzmNjrA", youtubeSearch: "Shovkat Mirzayev Uzbek music", spotifyId: "" },
  { name: "Tinariwen", country: "Mali / Sahara", flag: "🇲🇱", genre: "Tuareg Desert Blues", youtubeId: "5LkMtmVBDlg", youtubeSearch: "Tinariwen Amassakoul", pieceTitle: "Amassakoul", spotifyId: "5I5k3CTnrxdS6KSjUsMvwV" },
  { name: "Huun-Huur-Tu", country: "Tuva, Russia", flag: "🇷🇺", genre: "Tuvan Throat Singing", youtubeId: "R2ovoRyv4mo", youtubeSearch: "Huun Huur Tu throat singing", spotifyId: "6j8IT8OcKmBZSiMiHDXqWD" },
  { name: "Byambasuren Sharav", country: "Mongolia", flag: "🇲🇳", genre: "Urtiin Duu / Long Song", youtubeId: "d7VkHdVbBhU", youtubeSearch: "Mongolian long song urtiin duu", spotifyId: "" },
  { name: "Susheela Raman", country: "Tamil Nadu / UK", flag: "🇮🇳", genre: "Tamil Folk Fusion", youtubeId: "3DxFAi4HGWA", youtubeSearch: "Susheela Raman Salt Rain", pieceTitle: "Salt Rain", spotifyId: "6fAFPJn6ZlpVhCvT8tAbFi" },
  { name: "Trio Mandili", country: "Georgia", flag: "🇬🇪", genre: "Georgian Polyphonic Folk", youtubeId: "rB2RzNgVMAs", youtubeSearch: "Trio Mandili Georgian folk", spotifyId: "4nvyKi1a4LjcVFhFNjM6c1" },
  { name: "Bombino", country: "Niger", flag: "🇳🇪", genre: "Tuareg Guitar / Agadez Rock", youtubeId: "6lMvhCB0zAA", youtubeSearch: "Bombino Niger Tuareg guitar", spotifyId: "3cFJH3bPW0eCEJVnDrS5AK" },
  { name: "Vieux Farka Touré", country: "Mali", flag: "🇲🇱", genre: "Saharan Blues", youtubeId: "kqMSrLOcUkc", youtubeSearch: "Vieux Farka Touré blues", spotifyId: "6ykZFHn3E8UwmEXRXHqzPp" },
  { name: "Tanya Tagaq", country: "Canada (Inuit)", flag: "🇨🇦", genre: "Inuit Throat Singing / Experimental", youtubeId: "XVUcwBSI8qs", youtubeSearch: "Tanya Tagaq throat singing experimental", spotifyId: "4Pf4BV0E4zGcEPbU1DdL5w" },
  { name: "Kayhan Kalhor", country: "Iran", flag: "🇮🇷", genre: "Persian Classical / Kamancheh", youtubeId: "VBVk1GmomYk", youtubeSearch: "Kayhan Kalhor kamancheh Persian", spotifyId: "26hb0ueBTcb9k8HNYj5A1q" },
  { name: "Oumou Sangaré", country: "Mali", flag: "🇲🇱", genre: "Wassoulou / West African Soul", youtubeId: "dZ7TbS9PZXM", youtubeSearch: "Oumou Sangaré wassoulou", spotifyId: "7e28pMjgPgUoGq4m0Xhz6E" },
  { name: "Stella Chiweshe", country: "Zimbabwe", flag: "🇿🇼", genre: "Mbira / Shona Spirit Music", youtubeId: "Q4qk4QPZSHE", youtubeSearch: "Stella Chiweshe mbira Zimbabwe", spotifyId: "" },
  { name: "Lila Downs", country: "Oaxaca, Mexico", flag: "🇲🇽", genre: "Zapotec / Mexican Folk", youtubeId: "1_-3pZAZz-M", youtubeSearch: "Lila Downs Oaxacan folk", spotifyId: "7h2dwSBK3ofNF3lcKhnNTx" },
  { name: "Amara Toure", country: "Senegal", flag: "🇸🇳", genre: "Afro-Cuban / Senegalese 70s Soul", youtubeId: "kGHGI7q8AkA", youtubeSearch: "Amara Toure Senegal soul", spotifyId: "" },
  { name: "Nusrat Fateh Ali Khan", country: "Pakistan", flag: "🇵🇰", genre: "Qawwali / Sufi Devotional", youtubeId: "qKeF8J0YDXI", youtubeSearch: "Nusrat Fateh Ali Khan qawwali", spotifyId: "5NL2YIQZ5uo7FU7sXUa0Xe" },
  { name: "Mari Boine", country: "Norway (Sámi)", flag: "🇳🇴", genre: "Sámi Joik / Arctic Folk", youtubeId: "0ueqPMVP_0k", youtubeSearch: "Mari Boine Sami joik Norway", spotifyId: "2HdVELAjWAvmaCEPVnkr8A" },
  { name: "Aurelio Martinez", country: "Honduras", flag: "🇭🇳", genre: "Garifuna / Punta", youtubeId: "vBHKbilrqGs", youtubeSearch: "Aurelio Martinez Garifuna Honduras", spotifyId: "" },
  { name: "Ballaké Sissoko", country: "Mali", flag: "🇲🇱", genre: "Kora / West African Classical", youtubeId: "Cs5zFfBmFkg", youtubeSearch: "Ballaké Sissoko kora Mali", spotifyId: "6ixrMNMxF8mzOe56YDqhgV" },
  { name: "Aziza Mustafa Zadeh", country: "Azerbaijan", flag: "🇦🇿", genre: "Jazz / Mugham Fusion", youtubeId: "MFnFCHWGDnc", youtubeSearch: "Aziza Mustafa Zadeh Azerbaijan jazz", spotifyId: "4wXCVBQRWYgjJa0MQPrWCB" },
  { name: "Anouar Brahem", country: "Tunisia", flag: "🇹🇳", genre: "Oud / North African Jazz", youtubeId: "jPU2P5aSKDo", youtubeSearch: "Anouar Brahem oud Tunisia", spotifyId: "2mCgCRDeHOyObTXjDlYP9x" },
  { name: "Rokia Traoré", country: "Mali", flag: "🇲🇱", genre: "Mande Folk / Alternative African", youtubeId: "FpZiNyHmHOA", youtubeSearch: "Rokia Traoré Mali folk", spotifyId: "6cg89MoP8BxGKGi9J8o5xG" },
  { name: "Hassan Hakmoun", country: "Morocco", flag: "🇲🇦", genre: "Gnawa / Trance Music", youtubeId: "JmBfKVCNw8k", youtubeSearch: "Hassan Hakmoun Gnawa Morocco", spotifyId: "" },
  { name: "Sainkho Namtchylak", country: "Tuva", flag: "🇷🇺", genre: "Experimental Throat Singing", youtubeId: "6yXAv7IEpFY", youtubeSearch: "Sainkho Namtchylak experimental", spotifyId: "" },
  { name: "Trad.Attack!", country: "Estonia", flag: "🇪🇪", genre: "Estonian Folk / Electronic", youtubeId: "bOAHoJxkqG4", youtubeSearch: "Trad.Attack Estonia folk electronic", spotifyId: "3oQVXcJVzGhXJW5pTv7vVF" },
  { name: "Tamikrest", country: "Mali / Algeria", flag: "🇲🇱", genre: "Tuareg Rock", youtubeId: "B4gD_LvKD1c", youtubeSearch: "Tamikrest Tuareg rock", spotifyId: "7I3skFGLOzUZzJiuJPD3AX" },
  { name: "Susana Baca", country: "Peru", flag: "🇵🇪", genre: "Afro-Peruvian / Festejo", youtubeId: "dGTwvHIf3-k", youtubeSearch: "Susana Baca Afro Peruvian", spotifyId: "7nMUFRpFNlblb44RTAAFGZ" },
  { name: "Emel Mathlouthi", country: "Tunisia", flag: "🇹🇳", genre: "Arab Alternative / Protest Folk", youtubeId: "hFQlFJCTxHo", youtubeSearch: "Emel Mathlouthi Kelmti Horra", pieceTitle: "Kelmti Horra", spotifyId: "3UMnMKRxEFxXMBNiUUiSlJ" },
  { name: "Altın Gün", country: "Turkey / Netherlands", flag: "🇹🇷", genre: "Anatolian Psych Rock", youtubeId: "c5XuiJbqX0Y", youtubeSearch: "Altın Gün Anatolian psychedelic", spotifyId: "5hTpBe8h35rJ67eAWHOCNy" },
  { name: "Noura Mint Seymali", country: "Mauritania", flag: "🇲🇷", genre: "Moorish Griot / Desert Blues", youtubeId: "6XUPB7lFCGg", youtubeSearch: "Noura Mint Seymali Mauritania", spotifyId: "" },
  { name: "Mahsa Vahdat", country: "Iran", flag: "🇮🇷", genre: "Persian Classical Voice", youtubeId: "DY25l0GmJLo", youtubeSearch: "Mahsa Vahdat Persian classical", spotifyId: "3WUOGv7V7iXiMhqCbkMiqd" },
  { name: "Hukwe Zawose", country: "Tanzania", flag: "🇹🇿", genre: "Gogo Music / Ilimba", youtubeId: "VBLX3LWsYoU", youtubeSearch: "Hukwe Zawose Tanzania Gogo music", spotifyId: "" },
  { name: "Imarhan", country: "Algeria", flag: "🇩🇿", genre: "Tuareg Rock / Tamasheq", youtubeId: "9E7EWzCxEiU", youtubeSearch: "Imarhan Algeria Tuareg", spotifyId: "3bEDHhMiSHU2DLgwXe3ELm" },
  { name: "Khun Narin's Electric Phin Band", country: "Thailand", flag: "🇹🇭", genre: "Thai Phin / Psychedelic Folk", youtubeId: "iw6DEhJFJms", youtubeSearch: "Khun Narin electric phin Thailand", spotifyId: "" },
  { name: "Djivan Gasparyan", country: "Armenia", flag: "🇦🇲", genre: "Armenian Duduk / Folk", youtubeId: "D5qSjrX6Hgc", youtubeSearch: "Djivan Gasparyan duduk Armenia", spotifyId: "6UfomURCiWAM0K1FZ8E1Ca" },
  { name: "Dobet Gnahoré", country: "Côte d'Ivoire", flag: "🇨🇮", genre: "Afro-Soul / Acoustic African", youtubeId: "7sPHqFO-J0Y", youtubeSearch: "Dobet Gnahoré Côte d'Ivoire", spotifyId: "6gBSLRlJQJpJFb9YBHXO8c" },
  { name: "Balkan Beat Box", country: "Israel / Balkans", flag: "🇮🇱", genre: "Balkan / Middle Eastern Electronic", youtubeId: "FQZ5wc0c7WY", youtubeSearch: "Balkan Beat Box electronic", spotifyId: "6oCXrFfEHDW5J2kxBrEaqL" },
  { name: "Sona Jobarteh", country: "Gambia / UK", flag: "🇬🇲", genre: "Kora / Griot / West African", youtubeId: "FdBMikCt_6Y", youtubeSearch: "Sona Jobarteh kora Gambia", spotifyId: "2A9GlHBtnSmJnGqBJFh9vX" },
  { name: "Sevara Nazarkhan", country: "Uzbekistan", flag: "🇺🇿", genre: "Uzbek Folk Pop / Shashmaqam", youtubeId: "9S-Wd6WZP6s", youtubeSearch: "Sevara Nazarkhan Uzbekistan folk", spotifyId: "" },
  { name: "Taraf de Haïdouks", country: "Romania", flag: "🇷🇴", genre: "Romani Violin / Lăutari", youtubeId: "9txl_JQM30o", youtubeSearch: "Taraf de Haidouks Romanian Romani", spotifyId: "3pRmJHVGznqerYp3YvpzJb" },
  { name: "Mariem Hassan", country: "Western Sahara", flag: "🇪🇭", genre: "Sahrawi Folk / Haul", youtubeId: "CRg83hCqzk4", youtubeSearch: "Mariem Hassan Sahrawi Western Sahara", spotifyId: "" },
  { name: "Kimmo Pohjonen", country: "Finland", flag: "🇫🇮", genre: "Experimental Accordion / Nordic", youtubeId: "Wh6jO9Rxhio", youtubeSearch: "Kimmo Pohjonen accordion Finland", spotifyId: "3JfqYLBhm7hJdPeXEFLMzr" },
  { name: "Ebo Taylor", country: "Ghana", flag: "🇬🇭", genre: "Highlife / Afrobeat", youtubeId: "6fJl3gVi2Fk", youtubeSearch: "Ebo Taylor Ghana highlife", spotifyId: "6FmVSQoqtlMqSgQxGn8g5h" },
  { name: "Ensemble Al-Kindī", country: "Syria", flag: "🇸🇾", genre: "Sufi Sama / Classical Arab", youtubeId: "phlL8BtGHNo", youtubeSearch: "Ensemble Al-Kindi Syrian Sufi", spotifyId: "" },
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
  const candidates = safeArtists.length > 0 ? safeArtists : SEED_ARTISTS;
  if (candidates.length === 0) return SEED_ARTISTS[0];
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return candidates[seed % candidates.length];
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

  const countryTokens = artist.country.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const genreTokens = artist.genre.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const remainingTokens = stripped.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
    .filter((token) => !countryTokens.includes(token));

  if (remainingTokens.length === 0) {
    return `Featured ${artist.genre.split("/")[0].trim()} performance`;
  }

  const overlapsGenreOnly = remainingTokens.length <= 2 && remainingTokens.every((token) => genreTokens.includes(token));

  if (overlapsGenreOnly) {
    return `Featured ${artist.genre.split("/")[0].trim()} performance`;
  }

  return toTitleCase(remainingTokens.join(" "));
}

function buildFallbackDetails(artist) {
  const pieceTitle = derivePieceTitle(artist);

  return {
    bio: `${artist.name} is a ${artist.genre.toLowerCase()} artist from ${artist.country} whose work carries the atmosphere of place, memory, and lived tradition. Their performances feel both rooted and immediate, drawing listeners into a musical language shaped by local history while still sounding vividly personal. What makes ${artist.name} exciting is the way technique and emotion stay tightly connected: every phrase feels inhabited rather than polished for distance. For listeners discovering them for the first time, this is not just a new name but a new musical map, one that opens onto scenes, stories, and cultural textures rarely centered in mainstream listening.`,
    pieceNote: artist.pieceDescription || `${pieceTitle} gives you a direct entry point into ${artist.name}'s world. Listen for the rhythmic feel, the grain of the voice or lead instrument, and the way ${artist.genre.toLowerCase()} carries both movement and atmosphere.`,
  };
}

function buildSpotifyEmbedUrl(spotifyId) {
  return `https://open.spotify.com/embed/artist/${spotifyId}?utm_source=generator&theme=0`;
}

function buildSpotifyUrl(spotifyId) {
  return `https://open.spotify.com/artist/${spotifyId}`;
}

function buildSpotifySearchUrl(artistName) {
  return `https://open.spotify.com/search/${encodeURIComponent(artistName)}`;
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
  const hasValidSpotifyId = isValidSpotifyId(artist.spotifyId);
  const countries = useMemo(() => new Set(allArtists.map((a) => a.country)).size, [allArtists]);
  const spotifyUrl = useMemo(() => (
    hasValidSpotifyId
      ? buildSpotifyUrl(artist.spotifyId)
      : buildSpotifySearchUrl(artist.name)
  ), [artist.spotifyId, artist.name, hasValidSpotifyId]);

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
            {hasValidSpotifyId ? (
              playerLoaded ? (
                <iframe
                  src={buildSpotifyEmbedUrl(artist.spotifyId)}
                  title={`${artist.name} – ${pieceTitle}`}
                  width="100%"
                  height="352"
                  style={{ border: "none", display: "block" }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayerLoaded(true)}
                  aria-label={`Play ${artist.name} on the embedded Spotify player`}
                  style={{
                    width: "100%",
                    minHeight: "320px",
                    border: "none",
                    cursor: "pointer",
                    padding: "36px 24px",
                    color: "#ffffff",
                    background: "linear-gradient(180deg, rgba(24, 59, 77, 0.18), rgba(24, 59, 77, 0.76)), linear-gradient(135deg, #1DB954 0%, #191414 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                  }}
                >
                  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "12px", maxWidth: "480px" }}>
                    <span style={{ width: "74px", height: "74px", borderRadius: "999px", background: "#1DB954", color: "#ffffff", display: "grid", placeItems: "center", fontSize: "30px", boxShadow: "0 10px 26px rgba(0,0,0,0.28)" }}>
                      ▶
                    </span>
                    <span style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700 }}>
                      Play on Spotify
                    </span>
                    <span style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(255,255,255,0.92)" }}>
                      Click to load the embedded Spotify player for <strong>{artist.name}</strong>.
                    </span>
                  </span>
                </button>
              )
            ) : (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 700 }}>Embedded player unavailable</p>
                <p style={{ margin: 0, color: palette.teal }}>Use the Spotify link below to listen.</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                textDecoration: "none",
                color: "#ffffff",
                background: "#1DB954",
                borderRadius: "999px",
                padding: "12px 18px",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 12px 24px rgba(29, 185, 84, 0.28)",
              }}
            >
              {hasValidSpotifyId ? "Open artist on Spotify" : "Find on Spotify"}
            </a>
            <a
              href={buildSpotifySearchUrl(artist.name)}
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
              Search more on Spotify
            </a>
          </div>

          <p style={{ margin: "0 0 24px", textAlign: "center", color: "#5c7a80", fontSize: "13px" }}>
            If the embedded player is blocked, use the Spotify button above to listen directly.
          </p>

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
