"use server";

import { db } from "../../lib-core/db";
import { user, session } from "../../lib-core/db/schema";
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
  // 1. استخراج البيانات من النموذج
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 2. التحقق من صحة الإدخال
  if (!email || !password) {
    return { error: "البريد الإلكتروني وكلمة المرور مطلوبان" };
  }

  try {
    // 3. البحث عن المستخدم في قاعدة البيانات
    const existingUser = await db.select().from(user).where(eq(user.email, email));
    
    if (existingUser.length === 0) {
      return { error: "البريد الإلكتروني غير موجود" };
    }

    const userData = existingUser[0];

    // 4. التحقق من كلمة المرور باستخدام Argon2
    const validPassword = await verify(userData.hashedPassword, password);
    if (!validPassword) {
      return { error: "كلمة المرور غير صحيحة" };
    }

    // 5. إنشاء جلسة جديدة
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 يوم

    // 6. تخزين الجلسة في قاعدة البيانات
    await db.insert(session).values({
      id: sessionId,
      userId: userData.id,
      expiresAt,
    });

    // 7. تعيين الكوكي (مع خيارات واضحة)
    cookies().set({
      name: "session",
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    // 8. التوجيه إلى الصفحة الرئيسية
    redirect("/");
  } catch (error) {
    console.error("❌ Signin error:", error);
    return { error: "حدث خطأ في الخادم أثناء تسجيل الدخول" };
  }
}

export async function signOut() {
  cookies().delete("session");
  redirect("/sign-in");
}
