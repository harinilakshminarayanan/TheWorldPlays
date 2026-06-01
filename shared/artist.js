export const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function isValidYoutubeId(youtubeId) {
  return typeof youtubeId === "string" && YOUTUBE_ID_REGEX.test(youtubeId.trim());
}

// Spotify artist/track/album IDs are 22-character Base62 strings
export const SPOTIFY_ID_REGEX = /^[a-zA-Z0-9]{22}$/;

export function isValidSpotifyId(spotifyId) {
  return typeof spotifyId === "string" && SPOTIFY_ID_REGEX.test(spotifyId.trim());
}

function extractYoutubeId(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (isValidYoutubeId(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const candidate = url.pathname.split("/").filter(Boolean)[0] || "";
      return isValidYoutubeId(candidate) ? candidate : "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const byQuery = url.searchParams.get("v") || "";
      if (isValidYoutubeId(byQuery)) return byQuery;

      const parts = url.pathname.split("/").filter(Boolean);
      const byPath = parts[0] === "embed" || parts[0] === "shorts" ? (parts[1] || "") : "";
      return isValidYoutubeId(byPath) ? byPath : "";
    }
  } catch {
    return "";
  }

  return "";
}

export function normalizeArtist(input) {
  if (!input || typeof input !== "object") return null;

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const country = typeof input.country === "string" ? input.country.trim() : "";
  const genre = typeof input.genre === "string" ? input.genre.trim() : "";
  if (!name || !country || !genre) return null;

  const youtubeId = extractYoutubeId(input.youtubeId) || extractYoutubeId(input.youtubeUrl);
  const spotifyId = typeof input.spotifyId === "string" && isValidSpotifyId(input.spotifyId.trim())
    ? input.spotifyId.trim()
    : "";
  // An artist must have at least one playable identifier
  if (!youtubeId && !spotifyId) return null;
  const flag = typeof input.flag === "string" && input.flag.trim() ? input.flag.trim() : "🌍";
  const youtubeSearch = typeof input.youtubeSearch === "string" && input.youtubeSearch.trim()
    ? input.youtubeSearch.trim()
    : `${name} ${country} ${genre}`;
  const pieceTitle = typeof input.pieceTitle === "string" && input.pieceTitle.trim()
    ? input.pieceTitle.trim()
    : "";
  const pieceDescription = typeof input.pieceDescription === "string" && input.pieceDescription.trim()
    ? input.pieceDescription.trim()
    : "";

  return { name, country, genre, flag, youtubeId, youtubeSearch, spotifyId, pieceTitle, pieceDescription };
}

export function dedupeArtists(artists) {
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
