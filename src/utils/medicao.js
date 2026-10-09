// Contador de renderizações usado pela bancada de medição (npm run bancada).
// Mantenha as chamadas contarRender(...) nos componentes: a bancada depende delas.
const contagens = {};

export function contarRender(nome) {
  contagens[nome] = (contagens[nome] ?? 0) + 1;
}

export function lerContagem(nome) {
  return contagens[nome] ?? 0;
}

export function zerarContagens() {
  for (const nome of Object.keys(contagens)) delete contagens[nome];
}
