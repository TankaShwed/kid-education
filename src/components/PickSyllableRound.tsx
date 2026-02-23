import { useState, useEffect, useCallback } from 'react'
import type { PickSyllableRound as Round, Syllable } from '@/domain/types'
import type { TTSProvider } from '@/domain/tts'

const PHRASE = 'Выбери слог'

interface PickSyllableRoundProps {
  round: Round
  tts: TTSProvider
  onCorrect: () => void
  onWrong?: (chosen: Syllable) => void
  /** Подсказка при ошибке: «X — это Y и Z» (следующая итерация можно включить) */
  hintOnWrong?: boolean
}

export function PickSyllableRound({
  round,
  tts,
  onCorrect,
  onWrong,
  hintOnWrong = false,
}: PickSyllableRoundProps) {
  const [options, setOptions] = useState<Syllable[]>(round.options)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [spoken, setSpoken] = useState(false)

  const target = round.target

  const speakTask = useCallback(() => {
    const text = `${PHRASE} ${target.toLowerCase()}`
    setSpoken(false)
    tts.speak(text).then(() => setSpoken(true))
  }, [target, tts])

  useEffect(() => {
    speakTask()
    return () => tts.cancel()
  }, [speakTask, tts])

  const handleChoose = useCallback(
    (chosen: Syllable) => {
      if (status !== 'idle') return
      if (chosen === target) {
        setStatus('correct')
        tts.speak('Правильно! Молодец!').then(() => onCorrect())
        return
      }
      setStatus('wrong')
      onWrong?.(chosen)
      const hint =
        hintOnWrong && chosen.length >= 2
          ? ` ${chosen.toLowerCase()} — это ${chosen[0]!.toLowerCase()} и ${chosen[1]!.toLowerCase()}.`
          : ''
      tts.speak(`Это слог ${chosen.toLowerCase()}.${hint}`).then(() => {
        setOptions((prev) => prev.filter((s) => s !== chosen))
        setStatus('idle')
      })
    },
    [target, status, tts, onCorrect, onWrong, hintOnWrong]
  )

  return (
    <div className="pick-syllable-round">
      <p className="instruction">Выбери слог <strong>{target}</strong></p>
      <div className="options" role="group" aria-label="Варианты слогов">
        {options.map((syllable) => (
          <button
            key={syllable}
            type="button"
            className="syllable-button"
            onClick={() => handleChoose(syllable)}
            disabled={status !== 'idle'}
            aria-pressed={status === 'correct' ? undefined : false}
          >
            {syllable}
          </button>
        ))}
      </div>
      {!spoken && <p className="hint">Слушай задание…</p>}
    </div>
  )
}
