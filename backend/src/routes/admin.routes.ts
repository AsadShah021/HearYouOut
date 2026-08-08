import { Router } from "express";
import { z } from "zod";

import { ApiError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const adminRoutes = Router();

// Everything here is admin-only, including read access — user records and
// message volumes are not listener business.
adminRoutes.use(requireAuth, requireRole("ADMIN"));

const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

/* --------------------------------- Stats --------------------------------- */

/**
 * Everything the overview needs, and the counts the sidebar badges use.
 * One round trip rather than six.
 */
adminRoutes.get("/stats", async (_req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    members,
    listeners,
    admins,
    newThisWeek,
    openRequests,
    scheduledRequests,
    declinedRequests,
    waitingChats,
    activeChats,
    totalMessages,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "LISTENER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.meetingRequest.count({ where: { status: { in: ["NEW", "REVIEWING"] } } }),
    prisma.meetingRequest.count({ where: { status: "SCHEDULED" } }),
    prisma.meetingRequest.count({ where: { status: "DECLINED" } }),
    prisma.conversation.count({ where: { status: "WAITING" } }),
    prisma.conversation.count({ where: { status: "ACTIVE" } }),
    prisma.message.count(),
  ]);

  res.json({
    stats: {
      users: { members, listeners, admins, total: members + listeners + admins, newThisWeek },
      requests: { open: openRequests, scheduled: scheduledRequests, declined: declinedRequests },
      chats: { waiting: waitingChats, active: activeChats, messages: totalMessages },
    },
  });
});

/**
 * The "needs attention" feed — open tickets and unanswered chats, newest first.
 * This is what makes the panel feel like an inbox rather than a report.
 */
adminRoutes.get("/attention", async (_req, res) => {
  const [requests, chats] = await prisma.$transaction([
    prisma.meetingRequest.findMany({
      where: { status: { in: ["NEW", "REVIEWING"] } },
      orderBy: { createdAt: "asc" },
      take: 10,
      select: {
        id: true,
        reference: true,
        name: true,
        topic: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.conversation.findMany({
      where: { status: "WAITING" },
      orderBy: { lastMessageAt: "asc" },
      take: 10,
      select: {
        id: true,
        lastMessageAt: true,
        member: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { body: true },
        },
      },
    }),
  ]);

  res.json({ requests, chats });
});

/* --------------------------------- Users --------------------------------- */

const listQuery = z.object({
  q: z.string().trim().max(191).optional(),
  role: z.enum(["MEMBER", "LISTENER", "ADMIN"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

adminRoutes.get("/users", async (req, res) => {
  const { q, role, page, perPage } = listQuery.parse(req.query);

  const where = {
    ...(role ? { role } : {}),
    ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {}),
  };

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        ...publicUser,
        _count: { select: { requests: true, conversations: true, messages: true } },
      },
    }),
  ]);

  res.json({
    users,
    pagination: { page, perPage, total, pages: Math.max(1, Math.ceil(total / perPage)) },
  });
});

const idParam = z.object({ id: z.string().min(1) });

adminRoutes.get("/users/:id", async (req, res) => {
  const { id } = idParam.parse(req.params);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...publicUser,
      listenerProfile: {
        select: { slug: true, headline: true, bio: true, timezone: true, isOnShift: true },
      },
      requests: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          reference: true,
          topic: true,
          status: true,
          scheduledFor: true,
          createdAt: true,
        },
      },
      conversations: {
        orderBy: { lastMessageAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          lastMessageAt: true,
          _count: { select: { messages: true } },
        },
      },
      _count: { select: { requests: true, conversations: true, messages: true } },
    },
  });

  if (!user) throw ApiError.notFound("No such user");
  res.json({ user });
});

const updateUser = z.object({
  role: z.enum(["MEMBER", "LISTENER", "ADMIN"]),
});

adminRoutes.patch("/users/:id", async (req, res) => {
  const { id } = idParam.parse(req.params);
  const { role } = updateUser.parse(req.body);

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw ApiError.notFound("No such user");

  // Guard against locking yourself — and possibly everyone — out of the panel.
  if (target.id === req.user!.id && role !== "ADMIN") {
    throw ApiError.badRequest("You can't remove your own admin access");
  }
  if (target.role === "ADMIN" && role !== "ADMIN") {
    const admins = await prisma.user.count({ where: { role: "ADMIN" } });
    if (admins <= 1) throw ApiError.badRequest("There must always be at least one admin");
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: publicUser,
  });

  res.json({ user });
});
