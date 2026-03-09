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
  {id:'comida', label:'Comida', emoji:'🍔'},
  {id:'bebidas', label:'Bebidas', emoji:'🍺'},
  {id:'helados', label:'Helados', emoji:'🍧'},
]

function Logo() {
  return (
    <div style={{display:'flex', alignItems:'center', gap:10}}>
      <div style={{width:46,height:46,borderRadius:16,background:'rgba(255,255,255,0.2)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,border:'1.5px solid rgba(255,255,255,0.3)'}}>🌊</div>
      <div>
        <div style={{fontSize:28,fontWeight:900,color:'white',letterSpacing:-1,lineHeight:1}}>
          Chiring<span style={{color:'#B2F0FB'}}>App</span>
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.8)',fontWeight:500,marginTop:2}}>
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

  const filteredItems = cat === 'all' ? items : items.filter(i => i.categoria === cat)

  return (
    <div style={s.phone}>

      {screen === 'pago' && (
        <Pago total={total} pedidoId={pedidoId}
          onVolver={() => setScreen('cart')}
          onExito={onPagoExito} />
      )}

      {screen === 'menu' && <>
        <div style={s.header}>
          <div style={s.headerRow}>
            <Logo />
            <div style={s.hamacaBadge}>🏖️ {hamacaNum}</div>
          </div>
          <div style={s.headerBottom}>
            <div style={s.headerTitle}>¿Qué te apetece? 😎</div>
            <div style={s.headerSub}>Pedido directo a tu hamaca</div>
          </div>
        </div>

        <div style={{padding:'20px 16px 8px', background:'white', borderBottom:'1px solid #F0F0F0'}}>
          <div style={s.catsRow}>
            {cats.map(c=>(
              <button key={c.id} onClick={()=>setCat(c.id)}
                style={{...s.cat, ...(cat===c.id ? s.catOn : s.catOff)}}>
                <span style={{fontSize:20}}>{c.emoji}</span>
                <span style={{fontSize:11,fontWeight:700,marginTop:4}}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{padding:'16px', background:'#F7F7F7', minHeight:'60vh'}}>
          {loading ? (
            <div style={{textAlign:'center',padding:60,color:'#00B4D8',fontSize:15,fontWeight:600}}>
              Cargando carta... 🌊
            </div>
          ) : (
            <div style={s.grid}>
              {filteredItems.map(item => {
                const q = cart[item.id]||0
                return (
                  <div key={item.id} style={{...s.card, ...(q>0?s.cardHot:{})}}>
                    <div style={s.imgWrapper}>
                      <img src={item.imagen_url} alt={item.nombre} style={s.img} />
                      <div style={s.imgOverlay} />
                      {q > 0 && <div style={s.badge}>{q}</div>}
                      <button style={s.addBtn} onClick={()=>add(item.id)}>+</button>
                    </div>
                    <div style={s.cardBody}>
                      <p style={s.iName}>{item.nombre}</p>
                      <p style={s.iDesc}>{item.descripcion}</p>
                      <p style={s.iPrice}>{Number(item.precio).toFixed(2).replace('.',',')} €</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{height:100}}/>

        {count > 0 && (
          <div style={s.cartBar}>
            <button style={s.cartBtn} onClick={()=>setScreen('cart')}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={s.cartCount}>{count}</div>
                <span style={{fontSize:15,fontWeight:700}}>Ver mi pedido</span>
              </div>
              <span style={{fontSize:16,fontWeight:900}}>{total.toFixed(2).replace('.',',')} €</span>
            </button>
          </div>
        )}
      </>}

      {screen === 'cart' && (
        <div style={{minHeight:'100vh', background:'#F7F7F7'}}>
          <div style={s.cartHeader}>
            <button style={s.back} onClick={()=>setScreen('menu')}>←</button>
            <span style={{fontSize:18,fontWeight:900,color:'#0A2540'}}>Tu pedido</span>
            <span style={{fontSize:13,color:'#aaa',fontWeight:500}}>Hamaca {hamacaNum}</span>
          </div>

          <div style={{padding:'8px 16px'}}>
            {Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>{
              const item = items.find(i=>i.id==id)
              return (
                <div key={id} style={s.cartRow}>
                  <img src={item.imagen_url} alt={item.nombre}
                    style={{width:70,height:70,borderRadius:16,objectFit:'cover',flexShrink:0}}/>
                  <div style={{flex:1,padding:'0 12px'}}>
                    <p style={{fontSize:15,fontWeight:800,color:'#0A2540',marginBottom:4}}>{item.nombre}</p>
                    <p style={{fontSize:15,fontWeight:900,color:'#00B4D8'}}>{(Number(item.precio)*q).toFixed(2).replace('.',',')} €</p>
                  </div>
                  <div style={s.qCtrl}>
                    <button style={s.qBtn} onClick={()=>chg(id,-1)}>−</button>
                    <span style={{fontWeight:900,fontSize:16,minWidth:24,textAlign:'center'}}>{q}</span>
                    <button style={{...s.qBtn,background:'#00B4D8',color:'white',border:'none'}} onClick={()=>chg(id,1)}>+</button>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{padding:'0 16px', marginTop:8}}>
            <div style={s.totalBox}>
              <div>
                <div style={{fontSize:13,color:'#aaa',fontWeight:600}}>Total a pagar</div>
                <div style={{fontSize:32,fontWeight:900,color:'#0A2540'}}>{total.toFixed(2).replace('.',',')} €</div>
              </div>
              <div style={{fontSize:13,color:'#aaa',fontWeight:500,textAlign:'right'}}>
                {count} {count===1?'producto':'productos'}
              </div>
            </div>
          </div>

          <div style={{padding:'16px'}}>
            <button style={{...s.payBtn, opacity: guardando ? 0.7 : 1}}
              onClick={crearPedido} disabled={guardando}>
              {guardando ? '⏳ Preparando...' : `💳 Ir a pagar · ${total.toFixed(2).replace('.',',')} €`}
            </button>
          </div>
        </div>
      )}

      {screen === 'success' && (
        <div style={s.successScreen}>
          <div style={{fontSize:80,marginBottom:20}}>🎉</div>
          <p style={{fontSize:30,fontWeight:900,color:'#0A2540',marginBottom:8,textAlign:'center'}}>¡Pedido confirmado!</p>
          <p style={{fontSize:15,color:'#888',marginBottom:32,lineHeight:1.7,fontWeight:500,textAlign:'center'}}>
            Estamos preparando tu pedido.<br/>En breve llega a tu hamaca 🏖️
          </p>
          <div style={s.etaCard}>
            {[['📍 Hamaca',hamacaNum],['🏖️ Chiringuito','Playa Sol'],['⏱️ Tiempo','~8 min']].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid #F0F8FB'}}>
                <span style={{color:'#AAA',fontWeight:600,fontSize:14}}>{l}</span>
                <span style={{fontWeight:900,color:'#0A2540',fontSize:15}}>{v}</span>
              </div>
            ))}
            <div style={{fontSize:72,fontWeight:900,color:'#00B4D8',textAlign:'center',margin:'24px 0 8px',letterSpacing:-3}}>8'</div>
          </div>
          <button style={{...s.payBtn,background:'linear-gradient(135deg,#0A2540,#023E8A)',marginTop:20}}
            onClick={()=>{setCart({});setScreen('menu')}}>
            🛍️ Nuevo pedido
          </button>
        </div>
      )}

    </div>
  )
}

const s = {
  phone:{ width:'100%', maxWidth:430, minHeight:'100vh', background:'#F7F7F7', margin:'0 auto', fontFamily:'Poppins, sans-serif' },
  header:{ background:'linear-gradient(160deg,#00B4D8 0%,#0096C7 50%,#0077B6 100%)', padding:'32px 20px 24px', color:'white' },
  headerRow:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  hamacaBadge:{ background:'rgba(255,255,255,0.25)', backdropFilter:'blur(10px)', border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:24, padding:'8px 18px', fontSize:14, fontWeight:800, color:'white' },
  headerTitle:{ fontSize:26, fontWeight:900, color:'white', marginBottom:4 },
  headerSub:{ fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:500 },
  headerBottom:{ marginTop:4 },
  catsRow:{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 },
  cat:{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 16px', borderRadius:16, border:'none', cursor:'pointer', minWidth:70, transition:'all 0.2s' },
  catOn:{ background:'linear-gradient(135deg,#00B4D8,#0077B6)', color:'white', boxShadow:'0 4px 15px rgba(0,180,216,0.4)' },
  catOff:{ background:'#F7F7F7', color:'#666' },
  grid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  card:{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', transition:'all 0.2s' },
  cardHot:{ boxShadow:'0 6px 24px rgba(0,180,216,0.25)', transform:'translateY(-2px)' },
  imgWrapper:{ position:'relative', width:'100%', height:130 },
  img:{ width:'100%', height:'100%', objectFit:'cover' },
  imgOverlay:{ position:'absolute', bottom:0, left:0, right:0, height:60, background:'linear-gradient(transparent, rgba(0,0,0,0.4))' },
  badge:{ position:'absolute', top:10, left:10, background:'#00B4D8', color:'white', borderRadius:20, minWidth:26, height:26, fontSize:12, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 8px', boxShadow:'0 2px 8px rgba(0,180,216,0.5)' },
  addBtn:{ position:'absolute', bottom:10, right:10, width:36, height:36, borderRadius:'50%', border:'none', background:'white', color:'#00B4D8', fontSize:24, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 12px rgba(0,0,0,0.2)', fontWeight:300, lineHeight:1 },
  cardBody:{ padding:'12px 14px 16px' },
  iName:{ fontSize:14, fontWeight:800, color:'#0A2540', marginBottom:3 },
  iDesc:{ fontSize:11, color:'#aaa', fontWeight:500, marginBottom:8 },
  iPrice:{ fontSize:18, fontWeight:900, color:'#00B4D8' },
  cartBar:{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', width:'calc(100% - 32px)', maxWidth:398 },
  cartBtn:{ width:'100%', padding:'18px 24px', background:'linear-gradient(135deg,#0A2540,#023E8A)', color:'white', border:'none', borderRadius:20, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 8px 30px rgba(2,62,138,0.45)' },
  cartCount:{ background:'#00B4D8', borderRadius:12, padding:'4px 12px', fontSize:14, fontWeight:900, minWidth:28, textAlign:'center' },
  cartHeader:{ background:'white', padding:'20px 20px 16px', display:'flex', alignItems:'center', gap:16, borderBottom:'1px solid #F0F0F0', position:'sticky', top:0, zIndex:10 },
  back:{ background:'#F7F7F7', border:'none', borderRadius:12, width:36, height:36, fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#0A2540' },
  cartRow:{ display:'flex', alignItems:'center', background:'white', marginBottom:8, borderRadius:16, padding:16 },
  qCtrl:{ display:'flex', alignItems:'center', gap:10 },
  qBtn:{ width:32, height:32, borderRadius:10, border:'1.5px solid #E0E0E0', background:'white', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#0A2540', fontWeight:700 },
  totalBox:{ background:'white', borderRadius:20, padding:'20px 24px', margin:'8px 0', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' },
  payBtn:{ width:'100%', padding:'18px', background:'linear-gradient(135deg,#00B4D8,#0077B6)', color:'white', border:'none', borderRadius:20, fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'0 6px 24px rgba(0,180,216,0.4)' },
  successScreen:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:32, background:'white' },
  etaCard:{ background:'#F7FBFF', borderRadius:24, padding:'8px 24px', width:'100%', marginBottom:8 },
}