import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App.tsx';
import { t } from '@/i18n/t.ts';

import './index.css';

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

document.title = t('app.title');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
