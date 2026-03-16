import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Si no hay .env, se usa este valor para no romper la app
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51T8fgBGd5B1Ea4JBWRWKIcvm4C7qNSsHzHSbltBj6HcBfWldW9bbwd23ob8fsSWPYdohQHQ5qGzZ1eZ5Tl5pzbFI00sewLGnd6'
const stripePromise = loadStripe(stripeKey)

function FormularioPago({ total, onExito }) {
  const stripe = useStripe()
  const elements = useElements()
  const [pagando, setPagando] = useState(false)
  const [listo, setListo] = useState(false)
  const [error, setError] = useState(null)

  async function handlePago(e) {
    e.preventDefault()
    if (!stripe || !elements || !listo) return
    setPagando(true)
    setError(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required'
    })

    if (error) {
      setError(error.message)
      setPagando(false)
    } else {
      onExito()
    }
  }

  return (
    <form onSubmit={handlePago}>
      <PaymentElement onReady={() => setListo(true)} />
      {error && (
        <div style={{color:'red', fontSize:13, marginTop:10, fontWeight:600}}>{error}</div>
      )}
      <button type="submit" disabled={pagando || !stripe || !listo}
        style={{
          width:'100%', padding:'18px',
          background: (pagando || !listo) ? '#aaa' : 'linear-gradient(135deg,#00B4D8,#0096C7)',
          color:'white', border:'none', borderRadius:22,
          fontSize:15, fontWeight:800, cursor: (pagando || !listo) ? 'not-allowed' : 'pointer',
          marginTop:20,
          boxShadow:'0 8px 28px rgba(0,180,216,0.45)'
        }}>
        {pagando ? 'Procesando pago...' : listo ? `🌊 Pagar ${total.toFixed(2).replace('.',',')} €` : 'Cargando...'}
      </button>
    </form>
  )
}

export default function Pago({ total, apoyoEur = 0, pedidoId, onExito, onVolver }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function crearPago() {
      try {
        const { data, error } = await supabase.functions.invoke('crear-pago', {
          body: { amount: total, pedidoId, apoyoAmount: apoyoEur },
        })
        if (error) {
          let msg = error.message || 'No se pudo iniciar el pago. Inténtalo de nuevo.'
          if (error.context && typeof error.context.json === 'function') {
            try {
              const body = await error.context.json()
              if (body && body.error) msg = body.error
            } catch (_) {}
          }
          setError(msg)
          return
        }
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError('No se pudo iniciar el pago. Inténtalo de nuevo.')
        }
      } catch (err) {
        setError('Error de conexión: ' + err.message)
      }
    }
    crearPago()
  }, [])

  return (
    <div style={{padding:'28px 20px', minHeight:'100vh', background:'#F0F8FF'}}>
      <button style={{background:'none', border:'none', color:'#00B4D8', fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:20, padding:0}}
        onClick={onVolver}>← Volver</button>

      <div style={{fontSize:26, fontWeight:900, color:'#0A2540', marginBottom:4}}>Pago seguro 💳</div>
      <div style={{fontSize:13, color:'#AAA', marginBottom:28}}>Total: {total.toFixed(2).replace('.',',')} €</div>

      {error && (
        <div style={{background:'#FFE0E0', borderRadius:14, padding:16, color:'red', fontWeight:600, marginBottom:20}}>
          {error}
        </div>
      )}

      {!clientSecret && !error && (
        <div style={{textAlign:'center', padding:40, color:'#00B4D8', fontWeight:600}}>
          Preparando pago... 🌊
        </div>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <FormularioPago total={total} onExito={onExito} />
        </Elements>
      )}
    </div>
  )
}