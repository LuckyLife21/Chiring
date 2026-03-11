import { useState, useEffect, useRef } from 'react'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'
import { supabase } from './supabase'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [olvidado, setOlvidado] = useState(false)
  const [emailReset, setEmailReset] = useState('')
  const [resetEnviado, setResetEnviado] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email o contraseña incorrectos')
    else onLogin()
    setLoading(false)
  }

  async function handleReset() {
    if (!emailReset) return
    setResetLoading(true)
    await supabase.auth.resetPasswordForEmail(emailReset, {
      redirectTo: 'https://chiringapp.com/panel',
    })
    setResetEnviado(true)
    setResetLoading(false)
  }

  if (olvidado) {
    return (
      <div style={ls.bg}>
        <div style={ls.card}>
          <div style={ls.logo}>🌊 Chiring</div>
          <div style={ls.sub}>Recuperar contraseña</div>
          {!resetEnviado ? <>
            <input style={ls.input} type="email" placeholder="Tu email" value={emailReset}
              onChange={e => setEmailReset(e.target.value)} />
            <button style={{...ls.btn, opacity: resetLoading ? 0.7 : 1}} onClick={handleReset} disabled={resetLoading}>
              {resetLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
            <div style={{textAlign:'center', marginTop:20, fontSize:13, color:'#aaa'}}>
              <span style={{color:'#0077B6', fontWeight:700, cursor:'pointer'}} onClick={() => setOlvidado(false)}>← Volver al login</span>
            </div>
          </> : <>
            <div style={{textAlign:'center', fontSize:15, color:'#28a745', fontWeight:700, marginBottom:16}}>
              ✅ Email enviado
            </div>
            <div style={{textAlign:'center', fontSize:13, color:'#aaa', marginBottom:24}}>
              Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
            </div>
            <div style={{textAlign:'center', fontSize:13, color:'#aaa'}}>
              <span style={{color:'#0077B6', fontWeight:700, cursor:'pointer'}} onClick={() => { setOlvidado(false); setResetEnviado(false) }}>← Volver al login</span>
            </div>
          </>}
        </div>
      </div>
    )
  }

  return (
    <div style={ls.bg}>
      <div style={ls.card}>
        <div style={ls.logo}>🌊 Chiring</div>
        <div style={ls.sub}>Panel del chiringuito</div>
        <input style={ls.input} type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} />
        <input style={ls.input} type="password" placeholder="Contraseña" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        {error && <div style={ls.error}>{error}</div>}
        <button style={{...ls.btn, opacity: loading ? 0.7 : 1}} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <div style={{textAlign:'center', marginTop:16, fontSize:13}}>
          <span style={{color:'#0077B6', fontWeight:700, cursor:'pointer'}} onClick={() => setOlvidado(true)}>¿Olvidaste tu contraseña?</span>
        </div>
        <div style={{textAlign:'center', marginTop:12, fontSize:13, color:'#aaa'}}>
          ¿No tienes cuenta?{' '}
          <a href="/registro" style={{color:'#0077B6', fontWeight:700, textDecoration:'none'}}>Regístrate gratis</a>
        </div>
      </div>
    </div>
  )
}

function BannerStripe({ chiringuito }) {
  const [cargando, setCargando] = useState(false)

  async function conectarStripe() {
    setCargando(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { data, error } = await supabase.functions.invoke('stripe-connect-onboarding', {
        body: {
          chiringuito_id: chiringuito.id,
          email: chiringuito.email,
          nombre: chiringuito.nombre,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      })
      if (error) throw error
      window.location.href = data.url
    } catch (e) {
      alert('Error al conectar con Stripe. Inténtalo de nuevo.')
      setCargando(false)
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
      borderRadius: 16, padding: '16px 20px', marginBottom: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(255,107,53,0.3)', gap: 12, flexWrap: 'wrap',
    }}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{fontSize:28}}>🚀</div>
        <div>
          <div style={{fontWeight:800, color:'white', fontSize:15}}>¡Ya casi estás!</div>
          <div style={{fontSize:13, color:'rgba(255,255,255,0.85)'}}>Conecta tu cuenta bancaria para empezar a recibir pedidos</div>
        </div>
      </div>
      <button
        onClick={conectarStripe}
        disabled={cargando}
        style={{
          background: 'white', color: '#FF6B35', border: 'none',
          borderRadius: 50, padding: '10px 22px', fontSize: 14, fontWeight: 800,
          cursor: cargando ? 'default' : 'pointer', opacity: cargando ? 0.7 : 1,
          whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif',
        }}
      >
        {cargando ? 'Cargando...' : 'Completar registro →'}
      </button>
    </div>
  )
}

function PinManager({ pinCorrecto, onAcceso }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function verificar() {
    if (pin === pinCorrecto) onAcceso()
    else { setError('PIN incorrecto'); setPin('') }
  }

  return (
    <div style={ls.bg}>
      <div style={ls.card}>
        <div style={ls.logo}>🔐 Modo Manager</div>
        <div style={ls.sub}>Introduce el PIN de propietario</div>
        <input style={{...ls.input, textAlign:'center', fontSize:24, letterSpacing:8}}
          type="password" placeholder="••••" value={pin} maxLength={4}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && verificar()} />
        {error && <div style={ls.error}>{error}</div>}
        <button style={ls.btn} onClick={verificar}>Acceder</button>
      </div>
    </div>
  )
}

function Manager({ chiringuito, onVolver }) {
  const [tab, setTab] = useState('stats')
  const [pedidos, setPedidos] = useState([])
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [hamacas, setHamacas] = useState([])
  const [loading, setLoading] = useState(true)
  const [vista, setVista] = useState('hoy')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [chiringData, setChiringData] = useState(chiringuito)
  const [editando, setEditando] = useState(null)

  const [nuevoProducto, setNuevoProducto] = useState({ nombre:'', descripcion:'', precio:'', imagen_url:'', categoria:'' })
  const [nuevaCat, setNuevaCat] = useState({ nombre:'', emoji:'' })
  const [nuevaHamaca, setNuevaHamaca] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [msg, setMsg] = useState('')

  const [cambiandoPass, setCambiandoPass] = useState(false)
  const [codigoEnviadoPass, setCodigoEnviadoPass] = useState(false)
  const [codigoPass, setCodigoPass] = useState('')
  const [codigoVerifPass, setCodigoVerifPass] = useState('')
  const [nuevaPass, setNuevaPass] = useState('')
  const [nuevaPass2, setNuevaPass2] = useState('')

  const [cambiandoPin, setCambiandoPin] = useState(false)
  const [codigoEnviadoPin, setCodigoEnviadoPin] = useState(false)
  const [codigoPin, setCodigoPin] = useState('')
  const [codigoVerifPin, setCodigoVerifPin] = useState('')
  const [nuevoPin, setNuevoPin] = useState('')

  useEffect(() => { cargarTodo() }, [])

  async function cargarTodo() {
    const [{ data: p }, { data: pr }, { data: c }, { data: h }] = await Promise.all([
      supabase.from('pedidos').select(`*, hamacas(numero), pedido_items(cantidad, precio_unitario, productos(nombre))`).eq('chiringuito_id', chiringuito.id).order('created_at', { ascending: false }),
      supabase.from('productos').select('*').eq('chiringuito_id', chiringuito.id).order('nombre'),
      supabase.from('categorias').select('*').eq('chiringuito_id', chiringuito.id).order('orden'),
      supabase.from('hamacas').select('*').eq('chiringuito_id', chiringuito.id).order('numero'),
    ])
    if (p) setPedidos(p)
    if (pr) setProductos(pr)
    if (c) setCategorias(c)
    if (h) setHamacas(h)
    setLoading(false)
  }

  function mostrarMsg(m) { setMsg(m); setTimeout(() => setMsg(''), 4000) }

  const ahora = new Date()
  function filtrarPorPeriodo(lista) {
    if (vista === 'custom' && fechaDesde && fechaHasta) {
      const desde = new Date(fechaDesde)
      const hasta = new Date(fechaHasta); hasta.setHours(23,59,59)
      return lista.filter(p => {
        const f = new Date(p.created_at)
        return f >= desde && f <= hasta && p.estado === 'entregado'
      })
    }
    const dias = { '7d':7, '30d':30, '6m':180, '1a':365 }[vista]
    if (vista === 'hoy') return lista.filter(p => new Date(p.created_at).toDateString() === ahora.toDateString() && p.estado === 'entregado')
    return lista.filter(p => (ahora - new Date(p.created_at)) / 86400000 <= dias && p.estado === 'entregado')
  }

  const pedidosFiltrados = filtrarPorPeriodo(pedidos)
  const ingresos = pedidosFiltrados.reduce((s,p) => s + Number(p.total), 0)
  const ticketMedio = pedidosFiltrados.length > 0 ? ingresos / pedidosFiltrados.length : 0
  const conteoProductos = {}
  pedidosFiltrados.forEach(p => p.pedido_items?.forEach(item => {
    const n = item.productos?.nombre
    if (n) conteoProductos[n] = (conteoProductos[n] || 0) + item.cantidad
  }))
  const topProductos = Object.entries(conteoProductos).sort((a,b) => b[1]-a[1]).slice(0,5)
  const ventasPorHora = {}
  pedidosFiltrados.forEach(p => {
    const h = new Date(p.created_at).getHours()
    ventasPorHora[h] = (ventasPorHora[h] || 0) + Number(p.total)
  })
  const maxVenta = Math.max(...Object.values(ventasPorHora), 1)

  async function toggleProducto(id, disponible) {
    await supabase.from('productos').update({ disponible }).eq('id', id)
    cargarTodo()
  }
  async function guardarEdicion() {
    setGuardando(true)
    await supabase.from('productos').update({
      nombre: editando.nombre, descripcion: editando.descripcion,
      precio: Number(editando.precio), imagen_url: editando.imagen_url,
      categoria: editando.categoria,
    }).eq('id', editando.id)
    setEditando(null)
    await cargarTodo()
    mostrarMsg('✅ Producto guardado')
    setGuardando(false)
  }
  async function añadirProducto() {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return mostrarMsg('⚠️ Nombre y precio obligatorios')
    setGuardando(true)
    await supabase.from('productos').insert({
      ...nuevoProducto, precio: Number(nuevoProducto.precio),
      chiringuito_id: chiringuito.id, disponible: true
    })
    setNuevoProducto({ nombre:'', descripcion:'', precio:'', imagen_url:'', categoria:'' })
    await cargarTodo()
    mostrarMsg('✅ Producto añadido')
    setGuardando(false)
  }

  async function añadirCategoria() {
    if (!nuevaCat.nombre || !nuevaCat.emoji) return mostrarMsg('⚠️ Nombre y emoji obligatorios')
    await supabase.from('categorias').insert({
      nombre: nuevaCat.nombre, emoji: nuevaCat.emoji,
      chiringuito_id: chiringuito.id, orden: categorias.length + 1
    })
    setNuevaCat({ nombre:'', emoji:'' })
    await cargarTodo()
    mostrarMsg('✅ Categoría añadida')
  }
  async function eliminarCategoria(id) {
    if (!confirm('¿Eliminar esta categoría?')) return
    await supabase.from('categorias').delete().eq('id', id)
    await cargarTodo()
    mostrarMsg('✅ Categoría eliminada')
  }

  async function añadirHamaca() {
    if (!nuevaHamaca) return mostrarMsg('⚠️ Escribe el número de hamaca')
    await supabase.from('hamacas').insert({ numero: nuevaHamaca, chiringuito_id: chiringuito.id, activa: true })
    setNuevaHamaca('')
    await cargarTodo()
    mostrarMsg('✅ Hamaca añadida')
  }
  async function toggleHamaca(id, activa) {
    await supabase.from('hamacas').update({ activa }).eq('id', id)
    cargarTodo()
  }
  async function eliminarHamaca(id) {
    if (!confirm('¿Eliminar esta hamaca?')) return
    await supabase.from('hamacas').delete().eq('id', id)
    await cargarTodo()
    mostrarMsg('✅ Hamaca eliminada')
  }

  async function enviarCodigo(tipo) {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString()
    if (tipo === 'pass') { setCodigoPass(codigo); setCodigoEnviadoPass(true) }
    else { setCodigoPin(codigo); setCodigoEnviadoPin(true) }
    const { data } = await supabase.from('chiringuitos').select('email_notificaciones').eq('id', chiringuito.id).single()
    await supabase.functions.invoke('enviar-codigo', {
      body: { email: data.email_notificaciones, codigo, tipo }
    })
    mostrarMsg(`✅ Código enviado a ${data.email_notificaciones}`)
  }

  async function verificarYCambiarPass() {
    if (codigoVerifPass !== codigoPass) return mostrarMsg('⚠️ Código incorrecto')
    if (nuevaPass !== nuevaPass2) return mostrarMsg('⚠️ Las contraseñas no coinciden')
    if (nuevaPass.length < 6) return mostrarMsg('⚠️ Mínimo 6 caracteres')
    setGuardando(true)
    const { error } = await supabase.auth.updateUser({ password: nuevaPass })
    if (error) mostrarMsg('❌ Error al cambiar contraseña')
    else {
      mostrarMsg('✅ Contraseña cambiada correctamente')
      setCambiandoPass(false); setCodigoEnviadoPass(false)
      setCodigoPass(''); setCodigoVerifPass(''); setNuevaPass(''); setNuevaPass2('')
    }
    setGuardando(false)
  }

  async function verificarYCambiarPin() {
    if (codigoVerifPin !== codigoPin) return mostrarMsg('⚠️ Código incorrecto')
    if (nuevoPin.length !== 4) return mostrarMsg('⚠️ El PIN debe tener 4 dígitos')
    setGuardando(true)
    await supabase.from('chiringuitos').update({ pin_manager: nuevoPin }).eq('id', chiringuito.id)
    mostrarMsg('✅ PIN cambiado correctamente')
    setCambiandoPin(false); setCodigoEnviadoPin(false)
    setCodigoPin(''); setCodigoVerifPin(''); setNuevoPin('')
    setGuardando(false)
  }

  const tabs = [['stats','📊 Stats'],['productos','📦 Productos'],['categorias','🗂️ Categorías'],['hamacas','🪑 Hamacas'],['config','⚙️ Config']]
  const baseUrl = window.location.origin
  const periodos = [['hoy','Hoy'],['7d','7 días'],['30d','30 días'],['6m','6 meses'],['1a','1 año'],['custom','📅 Fechas']]

  return (
    <div style={{minHeight:'100vh', background:'#F0F8FF', fontFamily:'Poppins, sans-serif'}}>
      <div style={s.header}>
        <div style={{...s.headerInner, maxWidth:1100}}>
          <div>
            <div style={s.logo}>📊 Manager</div>
            <div style={s.logoSub}>{chiringuito.nombre}</div>
          </div>
          <button style={s.logoutBtn} onClick={onVolver}>← Volver al panel</button>
        </div>
      </div>

      <div style={{background:'white', borderBottom:'1px solid #F0F0F0', padding:'0 20px'}}>
        <div style={{maxWidth:1100, margin:'0 auto', display:'flex', gap:4, overflowX:'auto'}}>
          {tabs.map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              padding:'14px 20px', border:'none', background:'none', cursor:'pointer',
              fontFamily:'Poppins, sans-serif', fontWeight:700, fontSize:13,
              color: tab===v ? '#00B4D8' : '#aaa',
              borderBottom: tab===v ? '3px solid #00B4D8' : '3px solid transparent',
              whiteSpace:'nowrap'
            }}>{l}</button>
          ))}
        </div>
      </div>

      {msg && <div style={{background:'#D4EDDA', color:'#155724', padding:'12px 20px', textAlign:'center', fontWeight:700, fontSize:14}}>{msg}</div>}

      <div style={{maxWidth:1100, margin:'0 auto', padding:'20px 16px'}}>

        {tab === 'stats' && <>
          <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
            {periodos.map(([v,l]) => (
              <button key={v} onClick={() => setVista(v)}
                style={{...ms.tabBtn, ...(vista===v ? ms.tabOn : ms.tabOff)}}>{l}</button>
            ))}
          </div>
          {vista === 'custom' && (
            <div style={{display:'flex', gap:12, marginBottom:16, alignItems:'center'}}>
              <div style={ms.label}>Desde</div>
              <input type="date" style={{...ms.input, width:'auto'}} value={fechaDesde} onChange={e=>setFechaDesde(e.target.value)} />
              <div style={ms.label}>Hasta</div>
              <input type="date" style={{...ms.input, width:'auto'}} value={fechaHasta} onChange={e=>setFechaHasta(e.target.value)} />
            </div>
          )}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:20}}>
            {[['💰',ingresos.toFixed(0)+'€','Ingresos'],['🧾',pedidosFiltrados.length,'Pedidos'],['🎯',ticketMedio.toFixed(2)+'€','Ticket medio'],['🪑',new Set(pedidosFiltrados.map(p=>p.hamacas?.numero)).size,'Hamacas activas']].map(([icon,num,label]) => (
              <div key={label} style={ms.statCard}>
                <div style={ms.statIcon}>{icon}</div>
                <div style={ms.statNum}>{num}</div>
                <div style={ms.statLabel}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
            <div style={ms.section}>
              <div style={ms.sectionTitle}>🏆 Productos más vendidos</div>
              {topProductos.length === 0 ? <div style={{color:'#aaa',fontSize:13}}>Sin datos aún</div> :
                topProductos.map(([nombre, cantidad], i) => (
                  <div key={nombre} style={ms.prodRow}>
                    <div style={ms.prodRank}>{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</div>
                    <div style={{flex:1,fontWeight:700,color:'#0A2540',fontSize:14}}>{nombre}</div>
                    <div style={ms.prodQty}>{cantidad} uds</div>
                  </div>
                ))
              }
            </div>
            <div style={ms.section}>
              <div style={ms.sectionTitle}>⏰ Ventas por hora</div>
              {Object.keys(ventasPorHora).length === 0 ? <div style={{color:'#aaa',fontSize:13}}>Sin datos aún</div> :
                <div style={{display:'flex', alignItems:'flex-end', gap:6, height:120, marginTop:8}}>
                  {Object.entries(ventasPorHora).sort((a,b)=>a[0]-b[0]).map(([hora, venta]) => (
                    <div key={hora} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                      <div style={{fontSize:10,color:'#00B4D8',fontWeight:700}}>{venta.toFixed(0)}€</div>
                      <div style={{width:'100%',background:'linear-gradient(180deg,#00B4D8,#0077B6)',borderRadius:'6px 6px 0 0',height:`${(venta/maxVenta)*90}px`,minHeight:4}}/>
                      <div style={{fontSize:10,color:'#aaa'}}>{hora}h</div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
          <div style={ms.section}>
            <div style={ms.sectionTitle}>📋 Historial de pedidos</div>
            {pedidosFiltrados.length === 0 ? <div style={{color:'#aaa',fontSize:13}}>Sin pedidos en este periodo</div> :
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
                {pedidosFiltrados.map(pedido => (
                  <div key={pedido.id} style={{display:'flex',alignItems:'center',borderRadius:12,background:'#F7F7F7',padding:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:'#0A2540',fontSize:13}}>🪑 Hamaca {pedido.hamacas?.numero}</div>
                      <div style={{fontSize:11,color:'#aaa',marginTop:2}}>{new Date(pedido.created_at).toLocaleString('es-ES',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</div>
                    </div>
                    <div style={{fontWeight:900,color:'#00B4D8',fontSize:15}}>{Number(pedido.total).toFixed(2)}€</div>
                  </div>
                ))}
              </div>
            }
          </div>
        </>}

        {tab === 'productos' && <>
          {editando && (
            <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
              <div style={{background:'white',borderRadius:24,padding:28,width:'100%',maxWidth:480,boxShadow:'0 20px 60px rgba(0,0,0,0.3)',maxHeight:'90vh',overflowY:'auto'}}>
                <div style={{fontSize:17,fontWeight:900,color:'#0A2540',marginBottom:20}}>✏️ Editar producto</div>
                {editando.imagen_url && <img src={editando.imagen_url} alt="" style={{width:'100%',height:160,objectFit:'cover',borderRadius:14,marginBottom:16}} />}
                <div style={ms.label}>Nombre</div>
                <input style={ms.input} value={editando.nombre} onChange={e=>setEditando({...editando,nombre:e.target.value})} />
                <div style={ms.label}>Descripción</div>
                <input style={ms.input} value={editando.descripcion||''} onChange={e=>setEditando({...editando,descripcion:e.target.value})} />
                <div style={ms.label}>Precio (€)</div>
                <input style={ms.input} type="number" step="0.01" value={editando.precio} onChange={e=>setEditando({...editando,precio:e.target.value})} />
                <div style={ms.label}>URL de foto</div>
                <input style={ms.input} placeholder="https://..." value={editando.imagen_url||''} onChange={e=>setEditando({...editando,imagen_url:e.target.value})} />
                <div style={ms.label}>Categoría</div>
                <select style={ms.input} value={editando.categoria||''} onChange={e=>setEditando({...editando,categoria:e.target.value})}>
                  <option value="">Sin categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.nombre.toLowerCase()}>{c.emoji} {c.nombre}</option>)}
                </select>
                <div style={{display:'flex',gap:10,marginTop:8}}>
                  <button style={{...ms.btnAdd,flex:1,background:'#eee',color:'#555'}} onClick={()=>setEditando(null)}>Cancelar</button>
                  <button style={{...ms.btnAdd,flex:2,opacity:guardando?0.7:1}} onClick={guardarEdicion} disabled={guardando}>
                    {guardando?'Guardando...':'💾 Guardar cambios'}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div style={ms.section}>
            <div style={ms.sectionTitle}>➕ Añadir producto</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <input style={ms.input} placeholder="Nombre" value={nuevoProducto.nombre} onChange={e=>setNuevoProducto({...nuevoProducto,nombre:e.target.value})} />
              <input style={ms.input} placeholder="Precio (ej: 5.50)" value={nuevoProducto.precio} onChange={e=>setNuevoProducto({...nuevoProducto,precio:e.target.value})} />
              <input style={ms.input} placeholder="Descripción" value={nuevoProducto.descripcion} onChange={e=>setNuevoProducto({...nuevoProducto,descripcion:e.target.value})} />
              <input style={ms.input} placeholder="URL de foto" value={nuevoProducto.imagen_url} onChange={e=>setNuevoProducto({...nuevoProducto,imagen_url:e.target.value})} />
              <select style={ms.input} value={nuevoProducto.categoria} onChange={e=>setNuevoProducto({...nuevoProducto,categoria:e.target.value})}>
                <option value="">Selecciona categoría</option>
                {categorias.map(c => <option key={c.id} value={c.nombre.toLowerCase()}>{c.emoji} {c.nombre}</option>)}
              </select>
            </div>
            <button style={{...ms.btnAdd, opacity: guardando?0.7:1}} onClick={añadirProducto} disabled={guardando}>
              {guardando ? 'Guardando...' : '➕ Añadir producto'}
            </button>
          </div>
          <div style={ms.section}>
            <div style={ms.sectionTitle}>📦 Todos los productos ({productos.length})</div>
            {productos.map(prod => (
              <div key={prod.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F0F0F0'}}>
                {prod.imagen_url
                  ? <img src={prod.imagen_url} alt={prod.nombre} style={{width:60,height:60,borderRadius:12,objectFit:'cover',flexShrink:0}} />
                  : <div style={{width:60,height:60,borderRadius:12,background:'#F0F0F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>🍽️</div>
                }
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:'#0A2540',fontSize:14}}>{prod.nombre}</div>
                  <div style={{fontSize:12,color:'#aaa',marginTop:2}}>{prod.descripcion}</div>
                  <div style={{fontSize:12,color:'#aaa',marginTop:1}}>Categoría: {prod.categoria||'—'}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                  <div style={{fontWeight:900,color:'#00B4D8',fontSize:16}}>{Number(prod.precio).toFixed(2)}€</div>
                  <div style={{fontSize:11,fontWeight:700,color:prod.disponible?'#28a745':'#dc3545'}}>
                    {prod.disponible?'● Activo':'● Inactivo'}
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button onClick={()=>setEditando({...prod})} style={{...ms.toggleBtn,background:'#0077B6'}}>✏️ Editar</button>
                    <button onClick={()=>toggleProducto(prod.id,!prod.disponible)}
                      style={{...ms.toggleBtn,background:prod.disponible?'#dc3545':'#28a745'}}>
                      {prod.disponible?'Desactivar':'Activar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {tab === 'categorias' && <>
          <div style={ms.section}>
            <div style={ms.sectionTitle}>➕ Añadir categoría</div>
            <div style={{display:'flex', gap:12}}>
              <input style={{...ms.input, flex:1}} placeholder="Nombre (ej: Postres)" value={nuevaCat.nombre} onChange={e=>setNuevaCat({...nuevaCat,nombre:e.target.value})} />
              <input style={{...ms.input, width:80}} placeholder="🍰" value={nuevaCat.emoji} onChange={e=>setNuevaCat({...nuevaCat,emoji:e.target.value})} />
            </div>
            <button style={ms.btnAdd} onClick={añadirCategoria}>➕ Añadir categoría</button>
          </div>
          <div style={ms.section}>
            <div style={ms.sectionTitle}>🗂️ Categorías actuales</div>
            {categorias.map(cat => (
              <div key={cat.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F0F0F0'}}>
                <div style={{fontSize:28}}>{cat.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:'#0A2540'}}>{cat.nombre}</div>
                  <div style={{fontSize:12,color:'#aaa'}}>Orden: {cat.orden}</div>
                </div>
                <button onClick={()=>eliminarCategoria(cat.id)} style={{...ms.toggleBtn,background:'#dc3545'}}>🗑️ Eliminar</button>
              </div>
            ))}
          </div>
        </>}

        {tab === 'hamacas' && <>
          <div style={ms.section}>
            <div style={ms.sectionTitle}>➕ Añadir hamaca</div>
            <div style={{display:'flex', gap:12}}>
              <input style={{...ms.input, flex:1}} placeholder="Número (ej: 16A)" value={nuevaHamaca} onChange={e=>setNuevaHamaca(e.target.value)} />
              <button style={{...ms.btnAdd,marginTop:0}} onClick={añadirHamaca}>➕ Añadir</button>
            </div>
          </div>
          <div style={ms.section}>
            <div style={ms.sectionTitle}>🪑 Hamacas ({hamacas.length}) — clic en el QR para imprimir</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12}}>
              {hamacas.map(h => {
                const url = `${baseUrl}/hamaca/${h.numero}`
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`
                return (
                  <div key={h.id} style={{background:h.activa?'white':'#FFF0F0',borderRadius:16,padding:16,textAlign:'center',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',border:h.activa?'2px solid #E0F0FF':'2px solid #FFD0D0'}}>
                    <div style={{fontWeight:900,color:'#0A2540',fontSize:16,marginBottom:8}}>🪑 {h.numero}</div>
                    <img src={qrUrl} alt={`QR ${h.numero}`}
                      style={{width:100,height:100,borderRadius:8,cursor:'pointer',border:'3px solid #E0F0FF'}}
                      onClick={()=>window.open(qrUrl,'_blank')} />
                    <div style={{fontSize:10,color:'#aaa',marginTop:6,marginBottom:10,wordBreak:'break-all'}}>{url}</div>
                    <div style={{fontSize:11,fontWeight:700,color:h.activa?'#28a745':'#dc3545',marginBottom:8}}>
                      {h.activa?'● Activa':'● Inactiva'}
                    </div>
                    <div style={{display:'flex',gap:6,justifyContent:'center'}}>
                      <button onClick={()=>toggleHamaca(h.id,!h.activa)}
                        style={{...ms.toggleBtn,background:h.activa?'#856404':'#28a745',fontSize:11}}>
                        {h.activa?'Desactivar':'Activar'}
                      </button>
                      <button onClick={()=>eliminarHamaca(h.id)}
                        style={{...ms.toggleBtn,background:'#dc3545',fontSize:11}}>🗑️</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>}

        {tab === 'config' && <>
          <div style={ms.section}>
            <div style={ms.sectionTitle}>🏪 Nombre del negocio</div>
            <div style={{background:'#F7F7F7', borderRadius:12, padding:'14px 16px', fontSize:16, fontWeight:700, color:'#0A2540', display:'flex', alignItems:'center', gap:10}}>
              <span style={{fontSize:20}}>🔒</span>
              {chiringData.nombre}
            </div>
            <div style={{fontSize:12, color:'#aaa', marginTop:8}}>El nombre del negocio solo puede ser modificado por el equipo de Chiring. Contacta con soporte si necesitas cambiarlo.</div>
          </div>

          <div style={ms.section}>
            <div style={ms.sectionTitle}>🔑 Cambiar contraseña</div>
            {!cambiandoPass ? (
              <button style={ms.btnAdd} onClick={() => setCambiandoPass(true)}>🔑 Cambiar contraseña</button>
            ) : !codigoEnviadoPass ? (
              <div>
                <div style={{fontSize:14, color:'#666', marginBottom:12}}>Te enviaremos un código de verificación al email registrado.</div>
                <div style={{display:'flex', gap:10}}>
                  <button style={ms.btnAdd} onClick={() => enviarCodigo('pass')}>📧 Enviar código</button>
                  <button style={{...ms.btnAdd, background:'#eee', color:'#555'}} onClick={() => setCambiandoPass(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:8, maxWidth:400}}>
                <div style={ms.label}>Código recibido por email</div>
                <input style={ms.input} placeholder="123456" value={codigoVerifPass} onChange={e=>setCodigoVerifPass(e.target.value)} />
                <div style={ms.label}>Nueva contraseña</div>
                <input style={ms.input} type="password" placeholder="Mínimo 6 caracteres" value={nuevaPass} onChange={e=>setNuevaPass(e.target.value)} />
                <div style={ms.label}>Repetir contraseña</div>
                <input style={ms.input} type="password" placeholder="Repite la contraseña" value={nuevaPass2} onChange={e=>setNuevaPass2(e.target.value)} />
                <div style={{display:'flex', gap:10}}>
                  <button style={{...ms.btnAdd, background:'#eee', color:'#555'}} onClick={() => {setCambiandoPass(false); setCodigoEnviadoPass(false)}}>Cancelar</button>
                  <button style={{...ms.btnAdd, opacity:guardando?0.7:1}} onClick={verificarYCambiarPass} disabled={guardando}>
                    {guardando ? 'Guardando...' : '💾 Confirmar cambio'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={ms.section}>
            <div style={ms.sectionTitle}>🔐 Cambiar PIN de manager</div>
            {!cambiandoPin ? (
              <button style={ms.btnAdd} onClick={() => setCambiandoPin(true)}>🔐 Cambiar PIN</button>
            ) : !codigoEnviadoPin ? (
              <div>
                <div style={{fontSize:14, color:'#666', marginBottom:12}}>Te enviaremos un código de verificación al email registrado.</div>
                <div style={{display:'flex', gap:10}}>
                  <button style={ms.btnAdd} onClick={() => enviarCodigo('pin')}>📧 Enviar código</button>
                  <button style={{...ms.btnAdd, background:'#eee', color:'#555'}} onClick={() => setCambiandoPin(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:8, maxWidth:400}}>
                <div style={ms.label}>Código recibido por email</div>
                <input style={ms.input} placeholder="123456" value={codigoVerifPin} onChange={e=>setCodigoVerifPin(e.target.value)} />
                <div style={ms.label}>Nuevo PIN (4 dígitos)</div>
                <input style={{...ms.input, textAlign:'center', fontSize:24, letterSpacing:8}} type="password" placeholder="••••" maxLength={4} value={nuevoPin} onChange={e=>setNuevoPin(e.target.value)} />
                <div style={{display:'flex', gap:10}}>
                  <button style={{...ms.btnAdd, background:'#eee', color:'#555'}} onClick={() => {setCambiandoPin(false); setCodigoEnviadoPin(false)}}>Cancelar</button>
                  <button style={{...ms.btnAdd, opacity:guardando?0.7:1}} onClick={verificarYCambiarPin} disabled={guardando}>
                    {guardando ? 'Guardando...' : '💾 Confirmar cambio'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>}

      </div>
    </div>
  )
}

export default function Panel() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [chiringuito, setChiringuito] = useState(null)
  const [vistaManager, setVistaManager] = useState(false)
  const [pinVerificado, setPinVerificado] = useState(false)
  const [nuevaPassRecovery, setNuevaPassRecovery] = useState('')
  const [nuevaPassRecovery2, setNuevaPassRecovery2] = useState('')
  const [recoveryLoading, setRecoveryLoading] = useState(false)
  const [recoveryMsg, setRecoveryMsg] = useState('')
  const pedidosAnteriores = useRef([])

  function sonar() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch(e) {}
  }

  // ← ÚNICO CAMBIO: bloqueamos que se setee la sesión si venimos de recovery
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (window.location.hash.includes('type=recovery')) return
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      if (window.location.hash.includes('type=recovery')) return
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (!session) return
    async function cargarChiringuito() {
      const { data } = await supabase.from('chiringuitos').select('*').eq('email', session.user.email).single()
      if (data) setChiringuito(data)
    }
    cargarChiringuito()
  }, [session])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('stripe') === 'ok' && chiringuito) {
      supabase.from('chiringuitos').update({ stripe_completado: true }).eq('id', chiringuito.id)
      setChiringuito(prev => ({ ...prev, stripe_completado: true }))
      window.history.replaceState({}, '', '/panel')
    }
  }, [chiringuito])

  async function cargarPedidos() {
    if (!chiringuito) return
    const { data, error } = await supabase
      .from('pedidos')
      .select(`*, hamacas(numero), pedido_items(cantidad, precio_unitario, productos(nombre))`)
      .eq('chiringuito_id', chiringuito.id)
      .order('created_at', { ascending: false })
    if (!error) {
      const nuevos = data.filter(p => p.estado === 'pendiente')
      const anteriores = pedidosAnteriores.current.filter(p => p.estado === 'pendiente')
      if (nuevos.length > anteriores.length) sonar()
      pedidosAnteriores.current = data
      setPedidos(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!chiringuito) return
    cargarPedidos()
    const canal = supabase.channel('pedidos')
      .on('postgres_changes', { event:'*', schema:'public', table:'pedidos' }, () => cargarPedidos())
      .subscribe()
    return () => supabase.removeChannel(canal)
  }, [chiringuito])

  async function cambiarEstado(id, estado) {
    await supabase.from('pedidos').update({ estado }).eq('id', id)
    cargarPedidos()
  }

  async function logout() {
    await supabase.auth.signOut()
    setSession(null); setChiringuito(null); setPedidos([])
    setVistaManager(false); setPinVerificado(false)
    pedidosAnteriores.current = []
  }

  async function guardarNuevaPass() {
    if (nuevaPassRecovery.length < 6) { setRecoveryMsg('⚠️ Mínimo 6 caracteres'); return }
    if (nuevaPassRecovery !== nuevaPassRecovery2) { setRecoveryMsg('⚠️ Las contraseñas no coinciden'); return }
    setRecoveryLoading(true)
    const { error } = await supabase.auth.updateUser({ password: nuevaPassRecovery })
    if (error) setRecoveryMsg('❌ Error al cambiar la contraseña')
    else {
      setRecoveryMsg('✅ Contraseña cambiada correctamente')
      setTimeout(() => window.location.href = '/panel', 2000)
    }
    setRecoveryLoading(false)
  }

  if (window.location.hash.includes('type=recovery')) return (
    <div style={ls.bg}>
      <div style={ls.card}>
        <div style={ls.logo}>🌊 Chiring</div>
        <div style={ls.sub}>Crea una nueva contraseña</div>
        <input style={ls.input} type="password" placeholder="Nueva contraseña" value={nuevaPassRecovery}
          onChange={e => setNuevaPassRecovery(e.target.value)} />
        <input style={ls.input} type="password" placeholder="Repetir contraseña" value={nuevaPassRecovery2}
          onChange={e => setNuevaPassRecovery2(e.target.value)} />
        {recoveryMsg && <div style={{...ls.error, color: recoveryMsg.includes('✅') ? '#28a745' : '#e74c3c'}}>{recoveryMsg}</div>}
        <button style={{...ls.btn, opacity: recoveryLoading ? 0.7 : 1}} onClick={guardarNuevaPass} disabled={recoveryLoading}>
          {recoveryLoading ? 'Guardando...' : '💾 Guardar nueva contraseña'}
        </button>
      </div>
    </div>
  )

  if (!session) return <Login onLogin={() => {}} />
  if (vistaManager && !pinVerificado)
    return <PinManager pinCorrecto={chiringuito?.pin_manager || '1234'} onAcceso={() => setPinVerificado(true)} />
  if (vistaManager && pinVerificado)
    return <Manager chiringuito={chiringuito} onVolver={() => { setVistaManager(false); setPinVerificado(false) }} />

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
            <div style={s.logo}>🌊 Chiring</div>
            <div style={s.logoSub}>{chiringuito?.nombre || 'Panel del Chiringuito'}</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <button style={s.managerBtn} onClick={() => setVistaManager(true)}>📊 Manager</button>
            <div style={s.live}>● EN VIVO</div>
            <button style={s.logoutBtn} onClick={logout}>Salir</button>
          </div>
        </div>
      </div>

      <div style={s.body}>

        {chiringuito && !chiringuito.stripe_completado && (
          <BannerStripe chiringuito={chiringuito} />
        )}

        <div style={s.statsRow}>
          <div style={s.stat}><div style={s.statNum}>{pedidos.filter(p=>p.estado==='pendiente').length}</div><div style={s.statLabel}>Nuevos</div></div>
          <div style={s.stat}><div style={s.statNum}>{pedidos.filter(p=>p.estado==='preparando').length}</div><div style={s.statLabel}>Preparando</div></div>
          <div style={s.stat}><div style={s.statNum}>{pedidos.filter(p=>p.estado==='entregado').length}</div><div style={s.statLabel}>Entregados</div></div>
          <div style={s.stat}>
            <div style={s.statNum}>{pedidos.filter(p=>p.estado==='entregado').reduce((s,p)=>s+Number(p.total),0).toFixed(0)}€</div>
            <div style={s.statLabel}>Recaudado</div>
          </div>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:40,color:'#00B4D8',fontWeight:600}}>Cargando pedidos... 🌊</div>
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
                  <div style={{...s.total, color: c.color}}>{Number(pedido.total).toFixed(2).replace('.',',')} €</div>
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
                  {pedido.estado === 'pendiente_pago' && <div style={{fontSize:13,color:'#7C3A00',fontWeight:600,textAlign:'center'}}>Esperando pago del cliente...</div>}
                  {pedido.estado === 'pendiente' && <button style={{...s.btn,background:'#0096C7'}} onClick={()=>cambiarEstado(pedido.id,'preparando')}>👨‍🍳 Aceptar pedido</button>}
                  {pedido.estado === 'preparando' && <button style={{...s.btn,background:'#28a745'}} onClick={()=>cambiarEstado(pedido.id,'entregado')}>✅ Marcar entregado</button>}
                  {pedido.estado === 'entregado' && <div style={{fontSize:13,color:'#155724',fontWeight:600,textAlign:'center'}}>Pedido completado 🎉</div>}
                </div>
                <div style={s.fecha}>{new Date(pedido.created_at).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}</div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const ls = {
  bg:{ minHeight:'100vh', background:'linear-gradient(160deg,#00B4D8,#0077B6)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins, sans-serif' },
  card:{ background:'white', borderRadius:24, padding:'40px 32px', width:'100%', maxWidth:380, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' },
  logo:{ fontSize:28, fontWeight:900, color:'#0A2540', textAlign:'center', marginBottom:4 },
  sub:{ fontSize:13, color:'#aaa', textAlign:'center', marginBottom:28, fontWeight:500 },
  input:{ width:'100%', padding:'14px 16px', borderRadius:14, border:'1.5px solid #E0E0E0', fontSize:15, fontFamily:'Poppins, sans-serif', marginBottom:12, boxSizing:'border-box', outline:'none' },
  error:{ color:'#e74c3c', fontSize:13, fontWeight:600, marginBottom:12, textAlign:'center' },
  btn:{ width:'100%', padding:'16px', background:'linear-gradient(135deg,#00B4D8,#0077B6)', color:'white', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Poppins, sans-serif' },
}

const ms = {
  tabBtn:{ padding:'8px 16px', borderRadius:20, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:'Poppins, sans-serif' },
  tabOn:{ background:'linear-gradient(135deg,#00B4D8,#0077B6)', color:'white' },
  tabOff:{ background:'white', color:'#666' },
  statCard:{ background:'white', borderRadius:20, padding:'20px 16px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.07)' },
  statIcon:{ fontSize:24, marginBottom:6 },
  statNum:{ fontSize:26, fontWeight:900, color:'#0A2540' },
  statLabel:{ fontSize:12, color:'#aaa', fontWeight:600, marginTop:4 },
  section:{ background:'white', borderRadius:20, padding:'20px', marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,0.07)' },
  sectionTitle:{ fontSize:15, fontWeight:900, color:'#0A2540', marginBottom:14 },
  prodRow:{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #F0F0F0' },
  prodRank:{ fontSize:18, minWidth:28 },
  prodQty:{ background:'#EBF8FF', color:'#0077B6', borderRadius:10, padding:'4px 10px', fontSize:12, fontWeight:700 },
  histRow:{ display:'flex', alignItems:'center' },
  input:{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid #E0E0E0', fontSize:14, fontFamily:'Poppins, sans-serif', marginBottom:8, boxSizing:'border-box', outline:'none' },
  btnAdd:{ marginTop:8, padding:'12px 20px', background:'linear-gradient(135deg,#00B4D8,#0077B6)', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Poppins, sans-serif' },
  toggleBtn:{ padding:'6px 12px', color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Poppins, sans-serif' },
  label:{ fontSize:13, fontWeight:700, color:'#0A2540', marginBottom:6 },
}

const s = {
  bg:{ minHeight:'100vh', background:'#F0F8FF', fontFamily:'Poppins, sans-serif' },
  header:{ background:'linear-gradient(135deg,#00B4D8,#0096C7)', padding:'24px 20px', color:'white' },
  headerInner:{ display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:600, margin:'0 auto' },
  logo:{ fontSize:22, fontWeight:900, letterSpacing:-0.5 },
  logoSub:{ fontSize:12, opacity:0.75, marginTop:3 },
  live:{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:700, color:'#90FF90' },
  logoutBtn:{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:700, color:'white', cursor:'pointer' },
  managerBtn:{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.4)', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:700, color:'white', cursor:'pointer' },
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