# Traza — Planes competitivos + precios en córdobas (BCN) en el portfolio DenDEV

## Resumen ejecutivo
Actualización de la sección de planes del portfolio estático (HTML/CSS/JS puro): se mantuvieron los precios (US$200 / 400–600 / 700–1.200 / 1.500+), se elevó el alcance del Plan Pro a 12 páginas y del Premium a 15, se enriquecieron las listas de funcionalidades de los 4 planes (tarjetas y modales sincronizados), se agregó la nota de mantenimiento mensual (ingreso recurrente desde US$15) y el equivalente en córdobas bajo cada precio usando la tasa oficial del BCN precargada. Verificado con node --check, guardián de estilo y smoke test HTTP; commit `6528144` en `main`. Falta: push a GitHub Pages (pendiente de confirmación del dueño).

## 1. Objetivo y criterios de aceptación
- **Objetivo**: volver los planes más atractivos y rentables según el mercado de Nicaragua/Ocotal, manteniendo precios y mostrando el equivalente en córdobas con la tasa oficial del BCN.
- **Criterios cumplidos**: precios sin cambios; Pro = 12 páginas; Premium = 15 páginas; features nuevas coherentes tarjeta↔modal; nota de mantenimiento; córdobas con tasa BCN y periodo visible; cero regresiones en el resto del sitio.

## 2. Fases (cronológicas)

### Fase 1 — Investigación de mercado (sin código)
- Fuentes: Neothek Managua ($497/10 págs + hosting/dominio/logo, $697/20 págs, $997 e-commerce), NicaPages ($130–190), Nica Web Design ($399 landing, $749 sitio, $899 rediseño), benchmark pyme Centroamérica US$500–2.000, salario mínimo NI 2026 (C$6.188–13.848/mes), tasa BCN nov-2026 C$36,62/US$.
- **Decisión**: precios se mantienen (ya competitivos); el diferencial se logra agregando valor percibido de bajo costo y subiendo alcance de páginas.

### Fase 2 — Tarjetas de planes (`index.html` ~líneas 174–255)
- `data-usd="200|400|700|1500"` en cada `<h4>` de precio + `<p class="precio-cordobas">` vacío debajo (lo llena JS).
- Listas "Incluye" nuevas: WhatsApp directo, SEO esencial/técnico, Google Analytics, sitemap + Search Console, Google Maps, datos estructurados + Open Graph, rondas de revisión (1/2/3), soporte (15/30/60/90 días), tienda con pagos, capacitación + manual, respaldos.
- Escalera de valor explícita: "Todo lo del Plan Básico" (Pro) y "Todo lo del Plan Pro" (Premium).
- Estandarización: "Desde: $ 400" → "Desde: US$ 400" (consistencia con el plan Básico).
- **Si alguien altera esta parte**: quitar `data-usd` o `.precio-cordobas` deja la tarjeta solo en dólares (degradación limpia, no rompe nada); cambiar el número de páginas aquí obliga a sincronizar el modal correspondiente.

### Fase 3 — Modales sincronizados (`index.html` ~líneas 395–790)
- Plan Básico: "Alcance y Contenido" ahora menciona anti-spam, WhatsApp, SEO esencial, Analytics, imágenes optimizadas.
- Plan Pro: 3 menciones "5 páginas"→"12 páginas" (ficha, costo, alcance) + features nuevas.
- Plan Premium: 2 menciones "10 páginas"→"15 páginas" + datos estructurados, Open Graph, 3 rondas, 60 días soporte.
- Plan Gold: alcance ampliado con respaldos automáticos y 90 días de soporte con documentación.
- **Si alguien altera esta parte**: el texto de páginas/precio del modal debe seguir coincidiendo con la tarjeta y con lo que se negocie en contrato; el modal es el documento comercial detallado.

### Fase 4 — Conversión a córdobas (`js/script.js` ~líneas 199–240)
- Nueva función `actualizarPreciosEnCordobas()` llamada en `DOMContentLoaded`.
- Constantes locales: `TASA_OFICIAL_BCN = 36.62`, `PERIODO_TASA_BCN = 'noviembre 2026'`. **Actualización MENSUAL obligatoria** (el BCN pre-anuncia el mes completo: crawling peg).
- Formato: `Intl.NumberFormat('es-NI', { currency: 'NIO', maximumFractionDigits: 0 })`.
- Guardas: si no hay `[data-usd]` en `#planes`, o `Intl` no existe, la función retorna sin romper nada.
- Banner de cabecera del archivo actualizado (regla R3: banner veraz).
- **Si alguien altera esta parte**: olvidar actualizar la tasa deja el equivalente desfasado (deriva de centavos en el mes, más con el tiempo); la fuente de la tasa oficial es la publicación mensual del BCN.

### Fase 5 — Estilos (`css/style.css` ~líneas 672–700)
- `.precio-cordobas`: 0.85rem, semibold, `min-height: 1.2rem` (evita salto de layout al llenarse por JS), hereda el color de la tarjeta (blanco en 3, oscuro en Gold sobre amarillo).
- `.nota-mantenimiento`: borde dashed discreto, max-width 720px, centrada bajo la grilla.
- **Si alguien altera esta parte**: quitar `min-height` provoca un reflow visible al cargar; cambiar fondo de la sección requiere revisar contraste de la nota.

## 3. Archivos afectados
| Archivo | Rol | Punto central |
|---|---|---|
| `index.html` | Estructura: tarjetas, modales, nota | sección `#planes` (~168–255) y 4 modales |
| `js/script.js` | Conversión USD→NIO | `actualizarPreciosEnCordobas()` al final |
| `css/style.css` | Estilo de línea córdobas y nota | bloque tras `.detalle-check` |

## 4. Contrato técnico
- Selector de entrada: `#planes [data-usd]` (número en el atributo).
- Destino: hermano `.precio-cordobas` dentro del mismo `card-body`.
- Salida: `≈ C$ 7,324 · TC oficial BCN, noviembre 2026`.
- No hay API externa: la tasa es constante local (decisión por CORS/bloqueo del SOAP del BCN desde navegador).

## 5. Reglas de negocio y seguridad
- Dinero: la conversión es solo informativa (equivalente aproximado); el precio contractual sigue en US$. Redondeo a entero (sin float para cobros; es display, no cálculo contable).
- El equivalente usa redondeo comercial (`maximumFractionDigits: 0`).
- Sin secretos en código: el token de push vive en `.env` (ignorado por git, verificado).

## 6. Pruebas realizadas (comandos exactos y evidencia)
- `node --check js/script.js` → OK ("SINTAXIS JS OK").
- `pwsh .../validar-estilo.ps1 -Ruta <proyecto> -SoloNuevos` → 0 errores, 0 avisos, 0 notas.
- `python -m http.server 8091 --bind 127.0.0.1` + `curl` → HTTP 200 en `/index.html`, `/js/script.js`, `/css/style.css`; verificado presencia de: 4×`data-usd`, 4×`precio-cordobas`, 1×`nota-mantenimiento`, 4×"Hasta 12 p", 3×"Hasta 15 p", 2×"anti-spam".
- Runtime de conversión en Node (misma API Intl del navegador): US$200→C$7.324, US$400→C$14.648, US$700→C$25.634, US$1500→C$54.930.
- NOTA: sitio estático sin `package.json` → no aplica npm typecheck/lint/test/build; se declaran las verificaciones equivalentes usadas.
- NO verificado aún: render en navegador real y GitHub Pages en producción (pendiente del push).

## 7. Decisiones y alternativas descartadas
- **Precarga mensual vs API en vivo**: descartada la API espejo (allratestoday, dependencia externa + key en cliente) y el Cloudflare Worker (infra propia + riesgo de bloqueo del BCN a IPs de datacenter). La tasa precargada nunca falla y el BCN pre-anuncia el mes; arquitectura lista para enchufar una API después.
- **Bajar techos de precio (Pro→500, Premium→1.000)**: descartado por decisión del dueño tras ver el análisis; en su lugar se subió el alcance (12/15 páginas), que responde al mismo problema competitivo vs Neothek.
- **"Mínimo 12 páginas garantizadas"**: descartado (regalaría US$33/página custom); se implementó "Hasta 12".
- **Córdobas en modales**: no se agregó; los rangos negociables no se convierten, solo el "Desde" de las tarjetas donde el cliente decide.

## 8. Deuda/riesgos pendientes
- **Actualización mensual de la tasa** (2 constantes en `script.js`): riesgo de desfase si se olvida; mitigación: handoff y este documento. Dueño: Denis.
- Push a producción pendiente de confirmación.
- A futuro: foto/testimonio del primer cliente ocotaleño (prueba social local).
- Experto humano requerido: nadie externo; revisión visual final del dueño en navegador tras el deploy.

## 9. Cómo reproducir la verificación
```powershell
# desde C:\SERVIDOR\Apache24\htdocs\Dendev93.github.io
node --check js/script.js
python -m http.server 8091 --bind 127.0.0.1
# abrir http://127.0.0.1:8091/ (sección Planes)
# NOTA: el puerto 8080 lo ocupa Apache/XAMPP local; usar 8091.
```
