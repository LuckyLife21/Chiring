# Cómo comprobar que todas las mejoras están hechas

Guía paso a paso para verificar cada funcionalidad.

---

## 1. Partner: sin duplicados en “Chiringuitos que has traído”

- Entra en **Partners** (landing → Partners o `/partner`) e inicia sesión.
- En la sección **“Chiringuitos que has traído”** no deberías ver el mismo chiringuito repetido varias veces (ej. tres “Playa Luna”). Si antes había duplicados, ahora solo debe aparecer uno por nombre.

---

## 2. Checklist de onboarding (primeros pasos)

- Entra en el **Panel** (iniciar sesión como chiringuito).
- Si aún no tienes pedidos, verás el mensaje: *“¿Primera vez? Entra en **Manager** (arriba) para ver los primeros pasos…”*.
- Haz clic en **Manager**, introduce tu **PIN de propietario** (el de 4 dígitos que creaste en el registro) y pulsa Acceder.
- Dentro de Manager, **si no tienes productos o no tienes hamacas**, en la parte de arriba verás la barra **“Primeros pasos”** con: 1) Añade productos, 2) Crea hamacas, 3) Imprime los QR. Al completar productos y hamacas, los pasos se marcan con ✓.
- Si ya tienes productos y hamacas, esa barra no se muestra (está pensada para quien empieza de cero).

---

## 3. Botón flotante “Probar gratis”

- Ve a la **página principal** (landing, `/`).
- Haz **scroll hacia abajo** (un poco más de la mitad de la página).
- Debe aparecer un botón fijo **“Probar gratis →”** abajo a la derecha que lleva a `/registro`.

---

## 4. Límite de envíos (anti-spam)

**Límites actuales:**

- **Formulario de contacto:** no se puede enviar más de un mensaje cada **1 minuto** (60 segundos). Si intentas enviar otro antes, verás: *“Espera un minuto antes de enviar otro mensaje.”*
- **Registro:** no se puede intentar registrarse más de una vez cada **1 minuto y medio** (90 segundos). Si lo intentas antes: *“Espera un minuto y medio antes de intentar de nuevo (límite anti-spam).”*

**Cómo comprobarlo:**

- Contacto: envía un mensaje, vuelve a enviar enseguida → debe salir el aviso de esperar 1 minuto.
- Registro: intenta registrarte, cancela o falla, e intenta de nuevo al momento → debe salir el aviso de esperar 1,5 minutos.

---

## 5. Páginas de error (404 y “Algo ha fallado”)

**Página 404 (no encontrada):**

- En el navegador entra en una URL que no exista, por ejemplo:  
  `https://tu-dominio.com/ruta-que-no-existe`
- Deberías ver la página **“Página no encontrada”** con enlace a inicio y a contacto.

**Página “Algo ha fallado”:**

- Esta página sale cuando la app lanza un error y el Error Boundary la captura (por ejemplo un fallo inesperado al cargar Manager).
- Para **no** depender de un error real, puedes forzarla en desarrollo: en `src/main.jsx` comenta temporalmente el contenido de una ruta y pon algo que lance error (ej. `throw new Error('test')`), recarga y deberías ver “Algo ha fallado” con botón Reintentar y enlaces a inicio y contacto. Luego deshaz el cambio.

---

## 6. Foco visible (accesibilidad con teclado)

**Qué es:** al navegar solo con **teclado** (pulsando **Tab**), el elemento que tiene el foco debe verse claramente (por ejemplo un borde o anillo azul). Así quien no usa ratón sabe en qué botón o enlace está.

**Cómo comprobarlo:**

- En la landing o en el panel, **no uses el ratón**.
- Pulsa **Tab** varias veces: el foco debe ir pasando por enlaces y botones y en cada uno debe verse un **outline azul** alrededor del elemento activo.

---

## 7. Aria-label (accesibilidad para lectores de pantalla)

**Qué es:** un **aria-label** es un texto “invisible” que los lectores de pantalla (para personas ciegas o con baja visión) leen en voz alta para describir un botón o icono (por ejemplo “Abrir menú”, “Descargar CSV”). En pantalla no se ve; solo lo usa la tecnología de asistencia.

**Dónde está:** en botones como el del menú móvil (“Abrir menú” / “Cerrar menú”), en el botón Partners, en el botón flotante “Probar gratis”, en los botones “Descargar CSV” del Manager y en los acordeones del FAQ. No hace falta “comprobarlo” a mano salvo que uses un lector de pantalla (p. ej. NVDA, VoiceOver) y verifiques que anuncia bien esos botones.

---

## 8. SEO: meta, Open Graph y sitemap

- **Meta y Open Graph:** abre el código fuente de la landing (clic derecho → “Ver código fuente”) o usa “Inspeccionar” en `<head>`. Deberías ver etiquetas como `<meta name="description"`, `<meta property="og:title"`, `og:description`, `og:image`, etc.
- **Sitemap:** entra en `https://tu-dominio.com/sitemap.xml`. Debe cargarse un XML con las URLs del sitio (inicio, registro, panel, partner, privacidad, términos, cookies).

---

## 9. Redes sociales en el footer

- En la **landing**, baja hasta el **final de la página** (footer).
- En la columna de la izquierda, debajo del email, debe aparecer la sección **“Síguenos”** con iconos/enlaces a Instagram, Facebook y X (Twitter). Las URLs son de ejemplo; puedes cambiarlas en `src/Landing.jsx` por tus redes reales.

---

## 10. Códigos promocionales

- Entra en el **Panel** → **Manager** (con tu PIN) → pestaña **“Códigos”**.
- Crea un código (ej. `VERANO10`, tipo porcentaje, valor 10).
- En la app de pedidos (vista hamaca/carrito), en el carrito debe aparecer el campo **“Código promocional”**. Introduce el código y pulsa Aplicar: el total debe bajar según el descuento.
- **Nota:** la tabla `codigos_descuento` debe existir en Supabase (ejecuta el SQL de `supabase/migrations/20250314000000_codigos_descuento.sql` si no la has creado).

---

## 11. Export CSV (productos y hamacas)

- Panel → **Manager** → pestaña **Productos**. Arriba del listado debe haber un botón **“Descargar CSV”**. Al pulsarlo se descarga un CSV con tus productos.
- Pestaña **Hamacas**: mismo botón **“Descargar CSV”** para descargar el listado de hamacas.

---

## 12. Notificaciones del navegador

- En el **Panel** (vista de pedidos), arriba a la derecha debe aparecer el botón **“🔔 Activar notificaciones”** si aún no has dado permiso.
- Pulsa y acepta cuando el navegador pida permiso para notificaciones.
- Cuando llegue un pedido nuevo (y no tengas la pestaña en primer plano), deberías recibir una notificación del sistema además del sonido.

---

## Arreglo aplicado: Manager / PIN

Si al pulsar **Manager** e introducir el PIN aparecía “Algo ha fallado”, se ha ajustado para que:

- No se entre a Manager si `chiringuito` no está cargado (se muestra “Cargando Manager…” o se vuelve atrás).
- Solo se renderiza la vista Manager cuando hay un chiringuito válido, evitando el error.

El PIN que debes usar es el de **4 dígitos** que configuraste en el **registro** (y que se guarda al completar la bienvenida). Si no lo recuerdas, en Manager → Config puedes **cambiar el PIN** (te enviarán un código por email).
