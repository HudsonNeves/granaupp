const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function FeedFinanceiro({ onClearExpenses, onDeleteTransaction, transacoes }) {
  return (
    <section className="panel feed-panel">
      <div className="panel-title feed-title">
        <div>
          <span>Feed financeiro</span>
          <h2>Seu dinheiro em tempo real</h2>
        </div>
        <button className="danger-action" type="button" onClick={onClearExpenses}>
          Zerar gastos
        </button>
      </div>

      <div className="transaction-list">
        {transacoes.map((transacao) => (
          <article className="transaction-item" key={transacao.id}>
            <span className="reaction">{transacao.reacao}</span>
            <div className="transaction-copy">
              <div>
                <strong>{transacao.descricao}</strong>
                <span>
                  {transacao.data} • {transacao.categoria}
                </span>
              </div>
              <p>{transacao.comentario}</p>
            </div>
            <span className={transacao.valor >= 0 ? 'value-positive' : 'value-negative'}>
              {currencyFormatter.format(transacao.valor)}
            </span>
            <button
              aria-label={`Excluir ${transacao.descricao}`}
              className="delete-action"
              type="button"
              onClick={() => onDeleteTransaction(transacao.id)}
            >
              Excluir
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
