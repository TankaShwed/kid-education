import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { isVowel } from '@/domain/letters';
import { PairSyllableRoundView } from './PairSyllableRoundView';
import { pairSyllableSlice } from './pairSyllableSlice';

/** Минимальное смещение по X между согласной и гласной (в % ширины контейнера), ~полширины буквы */
const HALF_LETTER_WIDTH_PERCENT = 5;

/**
 * Контейнер задания «Сложи слог»: подключает View к store, при дропе вычисляет пару
 * (слева согласная, справа гласная, слог из раунда) и диспатчит pairFormed или pairRejected.
 */
export function PairSyllableRoundContainer() {
  const dispatch = useAppDispatch();
  const round = useAppSelector((s) =>
    s.session.currentRound?.type === 'pairSyllable'
      ? s.session.currentRound
      : null
  );
  const {
    phase,
    letters,
    formedSyllables,
    hasStarted,
    spoken,
    findingStatus,
    wrongSyllableId,
  } = useAppSelector((s) => s.pairSyllable);

  const handleStart = useCallback(() => {
    dispatch(pairSyllableSlice.actions.startRound());
  }, [dispatch]);

  const handleDropOnLetter = useCallback(
    (draggedId: string, targetId: string, dropX: number) => {
      if (!round || round.type !== 'pairSyllable') return;
      const dragged = letters.find((l) => l.id === draggedId);
      const target = letters.find((l) => l.id === targetId);
      if (!dragged || !target) return;

      const targetX = target.position.x;
      const leftX = Math.min(dropX, targetX);
      const rightX = Math.max(dropX, targetX);
      const leftLetter = targetX < dropX ? target : dragged;
      const rightLetter = targetX < dropX ? dragged : target;

      const consonantLeft = !isVowel(leftLetter.letter);
      const vowelRight = isVowel(rightLetter.letter);
      const spacingOk = rightX - leftX >= HALF_LETTER_WIDTH_PERCENT;
      const syllable = leftLetter.letter + rightLetter.letter;
      const inRound = round.syllables.includes(syllable);

      if (!consonantLeft || !vowelRight || !spacingOk) {
        dispatch(
          pairSyllableSlice.actions.pairRejected({ reason: 'wrongOrder' })
        );
        return;
      }
      if (!inRound) {
        dispatch(
          pairSyllableSlice.actions.pairRejected({ reason: 'notInRound' })
        );
        return;
      }

      dispatch(
        pairSyllableSlice.actions.pairFormed({
          syllable,
          letterIds: [draggedId, targetId],
        })
      );
    },
    [dispatch, letters, round]
  );

  const handleChooseSyllable = useCallback(
    (syllableId: string) => {
      if (!round || round.type !== 'pairSyllable') return;
      const formed = formedSyllables.find((s) => s.id === syllableId);
      if (!formed) return;
      if (formed.syllable === round.targetFind) {
        dispatch(pairSyllableSlice.actions.chooseCorrect());
      } else {
        dispatch(pairSyllableSlice.actions.chooseWrong(syllableId));
      }
    },
    [dispatch, formedSyllables, round]
  );

  if (!round) return null;

  return (
    <PairSyllableRoundView
      round={round}
      phase={phase}
      letters={letters}
      formedSyllables={formedSyllables}
      hasStarted={hasStarted}
      spoken={spoken}
      wrongSyllableId={wrongSyllableId}
      onStart={handleStart}
      onDropOnLetter={handleDropOnLetter}
      onChooseSyllable={handleChooseSyllable}
    />
  );
}
