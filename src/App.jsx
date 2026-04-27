import { useState, useEffect, useRef } from "react";

// ─── Seed list (always present, never removed) ───────────────────────────────
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

// ─── Persistence helpers ──────────────────────────────────────────────────────
function loadStoredArtists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveStoredArtists(artists) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(artists)); } catch {}
}

function getAllArtists() {
  const stored = loadStoredArtists();
  const seedNames = new Set(SEED_ARTISTS.map((a) => a.name.toLowerCase()));
  const extraStored = stored.filter((a) => !seedNames.has(a.name.toLowerCase()));
  return [...SEED_ARTISTS, ...extraStored];
}

// ─── Daily artist (deterministic by date) ────────────────────────────────────
function getDailyArtist(artists) {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return artists[seed % artists.length];
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

// ─── API calls ────────────────────────────────────────────────────────────────
async function fetchArtistStory(artist) {
  try {
    const res = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: artist.name, country: artist.country, genre: artist.genre }),
    });
    const data = await res.json();
    return data.story || "Story unavailable.";
  } catch { return "Story unavailable."; }
}

async function expandArtistList(existingNames) {
  try {
    const res = await fetch("/api/expand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ existingNames, count: EXPAND_BATCH }),
    });
    const data = await res.json();
    return data.artists || [];
  } catch { return []; }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function App() {
  const [allArtists, setAllArtists] = useState(() => getAllArtists());
  const [artist, setArtist] = useState(() => getDailyArtist(getAllArtists()));
  const [story, setStory] = useState("");
  const [loadingStory, setLoadingStory] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [newlyAdded, setNewlyAdded] = useState(0);
  const expandingRef = useRef(false);

  useEffect(() => { setTimeout(() => setRevealed(true), 100); }, []);

  useEffect(() => {
    setLoadingStory(true);
    fetchArtistStory(artist).then((s) => {
      setStory(s);
      setLoadingStory(false);
    });
  }, [artist.name]);

  // Background expansion on load
  useEffect(() => {
    const current = getAllArtists();
    if (current.length < EXPAND_THRESHOLD && !expandingRef.current) {
      expandingRef.current = true;
      setExpanding(true);
      expandArtistList(current.map((a) => a.name)).then((newOnes) => {
        if (newOnes.length > 0) {
          const stored = loadStoredArtists();
          const existingNames = new Set(stored.map((a) => a.name.toLowerCase()));
          const seedNames = new Set(SEED_ARTISTS.map((a) => a.name.toLowerCase()));
          const toAdd = newOnes.filter(
            (a) => a.name && !existingNames.has(a.name.toLowerCase()) && !seedNames.has(a.name.toLowerCase())
          );
          if (toAdd.length > 0) {
            const updated = [...stored, ...toAdd];
            saveStoredArtists(updated);
            const newFull = getAllArtists();
            setAllArtists(newFull);
            setNewlyAdded(toAdd.length);
            setTimeout(() => setNewlyAdded(0), 5000);
          }
        }
        setExpanding(false);
        expandingRef.current = false;
      });
    }
  }, []);

  const listSize = allArtists.length;
  const countries = [...new Set(allArtists.map((a) => a.country))].length;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0805",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8dcc8", position: "relative", overflow: "hidden",
    }}>
      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(ellipse, rgba(180,120,40,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "780px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <header style={{
          textAlign: "center", paddingTop: "52px", paddingBottom: "40px",
          opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(-20px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{ fontSize: "10px", letterSpacing: "6px", textTransform: "uppercase", color: "#c49a3c", marginBottom: "12px" }}>
            ◈ &nbsp; Daily Discovery &nbsp; ◈
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 7vw, 64px)", fontWeight: "normal", letterSpacing: "-1px",
            margin: 0, lineHeight: 1, color: "#f0e4c8",
            fontFamily: "'Palatino Linotype', 'Palatino', 'Book Antiqua', Georgia, serif",
          }}>The World Plays</h1>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, #c49a3c, transparent)", margin: "20px auto" }} />
          <p style={{ fontSize: "13px", color: "#8a7a60", margin: 0, letterSpacing: "1px" }}>{formatDate()}</p>
        </header>

        {/* Artist Card */}
        <div style={{
          opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(30px)",
          transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "22px", lineHeight: 1 }}>{artist.flag}</span>
            <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c49a3c", border: "1px solid rgba(196,154,60,0.3)", padding: "5px 14px" }}>{artist.country}</span>
            <span style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#6a5a40", border: "1px solid rgba(106,90,64,0.3)", padding: "5px 14px" }}>{artist.genre}</span>
          </div>

          <h2 style={{
            textAlign: "center", fontSize: "clamp(28px, 6vw, 52px)", fontWeight: "normal",
            fontFamily: "'Palatino Linotype', 'Palatino', Georgia, serif",
            margin: "0 0 40px", color: "#f5ead0", lineHeight: 1.1,
          }}>{artist.name}</h2>

          {/* YouTube */}
          <div style={{
            position: "relative", marginBottom: "48px", borderRadius: "2px", overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,154,60,0.2)",
            background: "#0f0c08",
          }}>
            <div style={{ paddingBottom: "56.25%", position: "relative" }}>
              <iframe
                src={`https://www.youtube.com/embed/${artist.youtubeId}?rel=0&modestbranding=1&color=white`}
                title={`${artist.name} music`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {["topLeft","topRight","bottomLeft","bottomRight"].map((c) => (
              <div key={c} style={{
                position: "absolute",
                top: c.includes("top") ? 0 : "auto", bottom: c.includes("bottom") ? 0 : "auto",
                left: c.includes("Left") ? 0 : "auto", right: c.includes("Right") ? 0 : "auto",
                width: "20px", height: "20px",
                borderTop: c.includes("top") ? "1px solid rgba(196,154,60,0.5)" : "none",
                borderBottom: c.includes("bottom") ? "1px solid rgba(196,154,60,0.5)" : "none",
                borderLeft: c.includes("Left") ? "1px solid rgba(196,154,60,0.5)" : "none",
                borderRight: c.includes("Right") ? "1px solid rgba(196,154,60,0.5)" : "none",
              }} />
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,154,60,0.3))" }} />
            <span style={{ fontSize: "12px", color: "#6a5a40", letterSpacing: "4px" }}>◆</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,154,60,0.3))" }} />
          </div>

          {/* Story */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "-24px", width: "2px", height: "100%", background: "linear-gradient(to bottom, rgba(196,154,60,0.4), transparent)" }} />
            {loadingStory ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <div style={{
                  display: "inline-block", width: "40px", height: "40px",
                  border: "1px solid rgba(196,154,60,0.3)", borderTopColor: "#c49a3c",
                  borderRadius: "50%", animation: "spin 1.2s linear infinite",
                }} />
                <p style={{ color: "#6a5a40", fontSize: "12px", letterSpacing: "2px", marginTop: "16px" }}>CONJURING THE STORY…</p>
              </div>
            ) : (
              story.split("\n\n").filter(Boolean).map((para, i) => (
                <p key={i} style={{
                  fontSize: "clamp(15px, 2.5vw, 17px)", lineHeight: 1.85,
                  color: i === 0 ? "#d4c4a0" : "#a89878",
                  margin: "0 0 24px", fontStyle: i === 0 ? "italic" : "normal",
                }}>
                  {i === 0 && (
                    <span style={{
                      float: "left", fontSize: "clamp(48px, 8vw, 72px)", lineHeight: 0.8,
                      marginRight: "8px", marginTop: "8px", color: "#c49a3c",
                      fontFamily: "'Palatino Linotype', Georgia, serif",
                    }}>{para[0]}</span>
                  )}
                  {i === 0 ? para.slice(1) : para}
                </p>
              ))
            )}
          </div>

          <div style={{ marginTop: "48px", textAlign: "center" }}>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(artist.youtubeSearch)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-block", fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase",
                color: "#c49a3c", textDecoration: "none",
                border: "1px solid rgba(196,154,60,0.3)", padding: "12px 28px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { e.target.style.background = "rgba(196,154,60,0.1)"; e.target.style.borderColor = "rgba(196,154,60,0.6)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(196,154,60,0.3)"; }}
            >
              Explore More on YouTube →
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: "center", marginTop: "80px", paddingTop: "32px", borderTop: "1px solid rgba(196,154,60,0.1)" }}>
          <p style={{ fontSize: "11px", color: "#4a3e2c", letterSpacing: "2px", margin: 0 }}>
            A NEW ARTIST FROM SOMEWHERE UNEXPECTED — EVERY DAY
          </p>
          <p style={{ fontSize: "10px", color: "#3a2e1c", margin: "8px 0 0", letterSpacing: "1px" }}>
            {listSize} artists · {countries} countries · 1 per day
            {expanding && <span style={{ color: "#6a5a40", marginLeft: "10px" }}>· ✦ discovering more…</span>}
          </p>
          {newlyAdded > 0 && (
            <p style={{ fontSize: "10px", color: "#c49a3c", margin: "6px 0 0", letterSpacing: "1px", animation: "fadeIn 0.5s ease" }}>
              ✦ {newlyAdded} new artists just added to the rotation
            </p>
          )}
        </footer>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; }
        ::selection { background: rgba(196,154,60,0.3); }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
