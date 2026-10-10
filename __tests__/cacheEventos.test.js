import AsyncStorage from '@react-native-async-storage/async-storage';
import { lerCache, salvarCache } from '../src/armazenamento/cacheEventos';
import { CHAVES } from '../src/armazenamento/chaves';

describe('cacheEventos', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('salva a lista de eventos', async () => {
    await salvarCache([{ id: 1, titulo: 'Semana de Tecnologia' }]);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('lê o cache salvo', async () => {
    const cache = await lerCache();
    expect(cache).toHaveLength(1);
    expect(cache[0].titulo).toBe('Semana de Tecnologia');
  });

  it('devolve null quando não há cache', async () => {
    expect(await lerCache()).toBeNull();
  });

  it('lê o cache legado da versão 2.0 como uma lista de eventos', async () => {
    const eventos = [{ id: 1, titulo: 'Semana de Tecnologia' }];
    await AsyncStorage.setItem(
      CHAVES.cacheEventos,
      JSON.stringify({ salvoEm: '2026-10-01T11:00:00.000Z', eventos })
    );

    expect(await lerCache()).toEqual(eventos);
  });
});
