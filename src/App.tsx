import { useState, useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  nextRound,
  sessionSlice,
} from '@/store';
import { PickSyllableRoundContainer } from '@/tasks/pick-syllable';
import { ComposeSyllableRoundContainer } from '@/tasks/compose-syllable';
import { ClassifyLetterRoundContainer } from '@/tasks/classify-letter';
import { DifficultyPicker } from '@/components/DifficultyPicker';
import './App.css';

export default function App() {
  const dispatch = useAppDispatch();
  const taskType = useAppSelector((s) => s.session.taskType);
  const difficulty = useAppSelector((s) => s.session.difficulty);
  const currentRound = useAppSelector((s) => s.session.currentRound);
  const roundKey = useAppSelector((s) => s.session.roundKey);
  const [showDifficulty, setShowDifficulty] = useState(false);

  useEffect(() => {
    if (currentRound === null) {
      dispatch(nextRound());
    }
  }, [currentRound, dispatch]);

  const switchTask = (type: typeof taskType) => {
    dispatch(sessionSlice.actions.setTaskType(type));
    dispatch(nextRound());
    setShowDifficulty(false);
  };

  const handleDifficultyChange = (v: typeof difficulty) => {
    dispatch(sessionSlice.actions.setDifficulty(v));
    setShowDifficulty(false);
    dispatch(nextRound());
  };

  if (currentRound === null) return null;

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
          <button
            type="button"
            className={taskType === 'classifyLetter' ? 'active' : ''}
            onClick={() => switchTask('classifyLetter')}
            data-testid="task-classify-letter"
          >
            Гласная или согласная
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
                onChange={handleDifficultyChange}
              />
            )}
          </>
        )}
      </header>
      <main className="main" data-testid="main">
        {currentRound.type === 'pickSyllable' && (
          <PickSyllableRoundContainer key={roundKey} />
        )}
        {currentRound.type === 'composeSyllable' && (
          <ComposeSyllableRoundContainer key={roundKey} />
        )}
        {currentRound.type === 'classifyLetter' && (
          <ClassifyLetterRoundContainer key={roundKey} />
        )}
      </main>
    </div>
  );
}
