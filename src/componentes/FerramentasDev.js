import { Pressable, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAVES } from '../armazenamento/chaves';
import { gerarEventos } from '../dados/gerarEventos';

// Aparece só em modo de desenvolvimento. Use para reproduzir os chamados.
export default function FerramentasDev() {
  async function simularCacheV20() {
    // Formato que a versão 2.0 gravava no aparelho dos usuários
    const eventos = gerarEventos().slice(0, 50);
    await AsyncStorage.setItem(
      CHAVES.cacheEventos,
      JSON.stringify({ salvoEm: new Date().toISOString(), eventos })
    );
    console.log('[dev] cache no formato 2.0 gravado. Recarregue o app (tecla r no terminal).');
  }

  async function mostrarArmazenamento() {
    const chaves = await AsyncStorage.getAllKeys();
    const pares = await AsyncStorage.multiGet(chaves);
    console.log('[dev] conteúdo do AsyncStorage:');
    for (const [chave, valor] of pares) {
      console.log('  ', chave, '=>', valor && valor.length > 200 ? valor.slice(0, 200) + '…' : valor);
    }
  }

  async function limpar() {
    await AsyncStorage.clear();
    console.log('[dev] AsyncStorage limpo.');
  }

  return (
    <View style={estilos.caixa}>
      <Text style={estilos.titulo}>Ferramentas de desenvolvimento</Text>
      <Pressable style={estilos.botao} onPress={simularCacheV20}>
        <Text style={estilos.texto}>Simular cache da versão 2.0</Text>
      </Pressable>
      <Pressable style={estilos.botao} onPress={mostrarArmazenamento}>
        <Text style={estilos.texto}>Ver armazenamento no console</Text>
      </Pressable>
      <Pressable style={estilos.botao} onPress={limpar}>
        <Text style={estilos.texto}>Limpar armazenamento</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { marginTop: 24, padding: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#94a3b8', borderRadius: 8, gap: 6 },
  titulo: { fontWeight: 'bold', color: '#64748b' },
  botao: { padding: 8, backgroundColor: '#e2e8f0', borderRadius: 6 },
  texto: { color: '#1e3a5f' },
});
