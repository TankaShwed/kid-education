import { useCallback } from 'react';
import { ReadWordPictureRoundView } from './ReadWordPictureRoundView';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { readWordPictureSlice } from './readWordPictureSlice';

/**
 * Контейнер задания «Прочитай слово и выбери картинку»: подключает View к store
 * и диспатчит экшены slice. Озвучка выполняется сагой по экшенам startRound,
 * readWord, chooseWrong, chooseCorrect.
 */
export function ReadWordPictureRoundContainer() {
  const dispatch = useAppDispatch();
  const round = useAppSelector((s) =>
    s.session.currentRound?.type === 'readWordPicture'
      ? s.session.currentRound
      : null
  );
  const { options, status, hasStarted, spoken } = useAppSelector(
    (s) => s.readWordPicture
  );

  const handleStart = useCallback(() => {
    dispatch(readWordPictureSlice.actions.startRound());
  }, [dispatch]);

  const handleReadWord = useCallback(() => {
    dispatch(readWordPictureSlice.actions.readWord());
  }, [dispatch]);

  const handleChooseOption = useCallback(
    (optionId: string) => {
      if (status !== 'idle' || !round) return;
      if (optionId === round.correctId) {
        dispatch(readWordPictureSlice.actions.chooseCorrect());
        return;
      }
      dispatch(readWordPictureSlice.actions.chooseWrong(optionId));
    },
    [dispatch, status, round]
  );

  if (!round) return null;

  return (
    <ReadWordPictureRoundView
      round={round}
      options={options}
      status={status}
      hasStarted={hasStarted}
      spoken={spoken}
      onStart={handleStart}
      onReadWord={handleReadWord}
      onChooseOption={handleChooseOption}
    />
  );
}
