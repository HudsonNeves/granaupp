const tutorialSteps = [
  {
    titulo: 'Cadastre sua grana',
    texto: 'Registre entradas e gastos no feed para enxergar seu dinheiro em tempo real.',
  },
  {
    titulo: 'Acompanhe gráficos',
    texto: 'Escolha pizza, barras ou linha para visualizar o que mais combina com seu jeito de acompanhar.',
  },
  {
    titulo: 'Proteja seus sonhos',
    texto: 'Crie metas visuais e atualize o progresso sempre que guardar dinheiro.',
  },
  {
    titulo: 'Planeje recebimentos',
    texto: 'O calendário calcula automaticamente quantos dias faltam para cada pagamento.',
  },
]

export function TutorialOverlay({ onClose }) {
  return (
    <div className="tutorial-backdrop" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <section className="tutorial-modal">
        <div className="panel-title">
          <span>Boas-vindas</span>
          <h2 id="tutorial-title">Como usar o Granaup</h2>
        </div>
        <div className="tutorial-grid">
          {tutorialSteps.map((step, index) => (
            <article className="tutorial-step" key={step.titulo}>
              <strong>{index + 1}</strong>
              <div>
                <h3>{step.titulo}</h3>
                <p>{step.texto}</p>
              </div>
            </article>
          ))}
        </div>
        <button className="primary-action" type="button" onClick={onClose}>
          Começar
        </button>
      </section>
    </div>
  )
}
