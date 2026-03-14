export default function Privacidad() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'Poppins', sans-serif", padding: '24px 20px 60px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" style={{ color: '#0077B6', fontSize: 14, fontWeight: 700, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>
          ← Volver al inicio
        </a>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0A2540', marginBottom: 8 }}>Política de privacidad</h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>Última actualización: marzo 2025</p>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>1. Responsable</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            Los datos que nos facilitas son tratados por ChiringApp con la finalidad de prestar el servicio de pedidos desde la hamaca, gestión del panel del chiringuito y, en su caso, el programa de partners.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>2. Datos que recogemos</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            Recogemos los datos que nos indicas al registrarte (nombre, email, teléfono, ciudad, datos del negocio) y los necesarios para procesar pedidos y pagos (a través de Stripe). El tratamiento se basa en la ejecución del contrato y en tu consentimiento cuando así lo exija la ley.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>3. Conservación y derechos</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            Conservamos tus datos mientras mantengas una cuenta activa y, después, durante los plazos legales aplicables. Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación y portabilidad escribiendo a{' '}
            <a href="mailto:appchiring@gmail.com" style={{ color: '#0077B6', fontWeight: 700 }}>appchiring@gmail.com</a>. Tienes derecho a reclamar ante la autoridad de control.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>4. Contacto</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            Para cualquier duda sobre privacidad: <a href="mailto:appchiring@gmail.com" style={{ color: '#0077B6', fontWeight: 700 }}>appchiring@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
