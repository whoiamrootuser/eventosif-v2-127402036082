// Gera a massa de dados do aluno de forma determinística a partir da matrícula.
// NÃO ALTERE este arquivo: o professor usa o mesmo gerador para conferir suas medições.
import { ALUNO } from '../../aluno.config';

const CATEGORIAS = ['Palestra', 'Oficina', 'Minicurso', 'Cultural'];
const TEMAS = [
  'Programação Mobile', 'Segurança da Informação', 'Inteligência Artificial',
  'Banco de Dados', 'Acessibilidade Digital', 'Computação em Nuvem',
  'Experiência do Usuário', 'Robótica Educacional', 'Empreendedorismo',
  'Ética e Tecnologia', 'Internet das Coisas', 'Música e Tecnologia',
  'Desenvolvimento Web', 'Ciência de Dados', 'Jogos Digitais',
];
const COMPLEMENTOS = [
  'na prática', 'para iniciantes', 'do zero', 'em debate', 'com projetos reais',
  'e mercado de trabalho', 'e sociedade', 'no dia a dia', 'para todos',
  'em 90 minutos', 'passo a passo', 'sem mistério',
];
const LOCAIS = ['Auditório', 'Laboratório 3', 'Laboratório 5', 'Sala 12', 'Biblioteca', 'Pátio central'];
const FRASES = [
  'Atividade aberta à comunidade externa.',
  'Traga seu notebook, se tiver.',
  'Certificado de participação emitido pela coordenação.',
  'Vagas limitadas; chegue com antecedência.',
  'Conteúdo introdutório, não exige conhecimento prévio.',
  'Indicado para estudantes a partir do segundo período.',
];

export function matriculaInformada() {
  const m = process.env.MATRICULA || ALUNO.matricula;
  if (!m || !/^\d{6,}$/.test(String(m))) {
    throw new Error(
      'Preencha sua matrícula (somente números) em aluno.config.js antes de executar o app ou os testes.'
    );
  }
  return String(m);
}

// Gerador pseudoaleatório determinístico (mulberry32)
function criarAleatorio(semente) {
  let t = semente >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function sementeDe(texto) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function quantidadeDeEventos(matricula = matriculaInformada()) {
  return 1500 + (Number(matricula.slice(-3)) % 1000); // entre 1500 e 2499
}

export function gerarEventos(matricula = matriculaInformada()) {
  const aleatorio = criarAleatorio(sementeDe(matricula));
  const escolher = (lista) => lista[Math.floor(aleatorio() * lista.length)];
  const total = quantidadeDeEventos(matricula);
  const inicio = Date.UTC(2026, 9, 1, 11, 0); // 01/10/2026 08:00 (Brasília)
  const eventos = [];
  let instante = inicio;

  for (let id = 1; id <= total; id++) {
    instante += Math.floor(aleatorio() * 6 + 1) * 30 * 60 * 1000; // avança de 30 min a 3 h
    const frases = Math.floor(aleatorio() * 4) + 1;
    eventos.push({
      id,
      titulo: `${escolher(TEMAS)} ${escolher(COMPLEMENTOS)}`,
      categoria: escolher(CATEGORIAS),
      data: new Date(instante).toISOString(),
      local: escolher(LOCAIS),
      descricao: Array.from({ length: frases }, () => escolher(FRASES)).join(' '),
    });
  }
  return eventos; // já em ordem cronológica
}
