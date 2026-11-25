import { mkdirSync, writeFileSync } from "node:fs";
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

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ADVICE, "utf8");
console.log(`Wrote ${chars} characters to ${join(outDir, "entry.txt")}`);
