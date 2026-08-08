import { Router } from "express";
import { z } from "zod";

import { ApiError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const requestRoutes = Router();

requestRoutes.use(requireAuth);

const createBody = z.object({
  name: z.string().trim().min(1, "Tell us your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(191),
  topic: z.string().trim().min(1, "Tell us what you'd like to talk about").max(5000),
});

const withRequester = {
  id: true,
  reference: true,
  name: true,
  email: true,
  topic: true,
  status: true,
  scheduledFor: true,
  meetUrl: true,
  internalNote: true,
  createdAt: true,
  updatedAt: true,
  assignedListener: { select: { id: true, name: true } },
} as const;

/** Short, human-quotable, and unique enough not to collide in practice. */
function makeReference() {
  return `SNG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/* ------------------------------- Member side ------------------------------ */

/** Submit a meeting request. */
requestRoutes.post("/", async (req, res) => {
  const body = createBody.parse(req.body);

  const request = await prisma.meetingRequest.create({
    // userId comes from the session, never the body — otherwise anyone could
    // file a request in someone else's name.
    data: { ...body, reference: makeReference(), userId: req.user!.id },
    select: withRequester,
  });

  res.status(201).json({ request });
});

/** The caller's own requests. */
requestRoutes.get("/mine", async (req, res) => {
  const requests = await prisma.meetingRequest.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    select: withRequester,
  });
  res.json({ requests });
});

/* -------------------------------- Team side ------------------------------- */

const listQuery = z.object({
  status: z.enum(["NEW", "REVIEWING", "SCHEDULED", "DECLINED"]).optional(),
  open: z.coerce.boolean().optional(),
});

/** The team queue. Staff only — a member must never see other people's requests. */
requestRoutes.get("/", requireRole("LISTENER", "ADMIN"), async (req, res) => {
  const { status, open } = listQuery.parse(req.query);

  const requests = await prisma.meetingRequest.findMany({
    where: status
      ? { status }
      : open
        ? { status: { in: ["NEW", "REVIEWING"] } }
        : undefined,
    // Oldest first: whoever has waited longest gets answered first.
    orderBy: { createdAt: "asc" },
    select: withRequester,
  });

  res.json({ requests });
});

/** Express 5 types params loosely; validate rather than cast. */
const idParam = z.object({ id: z.string().min(1) });

const updateBody = z
  .object({
    status: z.enum(["NEW", "REVIEWING", "SCHEDULED", "DECLINED"]).optional(),
    scheduledFor: z.coerce.date().optional(),
    meetUrl: z.string().url().max(500).optional(),
    assignedListenerId: z.string().nullable().optional(),
    internalNote: z.string().max(5000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update" })
  .refine((v) => v.status !== "SCHEDULED" || !!v.scheduledFor, {
    message: "A scheduled request needs a date and time",
    path: ["scheduledFor"],
  });

/** Schedule, decline or reassign. Staff only. */
requestRoutes.patch("/:id", requireRole("LISTENER", "ADMIN"), async (req, res) => {
  const { id } = idParam.parse(req.params);
  const data = updateBody.parse(req.body);

  const existing = await prisma.meetingRequest.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("That request no longer exists");

  if (data.assignedListenerId) {
    const listener = await prisma.user.findUnique({ where: { id: data.assignedListenerId } });
    if (!listener || listener.role === "MEMBER") {
      throw ApiError.badRequest("That listener doesn't exist");
    }
  }

  const request = await prisma.meetingRequest.update({
    where: { id },
    data,
    select: withRequester,
  });

  res.json({ request });
});
