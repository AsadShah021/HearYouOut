import { Router } from "express";
import { z } from "zod";

import { ApiError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const connectionRoutes = Router();

connectionRoutes.use(requireAuth);

const listenerCard = {
  id: true,
  name: true,
  listenerProfile: {
    select: {
      headline: true,
      bio: true,
      timezone: true,
      languages: true,
      specialties: true,
      isOnShift: true,
    },
  },
} as const;

const connectionSelect = {
  id: true,
  status: true,
  message: true,
  createdAt: true,
  respondedAt: true,
  member: { select: { id: true, name: true, email: true } },
  listener: { select: { id: true, name: true } },
} as const;

/* ------------------------------- Member side ------------------------------ */

/**
 * The listeners a member can choose from.
 *
 * Email is deliberately absent: members pick a person to talk to, not a way to
 * contact them off-platform.
 */
connectionRoutes.get("/listeners", async (req, res) => {
  const listeners = await prisma.user.findMany({
    where: { role: { in: ["LISTENER", "ADMIN"] } },
    orderBy: { name: "asc" },
    select: listenerCard,
  });

  // What the caller has already asked, so the UI can show per-listener state.
  const mine = await prisma.connectionRequest.findMany({
    where: { memberId: req.user!.id },
    select: { listenerId: true, status: true },
  });

  const byListener = Object.fromEntries(mine.map((r) => [r.listenerId, r.status]));

  res.json({
    listeners: listeners.map((listener) => ({
      ...listener,
      requestStatus: byListener[listener.id] ?? null,
    })),
  });
});

const createBody = z.object({
  listenerId: z.string().min(1),
  message: z.string().trim().max(2000).optional(),
});

/** Ask a listener to be yours. Asking again after a decline re-opens it. */
connectionRoutes.post("/", async (req, res) => {
  const { listenerId, message } = createBody.parse(req.body);

  const listener = await prisma.user.findUnique({
    where: { id: listenerId },
    select: { id: true, role: true, name: true },
  });
  if (!listener || listener.role === "MEMBER") {
    throw ApiError.badRequest("That person isn't a listener");
  }
  if (listener.id === req.user!.id) throw ApiError.badRequest("You can't request yourself");

  // Upsert on the unique pair: re-asking updates rather than piling up rows.
  const request = await prisma.connectionRequest.upsert({
    where: { memberId_listenerId: { memberId: req.user!.id, listenerId } },
    create: { memberId: req.user!.id, listenerId, message },
    update: { status: "PENDING", message, respondedAt: null },
    select: connectionSelect,
  });

  res.status(201).json({ request });
});

/** The caller's own requests, whatever their state. */
connectionRoutes.get("/mine", async (req, res) => {
  const requests = await prisma.connectionRequest.findMany({
    where: { memberId: req.user!.id },
    orderBy: { createdAt: "desc" },
    select: connectionSelect,
  });
  res.json({ requests });
});

/* ------------------------------ Listener side ----------------------------- */

const listQuery = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]).optional(),
});

/** Requests addressed to the signed-in listener. */
connectionRoutes.get("/", requireRole("LISTENER", "ADMIN"), async (req, res) => {
  const { status } = listQuery.parse(req.query);

  const requests = await prisma.connectionRequest.findMany({
    where: { listenerId: req.user!.id, ...(status ? { status } : {}) },
    // Oldest first: whoever has waited longest gets an answer first.
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    select: connectionSelect,
  });

  res.json({ requests });
});

const respondBody = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"]),
});

const idParam = z.object({ id: z.string().min(1) });

/**
 * Accept or decline.
 *
 * Accepting assigns this listener to the member's conversation — creating it if
 * the member has never opened chat — so the next thing they see is the right
 * name at the top of the thread.
 */
connectionRoutes.patch("/:id", requireRole("LISTENER", "ADMIN"), async (req, res) => {
  const { id } = idParam.parse(req.params);
  const { status } = respondBody.parse(req.body);

  const existing = await prisma.connectionRequest.findUnique({
    where: { id },
    select: { id: true, memberId: true, listenerId: true },
  });
  if (!existing) throw ApiError.notFound("That request no longer exists");

  // A listener answers their own requests, and nobody else's.
  if (existing.listenerId !== req.user!.id) {
    throw ApiError.forbidden("That request was sent to someone else");
  }

  const request = await prisma.connectionRequest.update({
    where: { id },
    data: { status, respondedAt: new Date() },
    select: connectionSelect,
  });

  if (status === "ACCEPTED") {
    let conversation = await prisma.conversation.findFirst({
      where: { memberId: existing.memberId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { memberId: existing.memberId },
        select: { id: true },
      });
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { assignedListenerId: req.user!.id },
    });
  }

  res.json({ request });
});
