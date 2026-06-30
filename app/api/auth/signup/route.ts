import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user, session } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";

function generateId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    const existingUser = await db.select().from(user).where(eq(user.email, email));
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await hash(password);
    const userId = generateId();

    // إنشاء المستخدم
    await db.insert(user).values({
      id: userId,
      email,
      name,
      hashedPassword,
    });

    // إنشاء جلسة (Session) لتسجيل الدخول التلقائي
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 يوم

    await db.insert(session).values({
      id: sessionId,
      userId,
      expiresAt,
    });

    // تعيين الكوكيز
    cookies().set("session", sessionId, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
