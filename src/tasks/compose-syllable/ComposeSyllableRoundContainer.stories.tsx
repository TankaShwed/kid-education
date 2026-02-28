import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { ComposeSyllableRoundContainer } from './ComposeSyllableRoundContainer';
import { createStoreForStory, sessionSlice, composeSyllableSlice } from '@/store';
import type { TTSProvider } from '@/domain/tts';

/** Мок TTS для изоляции в Storybook (озвучка не воспроизводится). */
const mockTTS: TTSProvider = {
  speak: (arg: string) => {console.log('speak:', arg); return Promise.resolve()},
  cancel: () => {},
};

function makeStoreWithRound(round: {
  type: 'composeSyllable';
  target: string;
  letters: string[];
}) {
  const storyStore = createStoreForStory(mockTTS);
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(composeSyllableSlice.actions.reset(round));
  return storyStore;
}

const defaultRound = {
  type: 'composeSyllable' as const,
  target: 'НО',
  letters: ['О', 'Н'],
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

const meta: Meta<typeof ComposeSyllableRoundContainer> = {
  component: ComposeSyllableRoundContainer,
  title: 'tasks/ComposeSyllable/Container',
  decorators: [withStore()],
};
export default meta;

type Story = StoryObj<typeof ComposeSyllableRoundContainer>;

/** Контейнер в изоляции: раунд «Собери слог НО», кнопка «Начать» → сага озвучивает (мок) → DnD. */
export const Default: Story = {};

/** Раунд «МА». */
export const Ma: Story = {
  decorators: [
    withStore({
      type: 'composeSyllable',
      target: 'МА',
      letters: ['М', 'А'],
    }),
  ],
};
