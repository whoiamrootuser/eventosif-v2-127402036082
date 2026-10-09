// ─────────────────────────────────────────────────────────────
//  BANCADA DE MEDIÇÃO — npm run bancada
//  Mede três interações da aba Eventos com a SUA massa de dados.
//  Não altere este arquivo: o professor executa a mesma bancada no seu repositório.
// ─────────────────────────────────────────────────────────────
import fs from 'fs';
import path from 'path';
import { render, screen, userEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aplicativo from '../src/Aplicativo';
import { lerContagem, zerarContagens } from '../src/utils/medicao';
import { matriculaInformada, quantidadeDeEventos } from '../src/dados/gerarEventos';

jest.setTimeout(180000);

const TERMO = 'progra';

async function medir(nome, acao) {
  zerarContagens();
  const inicio = performance.now();
  await acao();
  const ms = performance.now() - inicio;
  return {
    interacao: nome,
    tempoMs: Math.round(ms),
    rendersItemEvento: lerContagem('ItemEvento'),
    rendersListaEventos: lerContagem('ListaEventos'),
  };
}

test('bancada de desempenho da aba Eventos', async () => {
  await AsyncStorage.clear();
  const usuario = userEvent.setup();
  await render(<Aplicativo />);
  await screen.findByText('Próximos eventos');
  await screen.findAllByTestId(/^proximo-/);

  const resultados = [];

  resultados.push(
    await medir('1. Abrir a aba Eventos', async () => {
      await usuario.press(screen.getByRole('tab', { name: 'Eventos' }));
      await screen.findByText(/\d+ eventos/);
    })
  );

  resultados.push(
    await medir(`2. Digitar "${TERMO}" (${TERMO.length} teclas)`, async () => {
      await usuario.type(screen.getByPlaceholderText('Buscar evento'), TERMO);
    })
  );

  resultados.push(
    await medir('3. Favoritar o primeiro evento da lista', async () => {
      const [estrela] = screen.getAllByLabelText('Adicionar aos favoritos');
      await usuario.press(estrela);
    })
  );

  const matricula = matriculaInformada();
  const linhas = [
    `# Bancada de medição — ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
    '',
    `Matrícula: ${matricula} · eventos na massa de dados: ${quantidadeDeEventos(matricula)} · Node ${process.version}`,
    '',
    '| Interação | Tempo (ms) | Renders de ItemEvento | Renders de ListaEventos |',
    '|---|---:|---:|---:|',
    ...resultados.map(
      (r) => `| ${r.interacao} | ${r.tempoMs} | ${r.rendersItemEvento} | ${r.rendersListaEventos} |`
    ),
    '',
    '> Tempo varia com a máquina; contagem de renders é determinística e será conferida pelo professor.',
    '',
  ];
  const texto = linhas.join('\n');
  const pasta = path.join(__dirname, '..', 'medicoes');
  fs.mkdirSync(pasta, { recursive: true });
  fs.writeFileSync(path.join(pasta, 'ultima-bancada.md'), texto);
  process.stdout.write('\n' + texto + '\nArquivo gravado em medicoes/ultima-bancada.md\n');
});
