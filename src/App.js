import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter or HashRouter

import Home from './Pages/Home';
import Tasks from './Pages/Tasks';
import Squad from './Pages/Squad';
import Farm from './Pages/Farm';

const App = () => {
  return (
    <BrowserRouter> {/* Wrap your Routes with BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/squad" element={<Squad />} />
        <Route path="/farm" element={<Farm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
