# SnugTalk

A premium human connection platform. **We are the listeners** — a small in-house
team, not a marketplace. There is no recruitment funnel and no freelance roster.

Two ways in, deliberately different:

- **Chat is instant.** A visitor opens a chat from any page and starts writing. We
  read it and reply in the same thread. No appointment, no queue, no bot.
- **Meetings are by request.** Voice and Google Meet sessions are not self-serve.
  The person fills in a request form, we're notified, a human reads it, and we
  come back with a confirmed time and a calendar invitation.

> **SnugTalk is not therapy, counseling, or mental health treatment.** That line
> is load-bearing in this product and appears on the homepage, in the footer of
> every page, in the sign-up flow, and as section one of the Terms.

This repository is the **frontend only** — every form, booking and sign-in is
wired to a local simulation with a clearly marked TODO seam where your API goes.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, RSC, TypeScript strict) |
| Styling | Tailwind CSS v4 (`@theme inline`, OKLCH tokens) |
| Components | shadcn/ui conventions on Radix primitives |
| Animation | Framer Motion 12 (`MotionConfig reducedMotion="user"`) |
| Icons | lucide-react |
| Theming | next-themes, class strategy, no flash |
| Toasts | sonner |

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build
```

Other scripts: `npm run typecheck`, `npm run lint`, `npm start`.

> **Don't run `npm run build` while `npm run dev` is running.** Both write to
> `.next`, and building underneath a live dev server corrupts its cache — every
> route then fails with `Internal Server Error` or
> `Cannot find module './5611.js'`.
>
> To recover: stop the dev server, then
>
> ```bash
> rm -rf .next && npm run dev
> ```
>
> To check a build *without* disturbing a running dev server, build into a
> separate directory:
>
> ```bash
> NEXT_DIST_DIR=.next-verify npm run build
> ```

---

## Routes

**Marketing** — `src/app/(marketing)`

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, how it works, services, the team, bento features, testimonials, pricing, FAQ |
| `/chat` | **Live chat with a listener** — pre-chat capture, then a real thread |
| `/book` | **Meeting request form** — details, preferred days/times, then we confirm |
| `/services` | All eight conversation types with outcomes and opening prompts |
| `/listeners` | The team, filterable by focus area, language and format |
| `/pricing` | Three tiers, monthly/yearly toggle, full comparison matrix |
| `/about` | Why it exists, principles, how we listen, safety resources |
| `/privacy`, `/terms` | Policy pages |

A floating chat launcher sits on every marketing page (mounted client-side only,
and suppressed on `/chat` and both dashboards).

**Auth** — `src/app/(auth)`: `/sign-in`, `/sign-up`, `/forgot-password`
(split-screen layout with social buttons and validation).

**Member dashboard** — `src/app/dashboard`: overview (with pending-request
status), chat, sessions (confirmed / requested / past), notes, saved ideas,
favourite listeners, subscription, settings.

**Team dashboard** — `src/app/listener`: overview, **live chat inbox**,
**meeting-request queue with a scheduling dialog**, appointments, client notes,
availability editor, earnings, ratings & reviews, session history.

The request queue is the other half of the request flow: each entry shows who
asked, what for, the days and time windows they offered and their timezone.
Scheduling opens a dialog pre-filled with their first offered day and the
listener they asked for; confirming is where the calendar invite and Meet link
would be issued.

---

## Structure

```
src/
├── app/
│   ├── (marketing)/          # public pages — shares header + footer
│   ├── (auth)/               # split-screen auth layout
│   ├── dashboard/            # member app shell
│   ├── listener/             # listener app shell
│   ├── layout.tsx            # fonts, theme, motion + tooltip providers
│   ├── globals.css           # all design tokens live here
│   ├── error.tsx, not-found.tsx, sitemap.ts, robots.ts
├── components/
│   ├── ui/                   # shadcn primitives (21 components)
│   ├── brand/                # logo, avatars, theme + motion providers
│   ├── site/                 # header, footer
│   ├── chat/                 # chat panel + floating launcher widget
│   ├── marketing/            # landing + page sections
│   ├── booking/              # meeting request form and preferred-dates calendar
│   ├── dashboard/            # app shells, cards, charts, forms
│   ├── motion/               # Reveal / Stagger / AuroraBackdrop
│   └── shared/               # Section, ModeBadge, Rating
├── lib/
│   ├── data/                 # site config, plans, services, listeners, demo fixtures
│   ├── motion.ts             # shared variants and easings
│   ├── seo.tsx               # metadata factory + JSON-LD helpers
│   └── utils.ts
└── types/                    # every domain type in one file
```

---

## Design system

All tokens are defined once in `src/app/globals.css` and exposed to Tailwind via
`@theme inline`. Nothing is hardcoded in a component.

- **Colour** — OKLCH throughout. Indigo-violet primary carries trust and craft, a
  warm amber accent keeps the product human rather than clinical, and a calm teal
  signals privacy. Full light and dark ramps, plus semantic status colours.
- **Type** — Inter for UI, Instrument Serif italic for the emphasised phrase in
  display headlines. Headings get `-0.025em` tracking and `text-wrap: balance`.
- **Surfaces** — `.glass` and `.glass-strong` (backdrop blur + saturation),
  `.border-gradient` (masked 1px gradient hairline), `.bg-grid`, `.bg-dots`.
- **Motion** — six named keyframe animations (`aurora`, `float`, `shimmer`,
  `marquee`, `pulse-ring`, `waveform`) plus `Reveal`/`Stagger` scroll entrances.
  Reduced-motion is honoured in both CSS and Framer Motion.

Session formats have a colour identity used consistently everywhere — text is
teal, voice is violet, Meet audio is amber, Meet video is rose.

---

## Wiring it to a backend

Every simulated interaction is a `setTimeout` with a comment marking the seam:

| File | Replace with |
| --- | --- |
| `components/booking/meeting-request-form.tsx` → `handleSubmit()` | POST the request. **This handler is what notifies the team** and puts the entry in the queue. |
| `components/dashboard/request-queue.tsx` → `confirmSchedule()` | Create the session, generate the Meet link, send the calendar invite to both sides |
| `components/chat/chat-panel.tsx` → `respond()` | Your realtime channel — everything else in that file is production-shaped |
| `components/dashboard/team-chat-inbox.tsx` → `send()` | The team side of the same channel |
| `components/auth/auth-form.tsx` → `handleSubmit()` | Your auth provider |
| `components/dashboard/message-thread.tsx` → `send()` | Member-side realtime channel |
| `components/dashboard/settings-form.tsx`, `availability-editor.tsx` | Persistence |
| `lib/data/demo.ts` | Real members, requests and chats |
| `lib/data/listeners.ts` | Your actual team — the marketing stats derive from it |

`site.requestResponseTime` in `lib/data/site.ts` is the turnaround promised on
the request form, the confirmation screen, the FAQ and the Terms. Change it in
one place and all four update.

`sessionModes` carries a `booking: "instant" | "request"` flag — that single
field is what routes chat to `/chat` and everything else to `/book` across the
nav, the mode tiles and the how-it-works section.

`lib/data/site.ts` holds the brand constants — change `site.url` before deploying
so canonical URLs, the sitemap, and OG tags point at your domain.

---

## Accessibility & SEO

- Semantic landmarks, a skip link, `aria-current` on active nav, `aria-pressed`
  on toggle chips, labelled form controls, and visible focus rings on everything.
- Decorative avatars are `aria-hidden` so screen readers don't hear names twice.
- Per-page metadata via `createMetadata()`, plus Organization, Service and FAQPage
  JSON-LD on the landing page.
- `sitemap.xml` and `robots.txt` are generated; member and listener dashboards are
  disallowed from crawling and marked `noindex`.
- Every route renders its full content server-side — the marketing, auth and
  dashboard pages prerender to static HTML, and `/book` is server-rendered on
  demand so deep links like `/book?listener=l-mei&mode=meet-video` arrive
  pre-filled rather than being hydrated in.
