import { useState, useCallback, useRef } from 'react';
import type { PairSyllableRound } from './types';
import type {
  PairSyllableLetter,
  FormedSyllable,
} from './pairSyllableSlice';
import { isVowel } from '@/domain/letters';
import './PairSyllableRoundView.css';

const PAYLOAD_KEY = 'application/json';

/**
 * Пропсы презентационного компонента «Сложи слог».
 *
 * @remarks
 * phase, letters, formedSyllables, hasStarted, spoken, wrongSyllableId из контейнера;
 * onStart, onDropOnLetter, onChooseSyllable — колбэки.
 */
export interface PairSyllableRoundViewProps {
  round: PairSyllableRound;
  phase: 'pairing' | 'finding';
  letters: PairSyllableLetter[];
  formedSyllables: FormedSyllable[];
  hasStarted: boolean;
  spoken: boolean;
  wrongSyllableId: string | null;
  onStart: () => void;
  onDropOnLetter: (draggedId: string, targetId: string, dropX: number) => void;
  onChooseSyllable: (syllableId: string) => void;
}

export function PairSyllableRoundView({
  round,
  phase,
  letters,
  formedSyllables,
  hasStarted,
  spoken,
  wrongSyllableId,
  onStart,
  onDropOnLetter,
  onChooseSyllable,
}: PairSyllableRoundViewProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const lettersContainerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, letter: PairSyllableLetter) => {
      setDraggingId(letter.id);
      e.dataTransfer.setData(
        PAYLOAD_KEY,
        JSON.stringify({ letterId: letter.id, letter: letter.letter })
      );
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  const preventDefault = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      setDraggingId(null);
      const raw = e.dataTransfer.getData(PAYLOAD_KEY);
      if (!raw) return;
      try {
        const { letterId } = JSON.parse(raw) as {
          letterId: string;
          letter: string;
        };
        if (letterId === targetId) return;
        const container = lettersContainerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const dropXPercent =
          ((e.clientX - rect.left) / rect.width) * 100;
        onDropOnLetter(letterId, targetId, dropXPercent);
      } catch {
        // ignore
      }
    },
    [onDropOnLetter]
  );

  if (!hasStarted) {
    return (
      <div
        className="pair-syllable-round"
        data-testid="pair-syllable-round"
      >
        <button
          type="button"
          className="start-button"
          onClick={onStart}
          aria-label="Начать задание"
          data-testid="pair-syllable-start"
        >
          Начать
        </button>
      </div>
    );
  }

  return (
    <div
      className="pair-syllable-round"
      data-testid="pair-syllable-round"
    >
      {phase === 'pairing' && (
        <>
          <div
            ref={lettersContainerRef}
            className="pair-syllable-letters"
            data-testid="pair-syllable-letters"
          >
            {letters.map((letter) => (
              <span
                key={letter.id}
                className={`letter-chip ${isVowel(letter.letter) ? 'vowel' : 'consonant'} ${draggingId === letter.id ? 'dragging' : ''}`}
                style={{
                  left: `${letter.position.x}%`,
                  top: `${letter.position.y}%`,
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, letter)}
                onDragEnd={handleDragEnd}
                onDragOver={preventDefault}
                onDrop={(e) => handleDrop(e, letter.id)}
                data-testid={`pair-syllable-letter-${letter.id}`}
              >
                {letter.letter}
              </span>
            ))}
          </div>

          {formedSyllables.length > 0 && (
            <div
              className="pair-syllable-formed"
              data-testid="pair-syllable-formed"
            >
              {formedSyllables.map((s) => (
                <span
                  key={s.id}
                  className="syllable-chip"
                  data-testid={`pair-syllable-syllable-${s.id}`}
                >
                  {s.syllable[0]}
                  <span className="syllable-chip-vowel">{s.syllable[1]}</span>
                </span>
              ))}
            </div>
          )}

          {!spoken && (
            <p className="hint" data-testid="pair-syllable-hint">
              Слушай задание…
            </p>
          )}
          {spoken && letters.length > 0 && (
            <p className="hint" data-testid="pair-syllable-hint">
              Поднеси гласную к согласной или согласную к гласной
            </p>
          )}
        </>
      )}

      {phase === 'finding' && (
        <>
          <p className="finding-prompt" data-testid="pair-syllable-finding-prompt">
            Найди слог {round.targetFind}
          </p>
          <div
            className="pair-syllable-choices"
            data-testid="pair-syllable-choices"
          >
            {formedSyllables.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`syllable-chip clickable ${wrongSyllableId === s.id ? 'wrong' : ''}`}
                onClick={() => onChooseSyllable(s.id)}
                data-testid={`pair-syllable-choose-${s.id}`}
              >
                {s.syllable[0]}
                <span className="syllable-chip-vowel">{s.syllable[1]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
