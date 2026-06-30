export default function Properties() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif',
      padding: '20px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>
        🏠 قائمة العقارات
      </h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* هنا ستظهر العقارات من قاعدة البيانات */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>عقار 1</h3>
          <p>وصف العقار</p>
          <p style={{ color: '#0070f3', fontWeight: 'bold' }}>500,000 ريال</p>
        </div>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>عقار 2</h3>
          <p>وصف العقار</p>
          <p style={{ color: '#0070f3', fontWeight: 'bold' }}>750,000 ريال</p>
        </div>
      </div>
    </div>
  );
}
