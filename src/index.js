import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GlobalStateProvider } from './Context/GlobalStateContext';
import { TotalBalProvider } from './Context/TotalBalContext';

ReactDOM.render(
  <GlobalStateProvider>
    <TotalBalProvider>
      <App />
    </TotalBalProvider>
  </GlobalStateProvider>,
  document.getElementById('root')
);
