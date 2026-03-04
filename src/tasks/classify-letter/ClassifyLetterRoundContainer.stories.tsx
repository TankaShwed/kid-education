import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { ClassifyLetterRoundContainer } from './ClassifyLetterRoundContainer';
import {
  createStoreForStory,
  sessionSlice,
} from '@/store';
import { classifyLetterSlice } from './classifyLetterSlice';
import type { TTSProvider } from '@/domain/tts';
import type { ClassifyLetterRound } from './types';

const mockTTS: TTSProvider = {
  speak: (arg: string) => {
    console.log('speak:', arg);
    return Promise.resolve();
  },
  cancel: () => {},
};

function makeStoreWithRound(round: ClassifyLetterRound) {
  const storyStore = createStoreForStory(mockTTS);
  storyStore.dispatch(sessionSlice.actions.setTaskType('classifyLetter'));
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(classifyLetterSlice.actions.reset(round));
  return storyStore;
}

const defaultRound: ClassifyLetterRound = {
  type: 'classifyLetter',
  letters: ['А', 'М', 'У', 'Н', 'О', 'К', 'И', 'С'],
};

const withStore = (round: ClassifyLetterRound = defaultRound) => {
  const storyStore = makeStoreWithRound(round);
  function ReduxDecorator(Story: React.ComponentType) {
    return (
      <Provider store={storyStore}>
        <Story />
      </Provider>
    );
  }
  ReduxDecorator.displayName = 'ReduxDecorator';
  return ReduxDecorator;
};

const meta: Meta<typeof ClassifyLetterRoundContainer> = {
  component: ClassifyLetterRoundContainer,
  title: 'tasks/ClassifyLetter/Container',
  decorators: [withStore()],
};
export default meta;

type Story = StoryObj<typeof ClassifyLetterRoundContainer>;

/** Контейнер: раунд с буквами А, М, У, Н, О, К, И, С; кнопка «Начать» → озвучка → DnD по зонам. */
export const Default: Story = {};

/** Короткий раунд: четыре буквы. */
export const Short: Story = {
  decorators: [
    withStore({
      type: 'classifyLetter',
      letters: ['А', 'М', 'У', 'Н'],
    }),
  ],
};
