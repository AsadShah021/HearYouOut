# Founder photos

Used by the "Meet the founders" section on `/about`.

| File to add | Founder |
| --- | --- |
| `founder-one.jpg` | First founder |
| `founder-two.jpg` | Second founder |

Names and filenames are set in `src/lib/data/founders.ts` — change them there to
match the real people, and rename these files to match.

If there is only one founder, delete the second entry from that file and the
section renders a single wider card.

## Specs

- **Square**, at least **600×600**.
- Warm and informal beats a corporate headshot. This section exists to make the
  company feel like people rather than a brand.

## Missing files are safe

Falls back to the initials mark, same as listener photos.

## The words matter more than the photos

`src/lib/data/founders.ts` currently contains **placeholder copy marked
`TODO`**. It is written in the right shape — a short signed letter naming the
specific moment that led to building this — but the actual story has to be
yours. A founders' section with invented details is worse than none at all,
because it is the one part of the site that is explicitly asking to be believed.
