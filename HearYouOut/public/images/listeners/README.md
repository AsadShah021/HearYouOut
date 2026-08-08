# Listener photos

Drop each listener's photo here. **The filename must match the listener's `slug`**
in `src/lib/data/listeners.ts` — nothing else needs changing in code.

| File to add | Listener |
| --- | --- |
| `amara-okonkwo.jpg` | Amara Okonkwo |
| `daniel-reyes.jpg` | Daniel Reyes |
| `mei-lin-zhao.jpg` | Mei Lin Zhao |
| `priya-raghavan.jpg` | Priya Raghavan |
| `tomas-nogueira.jpg` | Tomás Nogueira |
| `hannah-whitfield.jpg` | Hannah Whitfield |
| `yuki-tanaka.jpg` | Yuki Tanaka |
| `marcus-bell.jpg` | Marcus Bell |
| `sofia-andersson.jpg` | Sofia Andersson |

Also add, for the listener who has an intro video:

| File to add | Used for |
| --- | --- |
| `amara-okonkwo-poster.jpg` | The still frame shown before the intro video plays |

## Specs

- **Square**, at least **800×800** (they render up to 448px on the profile page, at 2× for retina).
- **JPG** preferred. If you supply `.png` or `.webp` instead, update the file
  extension in the `avatar` field in `src/lib/data/listeners.ts`.
- Face roughly centred and filling the frame — these crop to a circle in the
  directory and to a rounded square on the profile page.
- Under ~300 KB each. Next.js re-encodes to AVIF/WebP on the fly, but the
  source still gets read on every build.

## Missing files are safe

Any photo that isn't here falls back automatically to the generated gradient
mark with the listener's initials. Nothing breaks, nothing 404s visibly — so you
can add these one at a time.

## Before launch

These must be photographs of the actual people on your team. Stock photos of
strangers presented as your listeners is misrepresentation, and it undermines
exactly the trust this change exists to build.
