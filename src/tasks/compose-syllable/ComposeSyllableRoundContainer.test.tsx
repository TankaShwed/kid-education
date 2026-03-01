import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ComposeSyllableRoundContainer } from './ComposeSyllableRoundContainer';
import {
  createStoreForStory,
  sessionSlice,
  composeSyllableSlice,
} from '@/store';
import type { TTSProvider } from '@/domain/tts';

const defaultRound = {
  type: 'composeSyllable' as const,
  target: 'НО',
  letters: ['Н', 'О'],
};

function makeStoreWithRound(
  round: { type: 'composeSyllable'; target: string; letters: string[] },
  tts: TTSProvider
) {
  const storyStore = createStoreForStory(tts);
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(composeSyllableSlice.actions.reset(round));
  return storyStore;
}

/**
 * Симуляция результата перетаскивания: заполняем слоты и диспатчим chooseCorrect/chooseWrong.
 * В jsdom нет DragEvent и dataTransfer, поэтому проверяем сценарий через store (озвучка и сага).
 */
function simulateFilledSlots(
  store: ReturnType<typeof createStoreForStory>,
  slots: string[],
  isCorrect: boolean
) {
  store.dispatch(composeSyllableSlice.actions.setSlots([...slots]));
  store.dispatch(composeSyllableSlice.actions.setPool([]));
  if (isCorrect) {
    store.dispatch(composeSyllableSlice.actions.chooseCorrect());
  } else {
    store.dispatch(composeSyllableSlice.actions.chooseWrong(slots.join('')));
  }
}

describe('Задание «Собери слог»', () => {
  let mockTTS: TTSProvider;

  beforeEach(() => {
    mockTTS = {
      speak: vi.fn().mockResolvedValue(undefined),
      cancel: vi.fn(),
    };
  });

  describe('успешный путь', () => {
    it('начать → озвучка → буквы в слоты в правильном порядке → TTS «Правильно! Молодец!»', async () => {
      const store = makeStoreWithRound(defaultRound, mockTTS);
      render(
        <Provider store={store}>
          <ComposeSyllableRoundContainer />
        </Provider>
      );

      const startBtn = screen.getByTestId('compose-syllable-start');
      expect(startBtn).toBeVisible();
      fireEvent.click(startBtn);

      await waitFor(() => {
        expect(mockTTS.speak).toHaveBeenCalledWith('Собери слог');
        expect(mockTTS.speak).toHaveBeenCalledWith('но', expect.any(Object));
      });

      await screen.findByTestId('compose-syllable-slots');
      expect(screen.getByTestId('compose-syllable-pool')).toBeInTheDocument();

      act(() => {
        simulateFilledSlots(store, ['Н', 'О'], true);
      });

      await waitFor(() => {
        expect(mockTTS.speak).toHaveBeenCalledWith('Правильно! Молодец!');
      });
    });
  });

  describe('неверный слог и повтор', () => {
    it('начать → неправильный порядок (О, Н) → подсказка, слоты сброшены → правильный порядок (Н, О) → TTS «Правильно! Молодец!»', async () => {
      const store = makeStoreWithRound(defaultRound, mockTTS);
      render(
        <Provider store={store}>
          <ComposeSyllableRoundContainer />
        </Provider>
      );

      fireEvent.click(screen.getByTestId('compose-syllable-start'));
      await screen.findByTestId('compose-syllable-slots');

      act(() => {
        simulateFilledSlots(store, ['О', 'Н'], false);
      });

      await waitFor(() => {
        expect(mockTTS.speak).toHaveBeenCalledWith(
          'Это слог он. Попробуй ещё раз.'
        );
      });

      await waitFor(() => {
        const state = store.getState();
        expect(state.composeSyllable.slots).toEqual([null, null]);
        expect(state.composeSyllable.pool).toHaveLength(2);
      });

      act(() => {
        simulateFilledSlots(store, ['Н', 'О'], true);
      });

      await waitFor(() => {
        expect(mockTTS.speak).toHaveBeenCalledWith('Правильно! Молодец!');
      });
    });
  });
});
