import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { CHAVES } from './chaves';

export async function guardarToken(token) {
  await SecureStore.setItemAsync(CHAVES.token, token);
  await AsyncStorage.removeItem(CHAVES.token);
}

export async function lerToken() {
  const tokenSeguro = await SecureStore.getItemAsync(CHAVES.token);
  if (tokenSeguro != null) return tokenSeguro;

  const tokenAntigo = await AsyncStorage.getItem(CHAVES.token);
  if (tokenAntigo == null) return null;

  await SecureStore.setItemAsync(CHAVES.token, tokenAntigo);
  await AsyncStorage.removeItem(CHAVES.token);
  return tokenAntigo;
}

export async function apagarToken() {
  await SecureStore.deleteItemAsync(CHAVES.token);
  await AsyncStorage.removeItem(CHAVES.token);
}
