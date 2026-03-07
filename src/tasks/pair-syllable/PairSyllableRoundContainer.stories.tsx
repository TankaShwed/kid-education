import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { PairSyllableRoundContainer } from './PairSyllableRoundContainer';
import {
  createStoreForStory,
  sessionSlice,
} from '@/store';
import { pairSyllableSlice } from './pairSyllableSlice';
import type { TTSProvider } from '@/domain/tts';
import type { PairSyllableRound } from './types';

const mockTTS: TTSProvider = {
  speak: (arg: string) => {
    console.log('speak:', arg);
    return Promise.resolve();
  },
  cancel: () => {},
};

function makeStoreWithRound(round: PairSyllableRound) {
  const storyStore = createStoreForStory(mockTTS);
  storyStore.dispatch(sessionSlice.actions.setTaskType('pairSyllable'));
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(pairSyllableSlice.actions.reset(round));
  return storyStore;
}

const defaultRound: PairSyllableRound = {
  type: 'pairSyllable',
  syllables: ['МА', 'НО', 'КУ'],
  targetFind: 'МА',
};

const withStore = (round: PairSyllableRound = defaultRound) => {
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

const meta: Meta<typeof PairSyllableRoundContainer> = {
  component: PairSyllableRoundContainer,
  title: 'tasks/PairSyllable/Container',
  decorators: [withStore()],
};
export default meta;

type Story = StoryObj<typeof PairSyllableRoundContainer>;

/** Контейнер: раунд с слогами МА, НО, КУ; кнопка «Начать» → озвучка → DnD буква-на-букву → фаза «Найди слог». */
export const Default: Story = {};

/** Короткий раунд: два слога (МА, НО). */
export const TwoSyllables: Story = {
  decorators: [
    withStore({
      type: 'pairSyllable',
      syllables: ['МА', 'НО'],
      targetFind: 'НО',
    }),
  ],
};
