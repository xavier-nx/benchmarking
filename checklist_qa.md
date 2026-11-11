# Checklist QA y entrega de PlasTrack

## Estado de la revisión

Las casillas `[x]` indican verificaciones efectuadas en el código o mediante pruebas ejecutadas en el entorno de desarrollo. Las casillas `[ ]` requieren una comprobación manual en navegador o en el sitio ya publicado. Una validación con DOM simulado no sustituye la prueba visual en un navegador real.

## Revisión estática y funcional

- [x] `app.js` carga los datos con la ruta relativa `./data_copernicus_sample.json`.
- [x] No se encontraron rutas absolutas locales en los recursos principales del dashboard.
- [x] Leaflet.js, su CSS y Chart.js están referenciados mediante HTTPS/CDN.
- [x] El mapa tiene un contenedor con altura CSS explícita; el gráfico usa un contenedor flexible con altura mínima y un `<canvas>`.
- [x] CSS define breakpoints para adaptar KPIs, mapa y gráfico a distintos anchos de pantalla.
- [x] `node --check app.js` finaliza sin errores de sintaxis.
- [x] Prueba de lógica con DOM y librerías simuladas: 15 registros, medias de 44.8% y 68.8%, 14 registros con `acumulacion_zonas > 0`, 15 marcadores y dos series de 15 valores.
- [x] Prueba de tolerancia: registros incompletos muestran `N/D` o cero ubicaciones sin excepción JavaScript.
- [x] Prueba de degradación: si falta Leaflet.js o Chart.js se muestra un aviso y se conserva la funcionalidad disponible.
- [x] Prueba de error de carga: un `fetch()` fallido muestra un mensaje visible.
- [x] Los valores dinámicos incluidos en los popups Leaflet se escapan antes de insertarse como HTML.
- [x] Prueba HTTP local anterior: `/`, `index.html`, `styles.css`, `app.js` y `data_copernicus_sample.json` respondieron HTTP 200; el JSON se pudo parsear con 15 registros.
- [x] El editor no reportó errores para HTML, CSS, JS, README ni documentos Markdown durante la revisión.

## Pruebas funcionales manuales en navegador

- [ ] Abrir el sitio con un servidor HTTP, no con `file://`.
- [ ] Confirmar que las cinco tarjetas muestran valores y que las fechas del periodo coinciden con el dataset.
- [ ] Confirmar que aparecen 15 ubicaciones y que el zoom permite explorar las islas.
- [ ] Abrir varios marcadores y verificar isla/zona, fecha, nubosidad, aptitud y satélite en el popup.
- [ ] Confirmar que el radio/color de los círculos sigue el nivel de `acumulacion_zonas`; no describirlo como un heatmap.
- [ ] Confirmar que el gráfico muestra las dos series, etiquetas de fecha, leyenda y tooltips.
- [ ] Probar temporalmente un JSON sin registros, con campos faltantes y con una respuesta HTTP fallida; comprobar los estados vacíos y el mensaje de error.
- [ ] Si se quiere probar la ausencia de CDN, bloquear temporalmente Leaflet o Chart.js desde DevTools y confirmar que se informa el problema sin excepción no controlada.

## Pruebas responsivas

Probar con DevTools o dispositivos reales. Registrar navegador, sistema, tamaño de viewport y resultado.

| Viewport sugerido | Resultado | Evidencia / observaciones |
|---|---|---|
| Escritorio, 1440 × 900 | [ ] Pendiente | [Completar] |
| Tableta, 768 × 1024 | [ ] Pendiente | [Completar] |
| Móvil, 390 × 844 | [ ] Pendiente | [Completar] |
| Móvil estrecho, 320 × 700 | [ ] Pendiente | [Completar] |

- [ ] No hay desplazamiento horizontal de la página.
- [ ] Las tarjetas conservan texto legible y no se solapan.
- [ ] El mapa se redimensiona después de pasar al breakpoint móvil y permite interacción táctil.
- [ ] El gráfico se mantiene legible; leyenda y fechas no quedan recortadas.
- [ ] En cada vista no hay controles tapados, textos cortados ni solapamientos.

## Consola y carga del JSON

- [ ] Abrir DevTools > **Console** y confirmar que no hay errores ni rechazos de promesas sin manejar.
- [ ] Abrir DevTools > **Network**, recargar y confirmar estado 200 para `data_copernicus_sample.json` y para los recursos CDN necesarios.
- [ ] Verificar que la URL solicitada al JSON sea relativa al sitio (en GitHub Pages de proyecto debe conservar el prefijo del repositorio).
- [ ] Confirmar que Leaflet carga las teselas con atribución visible de OpenStreetMap.
- [ ] Confirmar que no hay contenido mixto HTTP dentro de una página HTTPS.
- [ ] Revisar el estado de recursos externos si la red institucional bloquea alguno de los CDNs.

## Pruebas de publicación en GitHub Pages

- [ ] El repositorio contiene en su raíz `index.html`, `styles.css`, `app.js` y `data_copernicus_sample.json`.
- [ ] Los documentos `README.md`, `reporte_tecnico.md`, `bitacora_prompts.md` y `checklist_qa.md` están incluidos.
- [ ] En **Settings > Pages**, el origen es **Deploy from a branch**, con `main` y `/(root)`.
- [ ] El último despliegue de Pages terminó correctamente; guardar enlace o captura del estado.
- [ ] Abrir `[URL_GITHUB_PAGES]` y reemplazar el marcador en `README.md` por la URL exacta que proporciona GitHub.
- [ ] Verificar que `index.html`, CSS, JS y JSON carguen desde la URL pública; comprobar el caso de repositorio de proyecto, que suele incluir `/<repositorio>/` en la ruta.
- [ ] Recargar directamente la URL, probar mapa/gráfico e inspeccionar consola y Network.
- [ ] Confirmar que el repositorio y el dataset puedan ser públicos; no publicar credenciales ni datos personales.
- [ ] Verificar la política vigente de uso de teselas de OpenStreetMap antes de depender del servicio en producción.

## Checklist final de entrega académica

- [ ] Reporte técnico consolidado en formato paper, con autores, institución y fecha completados.
- [ ] Benchmarking y puntuaciones revisados por el equipo; precios/licencias contrastados con fuentes oficiales actuales.
- [ ] URL de GitHub Pages activa e incorporada en `README.md` en lugar de `[URL_GITHUB_PAGES]`.
- [ ] Dashboard comprobado en navegador móvil y de escritorio.
- [ ] Tarjetas KPI, mapa Leaflet y gráfico Chart.js funcionando en la URL publicada.
- [ ] JSON accesible en producción y nota de datos simulados visible.
- [ ] Bitácora de prompts incluida con transcripciones/evidencias que pide la asignatura.
- [ ] README actualizado con ejecución local y despliegue.
- [ ] Evidencia de despliegue, pruebas responsivas y revisión de consola guardada para la exposición/defensa.
