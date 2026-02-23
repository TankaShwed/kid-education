import { useState, useEffect, useCallback } from 'react';
import type { ComposeSyllableRound as Round } from '@/domain/types';
import type { TTSProvider } from '@/domain/tts';

const PHRASE = 'Собери слог';

interface ComposeSyllableRoundProps {
  round: Round;
  tts: TTSProvider;
  onCorrect: () => void;
}

type DragSource = { kind: 'pool' } | { kind: 'slot'; index: number };

export function ComposeSyllableRound({
  round,
  tts,
  onCorrect,
}: ComposeSyllableRoundProps) {
  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array(round.target.length).fill(null)
  );
  const [pool, setPool] = useState<string[]>(() => [...round.letters]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [dragging, setDragging] = useState<{
    source: DragSource;
    letter: string;
  } | null>(null);

  const target = round.target;
  const slotCount = round.target.length;

  const speakTask = useCallback(() => {
    tts.speak(`${PHRASE} ${target}`);
  }, [target, tts]);

  useEffect(() => {
    speakTask();
    return () => tts.cancel();
  }, [speakTask, tts]);

  const checkAndHandleComplete = useCallback(
    (newSlots: (string | null)[]) => {
      const filled = newSlots.every((s) => s !== null);
      if (!filled) return;
      const composed = newSlots.join('');
      if (composed === target) {
        setStatus('correct');
        onCorrect();
        tts.speak('Правильно! Молодец!');
      } else {
        setStatus('wrong');
        tts.speak(`Это слог ${composed}. Попробуй ещё раз.`).then(() => {
          setSlots(Array(slotCount).fill(null));
          setPool([...round.letters].sort(() => Math.random() - 0.5));
          setStatus('idle');
        });
      }
    },
    [target, tts, onCorrect, slotCount, round.letters]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, source: DragSource, letter: string) => {
      setDragging({ source, letter });
      e.dataTransfer.setData(
        'application/json',
        JSON.stringify({ source, letter })
      );
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  const handleDropOnSlot = useCallback(
    (e: React.DragEvent, slotIndex: number) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData('application/json');
      if (!raw) return;
      setDragging(null);
      let payload: { source: DragSource; letter: string };
      try {
        payload = JSON.parse(raw);
      } catch {
        return;
      }
      const { source, letter } = payload;

      if (source.kind === 'pool') {
        setPool((prev) => {
          const idx = prev.indexOf(letter);
          if (idx === -1) return prev;
          return prev.slice(0, idx).concat(prev.slice(idx + 1));
        });
        setSlots((prev) => {
          const next = [...prev];
          next[slotIndex] = letter;
          setTimeout(() => checkAndHandleComplete(next), 0);
          return next;
        });
      } else {
        setSlots((prev) => {
          const next = [...prev];
          const fromLetter = prev[source.index];
          next[source.index] = prev[slotIndex];
          next[slotIndex] = fromLetter;
          setTimeout(() => checkAndHandleComplete(next), 0);
          return next;
        });
      }
    },
    [checkAndHandleComplete]
  );

  const handleDropOnPool = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    try {
      const { source, letter } = JSON.parse(raw);
      if (source.kind === 'slot') {
        setSlots((prev) => {
          const next = [...prev];
          next[source.index] = null;
          return next;
        });
        setPool((prev) => [...prev, letter]);
      }
    } catch {
      // ignore
    }
    setDragging(null);
  }, []);

  const preventDefault = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      className="compose-syllable-round"
      data-testid="compose-syllable-round"
    >
      <p className="instruction" data-testid="compose-syllable-instruction">
        Собери слог <strong>{target}</strong>
      </p>

      <div
        className="slots"
        role="group"
        aria-label="Слоты для слога"
        data-testid="compose-syllable-slots"
      >
        {slots.map((letter, index) => (
          <div
            key={`slot-${index}`}
            className={`slot ${letter ? 'filled' : ''}`}
            onDragOver={preventDefault}
            onDrop={(ev) => {
              const raw = ev.dataTransfer.getData('application/json');
              if (!raw) return;
              try {
                const { source } = JSON.parse(raw);
                if (source.kind === 'slot' && source.index === index) return;
                handleDropOnSlot(ev, index);
              } catch {
                // ignore
              }
            }}
          >
            {letter ? (
              <span
                className="slot-letter"
                draggable
                onDragStart={(ev) =>
                  handleDragStart(ev, { kind: 'slot', index }, letter)
                }
                onDragEnd={handleDragEnd}
              >
                {letter}
              </span>
            ) : (
              <span className="slot-placeholder" aria-hidden>
                ?
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        className="letters-pool"
        role="group"
        aria-label="Буквы"
        onDragOver={preventDefault}
        onDrop={handleDropOnPool}
        data-testid="compose-syllable-pool"
      >
        {pool.map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className={`letter-chip ${dragging?.source.kind === 'pool' && dragging.letter === letter ? 'dragging' : ''}`}
            draggable
            onDragStart={(ev) => handleDragStart(ev, { kind: 'pool' }, letter)}
            onDragEnd={handleDragEnd}
          >
            {letter}
          </span>
        ))}
      </div>

      {status === 'idle' && (
        <p className="hint">Перетащи буквы в слоты по порядку</p>
      )}
    </div>
  );
}
