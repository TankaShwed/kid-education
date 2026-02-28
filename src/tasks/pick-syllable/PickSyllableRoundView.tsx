import type { PickSyllableRound as Round, Syllable } from '@/domain/types';

/**
 * Пропсы презентационного компонента «Выбери слог».
 *
 * @remarks
 * Данные раунда и состояние (options, status, hasStarted, spoken) приходят из контейнера;
 * onStart — запуск раунда (озвучка через сагу), onChoose — выбор варианта слога.
 */
export interface PickSyllableRoundViewProps {
  round: Round;
  options: Syllable[];
  status: 'idle' | 'correct' | 'wrong';
  hasStarted: boolean;
  spoken: boolean;
  onStart: () => void;
  onChoose: (chosen: Syllable) => void;
}

/** Чистое представление раунда «Выбери слог» (без TTS, данные снаружи). */
export function PickSyllableRoundView({
  round,
  options,
  status,
  hasStarted,
  spoken,
  onStart,
  onChoose,
}: PickSyllableRoundViewProps) {
  const target = round.target;

  return (
    <div className="pick-syllable-round" data-testid="pick-syllable-round">
      <p className="instruction" data-testid="pick-syllable-instruction" style={{display: 'none'}}>
        Выбери слог <strong>{target}</strong>
      </p>
      {!hasStarted ? (
        <button
          type="button"
          className="start-button"
          onClick={onStart}
          aria-label="Начать задание"
          data-testid="pick-syllable-start"
        >
          Начать
        </button>
      ) : (
        <>
          <div
            className="options"
            role="group"
            aria-label="Варианты слогов"
            data-testid="pick-syllable-options"
          >
            {options.map((syllable) => (
              <button
                key={syllable}
                type="button"
                className="syllable-button"
                onClick={() => onChoose(syllable)}
                disabled={status !== 'idle'}
                aria-pressed={status === 'correct' ? undefined : false}
                data-testid={`pick-syllable-option-${syllable}`}
              >
                {syllable}
              </button>
            ))}
          </div>
          {!spoken && <p className="hint">Слушай задание…</p>}
        </>
      )}
    </div>
  );
}
