import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
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
    beforeEach(() => {
      act(()=>{
        const startBtn = screen.getByTestId('pick-syllable-start');
        expect(startBtn).toBeVisible();
        fireEvent.click(startBtn);
  
      });
      describe('should render options', () => {
        it('should render options', () => {
          const options = screen.getByTestId('pick-syllable-options');
          expect(options).toBeInTheDocument();
        });
        it('should speak instruction', () => {
          // TODO: check call to mock TTS
        });
        
      });
      defaultRound.options.forEach(option => {
        if (option == defaultRound.target){
          describe('click correct button', () => {
            beforeEach(() => {
              const dataTestId = `pick-syllable-option-${option}`;
              act(()=>{
                const correctBtn = screen.getByTestId(dataTestId);
                fireEvent.click(correctBtn);
              });
            });
            it('should speak correct feedback', () => {
              // TODO: check call to mock TTS
            });
            it('should speak instruction for next round', () => {
              // TODO: check call to mock TTS
            });
          });
        } else {
          describe('click wrong button', () => {
            beforeEach(() => {
              const dataTestId = `pick-syllable-option-${option}`;
              act(()=>{
                const wrongBtn = screen.getByTestId(dataTestId);
                fireEvent.click(wrongBtn);
              });
            });
            it('should speak wrong feedback', () => {
              // TODO: check call to mock TTS
            });
            it('should hide wrong selected option: '+option, () => {
              // TODO: check call to mock TTS
            });
            describe('click correct button', () => {
              beforeEach(() => {
                const dataTestId = `pick-syllable-option-${defaultRound.target}`;
                act(()=>{
                  const correctBtn = screen.getByTestId(dataTestId);
                  fireEvent.click(correctBtn);
                });
              });
              it('should speak correct feedback', () => {
                // TODO: check call to mock TTS
              });
            });
          });
        }
      });
    });
  });
});
