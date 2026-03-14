# ChiringApp

App de pedidos para chiringuitos de playa. Los clientes escanean el QR de su hamaca, piden y pagan desde el móvil. El chiringuito recibe los pedidos en tiempo real en su panel.

- **Landing** (/) – Presentación, precios, FAQ, contacto  
- **Registro** (/registro) – Alta de chiringuitos  
- **Panel** (/panel) – Login y gestión de pedidos para chiringuitos  
- **Partner** (/partner) – Panel de partners (comisiones por referidos)  
- **Hamaca** (/hamaca/:numero) – Carta y pedido para el cliente  

## Cómo ejecutar

```bash
npm install
npm run dev
```

La app estará en `http://localhost:5173` (o el puerto que indique Vite).

## Variables de entorno

Copia `.env.example` a `.env` y rellena los valores. Sin ellas la app no podrá conectar con Supabase ni Stripe.

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (ej. `https://xxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima (pública) de Supabase |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe (pk_test_... o pk_live_...) |
| `VITE_APP_URL` | (Opcional) URL pública de la app; si no se define, los QRs usan la URL actual |

En **Vercel** (o tu hosting), configura las mismas variables en el panel de proyecto para que el build y la app en producción funcionen.

## Build y despliegue

```bash
npm run build
```

La carpeta `dist` se puede desplegar en Vercel, Netlify, etc. El `vercel.json` ya incluye el rewrite para SPA (todas las rutas a `index.html`).

## Supabase

- Tablas: `chiringuitos`, `colaboradores`, `pedidos`, `pedido_items`, `productos`, `categorias`, `hamacas`, etc.
- Edge Functions usadas: `enviar-bienvenida`, `enviar-confirmacion`, `stripe-connect-onboarding`, `crear-pago` (para pagos con Stripe).
- RLS: ver `partner-rls-pedidos.sql` para que los partners lean pedidos de sus referidos.

## Licencia

Proyecto privado. Todos los derechos reservados.
