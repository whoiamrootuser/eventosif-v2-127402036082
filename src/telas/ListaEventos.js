import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import ItemEvento from '../componentes/ItemEvento';
import { useEventos } from '../contextos/EventosContexto';
import { useFavoritos } from '../contextos/FavoritosContexto';
import { useEstadoPersistido } from '../hooks/useEstadoPersistido';
import { CHAVES } from '../armazenamento/chaves';
import { contarRender } from '../utils/medicao';
import { normalizar } from '../utils/texto';

const CATEGORIAS = ['Todas', 'Palestra', 'Oficina', 'Minicurso', 'Cultural'];

export default function ListaEventos() {
  contarRender('ListaEventos');
  const { eventos, status } = useEventos();
  const { favoritos, alternarFavorito } = useFavoritos();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useEstadoPersistido(CHAVES.categoria, 'Todas');

  if (status === 'carregando') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  const ordenados = eventos.sort((a, b) => a.titulo.localeCompare(b.titulo));
  const filtrados = ordenados.filter(
    (e) =>
      (categoria === 'Todas' || e.categoria === categoria) &&
      normalizar(e.titulo).includes(normalizar(busca))
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar evento"
        style={{ margin: 12, padding: 10, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8 }}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 6 }}>
        {CATEGORIAS.map((c) => (
          <Pressable
            key={c}
            accessibilityRole="button"
            accessibilityState={{ selected: c === categoria }}
            onPress={() => setCategoria(c)}
            style={{
              paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16,
              backgroundColor: c === categoria ? '#1e3a5f' : '#e2e8f0',
            }}
          >
            <Text style={{ color: c === categoria ? '#fff' : '#1e3a5f' }}>{c}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ margin: 12, color: '#64748b' }}>{filtrados.length} eventos</Text>

      <ScrollView>
        {filtrados.map((evento, indice) => (
          <ItemEvento
            key={indice}
            evento={evento}
            favoritos={favoritos}
            aoAlternarFavorito={() => alternarFavorito(evento)}
          />
        ))}
        {eventos.length === 0 && (
          <Text style={{ margin: 24, textAlign: 'center' }}>Nenhum evento encontrado</Text>
        )}
      </ScrollView>
    </View>
  );
}
