/**
 * Download Stitch screen HTML + screenshot for the blog index.
 * Usage: STITCH_API_KEY=re_... node scripts/fetch-stitch-blog.mjs
 */
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const PROJECT_ID = "15139511264767244910";
const SCREEN_ID = "210256264b3b4233a68661215081f59b";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "stitch");

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log("Wrote", dest);
}

async function main() {
  if (!process.env.STITCH_API_KEY?.trim()) {
    console.error("Set STITCH_API_KEY (from stitch.withgoogle.com → API Keys).");
    process.exit(1);
  }

  const { stitch } = await import("@google/stitch-sdk");
  const project = stitch.project(PROJECT_ID);
  const screen = await project.getScreen(SCREEN_ID);
  const htmlUrl = await screen.getHtml();
  const imageUrl = await screen.getImage();

  await mkdir(OUT_DIR, { recursive: true });
  await download(htmlUrl, join(OUT_DIR, "blog-index.html"));
  await download(imageUrl, join(OUT_DIR, "blog-index.png"));
  console.log("Done. Reference files in public/stitch/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
