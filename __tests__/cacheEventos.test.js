import AsyncStorage from '@react-native-async-storage/async-storage';
import { lerCache, salvarCache } from '../src/armazenamento/cacheEventos';

describe('cacheEventos', () => {
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
    await AsyncStorage.clear();
    expect(await lerCache()).toBeNull();
  });
});
