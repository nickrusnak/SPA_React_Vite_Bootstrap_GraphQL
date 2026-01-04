/**
 * Einstiegspunkt der React-Anwendung
 *
 * Hier wird die React-App initialisiert und in das DOM gerendert.
 * Bootstrap CSS wird global importiert für das Styling.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap CSS für React-Bootstrap Komponenten
// Muss vor eigenen Styles importiert werden, damit diese sie überschreiben können
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.tsx';
import './index.css';

// React 18+ createRoot API für Concurrent Features
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
