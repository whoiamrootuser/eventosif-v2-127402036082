// Simula a API de eventos do campus (sem rede: os dados vêm do gerador).
// Cada chamada devolve OBJETOS NOVOS, exatamente como um fetch + json() faria.
import { gerarEventos } from '../dados/gerarEventos';

const LATENCIA_MS = process.env.JEST_WORKER_ID ? 0 : 800;

export function buscarEventos() {
  return new Promise((resolver) => {
    setTimeout(() => resolver(gerarEventos()), LATENCIA_MS);
  });
}
