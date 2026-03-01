/**
 * Сага обновляет store асинхронно (после resolve TTS.speak). Чтобы не получать
 * предупреждения act(), ждём "успокоения" страницы внутри act(): после клика
 * вызываем второй act(async () => await findBy... / waitFor(...)), который
 * завершится только когда нужный элемент появится (сага успеет отработать).
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
import { PickSyllableRoundContainer } from './PickSyllableRoundContainer';
import {
  createStoreForStory,
  sessionSlice,
  pickSyllableSlice,
} from '@/store';
import type { TTSProvider } from '@/domain/tts';
import { PickSyllableRound } from '@/domain';

const defaultRound: PickSyllableRound = {
  type: 'pickSyllable' as const,
  target: 'НА',
  options: ['НО', 'НА', 'КА', 'КУ'] as const,
};

function makeStoreWithRound(
  round: { type: 'pickSyllable'; target: string; options: string[] },
  tts: TTSProvider
) {
  const storyStore = createStoreForStory(tts);
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(pickSyllableSlice.actions.reset(round));
  return storyStore;
}

describe('PickSyllable task', () => {
  let mockTTS: TTSProvider;

  beforeEach(() => {
    mockTTS = {
      speak: vi.fn().mockResolvedValue(undefined),
      cancel: vi.fn(),
    };
    const store = makeStoreWithRound(defaultRound, mockTTS);
    render(
      <Provider store={store}>
        <PickSyllableRoundContainer />
      </Provider>
    );
  });
  
  describe('success render', () =>{
    it('should render start button', () => {
      const startBtn = screen.getByTestId('pick-syllable-start');
      expect(startBtn).toBeVisible();
    });
  })

  describe('click start button', () => {
    beforeEach(async () => {
      const startBtn = screen.getByTestId('pick-syllable-start');
      expect(startBtn).toBeVisible();
      act(() => {
        fireEvent.click(startBtn);
      });
      await act(async () => {
        await screen.findByTestId('pick-syllable-options');
      });
    });

    describe('should render options', () => {
      it('should render options', () => {
        const options = screen.getByTestId('pick-syllable-options');
        expect(options).toBeInTheDocument();
      });
      it('should speak instruction', () => {
        expect(mockTTS.speak).toHaveBeenCalledWith('Выбери слог');
        expect(mockTTS.speak).toHaveBeenCalledWith(
          'на',
          expect.any(Object)
        );
      });
    });

    defaultRound.options.forEach((option) => {
      if (option === defaultRound.target) {
        describe('click correct button', () => {
          beforeEach(async () => {
            const dataTestId = `pick-syllable-option-${option}`;
            act(() => {
              fireEvent.click(screen.getByTestId(dataTestId));
            });
            await act(async () => {
              await waitFor(() => {
                expect(mockTTS.speak).toHaveBeenCalledWith('Правильно');
              });
            });
          });
          it('should speak correct feedback', () => {
            expect(mockTTS.speak).toHaveBeenCalledWith('Правильно');
          });
          it('should speak instruction for next round', () => {
            expect(
              screen.getByTestId('pick-syllable-start')
            ).toBeVisible();
          });
        });
      } else {
        describe('click wrong button', () => {
          beforeEach(async () => {
            const dataTestId = `pick-syllable-option-${option}`;
            act(() => {
              fireEvent.click(screen.getByTestId(dataTestId));
            });
            await act(async () => {
              await waitFor(() => {
                expect(
                  screen.queryByTestId(`pick-syllable-option-${option}`)
                ).not.toBeInTheDocument();
              });
            });
          });
          it('should speak wrong feedback', () => {
            expect(mockTTS.speak).toHaveBeenCalledWith('Это слог ');
            expect(mockTTS.speak).toHaveBeenCalledWith(
              option.toLowerCase(),
              expect.any(Object)
            );
          });
          it('should hide wrong selected option: ' + option, () => {
            expect(
              screen.queryByTestId(`pick-syllable-option-${option}`)
            ).not.toBeInTheDocument();
          });
          describe('click correct button', () => {
            beforeEach(async () => {
              const dataTestId = `pick-syllable-option-${defaultRound.target}`;
              act(() => {
                fireEvent.click(screen.getByTestId(dataTestId));
              });
              await act(async () => {
                await waitFor(() => {
                  expect(mockTTS.speak).toHaveBeenCalledWith('Правильно');
                });
              });
            });
            it('should speak correct feedback', () => {
              expect(mockTTS.speak).toHaveBeenCalledWith('Правильно');
            });
          });
        });
      }
    });
  });
});
