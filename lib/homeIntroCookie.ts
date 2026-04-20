const COOKIE_NAME = "gc_home_intro_seen";
const TTL_SECONDS = 60 * 60;

export function hasRecentHomeIntro(): boolean {
  if (typeof document === "undefined") return false;
  const prefix = `${COOKIE_NAME}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      const value = trimmed.slice(prefix.length);
      return value === "1";
    }
  }
  return false;
}

export function markHomeIntroSeen(): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=1; Max-Age=${TTL_SECONDS}; Path=/; SameSite=Lax${secure}`;
}
