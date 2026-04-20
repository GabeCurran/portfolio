import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.URL ?? "http://localhost:3001/projects/pokednd";

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1800, height: 1200 });
const errs = [];
page.on("pageerror", (err) => errs.push(`[pageerror] ${err.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errs.push(`[console.error] ${msg.text()}`);
});

await page.goto(URL, { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 8000));

const figs = await page.evaluate(() => {
  const figures = Array.from(document.querySelectorAll("figure"));
  return figures.map((f, i) => {
    const svg = f.querySelector(".mermaid-render svg");
    return {
      index: i,
      hasSvg: !!svg,
      viewBox: svg?.getAttribute("viewBox"),
      caption: f.querySelector("figcaption")?.textContent?.slice(0, 100),
    };
  });
});
console.log(JSON.stringify(figs, null, 2));
if (errs.length) errs.forEach((e) => console.log(e));

const allSvgHtml = await page.evaluate(() => {
  const figures = Array.from(document.querySelectorAll("figure"));
  return figures.map((f) => f.querySelector(".mermaid-render svg")?.outerHTML ?? null);
});

for (let i = 0; i < figs.length; i++) {
  if (!figs[i].hasSvg) continue;
  const svgHtml = allSvgHtml[i];
  if (!svgHtml) continue;
  const isolated = `<!doctype html><html><head><style>body{margin:0;background:#2b2b2b;padding:20px;font-family:system-ui;}svg{display:block;}</style></head><body>${svgHtml}</body></html>`;
  await page.setContent(isolated);
  await new Promise((r) => setTimeout(r, 200));
  const dims = await page.evaluate(() => {
    const s = document.querySelector("svg");
    const r = s.getBoundingClientRect();
    return { w: Math.ceil(r.width) + 40, h: Math.ceil(r.height) + 40 };
  });
  await page.setViewport({ width: dims.w, height: dims.h });
  await new Promise((r) => setTimeout(r, 100));
  await page.screenshot({ path: `scripts/diagram-fig${i}.png`, fullPage: true });
  console.log(`Screenshot fig${i}: ${dims.w}x${dims.h}`);
}

await browser.close();
