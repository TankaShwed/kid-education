import { useCallback } from 'react';
import type { Syllable } from '@/domain/types';
import { PickSyllableRoundView } from './PickSyllableRoundView';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { pickSyllableSlice } from './pickSyllableSlice';

/**
 * Контейнер задания «Выбери слог»: подключает View к store (session.currentRound, pickSyllable)
 * и диспатчит экшены slice. Озвучка выполняется сагой по экшенам startRound / chooseWrong / chooseCorrect.
 *
 * @remarks Рендерится в App при currentRound.type === 'pickSyllable'. Ключ по roundKey для сброса при новом раунде.
 */
export function PickSyllableRoundContainer() {
  const dispatch = useAppDispatch();
  const round = useAppSelector((s) =>
    s.session.currentRound?.type === 'pickSyllable'
      ? s.session.currentRound
      : null
  );
  const { options, status, hasStarted, spoken } = useAppSelector(
    (s) => s.pickSyllable
  );

  const handleStart = useCallback(() => {
    dispatch(pickSyllableSlice.actions.startRound());
  }, [dispatch]);

  const handleChoose = useCallback(
    (chosen: Syllable) => {
      if (status !== 'idle' || !round) return;
      if (chosen === round.target) {
        dispatch(pickSyllableSlice.actions.chooseCorrect());
        return;
      }
      dispatch(pickSyllableSlice.actions.chooseWrong(chosen));
    },
    [dispatch, status, round]
  );

  if (!round) return null;

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
