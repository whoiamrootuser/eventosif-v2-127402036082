import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { apagarToken, guardarToken, lerToken } from '../src/armazenamento/sessao';
import { CHAVES } from '../src/armazenamento/chaves';

describe('sessao', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    Object.keys(SecureStore.__cofre).forEach((chave) => delete SecureStore.__cofre[chave]);
  });

  it('guarda tokens novos no armazenamento seguro', async () => {
    await guardarToken('token-seguro');

    expect(await SecureStore.getItemAsync(CHAVES.token)).toBe('token-seguro');
    expect(await AsyncStorage.getItem(CHAVES.token)).toBeNull();
  });

  it('migra o token existente sem perder a sessão nem os favoritos', async () => {
    await AsyncStorage.setItem(CHAVES.token, 'token-da-versao-2.1');
    await AsyncStorage.setItem(CHAVES.favoritos, JSON.stringify([{ id: 42 }]));

    expect(await lerToken()).toBe('token-da-versao-2.1');
    expect(await SecureStore.getItemAsync(CHAVES.token)).toBe('token-da-versao-2.1');
    expect(await AsyncStorage.getItem(CHAVES.token)).toBeNull();
    expect(await AsyncStorage.getItem(CHAVES.favoritos)).toBe(JSON.stringify([{ id: 42 }]));
  });

  it('apaga o token dos dois armazenamentos ao encerrar a sessão', async () => {
    await guardarToken('token-seguro');

    await apagarToken();

    expect(await SecureStore.getItemAsync(CHAVES.token)).toBeNull();
    expect(await AsyncStorage.getItem(CHAVES.token)).toBeNull();
  });
});