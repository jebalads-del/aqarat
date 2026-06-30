import { NextResponse } from "next/server";

// بيانات تجريبية (سنستخدمها مؤقتاً)
const users: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // التحقق من صحة البيانات
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من تكرار البريد الإلكتروني
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // إنشاء مستخدم جديد (تجريبي)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // ملاحظة: في الحقيقة يجب تخزينها مشفرة
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    // محاكاة تخزين الجلسة
    const sessionId = "session_" + Date.now();

    // إرجاع استجابة نجاح مع بيانات المستخدم
    return NextResponse.json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      sessionId
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
