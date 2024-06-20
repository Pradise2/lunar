import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TotalBalProvider } from './Context/TotalBalContext'; // Adjust path based on your project structure

const { createRoot } = ReactDOM;

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <TotalBalProvider>
      <App />
    </TotalBalProvider>
  </React.StrictMode>
);
