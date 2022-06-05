import React from 'react';
import './App.css';
import Header from './Header';
import Board from './Board';

function App() {
  return (
    <div className='wrapper'>
      <Header />
      <main>
        <Board />
      </main>
    </div>
  );
}

export default App;
