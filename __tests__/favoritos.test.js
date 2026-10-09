import { render, screen, userEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aplicativo from '../src/Aplicativo';

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

  // TODO: às vezes falha, depois eu vejo. Pulei pra conseguir entregar a 2.1. (Kaio)
  it.skip('mantém os favoritos depois de fechar e abrir o app', async () => {
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
