import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header/Header'
import { TutorialOverlay } from './components/TutorialOverlay/TutorialOverlay'
import { getStorageItem, setStorageItem } from './services/storageService'
import { Onboarding } from './pages/Onboarding/Onboarding'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Metas } from './pages/Metas/Metas'
import { EducacaoFinanceira } from './pages/EducacaoFinanceira/EducacaoFinanceira'
import { Calendario } from './pages/Calendario/Calendario'
import { desafios, metas, pagamentos, transacoes } from './data/mockData'
import './styles/global.css'

const savedProfile = getStorageItem('profile')
const initialProfile = savedProfile?.nome
  ? {
      ...savedProfile,
      avatar: { id: 'money', nome: 'Dinheiro no controle', icone: '💰', tema: 'neon' },
      rendas: savedProfile.rendas ?? [savedProfile.renda].filter(Boolean),
    }
  : null
const initialThemeMode = getStorageItem('themeMode', 'dark')
const initialChartType = getStorageItem('chartType', 'pizza')
const initialTutorialSeen = getStorageItem('tutorialSeen', false)
const initialAppData = getStorageItem('appData', {
  transacoes,
  metas,
  desafios,
  pagamentos,
})

function App() {
  const [profile, setProfile] = useState(initialProfile)
  const [appData, setAppData] = useState(initialAppData)
  const [activePage, setActivePage] = useState(initialProfile ? 'dashboard' : 'onboarding')
  const [themeMode, setThemeMode] = useState(initialThemeMode)
  const [chartType, setChartType] = useState(initialChartType)
  const [showTutorial, setShowTutorial] = useState(Boolean(initialProfile) && !initialTutorialSeen)

  useEffect(() => {
    setStorageItem('appData', appData)
  }, [appData])

  useEffect(() => {
    setStorageItem('themeMode', themeMode)
  }, [themeMode])

  useEffect(() => {
    setStorageItem('chartType', chartType)
  }, [chartType])

  const userLabel = useMemo(() => {
    if (!profile) {
      return 'Granaup'
    }

    return `${profile.avatar.icone} ${profile.nome ?? profile.objetivo}`
  }, [profile])

  function handleOnboardingComplete(nextProfile) {
    setStorageItem('profile', nextProfile)
    setProfile(nextProfile)
    setActivePage('dashboard')
    setShowTutorial(true)
  }

  function addTransaction(transaction) {
    setAppData((currentData) => ({
      ...currentData,
      transacoes: [
        {
          id: crypto.randomUUID(),
          data: 'Agora',
          reacao: transaction.valor >= 0 ? '💸' : '🧾',
          comentario:
            transaction.valor >= 0
              ? 'Entrada cadastrada pelo usuário.'
              : 'Gasto cadastrado pelo usuário.',
          ...transaction,
        },
        ...currentData.transacoes,
      ],
    }))
  }

  function deleteTransaction(transactionId) {
    setAppData((currentData) => ({
      ...currentData,
      transacoes: currentData.transacoes.filter((transaction) => transaction.id !== transactionId),
    }))
  }

  function clearExpenses() {
    setAppData((currentData) => ({
      ...currentData,
      transacoes: currentData.transacoes.filter((transaction) => transaction.valor >= 0),
    }))
  }

  function addGoal(goal) {
    setAppData((currentData) => ({
      ...currentData,
      metas: [
        {
          id: crypto.randomUUID(),
          atual: 0,
          imagem:
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
          poupancaAutomatica: false,
          ...goal,
        },
        ...currentData.metas,
      ],
    }))
  }

  function updateGoal(goalId, changes) {
    setAppData((currentData) => ({
      ...currentData,
      metas: currentData.metas.map((goal) =>
        goal.id === goalId ? { ...goal, ...changes } : goal,
      ),
    }))
  }

  function addChallenge(challenge) {
    setAppData((currentData) => ({
      ...currentData,
      desafios: [
        {
          id: crypto.randomUUID(),
          progresso: 0,
          recompensa: '0%',
          insignia: '🏅',
          ...challenge,
        },
        ...currentData.desafios,
      ],
    }))
  }

  function deleteChallenge(challengeId) {
    setAppData((currentData) => ({
      ...currentData,
      desafios: currentData.desafios.filter((challenge) => challenge.id !== challengeId),
    }))
  }

  function clearChallenges() {
    setAppData((currentData) => ({
      ...currentData,
      desafios: [],
    }))
  }

  function addPayment(payment) {
    setAppData((currentData) => ({
      ...currentData,
      pagamentos: [
        {
          id: crypto.randomUUID(),
          alerta: 'Planeje antes de gastar: rolê, sonho e futuro.',
          ...payment,
        },
        ...currentData.pagamentos,
      ],
    }))
  }

  function toggleThemeMode() {
    setThemeMode((currentThemeMode) => (currentThemeMode === 'light' ? 'dark' : 'light'))
  }

  function closeTutorial() {
    setStorageItem('tutorialSeen', true)
    setShowTutorial(false)
  }

  function renderPage() {
    if (!profile || activePage === 'onboarding') {
      return <Onboarding onComplete={handleOnboardingComplete} />
    }

    const pages = {
      dashboard: (
        <Dashboard
          appData={appData}
          chartType={chartType}
          onAddChallenge={addChallenge}
          onAddTransaction={addTransaction}
          onChangeChartType={setChartType}
          onClearChallenges={clearChallenges}
          onClearExpenses={clearExpenses}
          onDeleteChallenge={deleteChallenge}
          onDeleteTransaction={deleteTransaction}
          profile={profile}
        />
      ),
      metas: (
        <Metas appData={appData} onAddGoal={addGoal} onUpdateGoal={updateGoal} profile={profile} />
      ),
      educacao: <EducacaoFinanceira />,
      calendario: <Calendario appData={appData} onAddPayment={addPayment} profile={profile} />,
    }

    return pages[activePage]
  }

  return (
    <div className={`app-shell theme-${profile?.avatar.tema ?? 'neon'} theme-ui-${themeMode}`}>
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        profile={profile}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
        userLabel={userLabel}
      />
      <main className="main-content">{renderPage()}</main>
      {showTutorial && <TutorialOverlay onClose={closeTutorial} />}
    </div>
  )
}

export default App
