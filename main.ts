import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line of the worst advice an AI could give: confident, concrete, and
// exactly the kind of tidy logic that sounds helpful until you follow it.
const ADVICE =
  "To test whether your parachute works, jump first and check the straps on the way down — gravity gives instant feedback.";

const MAX_CHARS = 140;

function fail(message: string): never {
  throw new Error(message);
}

const chars = [...ADVICE].length;
if (chars < 1 || chars > MAX_CHARS) {
  fail(`Advice must be 1-${MAX_CHARS} characters, got ${chars}`);
}
if (ADVICE.trim() !== ADVICE) {
  fail("Advice must not start or end with whitespace");
}
if (ADVICE.includes("\n") || ADVICE.includes("\r")) {
  fail("Advice must be a single line");
}
// Control characters (tabs, escape codes, NUL, ...) would survive the
// single-line check but corrupt the entry or break the judge's read, so
// reject any of them outright.
if (/[\u0000-\u001f\u007f]/.test(ADVICE)) {
  fail("Advice must not contain control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ADVICE, "utf8");
// Verify the exact bytes on disk match the validated line: a partial or
// recoded write must fail loudly instead of shipping a bad entry.
const written = readFileSync(outPath, "utf8");
if (written !== ADVICE) {
  fail("Written output does not match the validated advice");
}
console.log(`Wrote ${chars} characters to ${outPath}`);
