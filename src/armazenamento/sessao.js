import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAVES } from './chaves';

export async function guardarToken(token) {
  await AsyncStorage.setItem(CHAVES.token, token);
}

export async function lerToken() {
  return AsyncStorage.getItem(CHAVES.token);
}

export async function apagarToken() {
  await AsyncStorage.removeItem(CHAVES.token);
}
