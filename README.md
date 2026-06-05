# Granaup

Granaup é um protótipo de aplicativo de educação financeira para jovens, com foco em metas visuais, controle de gastos em tempo real, gráficos simples e planejamento de recebimentos.

O projeto roda totalmente no front-end, sem backend. As informações cadastradas pelo usuário são salvas localmente no navegador com `localStorage`.

## Funcionalidades

- Onboarding com nome, idade, cidade ou escola, avatar, múltiplas fontes de renda e objetivo principal.
- Tutorial inicial com explicação didática das principais áreas do aplicativo.
- Feed financeiro para cadastrar entradas e gastos em tempo real.
- Status do mês com termômetro visual.
- Gráficos financeiros em pizza, barras ou linha, com preferência salva pelo usuário.
- Regra dos envelopes digitais: 60% rolê e gastos livres, 30% sonhos e 10% futuro.
- Fábrica de sonhos com metas visuais, progresso e poupança automática.
- Desafios de hábito sem pontuação ou parcerias comerciais.
- Educação financeira em formato de stories.
- Calculadora de "quantos rolês custa isso?".
- Calendário visual de pagamentos com cálculo automático de dias restantes.

## Tecnologias

- React
- Vite
- JavaScript
- CSS
- localStorage

## Como Rodar

Versão publicada:

```text
https://hudsonneves.github.io/granaupp/
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:5173/granaupp/
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Estrutura Principal

```text
src/
|-- assets/
|-- components/
|-- data/
|-- pages/
|-- services/
|-- styles/
|-- App.jsx
`-- main.jsx
```

## Informações Institucionais

Projeto Integrador desenvolvido por alunos.

Unidade Operativa: CEP Jó Rufino e Carlos Aguiar - Taguatinga

UC 12: Projeto Integrador Desenvolvedor de Aplicações - 60h

Turma: 2025.08.53 - Técnico em Desenvolvimento de Sistemas

Instrutor: Hudson Neves

Projeto desenvolvido para a turma do curso Técnico em Contabilidade do mesmo CEP.

Instrutora: Joelma Leite
