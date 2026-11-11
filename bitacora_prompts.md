# Bitácora de prompts de IA utilizados

**Proyecto:** PlasTrack — benchmarking de herramientas de BI y prototipo del dashboard  
**Equipo:** [Completar integrantes]  
**Asignatura:** Inteligencia de Negocios, Unidad 1  
**Asistente utilizado en esta interacción:** GitHub Copilot. Anotar el nombre/versionado del modelo que muestre la interfaz si lo exige la rúbrica.

> Esta tabla resume los cuatro prompts de la actividad. Pega en los espacios al final de este documento el texto íntegro que realmente ingresó el equipo; no reemplaces las instrucciones reales por esta síntesis. Las respuestas de IA son borradores y no equivalen a validación científica ni a verificación de precios/licencias.

| N° | Objetivo | Prompt utilizado (resumen) | Resumen de la respuesta de la IA | Archivos generados/modificados | Ajustes humanos | Resultado/evidencia |
|---:|---|---|---|---|---|---|
| 0 | Generar datos de muestra para el prototipo. | Pedir un JSON válido con exactamente 15 pasadas simuladas, fechas de enero a abril de 2024, coordenadas plausibles de Galápagos, seis islas y zonas, campos obligatorios, satélites indicados, rangos de nubosidad/aptitud/acumulación y relación inversa aproximada. | Se produjo el dataset sintético `data_copernicus_sample.json` y un resumen tabular. Los valores se identifican como ficticios y académicos, no como mediciones oficiales de Copernicus. | `data_copernicus_sample.json` (generado en la etapa inicial del proyecto). | Validar estructura JSON, cantidad, fechas, islas, coordenadas y rangos. Registrar cualquier modificación manual efectiva; no cambiar el archivo sin anotar la razón. | Validación estructural ejecutada: 15 registros, campos/rangos esperados y cronología. Conservar prompt íntegro y salida usada como evidencia. |
| 1 | Prototipar el dashboard estático. | Pedir HTML/CSS/JavaScript vanilla con `fetch()` relativo, KPIs, Leaflet, Chart.js, estados de error, responsividad, README y despliegue en GitHub Pages. | Se generó la aplicación con tarjetas KPI, mapa de círculos graduados y gráfico temporal; el README describe ejecución local y publicación. | `index.html`, `styles.css`, `app.js`, `README.md`. `app.js` recibió ajustes de robustez durante esta revisión QA. | Revisar campos y cálculos; comprobar que `acumulacion_zonas > 0` cuenta registros, que círculos no son un heatmap y que la vista responde a distintos anchos. Se añadió manejo visible de CDN ausente y escape HTML de popups. Completar pruebas visuales manuales. | Prueba automatizada con DOM simulado: 15 filas, nubosidad media 44.8%, aptitud media 68.8%, 14 registros con acumulación positiva, 15 marcadores y dos series de 15 valores. Guardar capturas móvil/escritorio y prueba de URL pública. |
| 2 | Redactar el reporte técnico consolidado. | Pedir un documento tipo paper en español con benchmarking, arquitectura, KPIs, bitácora, conclusiones y referencias, sin inventar precios ni métricas. | Se redactó el benchmark cualitativo y se calcularon indicadores desde el JSON; se diferenciaron datos sintéticos, acumulación positiva y umbral de criticidad propuesto. | `reporte_tecnico.md`. | Completar nombres/institución/fecha; acordar escala y puntuaciones con el equipo; revisar citas y requisitos de formato del docente. | Se calcularon directamente 15 registros, medias y conteos. Puntajes de herramientas son cualitativos, no mediciones de laboratorio; confirmar precios/licencias vigentes antes de entregar. |
| 3 | Ejecutar QA básico y preparar el despliegue. | Pedir diagnóstico de rutas/CDN/responsividad/errores, checklist QA, instrucciones de GitHub Pages, actualización del README y bitácora con prompts. | Se documentaron pruebas y pendientes, se añadió el marcador `[URL_GITHUB_PAGES]` y se mejoró la degradación del dashboard ante la ausencia de Leaflet.js o Chart.js. | `app.js`, `README.md`, `checklist_qa.md`, `bitacora_prompts.md`. | Revisar el código, confirmar que los avisos no detienen los KPIs, ejecutar las pruebas documentadas y completar la URL real. La verificación en navegador y la publicación pública siguen pendientes hasta realizarlas. | `node --check`, pruebas funcionales con APIs simuladas y comprobación HTTP local completadas. No se afirma que GitHub Pages esté desplegado ni que se haya hecho una revisión visual real. Usar `checklist_qa.md` para cerrar pendientes. |

## Prompts completos

Pega cada instrucción completa tal como fue enviada. Si hubo iteraciones, conserva cada versión y numérala. No incluyas credenciales, tokens ni datos personales.

### Prompt 0 — generación del dataset

```text
[PEGAR AQUÍ EL PROMPT COMPLETO UTILIZADO PARA GENERAR data_copernicus_sample.json]
```

### Prompt 1 — dashboard

```text
[PEGAR AQUÍ EL PROMPT COMPLETO UTILIZADO PARA GENERAR EL DASHBOARD]
```

### Prompt 2 — reporte técnico

```text
[PEGAR AQUÍ EL PROMPT COMPLETO UTILIZADO PARA GENERAR reporte_tecnico.md]
```

### Prompt 3 — QA y despliegue

```text
[PEGAR AQUÍ EL PROMPT COMPLETO UTILIZADO PARA QA Y DESPLIEGUE]
```

## Lecciones aprendidas

- Un dataset sintético puede servir para validar integración y visualización, pero no para respaldar conclusiones ambientales ni atribuciones a Copernicus.
- Los indicadores deben tener fórmula, unidad, fuente y límites de interpretación explícitos. Contar registros con acumulación no es lo mismo que contar zonas críticas.
- Una prueba de sintaxis o con DOM simulado no reemplaza una prueba de navegador, revisión de consola, prueba en dispositivos ni validación de la URL pública.
- Las rutas relativas y el estado de respuesta del JSON son esenciales en GitHub Pages, especialmente cuando el sitio usa una URL de proyecto con prefijo de repositorio.
- El uso de CDNs y teselas externas simplifica el prototipo, pero introduce dependencias de red, disponibilidad y políticas de uso.
- La IA acelera el prototipado; el equipo sigue siendo responsable de validar datos, seguridad, referencias, licencias, comportamiento y resultados.

## Buenas prácticas para prompts

- Definir rol, contexto, propósito, audiencia y formato de salida antes de pedir código o documentación.
- Incluir el esquema exacto de datos, campos obligatorios, tipos, rangos y ejemplos válidos.
- Separar requisitos funcionales, visuales, de accesibilidad, responsividad, errores y despliegue.
- Pedir que se declaren supuestos e incertidumbres; prohibir que se inventen datos, precios, referencias o resultados.
- Solicitar salidas delimitadas por archivo y pasos de validación reproducibles.
- Probar la salida con datos reales del proyecto (indicando si son simulados), revisar errores y registrar los cambios humanos.
- Guardar prompt, fecha, herramienta/modelo, respuesta relevante, archivos afectados y evidencia verificable.
- No pegar secretos, tokens, credenciales ni datos personales en un prompt.
