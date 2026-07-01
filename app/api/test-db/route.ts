import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";

export async function GET() {
  try {
    // محاولة قراءة عدد المستخدمين من قاعدة البيانات
    const users = await db.select().from(user).limit(1);
    
    return NextResponse.json({
      success: true,
      message: "✅ قاعدة البيانات متصلة بنجاح!",
      usersCount: users.length,
      sample: users[0] || "لا يوجد مستخدمون بعد"
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "فشل الاتصال بقاعدة البيانات"
    }, { status: 500 });
  }
}
