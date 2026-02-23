import { useState, useEffect, useCallback } from 'react';
import type { PickSyllableRound as Round, Syllable } from '@/domain/types';
import type { TTSProvider } from '@/domain/tts';
import { SYLLABLE_RATE } from '@/domain/tts';
import { PickSyllableRoundView } from './PickSyllableRoundView';

const PHRASE = 'Выбери слог';

export interface PickSyllableRoundProps {
  round: Round;
  tts: TTSProvider;
  onCorrect: () => void;
  onWrong?: (chosen: Syllable) => void;
  hintOnWrong?: boolean;
}

/** Презентационный компонент с локальным state и TTS (для Storybook). */
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
    async (chosen: Syllable) => {
      if (status !== 'idle') return;
      if (chosen === target) {
        setStatus('correct');
        await tts.speak('Правильно');
        onCorrect();
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
    <PickSyllableRoundView
      round={round}
      options={options}
      status={status}
      hasStarted={hasStarted}
      spoken={spoken}
      onStart={handleStart}
      onChoose={handleChoose}
    />
  );
}
