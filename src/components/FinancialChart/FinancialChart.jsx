const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const chartOptions = [
  { id: 'pizza', label: 'Pizza' },
  { id: 'barras', label: 'Barras' },
  { id: 'linha', label: 'Linha' },
]

function getSlices(items) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  let cursor = 0

  return items.map((item) => {
    const start = cursor
    const size = total > 0 ? (item.value / total) * 100 : 0
    cursor += size

    return `${item.color} ${start}% ${cursor}%`
  })
}

function getLinePoint(item, index, items, minValue, range) {
  const x = items.length === 1 ? 150 : 20 + (index / (items.length - 1)) * 260
  const y = 130 - ((item.value - minValue) / range) * 110

  return { x, y }
}

export function FinancialChart({ balanceItems, chartType, onChangeChartType, summaryItems }) {
  const visibleSummaryItems = summaryItems.filter((item) => item.value > 0)
  const hasSummary = visibleSummaryItems.length > 0
  const hasBalance = balanceItems.length > 0
  const maxSummaryValue = Math.max(...visibleSummaryItems.map((item) => item.value), 1)
  const balanceValues = balanceItems.map((item) => item.value)
  const minBalanceValue = Math.min(...balanceValues, 0)
  const maxBalanceValue = Math.max(...balanceValues, 1)
  const balanceRange = Math.max(maxBalanceValue - minBalanceValue, 1)
  const linePoints = balanceItems
    .map((item, index) => {
      const point = getLinePoint(item, index, balanceItems, minBalanceValue, balanceRange)

      return `${point.x},${point.y}`
    })
    .join(' ')

  return (
    <section className="panel chart-panel">
      <div className="panel-title chart-title">
        <div>
          <span>Gráficos sincronizados</span>
          <h2>{chartType === 'linha' ? 'Evolução do saldo livre' : 'Resumo do dinheiro'}</h2>
          <p>
            Atualiza ao cadastrar, excluir ou zerar gastos, e ao mudar o progresso das metas.
          </p>
        </div>
        <div className="segmented-control" aria-label="Tipo de gráfico">
          {chartOptions.map((option) => (
            <button
              className={chartType === option.id ? 'segment segment--active' : 'segment'}
              key={option.id}
              type="button"
              onClick={() => onChangeChartType(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {chartType === 'pizza' && hasSummary && (
        <div className="pie-chart-layout">
          <div
            aria-label="Gráfico de pizza sincronizado com o resumo financeiro"
            className="pie-chart"
            style={{ background: `conic-gradient(${getSlices(visibleSummaryItems).join(', ')})` }}
          />
          <div className="chart-legend">
            {visibleSummaryItems.map((item) => (
              <span key={item.label}>
                <i style={{ background: item.color }} />
                {item.label}: {currencyFormatter.format(item.value)}
              </span>
            ))}
          </div>
        </div>
      )}

      {chartType === 'barras' && hasSummary && (
        <div className="bar-chart" aria-label="Gráfico de barras sincronizado com o resumo financeiro">
          {visibleSummaryItems.map((item) => (
            <div className="bar-item" key={item.label}>
              <span>{item.label}</span>
              <div>
                <i
                  style={{
                    '--bar-color': item.color,
                    width: `${Math.max((item.value / maxSummaryValue) * 100, 4)}%`,
                  }}
                />
              </div>
              <strong>{currencyFormatter.format(item.value)}</strong>
            </div>
          ))}
        </div>
      )}

      {chartType === 'linha' && hasBalance && (
        <div className="line-chart" aria-label="Gráfico de linha da evolução do saldo livre">
          <svg viewBox="0 0 300 150" role="img">
            <polyline points={linePoints} />
            {balanceItems.map((item, index) => {
              const point = getLinePoint(item, index, balanceItems, minBalanceValue, balanceRange)

              return <circle cx={point.x} cy={point.y} fill="#7cf7c8" key={item.id} r="5" />
            })}
          </svg>
          <div className="chart-legend">
            {balanceItems.slice(-3).map((item) => (
              <span key={item.id}>
                <i style={{ background: '#7cf7c8' }} />
                {item.label}: {currencyFormatter.format(item.value)}
              </span>
            ))}
          </div>
        </div>
      )}

      {chartType !== 'linha' && !hasSummary && (
        <p className="chart-empty">Cadastre uma entrada, um gasto ou uma meta para ver o gráfico.</p>
      )}

      {chartType === 'linha' && !hasBalance && (
        <p className="chart-empty">Cadastre uma entrada ou gasto para visualizar o saldo.</p>
      )}
    </section>
  )
}
