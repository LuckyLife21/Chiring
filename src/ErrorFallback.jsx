export default function ErrorFallback({ error, resetError }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Poppins', sans-serif", padding: 24, background: 'linear-gradient(160deg, #F0F8FF, #E8F4FF)', boxSizing: 'border-box',
    }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0A2540', marginBottom: 8 }}>Algo ha fallado</h1>
      <p style={{ fontSize: 15, color: '#555', marginBottom: 24, textAlign: 'center', maxWidth: 360 }}>
        Ha ocurrido un error inesperado. Puedes volver a intentar o ir al inicio.
      </p>
      {resetError && (
        <button
          type="button"
          onClick={resetError}
          style={{
            padding: '12px 24px', background: 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white',
            border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
          }}
        >
          Reintentar
        </button>
      )}
      <a
        href="/"
        style={{ marginTop: 16, fontSize: 14, color: '#0077B6', textDecoration: 'none' }}
      >
        Ir al inicio
      </a>
      <a href="/#contacto" style={{ marginTop: 8, fontSize: 14, color: '#0077B6', textDecoration: 'none' }}>
        Contacto
      </a>
    </div>
  )
}
