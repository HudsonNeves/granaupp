import { useMemo, useState } from 'react'
import { CardResumo } from '../../components/CardResumo/CardResumo'
import { DesafioCard } from '../../components/DesafioCard/DesafioCard'
import { FeedFinanceiro } from '../../components/FeedFinanceiro/FeedFinanceiro'
import { FinancialChart } from '../../components/FinancialChart/FinancialChart'
import { MetaCard } from '../../components/MetaCard/MetaCard'
import { envelopes } from '../../data/mockData'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const initialTransactionForm = {
  descricao: '',
  categoria: 'Rolê',
  valor: '',
}

const initialChallengeForm = {
  titulo: '',
  descricao: '',
}

function getGoalPhrase(objetivo) {
  const lowerGoal = objetivo.toLowerCase()

  if (lowerGoal === 'comprar um tênis') {
    return 'a compra do seu tênis'
  }

  if (lowerGoal.startsWith('comprar ')) {
    return `a compra de ${lowerGoal.replace('comprar ', '')}`
  }

  return lowerGoal
}

function getStatus(saldoLivre, gastos) {
  if (saldoLivre >= gastos * 0.5) {
    return {
      titulo: 'Grana segura',
      descricao: 'Você ainda tem margem para curtir sem atropelar suas metas.',
      nivel: 78,
    }
  }

  if (saldoLivre > 0) {
    return {
      titulo: 'Alerta amarelo',
      descricao: 'Ainda dá para controlar, mas cada gasto novo precisa fazer sentido.',
      nivel: 48,
    }
  }

  return {
    titulo: 'Modo sobrevivência',
    descricao: 'Hora de pausar gastos livres e proteger o essencial.',
    nivel: 22,
  }
}

function getBalanceItems(transacoes) {
  let balance = 0

  return [...transacoes]
    .reverse()
    .map((transaction, index) => {
      balance += Number(transaction.valor)

      return {
        id: transaction.id,
        label: transaction.data === 'Agora' ? `Movimento ${index + 1}` : transaction.data,
        value: balance,
      }
    })
}

export function Dashboard({
  appData,
  chartType,
  onAddChallenge,
  onAddTransaction,
  onChangeChartType,
  onClearChallenges,
  onClearExpenses,
  onDeleteChallenge,
  onDeleteTransaction,
  profile,
}) {
  const [transactionForm, setTransactionForm] = useState(initialTransactionForm)
  const [challengeForm, setChallengeForm] = useState(initialChallengeForm)
  const { desafios, metas, transacoes } = appData

  const totals = useMemo(() => {
    const entradas = transacoes
      .filter((transaction) => transaction.valor > 0)
      .reduce((total, transaction) => total + transaction.valor, 0)
    const gastos = transacoes
      .filter((transaction) => transaction.valor < 0)
      .reduce((total, transaction) => total + Math.abs(transaction.valor), 0)
    const sonhos = metas.reduce((total, meta) => total + Number(meta.atual), 0)
    const saldoLivre = entradas - gastos

    return { entradas, gastos, saldoLivre, sonhos }
  }, [metas, transacoes])

  const balanceItems = useMemo(() => getBalanceItems(transacoes), [transacoes])
  const summaryItems = [
    {
      label: totals.saldoLivre >= 0 ? 'Saldo livre' : 'Saldo negativo',
      value: Math.abs(totals.saldoLivre),
      color: totals.saldoLivre >= 0 ? '#7cf7c8' : '#ff8b7f',
    },
    { label: 'Gastos', value: totals.gastos, color: '#ff8b7f' },
    { label: 'Sonhos', value: totals.sonhos, color: '#ffb7ef' },
  ]

  const resumoFinanceiro = [
    {
      id: 1,
      titulo: 'Saldo livre',
      valor: totals.saldoLivre,
      tipo: totals.saldoLivre >= 0 ? 'positivo' : 'negativo',
      detalhe: 'Calculado com entradas e gastos cadastrados',
    },
    {
      id: 2,
      titulo: 'Guardado nos sonhos',
      valor: totals.sonhos,
      tipo: 'sonho',
      detalhe: 'Soma das metas atualizadas',
    },
    {
      id: 3,
      titulo: 'Total gasto',
      valor: totals.gastos,
      tipo: 'negativo',
      detalhe: 'Saídas registradas no feed',
    },
  ]

  const statusDoMes = getStatus(totals.saldoLivre, totals.gastos)
  const rendaBase = Math.max(totals.entradas, Number(profile.rendaMensal) || 200)
  const rendaLabel = profile.rendas?.length ? profile.rendas.join(', ') : profile.renda
  const envelopesCalculados = envelopes.map((envelope) => ({
    ...envelope,
    valor: (rendaBase * envelope.percentual) / 100,
  }))

  function handleTransactionSubmit(event) {
    event.preventDefault()

    const valor = Number(transactionForm.valor)

    if (!transactionForm.descricao.trim() || Number.isNaN(valor) || valor === 0) {
      return
    }

    onAddTransaction({
      descricao: transactionForm.descricao.trim(),
      categoria: transactionForm.categoria.trim() || 'Sem categoria',
      valor,
    })
    setTransactionForm(initialTransactionForm)
  }

  function handleChallengeSubmit(event) {
    event.preventDefault()

    if (!challengeForm.titulo.trim() || !challengeForm.descricao.trim()) {
      return
    }

    onAddChallenge({
      titulo: challengeForm.titulo.trim(),
      descricao: challengeForm.descricao.trim(),
    })
    setChallengeForm(initialChallengeForm)
  }

  function handleClearExpenses() {
    const hasExpenses = transacoes.some((transaction) => transaction.valor < 0)

    if (!hasExpenses) {
      return
    }

    if (window.confirm('Deseja zerar todos os gastos cadastrados? As entradas serão mantidas.')) {
      onClearExpenses()
    }
  }

  function handleClearChallenges() {
    if (desafios.length === 0) {
      return
    }

    if (window.confirm('Deseja excluir todos os desafios cadastrados?')) {
      onClearChallenges()
    }
  }

  return (
    <section className="dashboard">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Feed financeiro</span>
          <h1>
            Olá! {profile.nome}, pronto para planejar {getGoalPhrase(profile.objetivo)}?
          </h1>
          <p>Suas fontes de renda cadastradas: {rendaLabel}.</p>
        </div>
      </div>

      <section className="status-band">
        <div>
          <span>Status do mês</span>
          <h2>{statusDoMes.titulo}</h2>
          <p>{statusDoMes.descricao}</p>
        </div>
        <div className="thermometer" aria-label={`Termômetro em ${statusDoMes.nivel}%`}>
          <span style={{ width: `${statusDoMes.nivel}%` }} />
        </div>
      </section>

      <div className="summary-grid">
        {resumoFinanceiro.map((item) => (
          <CardResumo key={item.id} {...item} />
        ))}
      </div>

      <FinancialChart
        balanceItems={balanceItems}
        chartType={chartType}
        onChangeChartType={onChangeChartType}
        summaryItems={summaryItems}
      />

      <section className="panel">
        <div className="panel-title">
          <span>Cadastrar agora</span>
          <h2>Entrada ou gasto em tempo real</h2>
        </div>
        <form className="data-form transaction-form" onSubmit={handleTransactionSubmit}>
          <label>
            Descrição
            <input
              placeholder="Ex: lanche, pix, bolsa..."
              value={transactionForm.descricao}
              onChange={(event) =>
                setTransactionForm((currentForm) => ({
                  ...currentForm,
                  descricao: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Categoria
            <input
              value={transactionForm.categoria}
              onChange={(event) =>
                setTransactionForm((currentForm) => ({
                  ...currentForm,
                  categoria: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Valor
            <input
              placeholder="Use negativo para gasto"
              type="number"
              value={transactionForm.valor}
              onChange={(event) =>
                setTransactionForm((currentForm) => ({
                  ...currentForm,
                  valor: event.target.value,
                }))
              }
            />
          </label>
          <button className="primary-action" type="submit">
            Salvar movimento
          </button>
        </form>
      </section>

      <section className="panel envelope-panel">
        <div className="panel-title">
          <span>Regra dos envelopes</span>
          <h2>Com {currencyFormatter.format(rendaBase)}, o app sugere assim</h2>
        </div>
        <div className="envelope-grid">
          {envelopesCalculados.map((envelope) => (
            <article className="envelope-card" key={envelope.id}>
              <div className="envelope-ring" style={{ '--ring-color': envelope.cor }}>
                {envelope.percentual}%
              </div>
              <div>
                <h3>{envelope.nome}</h3>
                <strong>{currencyFormatter.format(envelope.valor)}</strong>
                <p>{envelope.descricao}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="content-grid">
        <FeedFinanceiro
          onClearExpenses={handleClearExpenses}
          onDeleteTransaction={onDeleteTransaction}
          transacoes={transacoes}
        />

        <section className="panel">
          <div className="panel-title">
            <span>Fábrica de sonhos</span>
            <h2>Metas visuais</h2>
          </div>
          <div className="stack">
            {metas.slice(0, 2).map((meta) => (
              <MetaCard key={meta.id} meta={meta} />
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title challenge-title">
            <div>
              <span>Hábitos</span>
              <h2>Desafios ativos</h2>
            </div>
            <button className="danger-action" type="button" onClick={handleClearChallenges}>
              Zerar desafios
            </button>
          </div>
          <form className="compact-form" onSubmit={handleChallengeSubmit}>
            <input
              placeholder="Novo desafio"
              value={challengeForm.titulo}
              onChange={(event) =>
                setChallengeForm((currentForm) => ({
                  ...currentForm,
                  titulo: event.target.value,
                }))
              }
            />
            <input
              placeholder="Regra ou objetivo"
              value={challengeForm.descricao}
              onChange={(event) =>
                setChallengeForm((currentForm) => ({
                  ...currentForm,
                  descricao: event.target.value,
                }))
              }
            />
            <button className="primary-action" type="submit">
              Criar desafio
            </button>
          </form>
          <div className="stack">
            {desafios.map((desafio) => (
              <DesafioCard
                key={desafio.id}
                desafio={desafio}
                onDelete={() => onDeleteChallenge(desafio.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
