import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Suppress benign browser ResizeObserver loop notification errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message &&
      (event.message.includes('ResizeObserver loop completed with undelivered notifications') ||
        event.message.includes('ResizeObserver loop limit exceeded'))
    ) {
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);

