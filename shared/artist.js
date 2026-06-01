export const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function isValidYoutubeId(youtubeId) {
  return typeof youtubeId === "string" && YOUTUBE_ID_REGEX.test(youtubeId.trim());
}

export function normalizeArtist(input) {
  if (!input || typeof input !== "object") return null;

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const country = typeof input.country === "string" ? input.country.trim() : "";
  const genre = typeof input.genre === "string" ? input.genre.trim() : "";
  if (!name || !country || !genre) return null;

  const youtubeIdRaw = typeof input.youtubeId === "string" ? input.youtubeId.trim() : "";
  const youtubeId = isValidYoutubeId(youtubeIdRaw) ? youtubeIdRaw : "";
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

  return { name, country, genre, flag, youtubeId, youtubeSearch, pieceTitle, pieceDescription };
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
