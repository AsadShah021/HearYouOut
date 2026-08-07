/**
 * Shared between the client auth provider and the edge middleware, so it must
 * NOT be a `"use client"` module — importing one of those into middleware hands
 * back a client reference rather than the string, and every cookie check
 * silently fails.
 */
export const SESSION_COOKIE = "hmo_session";
