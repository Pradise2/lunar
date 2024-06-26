import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { TotalBalProvider } from './Context/TotalBalContext'; // Adjust path based on your project structure

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <TotalBalProvider>
      <App />
    </TotalBalProvider>
  </React.StrictMode>
);
