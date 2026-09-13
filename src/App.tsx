import { useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import { StartScreen } from './components/StartScreen'
import { CharacterCreation } from './components/CharacterCreation'
import { Dashboard } from './components/Dashboard'
import { LifeSummary } from './components/LifeSummary'

function App() {
  const screen = useGameStore((s) => s.screen)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  switch (screen) {
    case 'creation':
      return <CharacterCreation />
    case 'playing':
      return <Dashboard />
    case 'summary':
      return <LifeSummary />
    default:
      return <StartScreen />
  }
}

export default App
