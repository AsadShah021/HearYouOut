# Testing-phase scope

The product sits behind an account. A visitor can read the landing page and
sign up or log in; **messaging and scheduling require an account**. Nothing was
deleted — everything below is parked in place, still type-checked and linted,
and comes back by undoing one small step.

## Public

| Route | What it is |
| --- | --- |
| `/` | Landing — hero, how it works, testimonials, not-therapy, safety, FAQ, CTA. Every call to action goes to **Get started** or **Log in**. |
| `/sign-up`, `/sign-in`, `/forgot-password` | Account creation and login |
| `/privacy`, `/terms` | Legal |

## Requires an account

Enforced in `src/middleware.ts`. Signed-out visitors are redirected to
`/sign-in?next=<where-they-were-going>` and land there after logging in.
Signed-in users hitting `/sign-in` or `/sign-up` are sent to `/dashboard`.

| Route | What it is |
| --- | --- |
| `/dashboard` | Two actions: send a message, schedule a meeting |
| `/chat` | Send a message — name and email are taken from the session, so there's no "who are you" step |
| `/book` | Schedule a meeting: **name, email, topic** (name and email prefilled) |
| `/dashboard/*` | Other member pages — routable, not linked |
| `/listener/*` | Team dashboard — routable, not linked |

## Auth is a front-end mock

`src/lib/auth.tsx` writes a cookie (`hmo_session`) and a localStorage record.
Nothing is verified and **anyone can set that cookie by hand — it is not
security**. It exists so middleware can redirect on the server before a
protected page renders, instead of flashing protected UI and then bouncing.

When the backend lands: replace `signIn`/`signUp` with real calls and have the
server set an httpOnly cookie. Middleware, route protection and every component
using `useAuth()` can stay exactly as they are.

The cookie name lives in `src/lib/session.ts` rather than `auth.tsx` because
middleware cannot import a `"use client"` module — doing so hands back a client
reference instead of the string, and every cookie check silently fails.

## Parked routes

Next.js ignores any folder starting with `_`, so these keep their code but serve
no URL. **To restore: drop the underscore from the folder name.**

| Folder | Route it restores |
| --- | --- |
| `src/app/(marketing)/_about/` | `/about` |
| `src/app/(marketing)/_pricing/` | `/pricing` |
| `src/app/(marketing)/_services/` | `/services` |
| `src/app/(marketing)/_listeners/` | `/listeners` and `/listeners/[slug]` |

After restoring a route, also add its entry back to:

- `mainNav` / `footerNav` in `src/lib/data/site.ts`
- the `routes` array in `src/app/sitemap.ts`

## Parked: the full member dashboard

`/dashboard` now shows two action cards and nothing else.

The previous overview — next session, standing check-in, pending request,
session stats, coming-up list, recent notes, subscription usage, saved ideas and
favourite listeners — is preserved at `src/app/dashboard/page.full.tsx`.
Next treats `page.full.tsx` as an ordinary module, not a route, so it ships
nothing. To restore, copy its contents over `page.tsx` and put the parked nav
items back in `components/dashboard/member-shell.tsx`.

## Parked landing sections

Components still exist and are unchanged — they are simply not imported by
`src/app/(marketing)/page.tsx`. Add the import and one line to restore:

- `<ConversationModes />` — `components/marketing/conversation-modes.tsx`
- `<ServicesGrid />` — `components/marketing/services-grid.tsx`
- `<FeaturedListeners />` — `components/marketing/featured-listeners.tsx`
- `<FeatureBento />` — `components/marketing/feature-bento.tsx`
- `<PricingSection />` — `components/marketing/pricing-section.tsx`
- `<ChatWidget />` — `components/chat/chat-widget.tsx`, removed from
  `app/(marketing)/layout.tsx`. Chat is behind auth now, so the public floating
  launcher would only bounce visitors to the login page.

These three still link to parked routes, which is fine while they are unused —
check their hrefs when you restore them.

## Parked: the full request form

`/book` now collects **name, email, topic** only.

The richer version is preserved at
`src/components/booking/meeting-request-form.full.tsx` — session format,
topic from the services list, preferred dates, times of day, urgency, preferred
listener, feedback mode, anonymous mode, and recurring check-in cadence.

To restore, in `src/app/(marketing)/book/page.tsx` swap:

```ts
import { MeetingRequestForm } from "@/components/booking/meeting-request-form";
```

for:

```ts
import { MeetingRequestFormFull as MeetingRequestForm } from "@/components/booking/meeting-request-form.full";
```

It reads the topic list from `src/lib/data/services.ts`, so restore the
`/services` route at the same time.

## Kept but no longer surfaced

Nothing here was changed — it is just not reachable from the navigation:

- **All 15 services** — `src/lib/data/services.ts` is intact, including the
  harassment category with its scope-limits panel.
- **The 9 listeners** — `src/lib/data/listeners.ts`, plus photos and the intro
  video wiring.
- **The 3 plans** — `src/lib/data/plans.ts`.
- **Founders** — `src/lib/data/founders.ts` and the `Founders` section, which
  rendered on the parked `/about`.
- **Both dashboards**, including the meeting request queue and team chat inbox.

## Moved rather than parked

The **safety and crisis resources** block used to live on `/about#safety`. Since
that page is parked and the disclaimer and helplines are not optional on a
service like this, it moved to the landing page as
`components/marketing/safety-section.tsx`. Every `#safety` link now points at
`/#safety`.
