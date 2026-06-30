"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء إنشاء الحساب");
        return;
      }

      // تسجيل الدخول التلقائي بعد إنشاء الحساب
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '20px',
      background: '#f5f5f5'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center' }}>
          ✨ إنشاء حساب جديد
        </h1>
        
        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c00', 
            padding: '10px', 
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            name="name"
            placeholder="الاسم الكامل" 
            style={{ 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              fontSize: '1rem'
            }}
            required
          />
          <input 
            type="email" 
            name="email"
            placeholder="البريد الإلكتروني" 
            style={{ 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              fontSize: '1rem'
            }}
            required
          />
          <input 
            type="password" 
            name="password"
            placeholder="كلمة المرور" 
            style={{ 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              fontSize: '1rem'
            }}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px', 
              background: loading ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          لديك حساب؟ <a href="/sign-in" style={{ color: '#0070f3' }}>تسجيل الدخول</a>
        </p>
      </div>
    </div>
  );
}
