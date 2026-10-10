import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAVES } from './chaves';

// Guarda a última lista recebida da API para abrir o app sem esperar a rede.
export async function salvarCache(eventos) {
  await AsyncStorage.setItem(CHAVES.cacheEventos, JSON.stringify(eventos));
}

export async function lerCache() {
  const bruto = await AsyncStorage.getItem(CHAVES.cacheEventos);
  if (bruto == null) return null;
  const cache = JSON.parse(bruto);
  if (Array.isArray(cache)) return cache;
  if (Array.isArray(cache?.eventos)) return cache.eventos;
  return null;
}
