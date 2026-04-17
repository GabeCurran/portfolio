import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const projects = [
  { slug: "pokednd", url: "https://pokednd.live/" },
  { slug: "revelations", url: "https://revelations.quest/" },
  { slug: "lingolyrics", url: "https://lingolyrics.vercel.app/" },
  { slug: "starworks", url: "https://starworks-studios.com/" },
  { slug: "blockverse", url: "https://blockverseproductions.com/" },
  // vy is excluded — the public site is just a password gate; we use a hardcoded
  // screenshot of the authenticated flower-journal view at public/img/previews/vy.png
  { slug: "gen1ify", url: "https://modrinth.com/datapack/gen1ify" },
  // dark is excluded — it's a YouTube short, not a webpage. Thumbnail is
  // pulled from img.youtube.com/vi/6cB0NbZ2yUs/maxresdefault.jpg (one-off).
  { slug: "seniorcare", url: "https://care-of-yore.herokuapp.com/" },
];

const OUT_DIR = path.join(process.cwd(), "public", "img", "previews");
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

for (const { slug, url } of projects) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  try {
    console.log(`→ ${slug}  ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));
    const out = path.join(OUT_DIR, `${slug}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`  ok  ${out}`);
  } catch (err) {
    console.error(`  !!  ${slug}: ${err.message}`);
  }
  await page.close();
}

await browser.close();
console.log("done.");
