// Helpers to detect provider and build embed URLs from a pasted video link.

export type VideoProvider = "youtube" | "vimeo" | "unknown";

export function detectProvider(url: string): VideoProvider {
  if (!url) return "unknown";
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("vimeo.com")) return "vimeo";
  return "unknown";
}

export function getYouTubeId(url: string): string | null {
  // Handles youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID
  const patterns = [
    /youtu\.be\/([\w-]{6,})/i,
    /[?&]v=([\w-]{6,})/i,
    /youtube\.com\/embed\/([\w-]{6,})/i,
    /youtube\.com\/shorts\/([\w-]{6,})/i,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return m ? m[1] : null;
}

export function getEmbedUrl(url: string): string | null {
  const provider = detectProvider(url);
  if (provider === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (provider === "vimeo") {
    const id = getVimeoId(url);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

export function getThumbnailUrl(url: string): string | null {
  const provider = detectProvider(url);
  if (provider === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
}
