import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { PickSyllableRoundContainer } from './PickSyllableRoundContainer';
import { createStoreForStory, sessionSlice, pickSyllableSlice } from '@/store';
import type { TTSProvider } from '@/domain/tts';

/** Мок TTS для изоляции в Storybook (озвучка не воспроизводится). */
const mockTTS: TTSProvider = {
  speak: () => Promise.resolve(),
  cancel: () => {},
};

function makeStoreWithRound(round: {
  type: 'pickSyllable';
  target: string;
  options: string[];
}) {
  const storyStore = createStoreForStory(mockTTS);
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(pickSyllableSlice.actions.reset(round));
  return storyStore;
}

const defaultRound = {
  type: 'pickSyllable' as const,
  target: 'НА',
  options: ['НО', 'НА', 'КА', 'КУ', 'НУ'],
};

const withStore = (round: typeof defaultRound = defaultRound) => {
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

const meta: Meta<typeof PickSyllableRoundContainer> = {
  component: PickSyllableRoundContainer,
  title: 'tasks/PickSyllableRoundContainer',
  decorators: [withStore()],
};
export default meta;

type Story = StoryObj<typeof PickSyllableRoundContainer>;

/** Контейнер в изоляции: раунд «Выбери слог НА», кнопка «Начать» → сага озвучивает (мок) → выбор слога. */
export const Default: Story = {};

/** Меньше вариантов (3). */
export const ThreeOptions: Story = {
  decorators: [
    withStore({
      type: 'pickSyllable',
      target: 'МА',
      options: ['МА', 'МО', 'МУ'],
    }),
  ],
};
