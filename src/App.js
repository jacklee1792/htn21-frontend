import './App.css';
import { Grid } from './Grid';
import React, { useEffect, useState } from 'react';

const example = {
  arr: [
    ["", "abcdefghijklm", "abcdefghijklm", "abcdefghijklm", "abcdefghijklm", "abcdefghijklm"],
    ["nopqrstuvwxyz", "nopqrstuvwxyz", "nopqrstuvwxyz", "nopqrstuvwxyz", "nopqrstuvwxyz", "nopqrstuvwxyz"],
    ["abcdefghijklm", "abcdefghijklm", "abcdefghijklm", "abcdefghijklm", "abcdefghijklm", "abcdefghijklm"],
    ["noptuvwxyz", "nopqrstuvwxyz", "nopqrstuvwxyz", "nopqrstuvwxyz", "nopqrstuvwxyz", "nopyz"],
    ["afghijklm", "abcghijklm", "abcdefghijklm", "abcdefghijklm", "abcdefjklm", "abcdefghijklm"],
    ["nowxyz", "nopqrstuvwxyz", "nopqrswxyz", "nopqrstuvwxyz", "nopqrstuvwxyz", "nowxyz"]
  ],
  progress: [
    [[-1, 3, 2, 0, 0, 0], [5, 10, 12, 0, 0, 0], [7, 4, 5, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
    [[-1, 13, 2, 0, 0, 0], [5, 13, 12, 0, 0, 0], [7, 4, 5, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
  ],
  row: [0, 1],
  col: [0, 1]
};

const n = 6;

const copyState = (prevState) => {
  let ret = {};
  // shhhhh you don't see this
  ret.arr = JSON.parse(JSON.stringify(prevState.arr));
  ret.progress = JSON.parse(JSON.stringify(prevState.progress));
  ret.row = prevState.row.slice();
  ret.col = prevState.col.slice();
  return ret;
}

function App() {

  const [gameState, setGameState] = useState(example);
  const [enableInput, setEnableInput] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown !== 0) {
      const timeout = setTimeout(() => {
        if (countdown === 1) {
          setEnableInput(true);
        }
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => {
        clearTimeout(timeout);
      }
    }
  }, [countdown]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!enableInput) {
        return;
      }
      const { key } = e;
      const { arr, progress, row, col } = gameState;
      const myRow = row[0], myCol = col[0];
      if (myRow + 1 < n
          && key === arr[myRow + 1][myCol][progress[0][myRow + 1][myCol]]
          && progress[1][myRow + 1][myCol] !== arr[myRow + 1][myCol].length) {
        setGameState((prevState) => {
          let newState = copyState(prevState);
          const { row: prow, col: pcol, arr: parr } = prevState;
          const pMyRow = prow[0], pMyCol = pcol[0];
          newState.progress[0][pMyRow + 1][pMyCol]++;
          console.log('update', pMyRow + 1, pMyCol);
          // move to that square
          if (newState.progress[0][pMyRow + 1][pMyCol]
            === parr[pMyRow + 1][pMyCol].length) {
            newState.row[0]++;
          }
          return newState;
        });
      } else if (myCol + 1 < n
          && key === arr[myRow][myCol + 1][progress[0][myRow][myCol + 1]]
          && progress[1][myRow][myCol + 1] !== arr[myRow][myCol + 1].length) {
        setGameState((prevState) => {
          let newState = copyState(prevState);
          const { row: prow, col: pcol, arr: parr } = prevState;
          const pMyRow = prow[0], pMyCol = pcol[0];
          newState.progress[0][pMyRow][pMyCol + 1]++;
          console.log('update', pMyRow, pMyCol + 1);
          // move to that square
          if (newState.progress[0][pMyRow][pMyCol + 1]
            === parr[pMyRow][pMyCol + 1].length) {
            newState.col[0]++;
          }
          return newState;
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameState, setGameState, enableInput]);

  return (
    <div className="app">
      <div className="fix-w">
        <h1>TypeCycles!</h1>
        <h2>Based on "Light Cycles" from <span className="ital">Tron: Evolution</span></h2>
      </div>
      <Grid countdown={countdown} { ...gameState } />
      <div className="fix-w">
        <h3>How to play</h3>
        <ul>
          <li>Both players start on the top-left square.</li>
          <li>Each cell has a <span className="bold">weight</span>, which is the number of keys you have to press to move to it.</li>
          <li>To reduce the weight of a cell, type the letter that appears on it.</li>
          <li>When you reduce the weight of a cell to 0, you move to the cell and block the cell off from the other player.</li>
          <li className="bold">First person to the bottom right cell wins!</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
