/**
 * Типы домена (см. docs/VOCABULARY.md).
 * Задел на несколько типов заданий и конфигураций.
 */

/** Слог — строка из 1–2 букв, напр. "НА", "КУ" */
export type Syllable = string;

/** Сложность: число вариантов в раунде (3–6) */
export type DifficultyLevel = 3 | 4 | 5 | 6;

/** Конфигурация задания «выбери слог» */
export interface PickSyllableTaskConfig {
  type: 'pickSyllable';
  /** Число вариантов на экране */
  optionsCount: DifficultyLevel;
}

/** Общий тип конфигурации задания (расширяется другими типами) */
export type TaskConfig = PickSyllableTaskConfig;

/** Идентификатор типа задания для микса в будущем */
export type TaskType = TaskConfig['type'];

/** Раунд задания «выбери слог» */
export interface PickSyllableRound {
  type: 'pickSyllable';
  /** Слог, который нужно выбрать */
  target: Syllable;
  /** Варианты на экране (включая target); после ошибок список уменьшается */
  options: Syllable[];
}

export type Round = PickSyllableRound;

/** Результат попытки в раунде */
export type AttemptResult =
  | { kind: 'correct' }
  | { kind: 'wrong'; chosen: Syllable };
