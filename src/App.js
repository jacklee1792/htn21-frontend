import './App.css';
import { Grid } from './Grid';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const example = {
  arr: [
    ["", "abcdefghijklm", "abcdefghijklm"],
    ["nopqrstuvwxyz", "nopqrstuvwxyz", "nopqrstuvwxyz"],
    ["abcdefghijklm", "abcdefghijklm", "abcdefghijklm"]
  ],
  progress: [[0, 3, 2], [5, 10, 12], [7, 4, 5]],
  row: 0,
  col: 0
};

const n = 3;

function App() {

  const [state, setState] = useState(example);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      console.log('kd', key);
      const { arr, progress, row, col } = state;
      if (row + 1 < n && key === arr[row + 1][col][progress[row + 1][col]]) {
        setState((prevState) => {
          let newState = { ...prevState };
          // shhhhh you don't see this
          newState.arr = JSON.parse(JSON.stringify(newState.arr));
          newState.progress = JSON.parse(JSON.stringify(newState.progress));
          const { row: prow, col: pcol, arr: parr } = prevState;
          newState.progress[prow + 1][pcol]++;
          if (newState.progress[prow + 1][pcol]
            === parr[prow + 1][pcol].length) {
            newState.row++;
          }
          return newState;
        });
      } else if (col + 1 < n && key === arr[row][col + 1][progress[row][col + 1]]) {
        setState((prevState) => {
          let newState = { ...prevState };
          // shhhhh you don't see this
          newState.arr = JSON.parse(JSON.stringify(newState.arr));
          newState.progress = JSON.parse(JSON.stringify(newState.progress));
          const { row: prow, col: pcol, arr: parr } = prevState;
          newState.progress[prow][pcol + 1]++;
          if (newState.progress[prow][pcol + 1]
            === parr[prow][pcol + 1].length) {
            newState.col++;
          }
          return newState;
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [state, setState]);

  return (
    <div className="app">
      <Grid {...state} />
    </div>
  );
}

export default App;
