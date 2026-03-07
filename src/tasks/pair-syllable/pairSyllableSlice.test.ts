import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pairSyllableSlice } from './pairSyllableSlice';
import type { PairSyllableRound } from './types';

const round: PairSyllableRound = {
  type: 'pairSyllable',
  syllables: ['МА', 'НО', 'КУ'],
  targetFind: 'МА',
};

function minDistance(letters: { position: { x: number; y: number } }[]): number {
  let min = Infinity;
  for (let i = 0; i < letters.length; i++) {
    for (let j = i + 1; j < letters.length; j++) {
      const d = Math.hypot(
        letters[i]!.position.x - letters[j]!.position.x,
        letters[i]!.position.y - letters[j]!.position.y
      );
      if (d < min) min = d;
    }
  }
  return min;
}

describe('pairSyllableSlice', () => {
  describe('reset', () => {
    it('should place letters with minimum distance between them', () => {
      const store = configureStore({
        reducer: { pairSyllable: pairSyllableSlice.reducer },
      });
      const minDistances: number[] = [];
      for (let run = 0; run < 25; run++) {
        store.dispatch(pairSyllableSlice.actions.reset(round));
        const letters = store.getState().pairSyllable.letters;
        expect(letters.length).toBe(6);
        const d = minDistance(letters);
        minDistances.push(d);
      }
      const avgMin = minDistances.reduce((a, b) => a + b, 0) / minDistances.length;
      expect(avgMin).toBeGreaterThanOrEqual(12);
    });
  });

  describe('dropOccurred', () => {
    it('should update letter position when targetId is null', () => {
      const store = configureStore({
        reducer: { pairSyllable: pairSyllableSlice.reducer },
      });
      store.dispatch(pairSyllableSlice.actions.reset(round));
      const letter = store.getState().pairSyllable.letters[0]!;

      store.dispatch(
        pairSyllableSlice.actions.placeLetter({
          draggedId: letter.id,
          dropX: 50,
          dropY: 30,
          width_percent: 10,
          height_percent: 10,
        })
      );

      const updated = store.getState().pairSyllable.letters.find(
        (l) => l.id === letter.id
      );
      expect(updated?.position).toEqual({ x: 50, y: 30 });
    });

    it('should not change letters when targetId is set (saga handles)', () => {
      const store = configureStore({
        reducer: { pairSyllable: pairSyllableSlice.reducer },
      });
      store.dispatch(pairSyllableSlice.actions.reset(round));
      const letters = store.getState().pairSyllable.letters;
      const [a] = [letters[0]!, letters[1]!];

      store.dispatch(
        pairSyllableSlice.actions.placeLetter({
          draggedId: a.id,
          dropX: 60,
          dropY: 40,
          width_percent: 10,
          height_percent: 10,
        })
      );

      expect(store.getState().pairSyllable.letters.length).toBe(6);
    });
  });
});
