import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { readWordPictureSlice } from './readWordPictureSlice';
import type { ReadWordPictureRound } from './types';

const round: ReadWordPictureRound = {
  type: 'readWordPicture',
  word: 'МАМА',
  correctId: 'mama',
  options: [
    { id: 'mama', alt: 'Мама' },
    { id: 'papa', alt: 'Папа' },
    { id: 'sok', alt: 'Сок' },
  ],
};

describe('readWordPictureSlice', () => {
  describe('reset', () => {
    it('should set options and initial state', () => {
      const store = configureStore({
        reducer: { readWordPicture: readWordPictureSlice.reducer },
      });
      store.dispatch(readWordPictureSlice.actions.reset(round));
      const state = store.getState().readWordPicture;
      expect(state.options).toHaveLength(3);
      expect(state.options.map((o) => o.id)).toEqual(['mama', 'papa', 'sok']);
      expect(state.status).toBe('idle');
      expect(state.hasStarted).toBe(false);
      expect(state.spoken).toBe(false);
    });
  });

  describe('startRound', () => {
    it('should set hasStarted and clear spoken', () => {
      const store = configureStore({
        reducer: { readWordPicture: readWordPictureSlice.reducer },
      });
      store.dispatch(readWordPictureSlice.actions.reset(round));
      store.dispatch(readWordPictureSlice.actions.startRound());
      const state = store.getState().readWordPicture;
      expect(state.hasStarted).toBe(true);
      expect(state.spoken).toBe(false);
    });
  });

  describe('instructionDone', () => {
    it('should set spoken to true', () => {
      const store = configureStore({
        reducer: { readWordPicture: readWordPictureSlice.reducer },
      });
      store.dispatch(readWordPictureSlice.actions.reset(round));
      store.dispatch(readWordPictureSlice.actions.startRound());
      store.dispatch(readWordPictureSlice.actions.instructionDone());
      expect(store.getState().readWordPicture.spoken).toBe(true);
    });
  });

  describe('chooseWrong', () => {
    it('should remove chosen option and set status to wrong', () => {
      const store = configureStore({
        reducer: { readWordPicture: readWordPictureSlice.reducer },
      });
      store.dispatch(readWordPictureSlice.actions.reset(round));
      store.dispatch(readWordPictureSlice.actions.startRound());
      store.dispatch(readWordPictureSlice.actions.chooseWrong('papa'));
      const state = store.getState().readWordPicture;
      expect(state.options).toHaveLength(2);
      expect(state.options.map((o) => o.id)).toEqual(['mama', 'sok']);
      expect(state.status).toBe('wrong');
    });
  });

  describe('wrongDone', () => {
    it('should set status back to idle', () => {
      const store = configureStore({
        reducer: { readWordPicture: readWordPictureSlice.reducer },
      });
      store.dispatch(readWordPictureSlice.actions.reset(round));
      store.dispatch(readWordPictureSlice.actions.chooseWrong('papa'));
      store.dispatch(readWordPictureSlice.actions.wrongDone());
      expect(store.getState().readWordPicture.status).toBe('idle');
    });
  });

  describe('chooseCorrect', () => {
    it('should set status to correct', () => {
      const store = configureStore({
        reducer: { readWordPicture: readWordPictureSlice.reducer },
      });
      store.dispatch(readWordPictureSlice.actions.reset(round));
      store.dispatch(readWordPictureSlice.actions.startRound());
      store.dispatch(readWordPictureSlice.actions.chooseCorrect());
      expect(store.getState().readWordPicture.status).toBe('correct');
    });
  });
});
