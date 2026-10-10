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
| C1 | Certa | Os testes `preserva favoritos existentes durante a hidratação` e `reconhece um favorito persistido pela identidade estável do evento` falharam antes da correção e passaram depois. Confirmaram a corrida de leitura/escrita e a comparação por referência. |
| C2 | Certa | `restaura a categoria persistida depois de abrir Eventos` encontrou `selected: false` antes da correção; passou quando o hook passou a esperar a hidratação antes de gravar. |
| C3 | Certa | O teste do cache legado recebeu o envelope `{ salvoEm, eventos }` onde se esperava uma lista. A normalização passou a devolver `eventos`, mantendo também o formato atual em array. |
| C4 | Certa | Os testes mostraram que tokens não eram gravados no SecureStore. Após a mudança, o token novo fica seguro e o token legado é migrado sem perder a sessão nem os favoritos. |
| C5 | Não revisada | Os blocos B1–B3 não mediram o desempenho da lista. Ainda é necessário comparar a bancada antes/depois para confirmar o impacto do filtro, da ordenação e das renderizações. |
| C6 | Não revisada | Ainda falta executar o cenário de expandir um evento e depois filtrar por Oficina, verificando se a descrição permanece associada ao mesmo ID. |
| C7 | Não revisada | Ainda falta comparar os próximos eventos antes e depois de visitar a aba Eventos para confirmar se a ordenação altera o array compartilhado. |

---

## Parte B — Persistência

### B1 · Chamados C1 e C2
- Causa(s) encontrada(s): o hook de persistência gravava o valor inicial antes de concluir a leitura assíncrona, podendo sobrescrever os dados existentes. Separadamente, a estrela comparava objetos por referência; favoritos desserializados ou vindos de uma nova resposta da API tinham outra identidade. A seleção agora compara IDs e reconhece também os objetos já persistidos.
- Testes de regressão: [favoritos.test.js](__tests__/favoritos.test.js) — `preserva favoritos existentes durante a hidratação`, `reconhece um favorito persistido pela identidade estável do evento` e `mantém os favoritos depois de fechar e abrir o app`; [lista.test.js](__tests__/lista.test.js) — `restaura a categoria persistida depois de abrir Eventos`.
- Commit do teste vermelho: `bd48097` · commit da correção: `d76a411`
- **B-Q1.** Na montagem, o hook inicia com o valor padrão, como `[]`.<br>
  O efeito de leitura começa a migração e aguarda as operações assíncronas do armazenamento.<br>
  Enquanto isso, o efeito de escrita gravava imediatamente o padrão na mesma chave.<br>
  Se essa gravação terminasse antes da leitura, o valor salvo era substituído; agora a escrita só ocorre após a hidratação.
- **B-Q2.** C1 tinha duas causas.<br>
  A primeira era a corrida entre a leitura e a gravação do valor inicial, que podia apagar os favoritos persistidos.<br>
  A segunda era comparar objetos por referência, fazendo a estrela apagar mesmo quando o evento continuava favoritado.<br>
  Separei os casos em testes de hidratação e de objeto desserializado com o mesmo ID; ambos falhavam antes da correção.

### B2 · Chamado C3
- Causa: o cache da versão 2.0 tem o formato `{ salvoEm, eventos }`, mas o provedor o tratava como array. Ao receber esse objeto, `Inicio` chamava `slice`, que não é uma função disponível nele. `lerCache` agora aceita o array atual e extrai a lista do envelope legado; cache válido continua sendo usado.
- Teste de regressão: [cacheEventos.test.js](__tests__/cacheEventos.test.js) — `lê o cache legado da versão 2.0 como uma lista de eventos`.
- Commit do teste vermelho: `07b4051` · commit da correção: `e079430`
- **B-Q3.** Limpar todo o armazenamento apagaria dados sem relação com o cache, como favoritos, categoria e sessão do usuário.<br>
  Isso causaria perda de dados e não corrigiria a incompatibilidade entre o envelope 2.0 e o formato esperado pelo provedor.<br>
  A correção interpreta os dois formatos conhecidos e mantém o cache válido em uso.<br>
  Não é necessário apagar outras chaves para recuperar a tela.

### B3 · Chamado C4
- Causa: `sessao.js` guardava o token em texto puro no AsyncStorage. Novos tokens são gravados no `expo-secure-store`; a leitura migra o token legado para lá e remove a cópia em texto claro somente depois da gravação segura.
- Testes de regressão: [sessao.test.js](__tests__/sessao.test.js) — `guarda tokens novos no armazenamento seguro`, `migra o token existente sem perder a sessão nem os favoritos` e `apaga o token dos dois armazenamentos ao encerrar a sessão`.
- Commit do teste vermelho: `11d7eba` · commit da correção: `c9a996c`
- **B-Q4.** Os favoritos existentes permanecem na chave atual do AsyncStorage; a hidratação corrigida os lê antes de gravar, e a comparação por ID continua aceitando favoritos legados em formato de objeto.<br>
  O token 2.1 permanece disponível na chave antiga até a primeira leitura da sessão.<br>
  Nessa leitura, ele é copiado para o SecureStore e a cópia antiga só é removida depois que a gravação segura termina.<br>
  Assim, favoritos e sessão são preservados durante a atualização; sair da conta continua removendo o token explicitamente.

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
