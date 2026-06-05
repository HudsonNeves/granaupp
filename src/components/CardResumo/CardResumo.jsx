const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function CardResumo({ titulo, valor, tipo, detalhe }) {
  return (
    <article className={`summary-card summary-card--${tipo}`}>
      <span>{titulo}</span>
      <strong>{currencyFormatter.format(valor)}</strong>
      <p>{detalhe}</p>
    </article>
  )
}
