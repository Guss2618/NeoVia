const fs = require("node:fs");
const path = require("node:path");

const baseDir = path.join(process.cwd(), "data");
const raw = JSON.parse(fs.readFileSync(path.join(baseDir, "_geom_raw.json"), "utf-8"));
const pontos = JSON.parse(fs.readFileSync(path.join(baseDir, "pontos.json"), "utf-8"));

const RAIO_SNAP_M = 45;
const DEDUP_M = 60;

function projetar(lat, lng, lat0) {
  const x = (lng * Math.PI) / 180 * Math.cos((lat0 * Math.PI) / 180) * 6371000;
  const y = (lat * Math.PI) / 180 * 6371000;
  return { x, y };
}

function distPontoSegmento(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const px = a.x + t * dx;
  const py = a.y + t * dy;
  const ddx = p.x - px;
  const ddy = p.y - py;
  return { dist: Math.sqrt(ddx * ddx + ddy * ddy), t };
}

function stitch(ways) {
  if (ways.length === 0) return [];
  const prox = (a, b) =>
    Math.abs(a.lat - b.lat) < 1e-6 && Math.abs(a.lon - b.lon) < 1e-6;
  let linha = ways[0].slice();
  for (let i = 1; i < ways.length; i += 1) {
    const w = ways[i];
    const fim = linha[linha.length - 1];
    const ini = linha[0];
    if (prox(fim, w[0])) linha = linha.concat(w.slice(1));
    else if (prox(fim, w[w.length - 1])) linha = linha.concat(w.slice().reverse().slice(1));
    else if (prox(ini, w[w.length - 1])) linha = w.slice().concat(linha.slice(1));
    else if (prox(ini, w[0])) linha = w.slice().reverse().concat(linha.slice(1));
    else linha = linha.concat(w);
  }
  return linha;
}

const linhas = [];
let seq = 0;

for (const rel of raw.elements) {
  if (rel.type !== "relation" || !rel.tags || rel.tags.route !== "bus") continue;
  const t = rel.tags;

  const ways = (rel.members || [])
    .filter((m) => m.type === "way" && m.geometry && !/platform|stop/.test(m.role || ""))
    .map((m) => m.geometry);
  const polyRaw = stitch(ways);
  if (polyRaw.length < 2) continue;

  let minLat = 99, maxLat = -99, minLng = 99, maxLng = -99;
  for (const p of polyRaw) {
    minLat = Math.min(minLat, p.lat); maxLat = Math.max(maxLat, p.lat);
    minLng = Math.min(minLng, p.lon); maxLng = Math.max(maxLng, p.lon);
  }
  const lat0 = (minLat + maxLat) / 2;
  const margem = 0.0008;

  const poly = polyRaw.map((p) => projetar(p.lat, p.lon, lat0));
  const acumulado = [0];
  for (let i = 1; i < poly.length; i += 1) {
    const dx = poly[i].x - poly[i - 1].x;
    const dy = poly[i].y - poly[i - 1].y;
    acumulado[i] = acumulado[i - 1] + Math.sqrt(dx * dx + dy * dy);
  }

  const candidatos = pontos.filter(
    (s) =>
      s.lat >= minLat - margem && s.lat <= maxLat + margem &&
      s.lng >= minLng - margem && s.lng <= maxLng + margem,
  );

  const casados = [];
  for (const s of candidatos) {
    const ps = projetar(s.lat, s.lng, lat0);
    let melhor = null;
    for (let i = 0; i < poly.length - 1; i += 1) {
      const r = distPontoSegmento(ps, poly[i], poly[i + 1]);
      if (r.dist > RAIO_SNAP_M) continue;
      const ao = acumulado[i] + r.t * (acumulado[i + 1] - acumulado[i]);
      if (!melhor || r.dist < melhor.dist) melhor = { dist: r.dist, ao };
    }
    if (melhor) casados.push({ s, ao: melhor.ao });
  }

  casados.sort((a, b) => a.ao - b.ao);

  const paradas = [];
  let ultimoAo = -Infinity;
  for (const c of casados) {
    if (c.ao - ultimoAo < DEDUP_M) continue;
    ultimoAo = c.ao;
    paradas.push({ nome: c.s.nome, lat: c.s.lat, lng: c.s.lng });
  }
  if (paradas.length < 3) continue;

  const ref = t.ref || "";
  const nome =
    t.name ||
    [ref, t.from && t.to ? `${t.from} -> ${t.to}` : ""].filter(Boolean).join(" ") ||
    "Linha de onibus";
  const intervaloMin = 15 + (seq * 7) % 26;

  linhas.push({
    id: String(rel.id),
    ref,
    nome,
    operadora: t.operator || t.network || "",
    inicioOperacao: "05:00",
    fimOperacao: "23:30",
    intervaloMin,
    paradas,
  });
  seq += 1;
}

linhas.sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
fs.writeFileSync(path.join(baseDir, "linhas.json"), JSON.stringify(linhas, null, 2));

const tp = linhas.reduce((s, l) => s + l.paradas.length, 0);
console.log("Linhas:", linhas.length, "| media paradas:", (tp / linhas.length).toFixed(1));
console.log("min:", Math.min(...linhas.map((l) => l.paradas.length)), "max:", Math.max(...linhas.map((l) => l.paradas.length)));
