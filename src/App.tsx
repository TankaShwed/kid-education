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
  const [showDifficulty, setShowDifficulty] = useState(false);

  const nextRound = useCallback(() => {
    setRound(createRound(taskType, difficulty));
  }, [taskType, difficulty]);

  const handleCorrect = useCallback(() => {
    nextRound();
  }, [nextRound]);

  const switchTask = useCallback(
    (type: TaskType) => {
      setTaskType(type);
      setRound(createRound(type, difficulty));
      setShowDifficulty(false);
    },
    [difficulty]
  );

  if (round === null) return null;

  return (
    <div className="app">
      <header className="header">
        <h1>Учимся читать</h1>
        <nav className="task-switcher" aria-label="Тип задания">
          <button
            type="button"
            className={taskType === 'pickSyllable' ? 'active' : ''}
            onClick={() => switchTask('pickSyllable')}
          >
            Выбери слог
          </button>
          <button
            type="button"
            className={taskType === 'composeSyllable' ? 'active' : ''}
            onClick={() => switchTask('composeSyllable')}
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
                }}
              />
            )}
          </>
        )}
      </header>
      <main className="main">
        {round.type === 'pickSyllable' && (
          <PickSyllableRound
            round={round}
            tts={TTS}
            onCorrect={handleCorrect}
            hintOnWrong={true}
          />
        )}
        {round.type === 'composeSyllable' && (
          <ComposeSyllableRound
            round={round}
            tts={TTS}
            onCorrect={handleCorrect}
          />
        )}
      </main>
    </div>
  );
}
