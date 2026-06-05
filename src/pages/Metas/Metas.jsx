import { useState } from 'react'
import { MetaCard } from '../../components/MetaCard/MetaCard'

const initialGoalForm = {
  nome: '',
  objetivo: '',
  imagem: '',
}

export function Metas({ appData, onAddGoal, onUpdateGoal, profile }) {
  const [goalForm, setGoalForm] = useState(initialGoalForm)
  const [contributions, setContributions] = useState({})
  const { metas } = appData

  function handleGoalSubmit(event) {
    event.preventDefault()

    const objetivo = Number(goalForm.objetivo)

    if (!goalForm.nome.trim() || Number.isNaN(objetivo) || objetivo <= 0) {
      return
    }

    onAddGoal({
      nome: goalForm.nome.trim(),
      objetivo,
      imagem: goalForm.imagem.trim() || undefined,
    })
    setGoalForm(initialGoalForm)
  }

  function handleContributionSubmit(event, meta) {
    event.preventDefault()

    const value = Number(contributions[meta.id])

    if (Number.isNaN(value) || value <= 0) {
      return
    }

    onUpdateGoal(meta.id, {
      atual: Math.min(Number(meta.atual) + value, Number(meta.objetivo)),
    })
    setContributions((currentValues) => ({ ...currentValues, [meta.id]: '' }))
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Fábrica de sonhos</span>
          <h1>Guarde com propósito claro.</h1>
          <p>
            Seu objetivo principal é {profile.objetivo.toLowerCase()}. Cadastre novas metas e
            atualize cada progresso sem sair da tela.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-title">
          <span>Nova meta visual</span>
          <h2>Cadastrar sonho</h2>
        </div>
        <form className="data-form" onSubmit={handleGoalSubmit}>
          <label>
            Nome da meta
            <input
              placeholder="Ex: celular, festival, reserva..."
              value={goalForm.nome}
              onChange={(event) =>
                setGoalForm((currentForm) => ({ ...currentForm, nome: event.target.value }))
              }
            />
          </label>
          <label>
            Valor objetivo
            <input
              min="1"
              type="number"
              value={goalForm.objetivo}
              onChange={(event) =>
                setGoalForm((currentForm) => ({ ...currentForm, objetivo: event.target.value }))
              }
            />
          </label>
          <label>
            Link da foto
            <input
              placeholder="Opcional"
              value={goalForm.imagem}
              onChange={(event) =>
                setGoalForm((currentForm) => ({ ...currentForm, imagem: event.target.value }))
              }
            />
          </label>
          <button className="primary-action" type="submit">
            Criar meta
          </button>
        </form>
      </section>

      <div className="goals-layout">
        {metas.map((meta) => (
          <div className="editable-card" key={meta.id}>
            <MetaCard meta={meta} />
            <form className="inline-update-form" onSubmit={(event) => handleContributionSubmit(event, meta)}>
              <input
                min="1"
                placeholder="Adicionar R$"
                type="number"
                value={contributions[meta.id] ?? ''}
                onChange={(event) =>
                  setContributions((currentValues) => ({
                    ...currentValues,
                    [meta.id]: event.target.value,
                  }))
                }
              />
              <button className="primary-action" type="submit">
                Atualizar
              </button>
            </form>
            <label className="toggle-row editable-toggle">
              <input
                checked={Boolean(meta.poupancaAutomatica)}
                type="checkbox"
                onChange={(event) =>
                  onUpdateGoal(meta.id, { poupancaAutomatica: event.target.checked })
                }
              />
              <span>Poupança automática</span>
            </label>
          </div>
        ))}
      </div>

      <section className="panel automation-panel">
        <div>
          <span className="eyebrow">Proteção contra impulso</span>
          <h2>Poupança automática</h2>
          <p>
            Quando o auxílio entrar, 30% vai direto para Sonhos e 10% para Futuro. Você ainda vê o
            dinheiro, mas ele fica fora do saldo livre.
          </p>
        </div>
      </section>
    </section>
  )
}
