/**
 * Сага обновляет store асинхронно. DnD симулируем через dispatch dropOccurred (сырые данные);
 * сага валидирует и диспатчит pairFormed/pairRejected.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { PairSyllableRoundContainer } from './PairSyllableRoundContainer';
import {
  createStoreForStory,
  sessionSlice,
} from '@/store';
import { pairSyllableSlice } from './pairSyllableSlice';
import type { TTSProvider } from '@/domain/tts';
import type { PairSyllableRound } from './types';

const defaultRound: PairSyllableRound = {
  type: 'pairSyllable',
  syllables: ['МА', 'НО'],
  targetFind: 'МА',
};

function makeStoreWithRound(round: PairSyllableRound, tts: TTSProvider) {
  const storyStore = createStoreForStory(tts);
  storyStore.dispatch(sessionSlice.actions.setTaskType('pairSyllable'));
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(pairSyllableSlice.actions.reset(round));
  return storyStore;
}

describe('PairSyllable task', () => {
  let mockTTS: TTSProvider;
  let store: ReturnType<typeof createStoreForStory>;

  beforeEach(() => {
    mockTTS = {
      speak: vi.fn().mockResolvedValue(undefined),
      cancel: vi.fn(),
    };
    store = makeStoreWithRound(defaultRound, mockTTS);
    render(
      <Provider store={store}>
        <PairSyllableRoundContainer />
      </Provider>
    );
  });

  describe('success render', () => {
    it('should render start button', () => {
      expect(screen.getByTestId('pair-syllable-start')).toBeVisible();
    });
  });

  describe('click start button', () => {
    beforeEach(async () => {
      fireEvent.click(screen.getByTestId('pair-syllable-start'));
      await act(async () => {
        await screen.findByTestId('pair-syllable-letters');
      });
    });

    it('should render letters area', () => {
      expect(screen.getByTestId('pair-syllable-letters')).toBeInTheDocument();
    });

    it('should speak instruction', () => {
      expect(mockTTS.speak).toHaveBeenCalledWith(
        'Сложи гласную и согласную в слог.'
      );
    });

    describe('drop on letter (valid order) triggers pairFormed via saga', () => {
      beforeEach(async () => {
        const state = store.getState();
        const letters = state.pairSyllable.letters;
        const letterM = letters.find((l) => l.letter === 'М');
        const letterA = letters.find((l) => l.letter === 'А');
        expect(letterM && letterA).toBeDefined();
        act(() => {
          store.dispatch(
            pairSyllableSlice.actions.placeLetter({
              draggedId: letterA!.id,
              dropX: letterM!.position.x + 10,
              dropY: letterM!.position.y,
              width_percent: 10,
              height_percent: 10,
            })
          );
        });
        await act(async () => {
          await waitFor(() => {
            expect(store.getState().pairSyllable.letters.length).toBe(2);
          });
        });
      });

      it('should form pair MA and speak syllable', () => {
        expect(mockTTS.speak).toHaveBeenCalledWith('ма', expect.any(Object));
        expect(store.getState().pairSyllable.formedSyllables).toHaveLength(1);
        expect(store.getState().pairSyllable.formedSyllables[0]!.syllable).toBe(
          'МА'
        );
      });
    });

    describe('drop in empty place moves letter', () => {
      let letterId: string;
      beforeEach(() => {
        const state = store.getState();
        const letter = state.pairSyllable.letters[0]!;
        letterId = letter.id;
        act(() => {
          store.dispatch(
            pairSyllableSlice.actions.placeLetter({
              draggedId: letter.id,
              dropX: 50,
              dropY: 40,
              width_percent: 10,
              height_percent: 10,
            })
          );
        });
      });

      it('should update letter position', () => {
        const updated = store.getState().pairSyllable.letters.find(
          (l) => l.id === letterId
        );
        expect(updated?.position).toEqual({ x: 50, y: 40 });
      });
    });

    describe('form all pairs via dropOccurred then click correct syllable', () => {
      beforeEach(async () => {
        let state = store.getState();
        let letters = state.pairSyllable.letters;
        const letterM = letters.find((l) => l.letter === 'М')!;
        const letterA = letters.find((l) => l.letter === 'А')!;
        act(() => {
          store.dispatch(
            pairSyllableSlice.actions.placeLetter({
              draggedId: letterA.id,
              dropX: letterM.position.x + 10,
              dropY: letterM.position.y,
              width_percent: 10,
              height_percent: 10,
            })
          );
        });
        await act(async () => {
          await waitFor(() => {
            expect(store.getState().pairSyllable.letters.length).toBe(2);
          });
        });
        state = store.getState();
        letters = state.pairSyllable.letters;
        const letterN2 = letters.find((l) => l.letter === 'Н')!;
        const letterO2 = letters.find((l) => l.letter === 'О')!;
        act(() => {
          store.dispatch(
            pairSyllableSlice.actions.placeLetter({
              draggedId: letterO2.id,
              dropX: letterN2.position.x + 10,
              dropY: letterN2.position.y,
              width_percent: 10,
              height_percent: 10,
            })
          );
        });
        await act(async () => {
          await waitFor(() => {
            expect(store.getState().pairSyllable.phase).toBe('finding');
          });
        });
        await act(async () => {
          await waitFor(() => {
            expect(mockTTS.speak).toHaveBeenCalledWith('Найди слог');
          });
        });
        const targetSyllableId = store
          .getState()
          .pairSyllable.formedSyllables.find(
            (s) => s.syllable === defaultRound.targetFind
          )?.id;
        expect(targetSyllableId).toBeDefined();
        fireEvent.click(
          screen.getByTestId(`pair-syllable-choose-${targetSyllableId}`)
        );
        await act(async () => {
          await waitFor(() => {
            expect(mockTTS.speak).toHaveBeenCalledWith('Правильно');
          });
        });
      });

      it('should speak syllable after each pair and then Find syllable', () => {
        expect(mockTTS.speak).toHaveBeenCalledWith('ма', expect.any(Object));
        expect(mockTTS.speak).toHaveBeenCalledWith('но', expect.any(Object));
        expect(mockTTS.speak).toHaveBeenCalledWith('Найди слог');
        expect(mockTTS.speak).toHaveBeenCalledWith('ма', expect.any(Object));
      });

      it('should speak Правильно and show start for next round', () => {
        expect(mockTTS.speak).toHaveBeenCalledWith('Правильно');
        expect(screen.getByTestId('pair-syllable-start')).toBeVisible();
      });
    });

    describe('dropOccurred wrongOrder triggers pairRejected', () => {
      beforeEach(async () => {
        const state = store.getState();
        const letters = state.pairSyllable.letters;
        const letterM = letters.find((l) => l.letter === 'М')!;
        const letterA = letters.find((l) => l.letter === 'А')!;
        act(() => {
          store.dispatch(
            pairSyllableSlice.actions.placeLetter({
              draggedId: letterM.id,
              dropX: letterA.position.x + 10,
              dropY: letterA.position.y,
              width_percent: 10,
              height_percent: 10,
            })
          );
        });
        await act(async () => {
          await waitFor(() => {
            expect(mockTTS.speak).toHaveBeenCalledWith(
              'В слоге сначала согласная, потом гласная. Гласная должна быть справа.'
            );
          });
        });
      });

      it('should not change letters count', () => {
        expect(store.getState().pairSyllable.letters.length).toBe(4);
      });
    });
  });
});
