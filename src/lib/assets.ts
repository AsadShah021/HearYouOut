import fs from "node:fs";
import path from "node:path";

/**
 * Server-only check that a file under /public actually exists.
 *
 * Lets a page wire up an asset before the file has been supplied: the feature
 * stays switched off until someone drops the file in, then appears on the next
 * build with no code change. Evaluated at build time for static pages and per
 * request in development, so adding a file shows up immediately while running
 * `next dev`.
 */
export function publicAssetExists(assetPath?: string) {
  if (!assetPath) return false;

  try {
    // Strip the leading slash and any query so "/videos/x.mp4" resolves.
    const relative = assetPath.replace(/^\//, "").split("?")[0];
    return fs.existsSync(path.join(process.cwd(), "public", relative));
  } catch {
    return false;
  }
}
