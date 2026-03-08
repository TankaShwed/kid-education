import type { ReadWordPictureRound } from './types';
import type { PictureOption } from './types';

/** Набор слов с вариантами картинок (alt). Картинки (src) подставляются позже. */
const WORD_OPTIONS: ReadWordPictureRound[] = [
  {
    type: 'readWordPicture',
    word: 'МАМА',
    correctId: 'mama',
    options: [
      { id: 'mama', alt: 'Мама' },
      { id: 'papa', alt: 'Папа' },
      { id: 'dom', alt: 'Дом' },
      { id: 'sok', alt: 'Сок' },
    ],
  },
  {
    type: 'readWordPicture',
    word: 'ПАПА',
    correctId: 'papa',
    options: [
      { id: 'papa', alt: 'Папа' },
      { id: 'mama', alt: 'Мама' },
      { id: 'kot', alt: 'Кот' },
      { id: 'luk', alt: 'Лук' },
    ],
  },
  {
    type: 'readWordPicture',
    word: 'СОК',
    correctId: 'sok',
    options: [
      { id: 'sok', alt: 'Сок' },
      { id: 'luk', alt: 'Лук' },
      { id: 'dom', alt: 'Дом' },
      { id: 'stol', alt: 'Стол' },
    ],
  },
  {
    type: 'readWordPicture',
    word: 'ЛУК',
    correctId: 'luk',
    options: [
      { id: 'luk', alt: 'Лук' },
      { id: 'sok', alt: 'Сок' },
      { id: 'kot', alt: 'Кот' },
      { id: 'mama', alt: 'Мама' },
    ],
  },
  {
    type: 'readWordPicture',
    word: 'СТОЛ',
    correctId: 'stol',
    options: [
      { id: 'stol', alt: 'Стол' },
      { id: 'dom', alt: 'Дом' },
      { id: 'kot', alt: 'Кот' },
      { id: 'papa', alt: 'Папа' },
    ],
  },
  {
    type: 'readWordPicture',
    word: 'ДОМ',
    correctId: 'dom',
    options: [
      { id: 'dom', alt: 'Дом' },
      { id: 'stol', alt: 'Стол' },
      { id: 'mama', alt: 'Мама' },
      { id: 'sok', alt: 'Сок' },
    ],
  },
  {
    type: 'readWordPicture',
    word: 'КОТ',
    correctId: 'kot',
    options: [
      { id: 'kot', alt: 'Кот' },
      { id: 'dom', alt: 'Дом' },
      { id: 'luk', alt: 'Лук' },
      { id: 'papa', alt: 'Папа' },
    ],
  },
];

/**
 * Создать новый раунд «прочитай слово и выбери картинку»: случайное слово из набора,
 * варианты картинок в случайном порядке.
 */
export function createReadWordPictureRound(): ReadWordPictureRound {
  const template = WORD_OPTIONS[Math.floor(Math.random() * WORD_OPTIONS.length)]!;
  const options: PictureOption[] = [...template.options].sort(
    () => Math.random() - 0.5
  );
  return {
    type: 'readWordPicture',
    word: template.word,
    correctId: template.correctId,
    options,
  };
}
