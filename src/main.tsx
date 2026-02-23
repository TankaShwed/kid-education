import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, runSagas } from '@/store';
import { createBrowserTTS } from '@/domain/tts';
import App from './App';

const tts = createBrowserTTS();
runSagas(tts);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
