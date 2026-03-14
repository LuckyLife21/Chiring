export default function Terminos() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'Poppins', sans-serif", padding: '24px 20px 60px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" style={{ color: '#0077B6', fontSize: 14, fontWeight: 700, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>
          ← Volver al inicio
        </a>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0A2540', marginBottom: 8 }}>Términos de uso</h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>Última actualización: marzo 2025</p>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>1. Aceptación</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            El uso de Chiring (la “plataforma”) implica la aceptación de estos términos. La plataforma permite a los chiringuitos ofrecer pedidos desde la hamaca y a los clientes realizar y pagar pedidos desde el móvil.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>2. Uso del servicio</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            Debes usar el servicio de forma lícita y responsable. Es responsabilidad del chiringuito mantener sus datos, menú y hamacas actualizados. Los pagos se procesan a través de Stripe; se aplican sus condiciones en lo relativo al cobro.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>3. Precios y comisiones</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            El modelo de precios (por ejemplo, el porcentaje por pedido procesado) se comunica en la web y en el panel. Chiring se reserva el derecho de modificar precios con aviso previo cuando así lo indique la ley o el contrato.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>4. Contacto</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
            Para dudas sobre estos términos: <a href="mailto:appchiring@gmail.com" style={{ color: '#0077B6', fontWeight: 700 }}>appchiring@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
