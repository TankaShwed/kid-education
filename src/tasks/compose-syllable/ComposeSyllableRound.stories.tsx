import type { Meta, StoryObj } from '@storybook/react';
import { ComposeSyllableRound } from './ComposeSyllableRound';
import { createBrowserTTS } from '@/domain/tts';

const tts = createBrowserTTS();

const meta: Meta<typeof ComposeSyllableRound> = {
  component: ComposeSyllableRound,
  title: 'tasks/ComposeSyllableRound',
  args: {
    tts,
    onCorrect: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof ComposeSyllableRound>;

export const Default: Story = {
  args: {
    round: {
      type: 'composeSyllable',
      target: 'НО',
      letters: ['О', 'Н'],
    },
  },
};

export const Ma: Story = {
  args: {
    round: {
      type: 'composeSyllable',
      target: 'МА',
      letters: ['М', 'А'],
    },
  },
};
