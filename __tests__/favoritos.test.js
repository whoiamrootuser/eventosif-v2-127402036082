import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aplicativo from '../src/Aplicativo';
import ItemEvento from '../src/componentes/ItemEvento';
import { CHAVES } from '../src/armazenamento/chaves';

async function abrirAbaEventos(usuario) {
  await usuario.press(screen.getByRole('tab', { name: 'Eventos' }));
  await screen.findByText(/\d+ eventos/);
}

describe('Favoritos', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('marca um evento como favorito', async () => {
    const usuario = userEvent.setup();
    await render(<Aplicativo />);
    await abrirAbaEventos(usuario);

    const [primeiraEstrela] = screen.getAllByLabelText('Adicionar aos favoritos');
    await usuario.press(primeiraEstrela);

    expect(screen.getAllByLabelText('Remover dos favoritos')).toHaveLength(1);
  });

  it('preserva favoritos existentes durante a hidratação', async () => {
    await AsyncStorage.setItem(CHAVES.favoritos, JSON.stringify([{ id: 1 }]));

    await render(<Aplicativo />);

    await waitFor(() => {
      expect(screen.getByText(/Você tem/).props.children).toContain(1);
    });
  });

  it('reconhece um favorito persistido pela identidade estável do evento', async () => {
    const evento = {
      id: 1,
      titulo: 'Semana de Tecnologia',
      data: '2026-10-01T11:00:00.000Z',
      local: 'Auditório',
      categoria: 'Palestra',
      descricao: 'Descrição do evento',
    };

    const { getByLabelText } = await render(
      <ItemEvento
        evento={evento}
        favoritos={[JSON.parse(JSON.stringify(evento))]}
        aoAlternarFavorito={jest.fn()}
      />
    );

    expect(getByLabelText('Remover dos favoritos')).toBeOnTheScreen();
  });

  // TODO: às vezes falha, depois eu vejo. Pulei pra conseguir entregar a 2.1. (Kaio)
  it('mantém os favoritos depois de fechar e abrir o app', async () => {
    const usuario = userEvent.setup();
    const primeiraVez = await render(<Aplicativo />);
    await abrirAbaEventos(usuario);
    const estrelas = screen.getAllByLabelText('Adicionar aos favoritos');
    await usuario.press(estrelas[0]);
    await usuario.press(estrelas[1]);
    await primeiraVez.unmount(); // "fecha" o app

    await render(<Aplicativo />); // "abre" de novo
    await abrirAbaEventos(usuario);
    expect(await screen.findAllByLabelText('Remover dos favoritos')).toHaveLength(2);
  });
});
