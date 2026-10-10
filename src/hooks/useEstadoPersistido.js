import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { migrarChavesAntigas } from '../armazenamento/migracao';

// Funciona como useState, mas o valor sobrevive ao fechamento do app.
export function useEstadoPersistido(chave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);
  const [carregado, setCarregado] = useState(false);

  // leitura
  useEffect(() => {
    let ativo = true;

    async function carregar() {
      await migrarChavesAntigas();
      const bruto = await AsyncStorage.getItem(chave);
      if (!ativo) return;
      if (bruto != null) setValor(JSON.parse(bruto));
      setCarregado(true);
    }

    carregar().catch((erro) => console.error(`Falha ao carregar ${chave}`, erro));
    return () => {
      ativo = false;
    };
  }, [chave]);

  // escrita
  useEffect(() => {
    if (!carregado) return;
    AsyncStorage.setItem(chave, JSON.stringify(valor));
  }, [carregado, chave, valor]);

  return [valor, setValor];
}
