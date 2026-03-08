import type { ReadWordPictureRound } from './types';
import type { PictureOption } from './types';
import { splitWordIntoParts } from '@/domain/wordSyllables';
import { isVowel } from '@/domain/letters';
import './ReadWordPictureRoundView.css';

/**
 * Пропсы презентационного компонента «Прочитай слово и выбери картинку».
 */
export interface ReadWordPictureRoundViewProps {
  round: ReadWordPictureRound;
  options: PictureOption[];
  status: 'idle' | 'correct' | 'wrong';
  hasStarted: boolean;
  spoken: boolean;
  onStart: () => void;
  onReadWord: () => void;
  onChooseOption: (optionId: string) => void;
}

/** Рендер слова по слогам: части из splitWordIntoParts, буквы в span с классами vowel/consonant. */
function WordBySyllables({ word }: { word: string }) {
  const parts = splitWordIntoParts(word);

  return (
    <span
      className="read-word-picture-word"
      data-testid="read-word-picture-word"
      role="text"
    >
      {parts.map((part, idx) => {
        if (part.length === 2) {
          return (
            <span
              key={`${idx}-${part}`}
              className="read-word-picture-syllable-chip"
            >
              <span className="letter-chip consonant">{part[0]}</span>
              <span className="letter-chip vowel">{part[1]}</span>
            </span>
          );
        }
        const cls = isVowel(part) ? 'vowel' : 'consonant';
        return (
          <span
            key={`${idx}-${part}`}
            className={`read-word-picture-letter-single letter-chip ${cls}`}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}

/** Чистое представление раунда «Прочитай слово и выбери картинку». */
export function ReadWordPictureRoundView({
  round,
  options,
  status,
  hasStarted,
  spoken,
  onStart,
  onReadWord,
  onChooseOption,
}: ReadWordPictureRoundViewProps) {
  if (!hasStarted) {
    return (
      <div
        className="read-word-picture-round"
        data-testid="read-word-picture-round"
      >
        <button
          type="button"
          className="start-button"
          onClick={onStart}
          aria-label="Начать задание"
          data-testid="read-word-picture-start"
        >
          Начать
        </button>
      </div>
    );
  }

  return (
    <div
      className="read-word-picture-round"
      data-testid="read-word-picture-round"
    >
      <div className="read-word-picture-word-wrap">
        <WordBySyllables word={round.word} />
      </div>
      <button
        type="button"
        className="read-word-button"
        onClick={onReadWord}
        aria-label="Прочитать слово"
        data-testid="read-word-picture-read-button"
      >
        Прочитать
      </button>
      <div
        className="read-word-picture-options"
        role="group"
        aria-label="Варианты картинок"
        data-testid="read-word-picture-options"
      >
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="read-word-picture-option"
            onClick={() => onChooseOption(opt.id)}
            disabled={status !== 'idle'}
            data-testid={`read-word-picture-option-${opt.id}`}
          >
            {opt.alt}
          </button>
        ))}
      </div>
      {!spoken && (
        <p className="read-word-picture-hint" data-testid="read-word-picture-hint">
          Слушай задание…
        </p>
      )}
    </div>
  );
}
