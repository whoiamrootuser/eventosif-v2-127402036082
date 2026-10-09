# Relatório — Estudo de caso EventosIF 2.1

**Aluno(a):**  **Matrícula:**  **Turma:** 

---

## Etapa 0 — Medição inicial

Cole aqui o conteúdo de `medicoes/ultima-bancada.md` da primeira execução (antes de qualquer correção).

| Interação | Tempo (ms) | Renders de ItemEvento | Renders de ListaEventos |
|---|---:|---:|---:|
| 1. Abrir a aba Eventos | 599 | 1582 | 1 |
| 2. Digitar "progra" (6 teclas) | 426 | 1850 | 6 |
| 3. Favoritar o primeiro evento da lista | 179 | 96 | 1 |

---

## Parte A — Diagnóstico (SEM IA)

> Preencha e faça o commit `diag: hipoteses iniciais` **antes** de qualquer correção e **antes** de conversar com IA.

| Chamado | Consegui reproduzir? Como? | Minha hipótese (arquivo e linha) | Como vou provar |
|---|---|---|---|
| C1 | O relato descreve perda após reabrir e, às vezes, após a atualização dos eventos. | Duas causas prováveis. O hook grava imediatamente o estado inicial [] antes de terminar a leitura assíncrona, podendo sobrescrever os favoritos salvos: useEstadoPersistido.js:20. Além disso, favoritos guardam objetos e as estrelas comparam por identidade (includes); após JSON ou uma resposta nova da API, os objetos não são os mesmos, embora o total ainda use favoritos.length: FavoritosContexto.js:13, ItemEvento.js:10. Confiança alta, sem reprodução. | Testar separadamente: reiniciar com favoritos salvos e verificar contagem e estrelas; depois controlar a ordem da hidratação e confirmar se o estado inicial vazio substitui o valor persistido. |
| C2 | Reproduzir salvando Oficina, fechando e reabrindo a aba/app. | A categoria começa em Todas e usa o mesmo hook que grava o estado inicial antes de concluir a leitura. Isso pode substituir o valor persistido: ListaEventos.js:18, useEstadoPersistido.js:20. Confiança alta, sem reprodução. | Persistir Oficina, remontar a tela e verificar se a categoria continua selecionada; observar a ordem de getItem e setItem no armazenamento. |
| C3 | O botão de desenvolvimento “Simular cache da versão 2.0” fornece o cenário de reprodução indicado pelo relato. | O simulador grava { salvoEm, eventos }, mas lerCache devolve esse objeto e EventosProvedor o passa diretamente para setEventos. Inicio chama eventos.slice, que não existe nesse objeto: FerramentasDev.js:10, EventosContexto.js:18, Inicio.js:14. Confiança alta; o formato e o caminho incompatível estão no código. | Gravar o cache legado e recarregar. Verificar se o provedor valida/converte o formato antes de usá-lo e se a tela não lança erro enquanto a API atualiza os dados. |
| C4 | O relato descreve leitura do armazenamento do app com root. | O token é gravado e lido diretamente pelo AsyncStorage, em texto serializado sem proteção própria: sessao.js:5, sessao.js:9. Confiança alta quanto ao armazenamento observado; a proteção exigida deve ser validada no dispositivo-alvo. | Entrar, inspecionar o AsyncStorage e confirmar que o token não está lá; testar guardar, ler e apagar pelo armazenamento seguro escolhido. |
| C5 | O relato indica lentidão ao abrir a lista e ao digitar. | A tela ordena e filtra toda a lista em cada render e coloca todos os resultados em um ScrollView; a cada tecla, a busca atualiza o estado. Cada item também recebe uma callback nova, o que reduz o benefício de memo: ListaEventos.js:29, ListaEventos.js:61, ListaEventos.js:67. Confiança alta para a fonte de trabalho excessivo; impacto no aparelho não medido. | Rodar npm run bancada nas interações de abrir e digitar, comparar tempos e contagens de renders e perfilar no aparelho mais simples. |
| C6 | Reproduzir abrindo uma descrição e depois aplicar a categoria Oficina. | As linhas da lista usam o índice como key; ao filtrar, o React pode reaproveitar o estado local expandido para outro evento que ocupa o mesmo índice: ListaEventos.js:64, ItemEvento.js:9. Confiança alta, sem reprodução. | Abrir a descrição de um evento, filtrar e verificar que a descrição continua ligada ao mesmo ID — ou desaparece — e nunca aparece em outro evento. |
| C7 | Reproduzir anotando os próximos eventos, visitar a aba Eventos e voltar ao Início. | eventos.sort(...) ordena o array recebido do contexto no próprio lugar; Inicio depois toma os primeiros cinco, embora espere que permaneçam cronológicos: ListaEventos.js:29, Inicio.js:14. Confiança alta, sem reprodução. | Comparar os IDs exibidos em “Próximos eventos” antes e depois de visitar a lista; confirmar que a ordem original do array não muda. |

### Hipóteses revisadas (preencha ao final)

| Chamado | Hipótese inicial estava… (certa / parcial / errada) | O que me fez mudar de ideia (evidência) |
|---|---|---|
| | | |

---

## Parte B — Persistência

### B1 · Chamados C1 e C2
- Causa(s) encontrada(s):
- Teste de regressão (arquivo e nome do teste):
- Commit do teste vermelho: `hash` · commit da correção: `hash`
- **B-Q1.** Descreva, em ordem temporal, o que acontece desde a montagem do provedor até o valor salvo ser perdido.
- **B-Q2.** Quantas causas o chamado C1 tinha? Como você descobriu?

### B2 · Chamado C3
- Causa:
- Teste de regressão:
- Commits:
- **B-Q3.** Por que "apagar o armazenamento inteiro quando der erro" não é uma correção aceitável?

### B3 · Chamado C4
- Causa:
- Teste de regressão:
- Commits:
- **B-Q4.** O que acontece com os dados de quem já usa a versão 2.1 (favoritos e token já gravados) quando instalar a sua versão? Sua correção trata isso?

---

## Parte C — Desempenho

| Commit | Mudança (uma por commit) | Hipótese | Abrir aba (ms / renders) | Digitar (ms / renders) | Favoritar (ms / renders) | Mantive? |
|---|---|---|---|---|---|---|
| inicial | — | — | | | | — |
| | | | | | | |

- **C-Q1.** Qual mudança deu o maior ganho? Explique o **mecanismo** (não basta dizer "FlatList é melhor").
- **C-Q2.** Descreva um experimento que **não** melhorou a medição. O que você fez com ele?
- **C-Q3.** Por que o tempo medido no Jest não é o tempo que o usuário sente no celular? O que a contagem de renderizações mede de forma mais confiável?
- (Opcional) Medição no aparelho com o Performance Monitor, antes e depois.

---

## Parte D — Testes e depuração

### D1 · Auditoria da suíte do estagiário

| Problema encontrado | Arquivo / teste | Como provei que era um problema (comando) | Correção |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

- O que aconteceu quando o teste defeituoso passou a verificar de verdade?

### D2 · Relatórios de depuração (seis passos, até 15 linhas cada)

**C3 — tela branca**
1. Reproduzir:
2. Isolar:
3. Hipótese:
4. Instrumentar / evidência:
5. Correção da causa:
6. Teste de regressão:

**C7 — próximos eventos mudam**
1. Reproduzir:
2. Isolar:
3. Hipótese:
4. Instrumentar / evidência:
5. Correção da causa:
6. Teste de regressão:

### D3 · Chamado C6
- Causa:
- Por que o sintoma só aparece depois de filtrar?
- Teste de regressão:

---

## Parte E — Auditoria da resposta de IA

| Item | Classificação (correta / parcial / incorreta) | Evidência (o que executei e o resultado) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |
| 8 | | |
| 9 | | |
| 10 | | |

---

## Parte F — Reflexão (até 20 linhas)

1. O que você aprendeu neste estudo que a IA não poderia ter aprendido por você?
2. Descreva um momento em que a IA te levou para o caminho errado (ou quase). Como você percebeu?
3. Como você vai usar IA de forma diferente no projeto da sua equipe?

---

## Declaração de autoria

Declaro que diagnostiquei, escrevi e verifiquei o código e os textos deste repositório. Usei IA conforme as regras do estudo de caso e registrei esse uso em `DIARIO-IA.md`. Estou ciente de que serei chamado(a) a explicar, sem IA, qualquer trecho entregue.

Nome: ______________________ Data: ___/___/2026
