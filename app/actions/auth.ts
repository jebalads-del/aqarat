"use server";

import { db } from "../../lib/db";
import { user, session } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function generateId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "البريد الإلكتروني وكلمة المرور مطلوبان" };
  }

  const existingUser = await db.select().from(user).where(eq(user.email, email));
  if (existingUser.length === 0) {
    return { error: "البريد الإلكتروني غير موجود" };
  }

  const userData = existingUser[0];
  const validPassword = await verify(userData.hashedPassword, password);
  if (!validPassword) {
    return { error: "كلمة المرور غير صحيحة" };
  }

  const sessionId = generateId();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await db.insert(session).values({
    id: sessionId,
    userId: userData.id,
    expiresAt,
  });

  cookies().set({
    name: "session",
    value: sessionId,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  redirect("/");
}

export async function signOut() {
  cookies().delete("session");
  redirect("/sign-in");
}
