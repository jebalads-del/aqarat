"use server";

import { db } from "@/lib/db";
import { user, session, account, verification } from "@/lib/db/schema"; // تأكد من وجود هذه الجداول
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "جميع الحقول مطلوبة" };
  }

  const existingUser = await db.select().from(user).where(eq(user.email, email));
  if (existingUser.length > 0) {
    return { error: "البريد الإلكتروني مستخدم بالفعل" };
  }

  const hashedPassword = await hash(password);
  const userId = generateId(15);

  await db.insert(user).values({
    id: userId,
    email,
    name,
    hashedPassword,
  });

  // إنشاء جلسة (Session) لتسجيل الدخول التلقائي
  const sessionId = generateId(15);
  await db.insert(session).values({
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 يوم
  });

  cookies().set("session", sessionId, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
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

  const sessionId = generateId(15);
  await db.insert(session).values({
    id: sessionId,
    userId: userData.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  cookies().set("session", sessionId, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}

export async function signOut() {
  cookies().delete("session");
  redirect("/sign-in");
}
