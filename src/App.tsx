import { useState, useCallback } from 'react'
import { createBrowserTTS } from '@/domain/tts'
import { createPickSyllableRound } from '@/domain/rounds'
import type { PickSyllableRound as Round, DifficultyLevel } from '@/domain/types'
import { PickSyllableRound } from '@/components/PickSyllableRound'
import { DifficultyPicker } from '@/components/DifficultyPicker'
import './App.css'

const TTS = createBrowserTTS()

export default function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(4)
  const [round, setRound] = useState<Round | null>(() =>
    createPickSyllableRound(4)
  )
  const [showDifficulty, setShowDifficulty] = useState(false)

  const nextRound = useCallback(() => {
    setRound(createPickSyllableRound(difficulty))
  }, [difficulty])

  const handleCorrect = useCallback(() => {
    nextRound()
  }, [nextRound])

  if (round === null) return null

  return (
    <div className="app">
      <header className="header">
        <h1>Учимся читать</h1>
        <button
          type="button"
          className="difficulty-trigger"
          onClick={() => setShowDifficulty((v) => !v)}
          aria-expanded={showDifficulty}
        >
          Сложность: {difficulty} варианта
        </button>
        {showDifficulty && (
          <DifficultyPicker
            value={difficulty}
            onChange={(v) => {
              setDifficulty(v)
              setShowDifficulty(false)
              setRound(createPickSyllableRound(v))
            }}
          />
        )}
      </header>
      <main className="main">
        <PickSyllableRound
          round={round}
          tts={TTS}
          onCorrect={handleCorrect}
          hintOnWrong={true}
        />
      </main>
    </div>
  )
}
