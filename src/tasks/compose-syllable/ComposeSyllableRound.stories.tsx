import type { Meta, StoryObj } from '@storybook/react';
import { ComposeSyllableRoundView } from './ComposeSyllableRoundView';

const defaultRound = {
  type: 'composeSyllable' as const,
  target: 'НО',
  letters: ['О', 'Н'],
};

const meta: Meta<typeof ComposeSyllableRoundView> = {
  component: ComposeSyllableRoundView,
  title: 'tasks/ComposeSyllable/View',
  args: {
    round: defaultRound,
    onStart: () => {},
    onDropToSlot: () => {},
    onDropToPool: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof ComposeSyllableRoundView>;

/** Кнопка «Начать», раунд ещё не начат. */
export const Default: Story = {
  args: {
    round: defaultRound,
    slots: [null, null],
    pool: ['О', 'Н'],
    status: 'idle',
    hasStarted: false,
    spoken: false,
  },
};

/** Раунд начат, слоты пустые, можно перетаскивать. */
export const Started: Story = {
  args: {
    round: defaultRound,
    slots: [null, null],
    pool: ['О', 'Н'],
    status: 'idle',
    hasStarted: true,
    spoken: true,
  },
};

/** Частично собранный слог. */
export const Partial: Story = {
  args: {
    round: defaultRound,
    slots: ['Н', null],
    pool: ['О'],
    status: 'idle',
    hasStarted: true,
    spoken: true,
  },
};

/** Раунд «МА» с тремя буквами. */
export const Ma: Story = {
  args: {
    round: {
      type: 'composeSyllable',
      target: 'МА',
      letters: ['М', 'А'],
    },
    slots: [null, null],
    pool: ['М', 'А'],
    status: 'idle',
    hasStarted: true,
    spoken: true,
  },
};
