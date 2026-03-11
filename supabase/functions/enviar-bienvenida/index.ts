import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, nombre } = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Chiring <hola@chiringapp.com>",
        to: email,
        subject: "¡Bienvenido/a a Chiring! 🌊",
        html: `
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">

  <div style="background:linear-gradient(135deg,#0A2540,#0077B6);padding:40px 32px;text-align:center;border-radius:16px 16px 0 0;">
    <div style="font-size:40px;margin-bottom:8px;">🌊</div>
    <div style="font-size:26px;font-weight:900;color:white;letter-spacing:-1px;">chiringapp</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">La app para chiringuitos de playa</div>
  </div>

  <div style="padding:40px 32px;background:white;">
    <h2 style="font-size:22px;font-weight:800;color:#0A2540;margin-bottom:8px;">¡Bienvenido/a, ${nombre}! 🎉</h2>
    <p style="font-size:15px;color:#555;line-height:1.7;margin-bottom:28px;">
      Tu cuenta en Chiring está lista. Ya puedes configurar tu menú, añadir tus hamacas y empezar a recibir pedidos directamente desde la playa.
    </p>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="https://chiringapp.com/panel" style="display:inline-block;background:linear-gradient(135deg,#00B4D8,#0077B6);color:white;padding:16px 40px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:800;box-shadow:0 8px 24px rgba(0,119,182,0.3);">
        🚀 Ir a mi panel
      </a>
    </div>

    <div style="gap:12px;margin-bottom:32px;">
      <div style="display:flex;align-items:center;gap:14px;background:#F8FAFF;border-radius:12px;padding:14px 18px;margin-bottom:10px;">
        <span style="font-size:24px;">📱</span>
        <div>
          <div style="font-weight:700;color:#0A2540;font-size:14px;">Configura tu menú</div>
          <div style="font-size:12px;color:#888;">Añade productos, precios y fotos</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;background:#F8FAFF;border-radius:12px;padding:14px 18px;margin-bottom:10px;">
        <span style="font-size:24px;">🪑</span>
        <div>
          <div style="font-weight:700;color:#0A2540;font-size:14px;">Añade tus hamacas</div>
          <div style="font-size:12px;color:#888;">Cada una con su propio QR único</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;background:#F8FAFF;border-radius:12px;padding:14px 18px;">
        <span style="font-size:24px;">💳</span>
        <div>
          <div style="font-weight:700;color:#0A2540;font-size:14px;">Conecta tu cuenta bancaria</div>
          <div style="font-size:12px;color:#888;">Para recibir los pagos automáticamente</div>
        </div>
      </div>
    </div>

    <div style="background:#FFF8E1;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
      <p style="font-size:13px;color:#856404;margin:0;">
        💡 <strong>Recuerda:</strong> Solo pagas cuando vendes — 15% por pedido procesado. Sin cuotas fijas.
      </p>
    </div>

    <p style="font-size:13px;color:#aaa;text-align:center;">
      ¿Tienes dudas? Escríbenos a <a href="mailto:hola@chiringapp.com" style="color:#00B4D8;">hola@chiringapp.com</a>
    </p>
  </div>

  <div style="background:#0A2540;padding:24px 32px;text-align:center;border-radius:0 0 16px 16px;">
    <div style="font-size:16px;font-weight:900;color:white;margin-bottom:6px;">🌊 chiringapp</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.4);">© 2026 ChiringApp · Todos los derechos reservados</div>
    <div style="margin-top:10px;">
      <a href="https://chiringapp.com" style="color:rgba(255,255,255,0.5);font-size:12px;text-decoration:none;">chiringapp.com</a>
    </div>
  </div>

</div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});