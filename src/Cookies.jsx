export default function Cookies() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'Poppins', sans-serif", padding: '24px 20px 60px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" style={{ color: '#0077B6', fontSize: 14, fontWeight: 700, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>
          ← Volver al inicio
        </a>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0A2540', marginBottom: 8 }}>Cookies</h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>Última actualización: marzo 2025</p>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>¿Qué son las cookies?</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            Las cookies son pequeños archivos que el sitio web guarda en tu dispositivo para recordar preferencias, mantener la sesión o analizar el uso. En Chiring usamos solo las necesarias para que la web funcione correctamente.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>Cookies que utilizamos</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            <strong>Esenciales:</strong> sesión de usuario, preferencia de cookies (aceptar / solo esenciales / rechazar) y datos necesarios para el funcionamiento del panel y los pedidos. Sin ellas la web no podría ofrecer el servicio.
          </p>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginTop: 12 }}>
            Si aceptas “todas”, podríamos usar en el futuro cookies de análisis (por ejemplo para ver cómo se usa la web). Siempre puedes cambiar tu elección borrando la preferencia guardada o desde esta página.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>Cómo gestionar tus preferencias</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            Puedes borrar las cookies desde la configuración de tu navegador. Si vuelves a entrar en chiringapp.com, te volveremos a preguntar si aceptas cookies. Para dudas: <a href="mailto:appchiring@gmail.com" style={{ color: '#0077B6', fontWeight: 700 }}>appchiring@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
