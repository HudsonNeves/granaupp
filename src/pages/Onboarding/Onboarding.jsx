import { useState } from 'react'
import { avatares, fontesDeRenda, objetivosRapidos } from '../../data/mockData'

export function Onboarding({ onComplete }) {
  const [avatar, setAvatar] = useState(avatares[0])
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [cidade, setCidade] = useState('')
  const [rendas, setRendas] = useState([fontesDeRenda[0]])
  const [rendaMensal, setRendaMensal] = useState('')
  const [objetivo, setObjetivo] = useState(objetivosRapidos[0])

  function toggleRenda(renda) {
    setRendas((currentRendas) => {
      if (currentRendas.includes(renda)) {
        return currentRendas.filter((item) => item !== renda)
      }

      return [...currentRendas, renda]
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!nome.trim() || rendas.length === 0) {
      return
    }

    onComplete({
      avatar,
      nome: nome.trim(),
      idade: idade ? Number(idade) : null,
      cidade: cidade.trim(),
      rendas,
      rendaMensal: rendaMensal ? Number(rendaMensal) : 0,
      objetivo,
    })
  }

  return (
    <section className="onboarding-page">
      <div className="onboarding-hero">
        <span className="eyebrow">Primeiro contato</span>
        <h1>Vamos deixar sua grana com a sua cara.</h1>
        <p>
          Cadastre seu perfil, conte de onde vem seu dinheiro e escolha o primeiro objetivo para
          proteger.
        </p>
      </div>

      <form className="onboarding-flow" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Seu perfil</legend>
          <div className="profile-form-grid">
            <label>
              Nome
              <input
                required
                placeholder="Ex: Ana"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
              />
            </label>
            <label>
              Idade
              <input
                min="10"
                placeholder="Ex: 17"
                type="number"
                value={idade}
                onChange={(event) => setIdade(event.target.value)}
              />
            </label>
            <label className="form-wide">
              Cidade ou escola
              <input
                placeholder="Opcional"
                value={cidade}
                onChange={(event) => setCidade(event.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Escolha seu avatar</legend>
          <div className="option-grid">
            {avatares.map((item) => (
              <button
                className={avatar.id === item.id ? 'choice-card choice-card--selected' : 'choice-card'}
                key={item.id}
                type="button"
                onClick={() => setAvatar(item)}
              >
                <span>{item.icone}</span>
                <strong>{item.nome}</strong>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>De onde vem a sua grana?</legend>
          <div className="pill-grid">
            {fontesDeRenda.map((item) => (
              <button
                aria-pressed={rendas.includes(item)}
                className={rendas.includes(item) ? 'pill pill--selected' : 'pill'}
                key={item}
                type="button"
                onClick={() => toggleRenda(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="single-field">
            Renda mensal estimada
            <input
              min="0"
              placeholder="Ex: 320"
              type="number"
              value={rendaMensal}
              onChange={(event) => setRendaMensal(event.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Qual é o grande objetivo?</legend>
          <div className="pill-grid">
            {objetivosRapidos.map((item) => (
              <button
                className={objetivo === item ? 'pill pill--selected' : 'pill'}
                key={item}
                type="button"
                onClick={() => setObjetivo(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <button className="primary-action" type="submit">
          Entrar no meu feed
        </button>
      </form>
    </section>
  )
}
