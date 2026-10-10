import { render, screen, userEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aplicativo from '../src/Aplicativo';
import { CHAVES } from '../src/armazenamento/chaves';

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

  it('restaura a categoria persistida depois de abrir Eventos', async () => {
    await AsyncStorage.setItem(CHAVES.categoria, JSON.stringify('Oficina'));
    const usuario = userEvent.setup();
    await render(<Aplicativo />);

    await usuario.press(screen.getByRole('tab', { name: 'Eventos' }));
    await screen.findByText(/\d+ eventos/);

    expect(screen.getByRole('button', { name: 'Oficina' }).props.accessibilityState).toEqual({ selected: true });
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
