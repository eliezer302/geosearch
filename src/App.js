import React from 'react';
import './App.css';
import Pois from './Pois';

function App() {
  return (
    <div>
      <h1 className="text-center">Resultados de POIs</h1>
      <div className="App">
        <Pois />
      </div>
    </div>
  );
}

export default App;
