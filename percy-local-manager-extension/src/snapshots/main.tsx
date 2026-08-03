import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnapshotsPage } from './SnapshotsPage';
import './snapshots.css';

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <SnapshotsPage />
  </React.StrictMode>
);