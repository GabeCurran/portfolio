import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.URL ?? "http://localhost:3000/projects/pokednd";
const TAG = process.env.TAG ?? "current";

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1800, height: 1200 });

const errs = [];
page.on("pageerror", (err) => errs.push(`[pageerror] ${err.message}`));

try {
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 6000));

  // Pull the raw SVG out and render it at natural size into a fresh page
  const svgInfo = await page.evaluate(() => {
    const fig = Array.from(document.querySelectorAll("figure")).find((f) =>
      f.querySelector(".mermaid-render svg")
    );
    const svg = fig?.querySelector("svg");
    if (!svg) return null;
    return {
      svg: svg.outerHTML,
      viewBox: svg.getAttribute("viewBox"),
      width: svg.getBoundingClientRect().width,
      height: svg.getBoundingClientRect().height,
    };
  });

  if (!svgInfo) {
    console.log("No SVG found");
    if (errs.length) errs.forEach((e) => console.log(e));
  } else {
    console.log("viewBox:", svgInfo.viewBox);
    // Render the bare SVG on a fresh page, no TransformWrapper, full natural size
    const isolatedHtml = `<!doctype html><html><head>
      <style>
        body { margin:0; background:#2b2b2b; padding:20px; font-family: system-ui; }
        svg { display:block; }
      </style></head><body>${svgInfo.svg}</body></html>`;
    await page.setContent(isolatedHtml);
    await new Promise((r) => setTimeout(r, 200));
    const dims = await page.evaluate(() => {
      const s = document.querySelector("svg");
      const r = s.getBoundingClientRect();
      return { w: Math.ceil(r.width) + 40, h: Math.ceil(r.height) + 40 };
    });
    await page.setViewport({ width: dims.w, height: dims.h });
    await new Promise((r) => setTimeout(r, 100));
    const out = `scripts/diagram-${TAG}.png`;
    await page.screenshot({ path: out, fullPage: true });
    console.log(`Screenshot: ${out}  (${dims.w}x${dims.h})`);
  }
} finally {
  await browser.close();
}
