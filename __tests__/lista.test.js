import { render, screen, userEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aplicativo from '../src/Aplicativo';

describe('Lista de eventos', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('mostra a quantidade de eventos', async () => {
    const usuario = userEvent.setup();
    await render(<Aplicativo />);
    await usuario.press(screen.getByRole('tab', { name: 'Eventos' }));

    expect(await screen.findByText(/\d+ eventos/)).toBeOnTheScreen();
  });

  it('mostra aviso quando a busca não encontra nada', async () => {
    const usuario = userEvent.setup();
    await render(<Aplicativo />);
    await usuario.press(screen.getByRole('tab', { name: 'Eventos' }));
    await screen.findByText(/\d+ eventos/);

    await usuario.type(screen.getByPlaceholderText('Buscar evento'), 'xyzw');

    expect(screen.queryByText('Nenhum evento encontrado'));
  });
});
