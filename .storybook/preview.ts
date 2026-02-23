import type { Preview } from '@storybook/react';
import '../src/App.css';

const preview: Preview = {
  parameters: {
    controls: { matcher: /^on[A-Z]|^tts|^round/ },
    layout: 'centered',
  },
};
export default preview;
