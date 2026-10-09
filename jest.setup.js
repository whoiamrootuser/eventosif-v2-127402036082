// Simulações das FRONTEIRAS do app (disco e cofre seguro). Nunca da lógica do app.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-secure-store', () => {
  const cofre = {};
  return {
    __cofre: cofre,
    setItemAsync: jest.fn(async (chave, valor) => {
      cofre[chave] = valor;
    }),
    getItemAsync: jest.fn(async (chave) => (chave in cofre ? cofre[chave] : null)),
    deleteItemAsync: jest.fn(async (chave) => {
      delete cofre[chave];
    }),
  };
});
