export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Poppins', sans-serif", padding: 24, background: 'linear-gradient(160deg, #F0F8FF, #E8F4FF)', boxSizing: 'border-box',
    }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🌊</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0A2540', marginBottom: 8 }}>Página no encontrada</h1>
      <p style={{ fontSize: 16, color: '#555', marginBottom: 32, textAlign: 'center' }}>
        La ruta que buscas no existe o ha cambiado.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-block', padding: '14px 28px', background: 'linear-gradient(135deg,#00B4D8,#0077B6)',
          color: 'white', borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 700, fontFamily: "'Poppins', sans-serif",
        }}
      >
        Volver al inicio
      </a>
      <a href="/#contacto" style={{ marginTop: 16, fontSize: 14, color: '#0077B6', textDecoration: 'none' }}>
        Contacto
      </a>
    </div>
  )
}
