export type HighlightTerms = string[];
export type LinkConfig = { href: string; className?: string | string[]; target?: string; rel?: string };
export type LinkMap = Record<string, string | LinkConfig>;

export const HIGHLIGHT_TERMS: HighlightTerms = [
  "software engineer",
  "web apps",
  "games",
  "internal data tools",
  "database engineer",
  "WebstaurantStore",
  "Pokémon D&D",
  "Revelations",
  "connect",
];

export const LINKS: LinkMap = {
  "Drexel University": { href: "https://www.drexel.edu/", className: "college drexel", target: "_blank", rel: "noreferrer" },
  "WebstaurantStore": { href: "https://www.webstaurantstore.com/", className: "webstaurant", target: "_blank", rel: "noreferrer" },
};

// Custom inline tokens that render as raw HTML placeholders
const CUSTOM_TOKENS: Record<string, string> = {
  "[[LIFE_SECONDS]]": "<span class='life-seconds text-accent font-semibold'></span>",
};

export const INTRO_PARAGRAPHS: string[] = [
  "I'm a software engineer who works on web apps, games, and internal data tools. I'm currently a database engineer at WebstaurantStore, where I help maintain a lot of our web and database systems. Outside of work I'm building a Pokémon D&D web app with a friend, and a web-based PvP dueling game called Revelations. Feel free to check out my projects below, and reach out within the next [[LIFE_SECONDS]] seconds or so if you'd like to connect!",
];

export function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function segmentParagraph(p: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < p.length) {
    let matched = "";
    const candidateKeys = Array.from(new Set([
      ...HIGHLIGHT_TERMS,
      ...Object.keys(LINKS),
      ...Object.keys(CUSTOM_TOKENS),
    ])).sort((a, b) => b.length - a.length);
    for (const key of candidateKeys) {
      if (p.slice(i).toLowerCase().startsWith(key.toLowerCase())) {
        matched = p.substr(i, key.length);
        break;
      }
    }

    if (matched) {
      tokens.push(matched);
      i += matched.length;
      continue;
    }

  const ch = p[i];
    if (ch === " ") {
      let j = i + 1;
      while (j < p.length && p[j] === " ") j++;
      tokens.push(p.slice(i, j));
      i = j;
      continue;
    }

    if (/^[A-Za-z0-9]$/.test(ch)) {
      let j = i + 1;
      while (j < p.length && /[A-Za-z0-9'\-]/.test(p[j])) j++;
      tokens.push(p.slice(i, j));
      i = j;
      continue;
    }

    tokens.push(ch);
    i += 1;
  }
  return tokens;
}

function findCaseInsensitiveKey<T extends Record<string, unknown>>(obj: T, key: string): string | undefined {
  const lower = key.toLowerCase();
  return Object.keys(obj).find((k) => k.toLowerCase() === lower);
}

export function buildParagraphHTML(tokens: string[]): string {
  return tokens
    .map((t) => {
      if (Object.prototype.hasOwnProperty.call(CUSTOM_TOKENS, t)) {
        return CUSTOM_TOKENS[t];
      }
      const isHighlight = HIGHLIGHT_TERMS.some((k) => k.toLowerCase() === t.toLowerCase());
      const linkKey = findCaseInsensitiveKey(LINKS, t);

      if (!isHighlight && !linkKey) {
        return escapeHtml(t);
      }

      const spanClass = "highlighted";

      if (linkKey) {
        const entry = LINKS[linkKey];
        const cfg: LinkConfig = typeof entry === "string" ? { href: entry } : entry;
        const aClass = Array.isArray(cfg.className) ? cfg.className.join(" ") : (cfg.className ?? "");
        const href = escapeHtml(cfg.href);
        const rel = escapeHtml(cfg.rel ?? "noreferrer");
        const target = escapeHtml(cfg.target ?? "_blank");
        const classAttr = aClass ? ` class='${aClass}'` : "";
        return `<span class='${spanClass}'><a href='${href}'${classAttr} target='${target}' rel='${rel}'>${escapeHtml(t)}</a></span>`;
      }

      return `<span class='${spanClass}'>${escapeHtml(t)}</span>`;
    })
    .join("");
}
