import { useState, useEffect } from 'react'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'
import { supabase } from './supabase'
import Pago from './Pago'

const cats = [
  {id:'all', label:'Todo', emoji:'🍽️'},
  {id:'cervezas', label:'Cervezas', emoji:'🍺'},
  {id:'bebidas', label:'Bebidas', emoji:'🥤'},
  {id:'comida', label:'Comida', emoji:'🍟'},
  {id:'helados', label:'Helados', emoji:'🍦'},
]

function Logo() {
  return (
    <div style={{display:'flex', alignItems:'center', gap:8}}>
      <div style={{width:42,height:42,borderRadius:14,background:'white',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 15px rgba(0,0,0,0.15)',fontSize:24}}>🌊</div>
      <div>
        <div style={{fontSize:26,fontWeight:900,color:'white',letterSpacing:-1,lineHeight:1}}>
          Chiring<span style={{color:'#B2F0FB'}}>App</span>
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.75)',fontWeight:500,marginTop:2}}>
          Chiringuito Playa Sol · Malvarrosa
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const hamacaUrl = window.location.pathname.split('/hamaca/')[1] || '14B'
  const hamacaNum = decodeURIComponent(hamacaUrl)

  const [cat, setCat] = useState('all')
  const [cart, setCart] = useState({})
  const [screen, setScreen] = useState('menu')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [pedidoId, setPedidoId] = useState(null)

  useEffect(() => {
    async function cargarProductos() {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('disponible', true)
      if (!error) setItems(data)
      setLoading(false)
    }
    cargarProductos()
  }, [])

  const total = Object.entries(cart).reduce((s,[id,q]) => {
    const item = items.find(i=>i.id==id)
    return item ? s + Number(item.precio)*q : s
  }, 0)
  const count = Object.values(cart).reduce((a,b) => a+b, 0)
  const add = (id) => setCart(c => ({...c, [id]:(c[id]||0)+1}))
  const chg = (id, d) => setCart(c => ({...c, [id]:Math.max(0,(c[id]||0)+d)}))

  async function crearPedido() {
    setGuardando(true)
    try {
      const { data: chiringuito } = await supabase
        .from('chiringuitos')
        .select('id')
        .eq('nombre', 'Chiringuito Playa Sol')
        .single()

      const { data: hamaca } = await supabase
        .from('hamacas')
        .select('id')
        .eq('numero', hamacaNum)
        .eq('chiringuito_id', chiringuito.id)
        .single()

      const { data: pedido } = await supabase
        .from('pedidos')
        .insert({
          chiringuito_id: chiringuito.id,
          hamaca_id: hamaca.id,
          estado: 'pendiente_pago',
          total: total
        })
        .select()
        .single()

      const pedidoItems = Object.entries(cart)
        .filter(([,q]) => q > 0)
        .map(([id, q]) => {
          const item = items.find(i => i.id == id)
          return {
            pedido_id: pedido.id,
            producto_id: id,
            cantidad: q,
            precio_unitario: Number(item.precio)
          }
        })

      await supabase.from('pedido_items').insert(pedidoItems)
      setPedidoId(pedido.id)
      setScreen('pago')
    } catch (err) {
      alert('Error al crear el pedido, inténtalo de nuevo')
    }
    setGuardando(false)
  }

  async function onPagoExito() {
    if (pedidoId) {
      await supabase
        .from('pedidos')
        .update({ estado: 'pendiente' })
        .eq('id', pedidoId)
    }
    setScreen('success')
  }

  return (
    <div style={s.phone}>

      {screen === 'pago' && (
        <Pago
          total={total}
          pedidoId={pedidoId}
          onVolver={() => setScreen('cart')}
          onExito={onPagoExito}
        />
      )}

      {screen === 'menu' && <>
        <div style={s.header}>
          <div style={s.headerRow}>
            <Logo />
            <div style={s.hamaca}>🏖️ Hamaca {hamacaNum}</div>
          </div>
          <p style={s.wave}>〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰</p>
        </div>

        <div style={{padding:'20px 16px 10px'}}>
          <p style={s.label}>Categorías</p>
          <div style={s.catsRow}>
            {cats.map(c=>(
              <button key={c.id} onClick={()=>setCat(c.id)}
                style={{...s.cat, ...(cat===c.id ? s.catOn : s.catOff)}}>
                <span style={{fontSize:24}}>{c.emoji}</span>
                <span style={{fontSize:11,fontWeight:700,marginTop:5}}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{padding:'0 16px'}}>
          <p style={s.label}>Carta</p>
          {loading ? (
            <div style={{textAlign:'center',padding:40,color:'#00B4D8',fontSize:15,fontWeight:600}}>
              Cargando carta... 🌊
            </div>
          ) : (
            <div style={s.grid}>
              {(cat === 'all' ? items : items.filter(i => i.categoria === cat)).map(item=>{
                const q = cart[item.id]||0
                return (
                  <div key={item.id} style={{...s.card, ...(q>0?s.cardHot:{})}}>
                    {q>0 && <div style={s.badge}>{q}</div>}
                    <img src={item.imagen_url} alt={item.nombre}
                      style={{width:'100%',height:110,objectFit:'cover'}} />
                    <div style={s.cardBody}>
                      <p style={s.iName}>{item.nombre}</p>
                      <p style={s.iDesc}>{item.descripcion}</p>
                      <div style={s.iBot}>
                        <p style={s.iPrice}>{Number(item.precio).toFixed(2).replace('.',',')} €</p>
                        <button style={s.addBtn} onClick={()=>add(item.id)}>+</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{height:100}}/>

        {count>0 && (
          <div style={s.cartBar}>
            <button style={s.cartBtn} onClick={()=>setScreen('cart')}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={s.cartCount}>{count}</span>
                <span>Ver pedido</span>
              </div>
              <span style={{fontWeight:800}}>{total.toFixed(2).replace('.',',')} €</span>
            </button>
          </div>
        )}
      </>}

      {screen === 'cart' && (
        <div style={s.inner}>
          <button style={s.back} onClick={()=>setScreen('menu')}>← Volver al menú</button>
          <p style={s.pageTitle}>Tu pedido 🧾</p>
          <p style={s.pageSub}>Hamaca {hamacaNum} · Chiringuito Playa Sol</p>

          {Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>{
            const item = items.find(i=>i.id==id)
            return (
              <div key={id} style={s.cartRow}>
                <img src={item.imagen_url} alt={item.nombre}
                  style={{width:54,height:54,borderRadius:14,objectFit:'cover',flexShrink:0}}/>
                <div style={{flex:1}}>
                  <p style={{fontSize:14,fontWeight:700,color:'#0A2540'}}>{item.nombre}</p>
                  <p style={{fontSize:13,fontWeight:800,color:'#00B4D8'}}>{(Number(item.precio)*q).toFixed(2).replace('.',',')} €</p>
                </div>
                <div style={s.qCtrl}>
                  <button style={s.qBtn} onClick={()=>chg(id,-1)}>−</button>
                  <span style={{fontWeight:800,fontSize:15,minWidth:20,textAlign:'center'}}>{q}</span>
                  <button style={s.qBtn} onClick={()=>chg(id,1)}>+</button>
                </div>
              </div>
            )
          })}

          <div style={s.totalBox}>
            <span style={{color:'#888',fontWeight:600,fontSize:14}}>Total a pagar</span>
            <span style={{fontSize:24,fontWeight:900,color:'#00B4D8'}}>{total.toFixed(2).replace('.',',')} €</span>
          </div>

          <p style={{...s.label,marginBottom:12}}>Forma de pago</p>
          <div style={{display:'flex',gap:10,marginBottom:28}}>
            {[['💳','Tarjeta'],['📱','Bizum'],['🍎','Apple Pay']].map(([icon,label])=>(
              <div key={label} style={s.payOpt}>
                <span style={{fontSize:28}}>{icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:'#444',marginTop:6}}>{label}</span>
              </div>
            ))}
          </div>

          <button style={{...s.payBtn, opacity: guardando ? 0.7 : 1}}
            onClick={crearPedido} disabled={guardando}>
            {guardando ? 'Preparando pago...' : `🌊 Ir a pagar · ${total.toFixed(2).replace('.',',')} €`}
          </button>
        </div>
      )}

      {screen === 'success' && (
        <div style={s.successScreen}>
          <div style={{fontSize:90,marginBottom:24}}>🎉</div>
          <p style={{fontSize:28,fontWeight:900,color:'#0A2540',marginBottom:8}}>¡Pedido en camino!</p>
          <p style={{fontSize:15,color:'#888',marginBottom:36,lineHeight:1.7,fontWeight:500,textAlign:'center'}}>
            Tu pedido está siendo preparado.<br/>En breve llega a tu hamaca.
          </p>
          <div style={s.etaCard}>
            {[['📍 Hamaca',hamacaNum],['🏖️ Chiringuito','Playa Sol'],['⏱️ Tiempo est.','~8 min']].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #EEF8FB',fontSize:14}}>
                <span style={{color:'#AAA',fontWeight:600}}>{l}</span>
                <span style={{fontWeight:800,color:'#0A2540'}}>{v}</span>
              </div>
            ))}
            <div style={{fontSize:64,fontWeight:900,color:'#00B4D8',textAlign:'center',margin:'20px 0 8px',letterSpacing:-3}}>8'</div>
          </div>
          <button style={{...s.payBtn,background:'linear-gradient(135deg,#0A2540,#023E8A)',marginTop:16}}
            onClick={()=>{setCart({});setScreen('menu')}}>
            Nuevo pedido
          </button>
        </div>
      )}

    </div>
  )
}

const s = {
  phone:{ width:'100%', maxWidth:430, minHeight:'100vh', background:'#F0F8FF', position:'relative', margin:'0 auto' },
  header:{ background:'linear-gradient(135deg,#00B4D8,#0096C7)', padding:'28px 20px 0', color:'white' },
  headerRow:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  hamaca:{ background:'rgba(255,255,255,0.2)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:20, padding:'8px 16px', fontSize:13, fontWeight:700, whiteSpace:'nowrap', color:'white' },
  wave:{ fontSize:16, opacity:0.15, overflow:'hidden', height:20, letterSpacing:6 },
  label:{ fontSize:11, fontWeight:800, color:'#7BB8C8', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 },
  catsRow:{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 },
  cat:{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 14px', borderRadius:18, border:'none', cursor:'pointer', minWidth:72 },
  catOn:{ background:'linear-gradient(135deg,#00B4D8,#0096C7)', color:'white', boxShadow:'0 6px 20px rgba(0,180,216,0.4)', transform:'translateY(-2px)' },
  catOff:{ background:'white', color:'#555', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' },
  grid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  card:{ background:'white', borderRadius:22, overflow:'hidden', boxShadow:'0 4px 18px rgba(0,0,0,0.08)', position:'relative', transition:'all 0.2s' },
  cardHot:{ boxShadow:'0 8px 28px rgba(0,180,216,0.3)', transform:'translateY(-3px)' },
  badge:{ position:'absolute', top:10, right:10, background:'#00B4D8', color:'white', borderRadius:'50%', width:26, height:26, fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(0,180,216,0.5)', zIndex:1 },
  cardBody:{ padding:'12px 14px 14px' },
  iName:{ fontSize:13, fontWeight:800, color:'#0A2540', marginBottom:2 },
  iDesc:{ fontSize:11, color:'#B0C4CE', fontWeight:500, marginBottom:10 },
  iBot:{ display:'flex', justifyContent:'space-between', alignItems:'center' },
  iPrice:{ fontSize:17, fontWeight:900, color:'#00B4D8' },
  addBtn:{ width:34, height:34, borderRadius:'50%', border:'none', background:'linear-gradient(135deg,#00B4D8,#0096C7)', color:'white', fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,180,216,0.4)', fontWeight:300, lineHeight:1 },
  cartBar:{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', width:'calc(100% - 48px)', maxWidth:380 },
  cartBtn:{ width:'100%', padding:'17px 22px', background:'linear-gradient(135deg,#0A2540,#023E8A)', color:'white', border:'none', borderRadius:22, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 10px 35px rgba(2,62,138,0.5)' },
  cartCount:{ background:'#00B4D8', borderRadius:10, padding:'3px 10px', fontSize:13, fontWeight:800 },
  inner:{ padding:'28px 20px', minHeight:'100vh', background:'#F0F8FF' },
  back:{ background:'none', border:'none', color:'#00B4D8', fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:20, padding:0 },
  pageTitle:{ fontSize:26, fontWeight:900, color:'#0A2540', marginBottom:4 },
  pageSub:{ fontSize:13, color:'#AAA', marginBottom:24, fontWeight:500 },
  cartRow:{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:'1px solid #E8F4F8' },
  qCtrl:{ display:'flex', alignItems:'center', gap:12 },
  qBtn:{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #C8E6F0', background:'white', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#0A2540', fontWeight:600 },
  totalBox:{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', borderRadius:18, padding:'18px 22px', margin:'24px 0', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' },
  payOpt:{ flex:1, padding:'14px 8px', background:'white', border:'2px solid #E0F0F8', borderRadius:16, textAlign:'center', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' },
  payBtn:{ width:'100%', padding:'18px', background:'linear-gradient(135deg,#00B4D8,#0096C7)', color:'white', border:'none', borderRadius:22, fontSize:15, fontWeight:800, cursor:'pointer', boxShadow:'0 8px 28px rgba(0,180,216,0.45)' },
  successScreen:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:32, textAlign:'center', background:'#F0F8FF' },
  etaCard:{ background:'white', borderRadius:24, padding:'24px', width:'100%', boxShadow:'0 8px 30px rgba(0,0,0,0.07)' },
}
