import type { Meta, StoryObj } from '@storybook/react';
import { PickSyllableRound } from './PickSyllableRound';
import { createBrowserTTS } from '@/domain/tts';

const tts = createBrowserTTS();

const meta: Meta<typeof PickSyllableRound> = {
  component: PickSyllableRound,
  title: 'PickSyllableRound',
  args: {
    tts,
    onCorrect: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof PickSyllableRound>;

export const Default: Story = {
  args: {
    round: {
      type: 'pickSyllable',
      target: 'НА',
      options: ['НО', 'НА', 'КА', 'КУ', 'НУ'],
    },
  },
};

export const ThreeOptions: Story = {
  args: {
    round: {
      type: 'pickSyllable',
      target: 'МА',
      options: ['МА', 'МО', 'МУ'],
    },
  },
};
