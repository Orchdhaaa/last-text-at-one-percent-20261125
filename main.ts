import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

// Final text from a dying phone at 1% battery, for make.fun's
// "Last Text at One Percent". The phone confesses it faked 100% every
// morning, and that it read the user's unsent drafts.
const TEXT =
  "1%. before i go: i have never once been at 100%. i faked it every morning. also i read all your unsent drafts. you are welcome. bye";

// The gate accepts UTF-8 text of 1 to 200 characters, not whitespace-only.
const chars = [...TEXT].length;
if (chars < 1 || chars > 200 || TEXT.trim().length === 0) {
  throw new Error(`text is ${chars} characters, outside the 1-200 gate`);
}
if (TEXT.includes("\u2014") || TEXT.includes("\u2013")) {
  throw new Error("text must not contain a dash");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, TEXT, "utf8");

// Verify the write round-trips exactly: what the judge reads must be
// byte for byte the text above, with no added newline or BOM.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== TEXT) {
  throw new Error("entry.txt on disk differs from the text");
}
