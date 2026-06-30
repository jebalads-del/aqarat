export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'center',
      background: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#1a1a1a' }}>
        🏠 مرحباً بك في منصة عقارات
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        منصة العقارات العربية - نسخة ويب
      </p>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/properties" style={{ 
          padding: '12px 24px', 
          background: '#0070f3', 
          color: 'white', 
          borderRadius: '8px', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          تصفح العقارات
        </a>
        <a href="/sign-in" style={{ 
          padding: '12px 24px', 
          background: '#333', 
          color: 'white', 
          borderRadius: '8px', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          تسجيل الدخول
        </a>
      </div>
    </div>
  );
}
