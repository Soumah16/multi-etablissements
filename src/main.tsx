import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPWAUpdates } from './utils/pwaUpdates';

// Register PWA Service Worker with automatic background update checks (Android, iOS, Desktop)
initPWAUpdates();

createRoot(document.getElementById('root')!).render(<App />);
