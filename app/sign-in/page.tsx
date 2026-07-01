import { signIn } from "../actions/auth";

export default function SignIn() {
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
          🔐 تسجيل الدخول
        </h1>

        <form action={signIn} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
            style={{ 
              padding: '12px', 
              background: '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}
          >
            دخول
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          ليس لديك حساب؟ <a href="/sign-up" style={{ color: '#0070f3' }}>إنشاء حساب</a>
        </p>
      </div>
    </div>
  );
}
