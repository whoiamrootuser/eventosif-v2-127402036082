import { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { EventosProvedor } from './contextos/EventosContexto';
import { FavoritosProvedor } from './contextos/FavoritosContexto';
import { SessaoProvedor } from './contextos/SessaoContexto';
import { matriculaInformada } from './dados/gerarEventos';
import Inicio from './telas/Inicio';
import ListaEventos from './telas/ListaEventos';

function Abas() {
  const [aba, setAba] = useState('inicio');
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{aba === 'inicio' ? <Inicio /> : <ListaEventos />}</View>
      <View style={estilos.barra}>
        {[['inicio', 'Início'], ['eventos', 'Eventos']].map(([id, rotulo]) => (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected: aba === id }}
            onPress={() => setAba(id)}
            style={estilos.aba}
          >
            <Text style={[estilos.textoAba, aba === id && estilos.ativa]}>{rotulo}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function Aplicativo() {
  try {
    matriculaInformada();
  } catch (erro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 16, color: '#b91c1c' }}>{erro.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 48, backgroundColor: '#fff' }}>
      <StatusBar style="dark" />
      <SessaoProvedor>
        <EventosProvedor>
          <FavoritosProvedor>
            <Abas />
          </FavoritosProvedor>
        </EventosProvedor>
      </SessaoProvedor>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#e2e8f0' },
  aba: { flex: 1, padding: 14, alignItems: 'center' },
  textoAba: { color: '#64748b', fontSize: 16 },
  ativa: { color: '#1e3a5f', fontWeight: 'bold' },
});
