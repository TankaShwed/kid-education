/**
 * Сага обновляет store асинхронно. Действия пользователя — в beforeEach,
 * ожидание — через await act + waitFor. DnD симулируем через dispatch dropInZone.
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
import { ClassifyLetterRoundContainer } from './ClassifyLetterRoundContainer';
import {
  createStoreForStory,
  sessionSlice,
} from '@/store';
import { classifyLetterSlice } from './classifyLetterSlice';
import type { TTSProvider } from '@/domain/tts';
import type { ClassifyLetterRound } from './types';

const defaultRound: ClassifyLetterRound = {
  type: 'classifyLetter',
  letters: ['А', 'М', 'У', 'Н'],
};

function makeStoreWithRound(round: ClassifyLetterRound, tts: TTSProvider) {
  const storyStore = createStoreForStory(tts);
  storyStore.dispatch(sessionSlice.actions.setTaskType('classifyLetter'));
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(classifyLetterSlice.actions.reset(round));
  return storyStore;
}

describe('ClassifyLetter task', () => {
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
        <ClassifyLetterRoundContainer />
      </Provider>
    );
  });

  describe('success render', () => {
    it('should render start button', () => {
      const startBtn = screen.getByTestId('classify-letter-start');
      expect(startBtn).toBeVisible();
    });
  });

  describe('click start button', () => {
    beforeEach(async () => {
      fireEvent.click(screen.getByTestId('classify-letter-start'));
      await act(async () => {
        await screen.findByTestId('classify-letter-zones');
      });
    });

    it('should render zones and pool', () => {
      expect(screen.getByTestId('classify-letter-zone-vowel')).toBeInTheDocument();
      expect(screen.getByTestId('classify-letter-zone-consonant')).toBeInTheDocument();
      expect(screen.getByTestId('classify-letter-pool')).toBeInTheDocument();
    });

    it('should speak instruction', () => {
      expect(mockTTS.speak).toHaveBeenCalledWith(
        'Разнеси буквы: гласные — в красную область, согласные — в синюю.'
      );
    });

    describe('drop all letters correct', () => {
      beforeEach(async () => {
        const state = store.getState();
        const items = state.classifyLetter.items;
        for (const item of items) {
          const zone =
            item.letter === 'А' || item.letter === 'У'
              ? 'vowel'
              : 'consonant';
          act(() => {
            store.dispatch(
              classifyLetterSlice.actions.dropInZone({
                letterId: item.id,
                zone,
                result: 'correct',
              })
            );
          });
        }
        await act(async () => {
          await waitFor(() => {
            expect(mockTTS.speak).toHaveBeenCalledWith('Молодец!');
          });
        });
      });

      it('should speak correct feedback per letter and then Molodets', () => {
        expect(mockTTS.speak).toHaveBeenCalledWith('Правильно');
        expect(mockTTS.speak).toHaveBeenCalledWith('Молодец!');
      });

      it('should show start button for next round', () => {
        expect(screen.getByTestId('classify-letter-start')).toBeVisible();
      });
    });

    describe('drop vowel in consonant zone (wrong)', () => {
      beforeEach(async () => {
        const state = store.getState();
        const itemA = state.classifyLetter.items.find((i) => i.letter === 'А');
        expect(itemA).toBeDefined();
        act(() => {
          store.dispatch(
            classifyLetterSlice.actions.dropInZone({
              letterId: itemA!.id,
              zone: 'consonant',
              result: 'wrong',
            })
          );
        });
        await act(async () => {
          await waitFor(() => {
            expect(mockTTS.speak).toHaveBeenCalledWith('Неправильно');
          });
        });
        await act(async () => {
          await waitFor(() => {
            const s = store.getState();
            expect(s.classifyLetter.wrongLetterId).toBeNull();
          });
        });
      });

      it('should speak Nepravilno', () => {
        expect(mockTTS.speak).toHaveBeenCalledWith('Неправильно');
      });

      it('should reset wrongLetterId after wrongDone', () => {
        expect(store.getState().classifyLetter.wrongLetterId).toBeNull();
      });
    });
  });
});
