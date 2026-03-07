import { useState, useCallback, useRef, useLayoutEffect } from 'react';
import type { PairSyllableRound } from './types';
import type {
  PairSyllableLetter,
  FormedSyllable,
} from './pairSyllableSlice';
import { isVowel } from '@/domain/letters';
import './PairSyllableRoundView.css';
import { flyPosition } from './tools';

const PAYLOAD_KEY = 'application/json';

/** 1x1 прозрачный пиксель — убирает тень/ghost при перетаскивании */
const EMPTY_DRAG_IMAGE: HTMLImageElement = (() => {
  const img = document.createElement('img');
  img.src =
    'data:image/gif;base64,R0lGOODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  return img;
})();

/**
 * Сырые данные дропа: куда и на что отпустили (targetId = null — в пустое место).
 */
export type DropPayload = {
  draggedId: string;
  dropX: number;
  dropY: number;
  width_percent: number;
  height_percent: number;
};

/**
 * Пропсы презентационного компонента «Сложи слог».
 *
 * @remarks
 * onDrop передаёт только сырые данные; валидация в саге.
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
  onDrop: (payload: DropPayload) => void;
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
  onDrop,
  onChooseSyllable,
}: PairSyllableRoundViewProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const lettersContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [customPosition, setCustomPosition] = useState<{ xs: number; ys: number, xe: number, ye: number } | null>(null);

  useLayoutEffect(() => {
    const el = lettersContainerRef.current;
    if (!el) return;
    const update = () =>
      setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phase, letters.length]);

  const getDropCoords = useCallback((e: React.DragEvent) => {
    const container = lettersContainerRef.current;
    if (!container) return { dropX: 0, dropY: 0, width_percent: 0, height_percent: 0 };
    const rect = container.getBoundingClientRect();
    const {clientWidth, clientHeight} = e.target as HTMLElement;
    return {
      dropX: ((e.clientX - rect.left) / rect.width) * 100,
      dropY: ((e.clientY - rect.top) / rect.height) * 100,
      width_percent: (clientWidth / rect.width) * 100,
      height_percent: (clientHeight / rect.height) * 100,
    };
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent, letter: PairSyllableLetter) => {
      setDraggingId(letter.id);
      e.dataTransfer.setData(
        PAYLOAD_KEY,
        JSON.stringify({ letterId: letter.id, letter: letter.letter })
      );
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setDragImage(EMPTY_DRAG_IMAGE, 0, 0);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  const preventDefault = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    let firstPosition = customPosition;
    if (!firstPosition) {
      firstPosition = { xs: e.screenX, ys: e.screenY, xe: e.screenX, ye: e.screenY };
    }
    setCustomPosition({ ...firstPosition, xe: e.screenX, ye: e.screenY });
  }, [customPosition]);

  const handleDropOnLetter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggingId(null);
      setCustomPosition(null);
      const raw = e.dataTransfer.getData(PAYLOAD_KEY);
      if (!raw) return;
      try {
        const { letterId } = JSON.parse(raw) as {
          letterId: string;
          letter: string;
        };
        onDrop({ draggedId: letterId, ...getDropCoords(e) });
      } catch {
        // ignore
      }
    },
    [onDrop, getDropCoords]
  );

  const handleDropOnContainer = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDraggingId(null);
      const raw = e.dataTransfer.getData(PAYLOAD_KEY);
      if (!raw) return;
      try {
        const { letterId } = JSON.parse(raw) as {
          letterId: string;
          letter: string;
        };
        onDrop({ draggedId: letterId, ...getDropCoords(e) });
      } catch {
        // ignore
      }
    },
    [onDrop, getDropCoords]
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
            onDragOver={preventDefault}
            onDrop={handleDropOnContainer}
          >
            {letters.map((letter) => (
              <span
                key={letter.id}
                className={`letter-chip ${isVowel(letter.letter) ? 'vowel' : 'consonant'} ${draggingId === letter.id ? 'dragging' : ''}`}
                style={{
                  left: `${flyPosition(letter, draggingId, customPosition, containerSize.w, containerSize.h).x}%`,
                  top: `${flyPosition(letter, draggingId, customPosition, containerSize.w, containerSize.h).y}%`,
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, letter)}
                onDragEnd={handleDragEnd}
                onDragOver={preventDefault}
                onDrop={handleDropOnLetter}
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
