import { Router } from "express";
import { z } from "zod";

import { ApiError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const conversationRoutes = Router();

conversationRoutes.use(requireAuth);

const messageSelect = {
  id: true,
  body: true,
  createdAt: true,
  readAt: true,
  sender: { select: { id: true, name: true, role: true } },
} as const;

const conversationSelect = {
  id: true,
  status: true,
  lastMessageAt: true,
  createdAt: true,
  member: { select: { id: true, name: true, email: true } },
  assignedListener: { select: { id: true, name: true } },
} as const;

/** True if the caller is allowed to read and post in this conversation. */
function canAccess(
  conversation: { memberId: string },
  user: { id: string; role: string },
) {
  return user.role !== "MEMBER" || conversation.memberId === user.id;
}

/* ------------------------------- Member side ------------------------------ */

/**
 * The caller's own thread, created on first use.
 *
 * One thread per member keeps the model simple: chat here is an ongoing
 * relationship, not a series of disposable tickets.
 */
conversationRoutes.get("/mine", async (req, res) => {
  const memberId = req.user!.id;

  let conversation = await prisma.conversation.findFirst({
    where: { memberId },
    orderBy: { createdAt: "desc" },
    select: conversationSelect,
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { memberId },
      select: conversationSelect,
    });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: 200,
    select: messageSelect,
  });

  res.json({ conversation, messages });
});

/* -------------------------------- Team side ------------------------------- */

/** The team inbox. Staff only. */
conversationRoutes.get("/", requireRole("LISTENER", "ADMIN"), async (_req, res) => {
  const conversations = await prisma.conversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    take: 100,
    select: {
      ...conversationSelect,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, sender: { select: { role: true } } },
      },
    },
  });

  res.json({ conversations });
});

/* --------------------------------- Shared -------------------------------- */

conversationRoutes.get("/:id/messages", async (req, res) => {
  const { id } = idParam.parse(req.params);
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: { id: true, memberId: true },
  });
  if (!conversation) throw ApiError.notFound("Conversation not found");
  if (!canAccess(conversation, req.user!)) throw ApiError.forbidden();

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: 200,
    select: messageSelect,
  });

  res.json({ messages });
});

/** Express 5 types params loosely; validate rather than cast. */
const idParam = z.object({ id: z.string().min(1) });

const postBody = z.object({
  body: z.string().trim().min(1, "Write something first").max(5000),
});

conversationRoutes.post("/:id/messages", async (req, res) => {
  const { id } = idParam.parse(req.params);
  const { body } = postBody.parse(req.body);

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: { id: true, memberId: true, assignedListenerId: true },
  });
  if (!conversation) throw ApiError.notFound("Conversation not found");
  if (!canAccess(conversation, req.user!)) throw ApiError.forbidden();

  const isStaff = req.user!.role !== "MEMBER";

  // One transaction: the message and the thread's derived state must not drift
  // apart if the second write fails.
  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: { conversationId: conversation.id, senderId: req.user!.id, body },
      select: messageSelect,
    }),
    prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        // A member writing puts the thread back in the queue; a listener
        // replying claims it if nobody had.
        status: isStaff ? "ACTIVE" : "WAITING",
        ...(isStaff && !conversation.assignedListenerId
          ? { assignedListenerId: req.user!.id }
          : {}),
      },
    }),
  ]);

  res.status(201).json({ message });
});
