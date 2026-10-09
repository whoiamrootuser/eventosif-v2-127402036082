import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAVES, CHAVES_ANTIGAS } from './chaves';

// Copia valores das chaves da versão 2.0 (sem prefixo) para as chaves novas.
export async function migrarChavesAntigas() {
  const existentes = await AsyncStorage.getAllKeys();
  for (const nome of Object.keys(CHAVES_ANTIGAS)) {
    const antiga = CHAVES_ANTIGAS[nome];
    if (existentes.includes(antiga)) {
      const valor = await AsyncStorage.getItem(antiga);
      await AsyncStorage.setItem(CHAVES[nome], valor);
      await AsyncStorage.removeItem(antiga);
    }
  }
}
