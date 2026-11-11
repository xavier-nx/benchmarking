# PlasTrack

Dashboard web estático para explorar pasadas satelitales simuladas sobre las islas Galápagos. Lee `data_copernicus_sample.json` en el navegador y presenta indicadores, ubicaciones en un mapa y una tendencia de nubosidad y aptitud del sensor.

## Ejecutar localmente

No abras `index.html` directamente como archivo: los navegadores suelen bloquear `fetch()` desde `file://`. Desde la raíz del proyecto, inicia un servidor estático:

```bash
python3 -m http.server 8000
```

Abre <http://localhost:8000>. También puedes usar la extensión Live Server de VS Code.

## Desplegar en GitHub Pages

1. Crea un repositorio en GitHub. Para una publicación pública sencilla, crea el repositorio como **Public** y usa el nombre que prefieras. Asegúrate de publicar el contenido en una rama llamada `main`.
2. Sube a la raíz del repositorio `index.html`, `styles.css`, `app.js`, `data_copernicus_sample.json`, `README.md`, `reporte_tecnico.md`, `bitacora_prompts.md` y `checklist_qa.md`. También puedes clonar el repositorio y subir los archivos desde la terminal:

	```bash
	git add index.html styles.css app.js data_copernicus_sample.json README.md reporte_tecnico.md bitacora_prompts.md checklist_qa.md
	git commit -m "Preparar dashboard PlasTrack para GitHub Pages"
	git push -u origin main
	```

	Ejecuta estos comandos desde el repositorio clonado y después de configurar su remoto `origin`.
3. En GitHub, abre **Settings > Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**. Elige la rama `main` y la carpeta **/(root)**; guarda los cambios.
5. Espera a que GitHub indique que el despliegue terminó correctamente. La URL aparece en **Settings > Pages**. Una URL de proyecto suele tener la forma `https://<usuario>.github.io/<repositorio>/`; verifica la URL exacta que GitHub asigne.
6. Reemplaza el marcador siguiente por la URL real en este README:

	**URL pública:** `[URL_GITHUB_PAGES]`

	Por ejemplo, sustituye el texto completo `[URL_GITHUB_PAGES]` por `https://<usuario>.github.io/<repositorio>/`. No publiques el marcador sin reemplazar.
7. Abre la URL pública y verifica que carguen el dashboard y el JSON. Comprueba también la URL del archivo de datos añadiendo `data_copernicus_sample.json` al directorio del sitio.

El proyecto no requiere compilación ni backend. Leaflet, Chart.js, sus estilos y las teselas cartográficas se cargan desde servicios externos, por lo que el navegador necesita conexión a internet. GitHub Pages sirve archivos estáticos; no se ha configurado un despliegue público desde este entorno, por lo que la URL real debe completarse después de publicar el repositorio.

## Indicadores y datos

- **Pasadas satelitales:** cantidad de registros válidos encontrados en el JSON.
- **Nubosidad promedio:** promedio aritmético de `nubosidad_pct` en registros que contienen un valor numérico.
- **Aptitud promedio:** promedio aritmético de `aptitud_sensor_pct` en registros que contienen un valor numérico.
- **Registros con acumulación:** cuenta de registros con `acumulacion_zonas` mayor que cero; no es la suma del nivel de acumulación.
- **Periodo analizado:** fechas mínima y máxima presentes en `fecha`.

El mapa representa cada pasada con un círculo geográfico. El radio y el color reflejan el valor de `acumulacion_zonas` (0 a 4). El gráfico traza `nubosidad_pct` y `aptitud_sensor_pct` por `fecha`. Los campos faltantes se muestran como no disponibles o se omiten de la visualización correspondiente; si la respuesta está anidada, `app.js` intenta extraer arreglos comunes y propiedades GeoJSON sin alterar el archivo.

## Tecnologías

- HTML5, CSS3 y JavaScript vanilla.
- Leaflet.js para el mapa y teselas de OpenStreetMap.
- Chart.js para la serie temporal.
- JSON local cargado con `fetch()` mediante una ruta relativa.

Los datos de muestra son simulados con fines académicos y no representan mediciones oficiales de Copernicus.

## QA y entregables

- [Checklist QA y pruebas de publicación](checklist_qa.md)
- [Bitácora de prompts de IA](bitacora_prompts.md)
- [Reporte técnico consolidado](reporte_tecnico.md)

Antes de la entrega, ejecuta las pruebas manuales pendientes de `checklist_qa.md`, especialmente la comprobación en navegador móvil/escritorio, la consola del navegador y la URL pública de GitHub Pages.