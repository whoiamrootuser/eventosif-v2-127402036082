import { memo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { contarRender } from '../utils/medicao';
import { formatarData } from '../utils/texto';

// "Otimizado com memo" — commit do estagiário, versão 2.1
function ItemEvento({ evento, favoritos, aoAlternarFavorito }) {
  contarRender('ItemEvento');
  const [expandido, setExpandido] = useState(false);
  const favorito = favoritos.some((item) =>
    typeof item === 'object' && item !== null ? item.id === evento.id : item === evento.id
  );

  return (
    <View testID={`evento-${evento.id}`} style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#e2e8f0' }}>
      <Pressable
        testID={`expandir-${evento.id}`}
        accessibilityRole="button"
        onPress={() => setExpandido(!expandido)}
        style={{ flex: 1 }}
      >
        <Text style={{ fontWeight: 'bold', color: '#1e3a5f' }}>{evento.titulo}</Text>
        <Text style={{ color: '#64748b' }}>
          {formatarData(evento.data)} · {evento.local} · {evento.categoria}
        </Text>
        {expandido && (
          <Text testID={`descricao-${evento.id}`} style={{ marginTop: 6 }}>
            {evento.descricao}
          </Text>
        )}
      </Pressable>
      <Pressable
        testID={`favoritar-${evento.id}`}
        accessibilityRole="button"
        accessibilityLabel={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        accessibilityState={{ selected: favorito }}
        onPress={aoAlternarFavorito}
        hitSlop={12}
      >
        <Text style={{ fontSize: 22, color: '#f59e0b' }}>{favorito ? '★' : '☆'}</Text>
      </Pressable>
    </View>
  );
}

export default memo(ItemEvento);
