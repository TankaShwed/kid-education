import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { isVowel } from '@/domain/letters';
import { ClassifyLetterRoundView } from './ClassifyLetterRoundView';
import { classifyLetterSlice } from './classifyLetterSlice';

/**
 * Контейнер задания «Гласная или согласная»: подключает View к store и диспатчит экшены.
 * Озвучка выполняется сагой по startRound / speakLetter / dropInZone.
 *
 * @remarks Рендерится в App при currentRound.type === 'classifyLetter'.
 */
export function ClassifyLetterRoundContainer() {
  const dispatch = useAppDispatch();
  const round = useAppSelector((s) =>
    s.session.currentRound?.type === 'classifyLetter'
      ? s.session.currentRound
      : null
  );
  const { items, hasStarted, spoken, wrongLetterId } = useAppSelector(
    (s) => s.classifyLetter
  );

  const handleStart = useCallback(() => {
    dispatch(classifyLetterSlice.actions.startRound());
  }, [dispatch]);

  const handleSpeakLetter = useCallback(
    (letter: string) => {
      dispatch(classifyLetterSlice.actions.speakLetter(letter));
    },
    [dispatch]
  );

  const handleDropInZone = useCallback(
    (letterId: string, zone: 'vowel' | 'consonant') => {
      const item = items.find((i) => i.id === letterId);
      if (!item || item.placedZone !== null) return;
      const correct =
        (isVowel(item.letter) && zone === 'vowel') ||
        (!isVowel(item.letter) && zone === 'consonant');
      dispatch(
        classifyLetterSlice.actions.dropInZone({
          letterId,
          zone,
          result: correct ? 'correct' : 'wrong',
        })
      );
    },
    [dispatch, items]
  );

  if (!round) return null;

  return (
    <ClassifyLetterRoundView
      round={round}
      items={items}
      hasStarted={hasStarted}
      spoken={spoken}
      wrongLetterId={wrongLetterId}
      onStart={handleStart}
      onSpeakLetter={handleSpeakLetter}
      onDropInZone={handleDropInZone}
    />
  );
}
