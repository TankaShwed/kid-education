import type { Meta, StoryObj } from '@storybook/react';
import { PickSyllableRoundView } from './PickSyllableRoundView';

const defaultRound = {
  type: 'pickSyllable' as const,
  target: 'НА',
  options: ['НО', 'НА', 'КА', 'КУ', 'НУ'],
};

const meta: Meta<typeof PickSyllableRoundView> = {
  component: PickSyllableRoundView,
  title: 'tasks/PickSyllable/View',
  args: {
    round: defaultRound,
    onStart: () => {},
    onChoose: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof PickSyllableRoundView>;

/** Кнопка «Начать», раунд ещё не начат. */
export const Default: Story = {
  args: {
    round: defaultRound,
    options: defaultRound.options,
    status: 'idle',
    hasStarted: false,
    spoken: false,
  },
};

/** Раунд начат, можно выбирать слог. */
export const Started: Story = {
  args: {
    round: defaultRound,
    options: defaultRound.options,
    status: 'idle',
    hasStarted: true,
    spoken: true,
  },
};

/** Меньше вариантов (3). */
export const ThreeOptions: Story = {
  args: {
    round: {
      type: 'pickSyllable',
      target: 'МА',
      options: ['МА', 'МО', 'МУ'],
    },
    options: ['МА', 'МО', 'МУ'],
    status: 'idle',
    hasStarted: true,
    spoken: true,
  },
};
