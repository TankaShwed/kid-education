import { useState, useCallback } from 'react';
import { createBrowserTTS } from '@/domain/tts';
import {
  createPickSyllableRound,
  createComposeSyllableRound,
} from '@/domain/rounds';
import type { Round, DifficultyLevel, TaskType } from '@/domain/types';
import { PickSyllableRound } from '@/components/PickSyllableRound';
import { ComposeSyllableRound } from '@/components/ComposeSyllableRound';
import { DifficultyPicker } from '@/components/DifficultyPicker';
import './App.css';

const TTS = createBrowserTTS();

function createRound(taskType: TaskType, difficulty: DifficultyLevel): Round {
  if (taskType === 'pickSyllable') {
    return createPickSyllableRound(difficulty);
  }
  return createComposeSyllableRound();
}

export default function App() {
  const [taskType, setTaskType] = useState<TaskType>('pickSyllable');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(4);
  const [round, setRound] = useState<Round | null>(() =>
    createRound('pickSyllable', 4)
  );
  const [roundKey, setRoundKey] = useState(0);
  const [showDifficulty, setShowDifficulty] = useState(false);

  const nextRound = useCallback(() => {
    setRound(createRound(taskType, difficulty));
    setRoundKey((k) => k + 1);
  }, [taskType, difficulty]);

  const handleCorrect = useCallback(() => {
    nextRound();
  }, [nextRound]);

  const switchTask = useCallback(
    (type: TaskType) => {
      setTaskType(type);
      setRound(createRound(type, difficulty));
      setRoundKey((k) => k + 1);
      setShowDifficulty(false);
    },
    [difficulty]
  );

  if (round === null) return null;

  return (
    <div className="app" data-testid="app">
      <header className="header" data-testid="app-header">
        <h1>Учимся читать</h1>
        <nav className="task-switcher" aria-label="Тип задания">
          <button
            type="button"
            className={taskType === 'pickSyllable' ? 'active' : ''}
            onClick={() => switchTask('pickSyllable')}
            data-testid="task-pick-syllable"
          >
            Выбери слог
          </button>
          <button
            type="button"
            className={taskType === 'composeSyllable' ? 'active' : ''}
            onClick={() => switchTask('composeSyllable')}
            data-testid="task-compose-syllable"
          >
            Собери слог
          </button>
        </nav>
        {taskType === 'pickSyllable' && (
          <>
            <button
              type="button"
              className="difficulty-trigger"
              onClick={() => setShowDifficulty((v) => !v)}
              aria-expanded={showDifficulty}
              data-testid="difficulty-trigger"
            >
              Сложность: {difficulty} варианта
            </button>
            {showDifficulty && (
              <DifficultyPicker
                value={difficulty}
                onChange={(v) => {
                  setDifficulty(v);
                  setShowDifficulty(false);
                  setRound(createRound(taskType, v));
                  setRoundKey((k) => k + 1);
                }}
              />
            )}
          </>
        )}
      </header>
      <main className="main" data-testid="main">
        {round.type === 'pickSyllable' && (
          <PickSyllableRound
            key={roundKey}
            round={round}
            tts={TTS}
            onCorrect={handleCorrect}
            hintOnWrong={true}
          />
        )}
        {round.type === 'composeSyllable' && (
          <ComposeSyllableRound
            key={roundKey}
            round={round}
            tts={TTS}
            onCorrect={handleCorrect}
          />
        )}
      </main>
    </div>
  );
}
