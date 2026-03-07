import type { Meta, StoryObj } from '@storybook/react';
import { PairSyllableRoundView } from './PairSyllableRoundView';
import type { PairSyllableLetter, FormedSyllable } from './pairSyllableSlice';

const defaultRound = {
  type: 'pairSyllable' as const,
  syllables: ['МА', 'НО', 'КУ'] as const,
  targetFind: 'МА' as const,
};

const sampleLetters: PairSyllableLetter[] = [
  { id: 'l1', letter: 'М', position: { x: 20, y: 25 } },
  { id: 'l2', letter: 'А', position: { x: 55, y: 20 } },
  { id: 'l3', letter: 'Н', position: { x: 30, y: 50 } },
  { id: 'l4', letter: 'О', position: { x: 65, y: 45 } },
  { id: 'l5', letter: 'К', position: { x: 45, y: 70 } },
  { id: 'l6', letter: 'У', position: { x: 75, y: 65 } },
];

const sampleFormed: FormedSyllable[] = [
  { id: 's1', syllable: 'МА' },
  { id: 's2', syllable: 'НО' },
];

const meta: Meta<typeof PairSyllableRoundView> = {
  component: PairSyllableRoundView,
  title: 'tasks/PairSyllable/View',
  args: {
    round: defaultRound,
    onStart: () => {},
    onDropOnLetter: () => {},
    onChooseSyllable: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof PairSyllableRoundView>;

/** Кнопка «Начать», раунд ещё не начат. */
export const Default: Story = {
  args: {
    round: defaultRound,
    phase: 'pairing',
    letters: [],
    formedSyllables: [],
    hasStarted: false,
    spoken: false,
    wrongSyllableId: null,
  },
};

/** Раунд начат, фаза сборки: буквы разбросаны, можно перетаскивать. */
export const Pairing: Story = {
  args: {
    round: defaultRound,
    phase: 'pairing',
    letters: sampleLetters,
    formedSyllables: [],
    hasStarted: true,
    spoken: true,
    wrongSyllableId: null,
  },
};

/** Частично собраны пары: два слога готовы, буквы К и У остались. */
export const PartialPairs: Story = {
  args: {
    round: defaultRound,
    phase: 'pairing',
    letters: [
      { id: 'l5', letter: 'К', position: { x: 45, y: 70 } },
      { id: 'l6', letter: 'У', position: { x: 75, y: 65 } },
    ],
    formedSyllables: sampleFormed,
    hasStarted: true,
    spoken: true,
    wrongSyllableId: null,
  },
};

/** Фаза «Найди слог»: три собранных слога, нужно кликнуть на целевой. */
export const Finding: Story = {
  args: {
    round: defaultRound,
    phase: 'finding',
    letters: [],
    formedSyllables: [
      { id: 's1', syllable: 'МА' },
      { id: 's2', syllable: 'НО' },
      { id: 's3', syllable: 'КУ' },
    ],
    hasStarted: true,
    spoken: true,
    wrongSyllableId: null,
  },
};

/** Фаза finding после неверного клика (подсветка wrong). */
export const FindingWrong: Story = {
  args: {
    round: defaultRound,
    phase: 'finding',
    letters: [],
    formedSyllables: [
      { id: 's1', syllable: 'МА' },
      { id: 's2', syllable: 'НО' },
      { id: 's3', syllable: 'КУ' },
    ],
    hasStarted: true,
    spoken: true,
    wrongSyllableId: 's2',
  },
};
