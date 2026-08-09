# Listener intro videos

One video is wired up for now — Amara Okonkwo, the featured listener. Drop the
file here with this exact name:

| File to add | Listener |
| --- | --- |
| `amara-okonkwo-intro.mp4` | Amara Okonkwo |

The poster (still frame shown before playback) goes in
`public/images/listeners/amara-okonkwo-poster.jpg`.

## Specs

- **30–60 seconds.** Longer and people don't finish it.
- **MP4 / H.264 + AAC** — the only combination every browser plays natively.
- **1080×1080 (square) or 1080×1350 (4:5).** The player is portrait-ish, so a
  landscape 16:9 video will letterbox badly.
- Target **under 15 MB**. These are served straight from the origin, not a CDN
  transcoder, so the file size is what every visitor downloads.
- Their own face, their own voice, in one take. Polish is not the point —
  this is the trust signal precisely because it is unmistakably a real person.

## Captions are required, not optional

Add `amara-okonkwo-intro.vtt` alongside the video (WebVTT format). A video that
is the primary trust signal cannot be inaccessible to deaf and hard-of-hearing
visitors, and it is also what lets the content be read with the sound off —
which is how a large share of people will first encounter it.

A plain-text transcript also goes in `introTranscript` in
`src/lib/data/listeners.ts`, shown under the player.

## Missing files are safe

Until the video is here the profile page shows the photo (or gradient mark) with
no player, and no broken element. Adding the file is all that's needed to turn
the player on.

## Adding more later

1. Drop `<slug>-intro.mp4` here and `<slug>-poster.jpg` in `public/images/listeners/`.
2. Add `introVideo`, `introPoster` and `introTranscript` to that listener in
   `src/lib/data/listeners.ts`.

No component changes needed.
