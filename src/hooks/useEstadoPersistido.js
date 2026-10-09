import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { migrarChavesAntigas } from '../armazenamento/migracao';

// Funciona como useState, mas o valor sobrevive ao fechamento do app.
export function useEstadoPersistido(chave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);

  // leitura
  useEffect(() => {
    async function carregar() {
      await migrarChavesAntigas();
      const bruto = await AsyncStorage.getItem(chave);
      if (bruto != null) setValor(JSON.parse(bruto));
    }
    carregar();
  }, [chave]);

  // escrita
  useEffect(() => {
    AsyncStorage.setItem(chave, JSON.stringify(valor));
  }, [chave, valor]);

  return [valor, setValor];
}
