import { useState, useEffect } from 'react'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'
import { supabase } from './supabase'

export default function Panel() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  async function cargarPedidos() {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        hamacas (numero),
        pedido_items (
          cantidad,
          precio_unitario,
          productos (nombre)
        )
      `)
      .order('created_at', { ascending: false })

    if (!error) setPedidos(data)
    setLoading(false)
  }

  useEffect(() => {
    cargarPedidos()

    const canal = supabase
      .channel('pedidos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pedidos'
      }, () => cargarPedidos())
      .subscribe()

    return () => supabase.removeChannel(canal)
  }, [])

  async function cambiarEstado(id, estado) {
    await supabase.from('pedidos').update({ estado }).eq('id', id)
    cargarPedidos()
  }

  const colores = {
    pendiente_pago: { bg:'#FFE8D6', color:'#7C3A00', label:'⏳ PENDIENTE PAGO' },
    pendiente: { bg:'#FFF3CD', color:'#856404', label:'🔴 NUEVO' },
    preparando: { bg:'#CCE5FF', color:'#004085', label:'🟡 PREPARANDO' },
    entregado: { bg:'#D4EDDA', color:'#155724', label:'✅ ENTREGADO' },
  }

  return (
    <div style={s.bg}>
      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.logo}>🌊 ChiringApp</div>
            <div style={s.logoSub}>Panel del Chiringuito · Playa Sol</div>
          </div>
          <div style={s.live}>● EN VIVO</div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.statsRow}>
          <div style={s.stat}>
            <div style={s.statNum}>{pedidos.filter(p=>p.estado==='pendiente').length}</div>
            <div style={s.statLabel}>Nuevos</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>{pedidos.filter(p=>p.estado==='preparando').length}</div>
            <div style={s.statLabel}>Preparando</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>{pedidos.filter(p=>p.estado==='entregado').length}</div>
            <div style={s.statLabel}>Entregados</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>
              {pedidos.filter(p=>p.estado==='entregado')
                .reduce((s,p)=>s+Number(p.total),0)
                .toFixed(0)}€
            </div>
            <div style={s.statLabel}>Recaudado</div>
          </div>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:40,color:'#00B4D8',fontWeight:600}}>
            Cargando pedidos... 🌊
          </div>
        ) : pedidos.length === 0 ? (
          <div style={{textAlign:'center',padding:60,color:'#aaa'}}>
            <div style={{fontSize:48,marginBottom:12}}>🏖️</div>
            <div style={{fontWeight:600}}>Esperando pedidos...</div>
          </div>
        ) : (
          pedidos.map(pedido => {
            const c = colores[pedido.estado] || colores.pendiente
            return (
              <div key={pedido.id} style={{...s.card, background: c.bg}}>
                <div style={s.cardTop}>
                  <div>
                    <span style={{...s.estadoBadge, color: c.color}}>{c.label}</span>
                    <div style={s.hamacaLabel}>🪑 Hamaca {pedido.hamacas?.numero}</div>
                  </div>
                  <div style={{...s.total, color: c.color}}>
                    {Number(pedido.total).toFixed(2).replace('.',',')} €
                  </div>
                </div>

                <div style={s.itemsList}>
                  {pedido.pedido_items?.map((item, i) => (
                    <div key={i} style={s.itemRow}>
                      <span style={s.itemQty}>{item.cantidad}x</span>
                      <span style={s.itemName}>{item.productos?.nombre}</span>
                      <span style={s.itemPrice}>{(item.cantidad * item.precio_unitario).toFixed(2).replace('.',',')} €</span>
                    </div>
                  ))}
                </div>

                <div style={s.btnRow}>
                  {pedido.estado === 'pendiente_pago' && (
                    <div style={{fontSize:13, color:'#7C3A00', fontWeight:600, textAlign:'center'}}>
                      Esperando pago del cliente...
                    </div>
                  )}
                  {pedido.estado === 'pendiente' && (
                    <button style={{...s.btn, background:'#0096C7'}}
                      onClick={()=>cambiarEstado(pedido.id,'preparando')}>
                      👨‍🍳 Aceptar pedido
                    </button>
                  )}
                  {pedido.estado === 'preparando' && (
                    <button style={{...s.btn, background:'#28a745'}}
                      onClick={()=>cambiarEstado(pedido.id,'entregado')}>
                      ✅ Marcar entregado
                    </button>
                  )}
                  {pedido.estado === 'entregado' && (
                    <div style={{fontSize:13,color:'#155724',fontWeight:600,textAlign:'center'}}>
                      Pedido completado 🎉
                    </div>
                  )}
                </div>

                <div style={s.fecha}>
                  {new Date(pedido.created_at).toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const s = {
  bg:{ minHeight:'100vh', background:'#F0F8FF' },
  header:{ background:'linear-gradient(135deg,#00B4D8,#0096C7)', padding:'24px 20px', color:'white' },
  headerInner:{ display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:600, margin:'0 auto' },
  logo:{ fontSize:22, fontWeight:900, letterSpacing:-0.5 },
  logoSub:{ fontSize:12, opacity:0.75, marginTop:3 },
  live:{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:700, color:'#90FF90' },
  body:{ maxWidth:600, margin:'0 auto', padding:'20px 16px' },
  statsRow:{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:10, marginBottom:24 },
  stat:{ background:'white', borderRadius:16, padding:'14px 10px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' },
  statNum:{ fontSize:22, fontWeight:900, color:'#00B4D8' },
  statLabel:{ fontSize:11, color:'#aaa', fontWeight:600, marginTop:2 },
  card:{ borderRadius:20, padding:18, marginBottom:14, boxShadow:'0 2px 10px rgba(0,0,0,0.06)' },
  cardTop:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 },
  estadoBadge:{ fontSize:13, fontWeight:800, display:'block', marginBottom:4 },
  hamacaLabel:{ fontSize:16, fontWeight:900, color:'#0A2540' },
  total:{ fontSize:22, fontWeight:900 },
  itemsList:{ marginBottom:14 },
  itemRow:{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' },
  itemQty:{ fontSize:14, fontWeight:800, color:'#00B4D8', minWidth:28 },
  itemName:{ fontSize:14, fontWeight:600, color:'#0A2540', flex:1 },
  itemPrice:{ fontSize:13, fontWeight:700, color:'#666' },
  btnRow:{ marginTop:8 },
  btn:{ width:'100%', padding:'12px', color:'white', border:'none', borderRadius:14, fontSize:14, fontWeight:700, cursor:'pointer' },
  fecha:{ fontSize:11, color:'#999', textAlign:'right', marginTop:8 },
}