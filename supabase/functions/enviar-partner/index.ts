import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

serve(async (req) => {
  const { email, nombre, codigo_ref } = await req.json()

  const link = `https://chiringapp.com/registro?ref=${codigo_ref}`

  const html = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#0A2540,#0077B6);padding:32px;text-align:center">
        <div style="font-size:32px;font-weight:900;color:white;letter-spacing:-1px">?? chiringapp</div>
        <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:6px">Programa de Partners</div>
      </div>
      <div style="padding:36px 32px">
        <h1 style="font-size:24px;font-weight:800;color:#0A2540;margin-bottom:8px">¡Bienvenido/a, ${nombre}! ??</h1>
        <p style="color:#555;font-size:15px;line-height:1.7;margin-bottom:24px">
          Ya eres oficialmente <strong>Chiring Partner</strong>. Aquí tienes tu link único para compartir con chiringuitos:
        </p>
        <div style="background:#F0F8FF;border:2px solid #00B4D8;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
          <div style="font-size:12px;color:#888;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Tu link de referido</div>
          <div style="font-size:15px;font-weight:800;color:#0077B6;word-break:break-all">${link}</div>
        </div>
        <p style="color:#555;font-size:14px;line-height:1.7;margin-bottom:32px">
          Cada vez que un chiringuito se registre usando tu link, ganarás el <strong>1% de cada pedido</strong> que procesen. Sin límite, sin caducidad.
        </p>
        <div style="display:grid;gap:12px;margin-bottom:32px">
          <div style="background:#F8FAFF;border-radius:10px;padding:14px 16px;display:flex;gap:12px;align-items:center">
            <span style="font-size:20px">??</span>
            <div><strong style="color:#0A2540">Comparte tu link</strong><br><span style="font-size:13px;color:#888">Envíalo por WhatsApp, email o como quieras</span></div>
          </div>
          <div style="background:#F8FAFF;border-radius:10px;padding:14px 16px;display:flex;gap:12px;align-items:center">
            <span style="font-size:20px">??</span>
            <div><strong style="color:#0A2540">Gana comisión</strong><br><span style="font-size:13px;color:#888">1% de cada pedido de tus chiringuitos referidos</span></div>
          </div>
          <div style="background:#F8FAFF;border-radius:10px;padding:14px 16px;display:flex;gap:12px;align-items:center">
            <span style="font-size:20px">??</span>
            <div><strong style="color:#0A2540">Sin límite</strong><br><span style="font-size:13px;color:#888">Cuantos más chiringuitos traigas, más ganas</span></div>
          </div>
        </div>
        <p style="color:#aaa;font-size:12px;text-align:center">¿Tienes dudas? Escríbenos a <a href="mailto:appchiring@gmail.com" style="color:#00B4D8">appchiring@gmail.com</a></p>
      </div>
    </div>
  `

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Chiring <hola@chiringapp.com>",
      to: email,
      subject: "?? ¡Ya eres Chiring Partner! Tu link único",
      html
    })
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  })
})
