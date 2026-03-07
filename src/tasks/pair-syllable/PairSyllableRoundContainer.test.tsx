/**
 * Сага обновляет store асинхронно. DnD симулируем через dispatch pairFormed.
 * Ожидание — через await act + waitFor.
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

    describe('form all pairs via store then click correct syllable', () => {
      beforeEach(async () => {
        const state = store.getState();
        const letters = state.pairSyllable.letters;
        const idM = letters.find((l) => l.letter === 'М')?.id;
        const idA = letters.find((l) => l.letter === 'А')?.id;
        const idN = letters.find((l) => l.letter === 'Н')?.id;
        const idO = letters.find((l) => l.letter === 'О')?.id;
        expect(idM && idA && idN && idO).toBeDefined();
        act(() => {
          store.dispatch(
            pairSyllableSlice.actions.pairFormed({
              syllable: 'МА',
              letterIds: [idM!, idA!],
            })
          );
        });
        act(() => {
          store.dispatch(
            pairSyllableSlice.actions.pairFormed({
              syllable: 'НО',
              letterIds: [idN!, idO!],
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

    describe('pairRejected wrongOrder', () => {
      beforeEach(() => {
        act(() => {
          store.dispatch(
            pairSyllableSlice.actions.pairRejected({
              reason: 'wrongOrder',
            })
          );
        });
      });

      it('should not change letters count', () => {
        expect(store.getState().pairSyllable.letters.length).toBe(4);
      });
    });
  });
});
