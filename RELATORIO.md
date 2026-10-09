# Relatório — Estudo de caso EventosIF 2.1

**Aluno(a):**  **Matrícula:**  **Turma:** 

---

## Etapa 0 — Medição inicial

Cole aqui o conteúdo de `medicoes/ultima-bancada.md` da primeira execução (antes de qualquer correção).

---

## Parte A — Diagnóstico (SEM IA)

> Preencha e faça o commit `diag: hipoteses iniciais` **antes** de qualquer correção e **antes** de conversar com IA.

| Chamado | Consegui reproduzir? Como? | Minha hipótese (arquivo e linha) | Como vou provar |
|---|---|---|---|
| C1 | | | |
| C2 | | | |
| C3 | | | |
| C4 | | | |
| C5 | | | |
| C6 | | | |
| C7 | | | |

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
