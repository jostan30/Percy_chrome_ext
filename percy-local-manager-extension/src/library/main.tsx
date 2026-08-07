import React from 'react';
import ReactDOM from 'react-dom/client';
import { LibraryPage } from './LibraryPage';
import './../popup/popup.css';

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <LibraryPage />
  </React.StrictMode>
);