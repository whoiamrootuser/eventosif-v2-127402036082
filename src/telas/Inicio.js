import { ActivityIndicator, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useEventos } from '../contextos/EventosContexto';
import { useFavoritos } from '../contextos/FavoritosContexto';
import { useSessao } from '../contextos/SessaoContexto';
import FerramentasDev from '../componentes/FerramentasDev';
import { formatarData } from '../utils/texto';

export default function Inicio() {
  const { eventos, status } = useEventos();
  const { favoritos } = useFavoritos();
  const { autenticado, entrar, sair } = useSessao();

  // A API devolve os eventos em ordem cronológica: os 5 primeiros são os próximos.
  const proximos = eventos.slice(0, 5);

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.linha}>
        <Text style={estilos.saudacao}>{autenticado ? 'Sessão ativa' : 'Visitante'}</Text>
        <Pressable accessibilityRole="button" onPress={autenticado ? sair : entrar} style={estilos.botao}>
          <Text style={estilos.textoBotao}>{autenticado ? 'Sair' : 'Entrar'}</Text>
        </Pressable>
      </View>

      <Text style={estilos.destaque}>Você tem {favoritos.length} favoritos</Text>

      <Text style={estilos.titulo}>Próximos eventos</Text>
      {status === 'carregando' ? (
        <ActivityIndicator />
      ) : (
        proximos.map((e) => (
          <View key={e.id} testID={`proximo-${e.id}`} style={estilos.cartao}>
            <Text style={estilos.nome}>{e.titulo}</Text>
            <Text style={estilos.detalhe}>{formatarData(e.data)} · {e.local}</Text>
          </View>
        ))
      )}

      {__DEV__ && <FerramentasDev />}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saudacao: { fontSize: 16, color: '#1e3a5f' },
  botao: { backgroundColor: '#1e3a5f', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  destaque: { fontSize: 16, color: '#f97316', fontWeight: 'bold', marginVertical: 8 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#1e3a5f', marginTop: 8 },
  cartao: { padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8 },
  nome: { fontWeight: 'bold' },
  detalhe: { color: '#64748b' },
});
