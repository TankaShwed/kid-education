import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ComposeSyllableRoundView } from './ComposeSyllableRoundView';
import type { DragSource } from './ComposeSyllableRoundView';
import { composeSyllableSlice } from './composeSyllableSlice';

/**
 * Контейнер задания «Собери слог»: подключает View к store (session.currentRound, composeSyllable)
 * и диспатчит экшены slice. Озвучка выполняется сагой по экшенам startRound / chooseWrong / chooseCorrect.
 *
 * @remarks Рендерится в App при currentRound.type === 'composeSyllable'. Ключ по roundKey для сброса при новом раунде.
 */
export function ComposeSyllableRoundContainer() {
  const dispatch = useAppDispatch();
  const round = useAppSelector((s) =>
    s.session.currentRound?.type === 'composeSyllable'
      ? s.session.currentRound
      : null
  );
  const { slots, pool, status, hasStarted, spoken } = useAppSelector(
    (s) => s.composeSyllable
  );

  const handleStart = useCallback(() => {
    dispatch(composeSyllableSlice.actions.startRound());
  }, [dispatch]);

  const handleDropToSlot = useCallback(
    (slotIndex: number, payload: { source: DragSource; letter: string }) => {
      if (status !== 'idle' || !round) return;
      const { source, letter } = payload;

      let nextSlots: (string | null)[];
      let nextPool: string[];

      if (source.kind === 'pool') {
        const idx = pool.indexOf(letter);
        if (idx === -1) return;
        nextPool = pool.slice(0, idx).concat(pool.slice(idx + 1));
        nextSlots = [...slots];
        nextSlots[slotIndex] = letter;
      } else {
        const fromLetter = slots[source.index] ?? null;
        nextSlots = [...slots];
        nextSlots[source.index] = slots[slotIndex] ?? null;
        nextSlots[slotIndex] = fromLetter;
        nextPool = [...pool];
      }

      dispatch(composeSyllableSlice.actions.setSlots(nextSlots));
      dispatch(composeSyllableSlice.actions.setPool(nextPool));

      const filled = nextSlots.every((s) => s !== null);
      if (filled) {
        const composed = nextSlots.join('');
        if (composed === round.target) {
          dispatch(composeSyllableSlice.actions.chooseCorrect());
        } else {
          dispatch(composeSyllableSlice.actions.chooseWrong(composed));
        }
      }
    },
    [dispatch, round, slots, pool, status]
  );

  const handleDropToPool = useCallback(
    (payload: { source: DragSource; letter: string }) => {
      if (status !== 'idle' || !round) return;
      if (payload.source.kind !== 'slot') return;
      const { index } = payload.source;
      const { letter } = payload;

      const nextSlots = [...slots];
      nextSlots[index] = null;
      const nextPool = [...pool, letter];

      dispatch(composeSyllableSlice.actions.setSlots(nextSlots));
      dispatch(composeSyllableSlice.actions.setPool(nextPool));
    },
    [dispatch, round, slots, pool, status]
  );

  if (!round) return null;

  return (
    <ComposeSyllableRoundView
      round={round}
      slots={slots}
      pool={pool}
      status={status}
      hasStarted={hasStarted}
      spoken={spoken}
      onStart={handleStart}
      onDropToSlot={handleDropToSlot}
      onDropToPool={handleDropToPool}
    />
  );
}
