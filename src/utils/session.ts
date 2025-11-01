import { db } from "@/db";
import { users } from "@/db/schema";
import { sessions } from "@/db/schema/sessions";
import crypto from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { FastifyReply } from "fastify";

export const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000;

function generateSessionToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

async function createSession(reply: FastifyReply, userId: string) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const [session] = await db
    .insert(sessions)
    .values({
      token,
      userId,
      expiresAt,
    })
    .returning();

  reply.setCookie("session_token", session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRATION_IN_MILLISECONDS,
  });

  return session;
}

async function getUserSession(sessionToken: string) {
  const [session] = await db
    .select({
      session: sessions,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(eq(sessions.token, sessionToken), gt(sessions.expiresAt, new Date()))
    )
    .limit(1);

  return session;
}

async function deleteSession(sessionToken: string) {
  await db.delete(sessions).where(eq(sessions.token, sessionToken));
}

const session = {
  createSession,
  deleteSession,
  getUserSession,
};

export default session;
