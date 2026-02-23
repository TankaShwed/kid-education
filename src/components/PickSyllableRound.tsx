import { useState, useEffect, useCallback } from 'react';
import type { PickSyllableRound as Round, Syllable } from '@/domain/types';
import type { TTSProvider } from '@/domain/tts';
import { SYLLABLE_RATE } from '@/domain/tts';

const PHRASE = 'Выбери слог';

interface PickSyllableRoundProps {
  round: Round;
  tts: TTSProvider;
  onCorrect: () => void;
  onWrong?: (chosen: Syllable) => void;
  /** Подсказка при ошибке: «X — это Y и Z» (следующая итерация можно включить) */
  hintOnWrong?: boolean;
}

export function PickSyllableRound({
  round,
  tts,
  onCorrect,
  onWrong,
  hintOnWrong = false,
}: PickSyllableRoundProps) {
  const [options, setOptions] = useState<Syllable[]>(round.options);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [spoken, setSpoken] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const target = round.target;

  const speakTask = useCallback(() => {
    setSpoken(false);
    const syllable = target.toLowerCase();
    tts
      .speak(PHRASE)
      .then(() => tts.speak(syllable, { rate: SYLLABLE_RATE }))
      .then(() => setSpoken(true));
  }, [target, tts]);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    speakTask();
  }, [speakTask]);

  useEffect(() => () => tts.cancel(), [tts]);

  const handleChoose = useCallback(
    (chosen: Syllable) => {
      if (status !== 'idle') return;
      if (chosen === target) {
        setStatus('correct');
        onCorrect(); // следующий раунд сразу, не ждём окончания TTS (в headless/части браузеров onend может не сработать)
        tts.speak('Правильно! Молодец!');
        return;
      }
      setStatus('wrong');
      onWrong?.(chosen);
      const hint =
        hintOnWrong && chosen.length >= 2
          ? ` ${chosen.toLowerCase()} — это ${chosen[0]!.toLowerCase()} и ${chosen[1]!.toLowerCase()}.`
          : '';
      const syllable = chosen.toLowerCase();
      tts
        .speak('Это слог ')
        .then(() => tts.speak(syllable, { rate: SYLLABLE_RATE }))
        .then(() => (hint ? tts.speak(hint.trim()) : Promise.resolve()))
        .then(() => {
          setOptions((prev) => prev.filter((s) => s !== chosen));
          setStatus('idle');
        });
    },
    [target, status, tts, onCorrect, onWrong, hintOnWrong]
  );

  return (
    <div className="pick-syllable-round" data-testid="pick-syllable-round">
      <p className="instruction" data-testid="pick-syllable-instruction">
        Выбери слог <strong>{target}</strong>
      </p>
      {!hasStarted ? (
        <button
          type="button"
          className="start-button"
          onClick={handleStart}
          aria-label="Начать задание"
          data-testid="pick-syllable-start"
        >
          Начать
        </button>
      ) : (
        <>
          <div
            className="options"
            role="group"
            aria-label="Варианты слогов"
            data-testid="pick-syllable-options"
          >
            {options.map((syllable) => (
              <button
                key={syllable}
                type="button"
                className="syllable-button"
                onClick={() => handleChoose(syllable)}
                disabled={status !== 'idle'}
                aria-pressed={status === 'correct' ? undefined : false}
                data-testid={`pick-syllable-option-${syllable}`}
              >
                {syllable}
              </button>
            ))}
          </div>
          {!spoken && <p className="hint">Слушай задание…</p>}
        </>
      )}
    </div>
  );
}
