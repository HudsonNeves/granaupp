import { useMemo, useState } from 'react'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const initialPaymentForm = {
  titulo: '',
  data: '',
  valor: '',
  alerta: '',
}

function parseLocalDate(value) {
  if (!value) {
    return null
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)

    return new Date(year, month - 1, day)
  }

  if (/^\d{2}\/\d{2}$/.test(value)) {
    const [day, month] = value.split('/').map(Number)
    const currentYear = new Date().getFullYear()

    return new Date(currentYear, month - 1, day)
  }

  return null
}

function getRemainingDays(date) {
  if (!date) {
    return 0
  }

  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = startOfDate.getTime() - startOfToday.getTime()

  return Math.max(0, Math.ceil(diff / 86400000))
}

function getCalendarDays(monthDate, pagamentos) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const totalDays = new Date(year, month + 1, 0).getDate()
  const emptyDays = Array.from({ length: firstDay.getDay() }, (_, index) => ({
    id: `empty-${index}`,
    empty: true,
  }))

  const days = Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1
    const payments = pagamentos.filter((pagamento) => {
      const date = parseLocalDate(pagamento.data)

      return date?.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    })

    return { id: day, day, payments }
  })

  return [...emptyDays, ...days]
}

export function Calendario({ appData, onAddPayment, profile }) {
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm)
  const { pagamentos } = appData
  const calendarMonth = useMemo(() => {
    const nextPayment = pagamentos
      .map((pagamento) => parseLocalDate(pagamento.data))
      .filter(Boolean)
      .sort((a, b) => a.getTime() - b.getTime())[0]

    return nextPayment ?? new Date()
  }, [pagamentos])
  const calendarDays = useMemo(
    () => getCalendarDays(calendarMonth, pagamentos),
    [calendarMonth, pagamentos],
  )
  const rendaLabel = profile.rendas?.length ? profile.rendas.join(', ') : profile.renda

  function handlePaymentSubmit(event) {
    event.preventDefault()

    const valor = Number(paymentForm.valor)

    if (!paymentForm.titulo.trim() || !paymentForm.data || Number.isNaN(valor)) {
      return
    }

    onAddPayment({
      titulo: paymentForm.titulo.trim(),
      data: paymentForm.data,
      valor,
      alerta:
        paymentForm.alerta.trim() ||
        'Planeje o depósito antes dele cair: rolê, sonhos e futuro.',
    })
    setPaymentForm(initialPaymentForm)
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Pagamentos</span>
          <h1>Seu dinheiro antes dele cair.</h1>
          <p>
            O app lembra quando {rendaLabel} está chegando e ajuda você a planejar os envelopes.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-title">
          <span>Novo lembrete</span>
          <h2>Cadastrar pagamento</h2>
        </div>
        <form className="data-form" onSubmit={handlePaymentSubmit}>
          <label>
            Nome
            <input
              placeholder="Ex: Pé-de-Meia, mesada..."
              value={paymentForm.titulo}
              onChange={(event) =>
                setPaymentForm((currentForm) => ({
                  ...currentForm,
                  titulo: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Data de recebimento
            <input
              type="date"
              value={paymentForm.data}
              onChange={(event) =>
                setPaymentForm((currentForm) => ({ ...currentForm, data: event.target.value }))
              }
            />
          </label>
          <label>
            Valor
            <input
              min="0"
              type="number"
              value={paymentForm.valor}
              onChange={(event) =>
                setPaymentForm((currentForm) => ({ ...currentForm, valor: event.target.value }))
              }
            />
          </label>
          <label className="form-wide">
            Alerta
            <input
              placeholder="Opcional"
              value={paymentForm.alerta}
              onChange={(event) =>
                setPaymentForm((currentForm) => ({ ...currentForm, alerta: event.target.value }))
              }
            />
          </label>
          <button className="primary-action" type="submit">
            Salvar lembrete
          </button>
        </form>
      </section>

      <section className="panel calendar-panel">
        <div className="panel-title">
          <span>Calendário visual</span>
          <h2>{monthFormatter.format(calendarMonth)}</h2>
        </div>
        <div className="calendar-grid">
          {weekDays.map((day) => (
            <strong className="calendar-weekday" key={day}>
              {day}
            </strong>
          ))}
          {calendarDays.map((day) => (
            <article
              className={day.empty ? 'calendar-day calendar-day--empty' : 'calendar-day'}
              key={day.id}
            >
              {!day.empty && (
                <>
                  <span>{day.day}</span>
                  {day.payments.map((pagamento) => (
                    <small key={pagamento.id}>{pagamento.titulo}</small>
                  ))}
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className="calendar-list">
        {pagamentos.map((pagamento) => {
          const date = parseLocalDate(pagamento.data)
          const dias = getRemainingDays(date)

          return (
            <article className="payment-card" key={pagamento.id}>
              <div className="payment-date">
                <span>{date ? dateFormatter.format(date) : pagamento.data}</span>
                <strong>{dias === 1 ? '1 dia' : `${dias} dias`}</strong>
              </div>
              <div>
                <h2>{pagamento.titulo}</h2>
                <p>{currencyFormatter.format(pagamento.valor)} previstos</p>
                <small>{pagamento.alerta}</small>
              </div>
            </article>
          )
        })}
      </div>

      <section className="responsibility-alert">
        <strong>Alerta de responsabilidade</strong>
        <p>Mantenha a frequência nas aulas para garantir o próximo depósito do Pé-de-Meia.</p>
      </section>
    </section>
  )
}
