"use strict";

const DATA_URL = "./data_copernicus_sample.json";
const GALAPAGOS_CENTER = [-0.75, -90.55];

const elements = {
  status: document.getElementById("status-message"),
  period: document.getElementById("period-value"),
  total: document.getElementById("kpi-total"),
  cloud: document.getElementById("kpi-cloud"),
  suitability: document.getElementById("kpi-suitability"),
  accumulation: document.getElementById("kpi-accumulation"),
  kpiPeriod: document.getElementById("kpi-period"),
  mapCount: document.getElementById("map-count")
};

let map = null;

function showStatus(message) {
  const existing = elements.status.hidden ? [] : elements.status.textContent.split("\n");
  if (!existing.includes(message)) existing.push(message);
  elements.status.textContent = existing.filter(Boolean).join("\n");
  elements.status.hidden = false;
}

function initializeMap() {
  if (typeof L === "undefined" || typeof L.map !== "function") {
    elements.mapCount.textContent = "Mapa no disponible";
    showStatus("No se pudo cargar Leaflet.js; el resto del dashboard seguirá disponible.");
    return;
  }

  try {
    map = L.map("map", { scrollWheelZoom: false }).setView(GALAPAGOS_CENTER, 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);
  } catch (error) {
    map = null;
    elements.mapCount.textContent = "Mapa no disponible";
    showStatus("Leaflet.js no pudo inicializar el mapa; el resto del dashboard seguirá disponible.");
  }
}

function findRecords(payload, visited = new Set()) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object" || visited.has(payload)) return [];

  visited.add(payload);
  const preferredKeys = ["data", "records", "results", "items", "pasadas", "passes", "features"];

  for (const key of preferredKeys) {
    if (key in payload) {
      const records = findRecords(payload[key], visited);
      if (records.length) return records;
    }
  }

  for (const value of Object.values(payload)) {
    const records = findRecords(value, visited);
    if (records.length) return records;
  }

  return [];
}

function numericValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeRecord(entry, index) {
  if (!entry || typeof entry !== "object") return null;

  const properties = entry.properties && typeof entry.properties === "object"
    ? { ...entry, ...entry.properties }
    : entry;
  const coordinates = entry.geometry?.coordinates;

  // GeoJSON coordinates use [longitud, latitud]; flat records use named fields.
  const latitude = numericValue(properties.latitud ?? (Array.isArray(coordinates) ? coordinates[1] : null));
  const longitude = numericValue(properties.longitud ?? (Array.isArray(coordinates) ? coordinates[0] : null));

  return {
    id: properties.id ?? `PAS-${String(index + 1).padStart(3, "0")}`,
    fecha: typeof properties.fecha === "string" ? properties.fecha : "",
    hora: typeof properties.hora_utc === "string" ? properties.hora_utc : "",
    latitude,
    longitude,
    isla: typeof properties.isla === "string" ? properties.isla : "Isla no especificada",
    zona: typeof properties.zona === "string" ? properties.zona : "Zona no especificada",
    nubosidad: numericValue(properties.nubosidad_pct),
    aptitud: numericValue(properties.aptitud_sensor_pct),
    satellite: typeof properties.satelite === "string" ? properties.satelite : "No especificado",
    accumulation: numericValue(properties.acumulacion_zonas)
  };
}

function mean(values) {
  const available = values.filter(Number.isFinite);
  if (!available.length) return null;
  return available.reduce((sum, value) => sum + value, 0) / available.length;
}

function formatPercent(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)}%` : "N/D";
}

function formatDate(value) {
  if (!value) return "N/D";
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC"
  }).format(parsed).replace(".", "");
}

function updateKpis(records) {
  const dates = records.map(record => record.fecha).filter(value => value && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))).sort();
  const firstDate = dates[0] ?? "";
  const lastDate = dates.at(-1) ?? "";
  const accumulationCount = records.filter(record => Number.isFinite(record.accumulation) && record.accumulation > 0).length;

  elements.total.textContent = String(records.length);
  elements.cloud.textContent = formatPercent(mean(records.map(record => record.nubosidad)));
  elements.suitability.textContent = formatPercent(mean(records.map(record => record.aptitud)));
  elements.accumulation.textContent = String(accumulationCount);
  elements.kpiPeriod.textContent = firstDate && lastDate
    ? `${formatDate(firstDate)} – ${formatDate(lastDate)}`
    : "N/D";
  elements.period.textContent = firstDate && lastDate
    ? `${formatDate(firstDate)} — ${formatDate(lastDate)} ${new Date(`${lastDate}T00:00:00Z`).getUTCFullYear()}`
    : "Fechas no disponibles";
}

function popupContent(record) {
  const date = escapeHtml(record.fecha ? formatDate(record.fecha) : "Fecha no disponible");
  const time = record.hora ? ` · ${escapeHtml(record.hora)} UTC` : "";
  const cloud = formatPercent(record.nubosidad);
  const suitability = formatPercent(record.aptitud);
  const accumulation = Number.isFinite(record.accumulation) ? record.accumulation : "N/D";
  const island = escapeHtml(record.isla);
  const zone = escapeHtml(record.zona);
  const satellite = escapeHtml(record.satellite);

  return `<div class="map-popup"><strong>${island} · ${zone}</strong><span>${date}${time}</span><br><span>Nubosidad: ${cloud}</span><br><span>Aptitud: ${suitability}</span><br><span>Acumulación: ${accumulation} / 4</span><br><span>${satellite}</span></div>`;
}

function escapeHtml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, character => entities[character]);
}

function addMapMarkers(records) {
  if (!map || typeof L === "undefined" || typeof L.circleMarker !== "function") {
    elements.mapCount.textContent = "Mapa no disponible";
    return;
  }

  const bounds = [];
  let markerCount = 0;

  records.forEach(record => {
    if (!Number.isFinite(record.latitude) || !Number.isFinite(record.longitude)) return;
    if (record.latitude < -90 || record.latitude > 90 || record.longitude < -180 || record.longitude > 180) return;

    const level = Number.isFinite(record.accumulation) ? Math.min(4, Math.max(0, record.accumulation)) : 0;
    const color = level >= 3 ? "#d75c42" : level === 2 ? "#d49532" : "#167c74";
    const marker = L.circleMarker([record.latitude, record.longitude], {
      radius: 6 + level * 2,
      color,
      weight: 1.5,
      opacity: 0.95,
      fillColor: color,
      fillOpacity: 0.58
    });

    marker.bindPopup(popupContent(record));
    marker.addTo(map);
    bounds.push([record.latitude, record.longitude]);
    markerCount += 1;
  });

  elements.mapCount.textContent = `${markerCount} ${markerCount === 1 ? "ubicación" : "ubicaciones"}`;
  if (bounds.length > 1) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 9 });
  else if (bounds.length === 1) map.setView(bounds[0], 9);
}

function renderChart(records) {
  const chartElement = document.getElementById("trend-chart");
  const chartRecords = [...records].filter(record => record.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha));

  if (typeof Chart === "undefined") {
    chartElement.parentElement.innerHTML = '<p class="chart-empty">Chart.js no está disponible; no se pudo dibujar la tendencia.</p>';
    showStatus("No se pudo cargar Chart.js; el resto del dashboard seguirá disponible.");
    return;
  }

  if (!chartRecords.length) {
    chartElement.parentElement.innerHTML = '<p class="chart-empty">No hay fechas válidas para dibujar la tendencia.</p>';
    return;
  }

  new Chart(chartElement, {
    type: "line",
    data: {
      labels: chartRecords.map(record => formatDate(record.fecha)),
      datasets: [
        {
          label: "Nubosidad",
          data: chartRecords.map(record => record.nubosidad),
          borderColor: "#d75c42",
          backgroundColor: "rgb(215 92 66 / 10%)",
          pointBackgroundColor: "#d75c42",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 3.5,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.28,
          spanGaps: false
        },
        {
          label: "Aptitud del sensor",
          data: chartRecords.map(record => record.aptitud),
          borderColor: "#167c74",
          backgroundColor: "rgb(22 124 116 / 8%)",
          pointBackgroundColor: "#167c74",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 3.5,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.28,
          spanGaps: false
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          align: "start",
          labels: {
            color: "#53665f",
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 17,
            font: { family: "Manrope", size: 10, weight: "600" }
          }
        },
        tooltip: { intersect: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#819089",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 7,
            font: { family: "DM Mono", size: 9 }
          },
          border: { display: false }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: "#e9efeb", drawTicks: false },
          ticks: {
            stepSize: 20,
            padding: 8,
            color: "#819089",
            callback: value => `${value}%`,
            font: { family: "DM Mono", size: 9 }
          },
          border: { display: false }
        }
      }
    }
  });
}

async function loadDashboard() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`El servidor respondió con estado ${response.status}.`);

    const payload = await response.json();
    const records = findRecords(payload).map(normalizeRecord).filter(Boolean);
    if (!records.length) {
      showStatus("El archivo de datos se cargó, pero no contiene registros para mostrar.");
      elements.mapCount.textContent = "0 ubicaciones";
      return;
    }

    updateKpis(records);
    addMapMarkers(records);
    renderChart(records);
  } catch (error) {
    showStatus("No se pudo cargar data_copernicus_sample.json. Comprueba que el archivo esté en la raíz y que el sitio se ejecute desde un servidor web. También verifica tu conexión a internet para cargar las bibliotecas y el mapa.");
    elements.mapCount.textContent = "Datos no disponibles";
  }
}

initializeMap();
loadDashboard();