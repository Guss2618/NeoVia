export type Coord = { lat: number; lng: number };

export type Parada = { nome: string; lat: number; lng: number };

export type Linha = {
  id: string;
  ref: string;
  nome: string;
  operadora: string;
  inicioOperacao: string;
  fimOperacao: string;
  intervaloMin: number;
  paradas: Parada[];
};

export type EtapaCaminhada = {
  tipo: "caminhada";
  de: string;
  para: string;
  distanciaM: number;
  duracaoMin: number;
  trajeto: Coord[];
};

export type EtapaOnibus = {
  tipo: "onibus";
  linhaRef: string;
  linhaNome: string;
  operadora: string;
  embarque: Parada;
  desembarque: Parada;
  horarioSaida: string;
  horarioChegada: string;
  numParadas: number;
  duracaoMin: number;
  intervaloMin: number;
  trajeto: Coord[];
};

export type Etapa = EtapaCaminhada | EtapaOnibus;

export type Itinerario = {
  tipo: "direta" | "baldeacao";
  precoTotal: number;
  duracaoMin: number;
  horarioPartida: string;
  horarioChegada: string;
  distanciaAPeM: number;
  etapas: Etapa[];
};
