export function DesafioCard({ desafio, onDelete }) {
  return (
    <article className="challenge-card">
      <span className="challenge-badge">{desafio.insignia}</span>
      <div>
        <h3>{desafio.titulo}</h3>
        <p>{desafio.descricao}</p>
        <div className="progress" aria-label={`Progresso de ${desafio.progresso}%`}>
          <span style={{ width: `${desafio.progresso}%` }} />
        </div>
      </div>
      <strong>{desafio.recompensa}</strong>
      <button
        aria-label={`Excluir ${desafio.titulo}`}
        className="delete-action"
        type="button"
        onClick={onDelete}
      >
        Excluir
      </button>
    </article>
  )
}
