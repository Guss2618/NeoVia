"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";

export type Coordenada = { lat: number; lng: number };

export type PontoMapa = {
  id: string;
  nome: string;
  lat: number;
  lng: number;
};

export type PontoRota = PontoMapa & {
  papel: "embarque" | "desembarque";
  linhaRef: string;
  horario: string;
};

export type TrajetoMapa = {
  tipo: "caminhada" | "onibus";
  coords: Coordenada[];
};

type MapaRotasProps = {
  centro: Coordenada;
  pontosRota: PontoRota[];
  origem: Coordenada | null;
  destino: Coordenada | null;
  trajetos: TrajetoMapa[];
  onSelecionar: (coordenada: Coordenada) => void;
};

function criarPin(cor: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;background:${cor};transform:rotate(-45deg);border:3px solid #ffffff;box-shadow:0 6px 16px rgba(15,63,116,0.45)"></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });
}

const pinOrigem = criarPin("#16a34a");
const pinDestino = criarPin("#dc2626");

function CliqueNoMapa({
  onSelecionar,
}: {
  onSelecionar: (coordenada: Coordenada) => void;
}) {
  useMapEvents({
    click(evento) {
      onSelecionar({ lat: evento.latlng.lat, lng: evento.latlng.lng });
    },
  });
  return null;
}

function CentralizarMapa({ centro }: { centro: Coordenada }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([centro.lat, centro.lng], map.getZoom(), { duration: 0.8 });
  }, [centro.lat, centro.lng, map]);
  return null;
}

function AjustarTrajeto({ trajetos }: { trajetos: TrajetoMapa[] }) {
  const map = useMap();
  useEffect(() => {
    const todas = trajetos.flatMap((t) => t.coords);
    if (todas.length < 2) return;
    const limites = L.latLngBounds(todas.map((c) => [c.lat, c.lng]));
    map.fitBounds(limites, { padding: [40, 40], maxZoom: 16 });
  }, [trajetos, map]);
  return null;
}

function IsolarToquesMapa() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    L.DomEvent.disableScrollPropagation(container);
    L.DomEvent.disableClickPropagation(container);

    const bloquearScrollPagina = (evento: TouchEvent) => {
      evento.preventDefault();
    };

    container.addEventListener("touchmove", bloquearScrollPagina, {
      passive: false,
    });

    return () => {
      container.removeEventListener("touchmove", bloquearScrollPagina);
    };
  }, [map]);
  return null;
}

export default function MapaRotas({
  centro,
  pontosRota,
  origem,
  destino,
  trajetos,
  onSelecionar,
}: MapaRotasProps) {
  return (
    <MapContainer
      center={[centro.lat, centro.lng]}
      zoom={14}
      scrollWheelZoom
      dragging
      touchZoom
      className="size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <IsolarToquesMapa />
      <CliqueNoMapa onSelecionar={onSelecionar} />
      <CentralizarMapa centro={centro} />
      <AjustarTrajeto trajetos={trajetos} />

      {trajetos.map((trajeto, indice) =>
        trajeto.tipo === "onibus" ? (
          <Polyline
            key={`bus-${indice}`}
            positions={trajeto.coords.map((c) => [c.lat, c.lng])}
            pathOptions={{ color: "#0f3f74", weight: 6, opacity: 0.85 }}
          />
        ) : (
          <Polyline
            key={`pe-${indice}`}
            positions={trajeto.coords.map((c) => [c.lat, c.lng])}
            pathOptions={{
              color: "#16a34a",
              weight: 4,
              opacity: 0.8,
              dashArray: "2 10",
            }}
          />
        ),
      )}

      {pontosRota.map((ponto) => (
        <CircleMarker
          key={ponto.id}
          center={[ponto.lat, ponto.lng]}
          radius={ponto.papel === "embarque" ? 8 : 7}
          pathOptions={{
            color: ponto.papel === "embarque" ? "#0f3f74" : "#ea580c",
            weight: 3,
            fillColor: ponto.papel === "embarque" ? "#3b82f6" : "#fb923c",
            fillOpacity: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            <span className="font-bold">
              {ponto.papel === "embarque" ? "Embarque" : "Desembarque"}
            </span>
            <br />
            {ponto.nome}
            <br />
            Linha {ponto.linhaRef} - {ponto.horario}
          </Tooltip>
        </CircleMarker>
      ))}

      {origem && (
        <Marker position={[origem.lat, origem.lng]} icon={pinOrigem}>
          <Tooltip direction="top" offset={[0, -22]}>
            Origem
          </Tooltip>
        </Marker>
      )}

      {destino && (
        <Marker position={[destino.lat, destino.lng]} icon={pinDestino}>
          <Tooltip direction="top" offset={[0, -22]}>
            Destino
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
}
