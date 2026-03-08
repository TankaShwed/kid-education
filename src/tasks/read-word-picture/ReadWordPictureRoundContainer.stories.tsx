import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { ReadWordPictureRoundContainer } from './ReadWordPictureRoundContainer';
import {
  createStoreForStory,
  sessionSlice,
  readWordPictureSlice,
} from '@/store';
import type { TTSProvider } from '@/domain/tts';
import type { ReadWordPictureRound } from './types';

const mockTTS: TTSProvider = {
  speak: (...args) => {
    console.log('Speak:', ...args);
    return Promise.resolve();
  },
  cancel: () => {},
};

function makeStoreWithRound(round: ReadWordPictureRound) {
  const storyStore = createStoreForStory(mockTTS);
  storyStore.dispatch(sessionSlice.actions.setRound(round));
  storyStore.dispatch(readWordPictureSlice.actions.reset(round));
  return storyStore;
}

const defaultRound: ReadWordPictureRound = {
  type: 'readWordPicture',
  word: 'ТОЛИК',
  correctId: 'mama',
  options: [
    { id: 'mama', alt: 'Мама' },
    { id: 'papa', alt: 'Папа' },
    { id: 'sok', alt: 'Сок' },
    { id: 'dom', alt: 'Дом' },
  ],
};

const withStore = (round: ReadWordPictureRound = defaultRound) => {
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

const meta: Meta<typeof ReadWordPictureRoundContainer> = {
  component: ReadWordPictureRoundContainer,
  title: 'tasks/ReadWordPicture/Container',
  decorators: [withStore()],
};
export default meta;

type Story = StoryObj<typeof ReadWordPictureRoundContainer>;

/** Контейнер: раунд «МАМА», кнопка «Начать» → инструкция → слово по слогам, «Прочитать», выбор картинки. */
export const Default: Story = {};

/** Слово «СТОЛ» (согласные по одной). */
export const WordStol: Story = {
  decorators: [
    withStore({
      type: 'readWordPicture',
      word: 'СТОЛ',
      correctId: 'stol',
      options: [
        { id: 'stol', alt: 'Стол' },
        { id: 'dom', alt: 'Дом' },
        { id: 'sok', alt: 'Сок' },
      ],
    }),
  ],
};
