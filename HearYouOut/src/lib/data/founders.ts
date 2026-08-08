import type { Founder } from "@/types";

/**
 * Real people, real photos. The `letter` for each is still empty — that copy has
 * to be written by the founders themselves.
 *
 * This section is the one part of the site that explicitly asks to be believed,
 * so an invented origin story here does more damage than having no story at all.
 * The section renders the photos and names now; each letter appears on the page
 * the moment its array has paragraphs in it.
 *
 * What makes a letter work when you write it:
 *   - One specific moment, with details. Not "we saw a need in the market".
 *   - What you tried first and why it didn't help.
 *   - Say plainly that you are not therapists and never claimed to be.
 *   - Under ~180 words each. Longer reads as marketing.
 *   - Don't write them as a matched pair — two people who sound identical read
 *     as one person writing twice.
 */
/** Order matters — this is the order they appear on /about. */
export const founders: Founder[] = [
  {
    id: "shafqat-jamil",
    // Spelling taken from the uploaded photo filename (shafqat_jamil.png).
    name: "Shafqat Jamil",
    role: "Founder",
    photo: "/images/founders/shafqat_jamil.png",
    letter: [],
    signature: "Shafqat",
  },
  {
    id: "asad-shah",
    name: "Asad Shah",
    role: "Co-founder",
    photo: "/images/founders/asad_shah.png",
    letter: [],
    signature: "Asad",
  },
];

/** True once the photos and names are real — the letters can follow. */
export const foundersReady = true;
