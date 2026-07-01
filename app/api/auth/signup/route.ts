import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { user, session } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";

function generateId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  console.log("📨 Received signup request");
  
  try {
    // التحقق من وجود DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not defined");
      return NextResponse.json(
        { error: "خطأ في تكوين الخادم" },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log("📦 Request body:", { name: body.name, email: body.email });

    const { name, email, password } = body;

    if (!name || !email || !password) {
      console.error("❌ Missing fields");
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    console.log("🔍 Checking if user exists...");
    const existingUser = await db.select().from(user).where(eq(user.email, email));
    if (existingUser.length > 0) {
      console.error("❌ User already exists");
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    console.log("🔐 Hashing password...");
    const hashedPassword = await hash(password);
    const userId = generateId();

    // إنشاء المستخدم
    console.log("👤 Creating user...");
    await db.insert(user).values({
      id: userId,
      email,
      name,
      hashedPassword,
    });

    // إنشاء الجلسة
    console.log("🔑 Creating session...");
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db.insert(session).values({
      id: sessionId,
      userId,
      expiresAt,
    });

    // تعيين الكوكيز بالطريقة الصحيحة
    console.log("🍪 Setting cookie...");
    cookies().set({
      name: "session",
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    console.log("✅ Signup successful!");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
