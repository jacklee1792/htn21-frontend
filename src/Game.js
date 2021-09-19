import './App.css';
import { Grid } from './Grid';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { MdContentCopy } from 'react-icons/md';

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
    [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
  ],
  row: [0, 0],
  col: [0, 0]
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

export const Game = ({ sock }) => {

  const [gameState, setGameState] = useState(example);
  const [enableInput, setEnableInput] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState('create');
  const [gameOver, setGameOver] = useState(0);

  const { gid } = useParams();
  const history = useHistory();

  // Listen for keydown
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
            sock.emit('move', pMyRow + 1, pMyCol);
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
            sock.emit('move', pMyRow, pMyCol + 1);
          }
          return newState;
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [sock, gameState, setGameState, enableInput]);

  // Listen for move event, start event
  useEffect(() => {
    sock.on('move', (e) => {
      const [r, c] = e;
      setGameState((prevState) => {
        let newState = copyState(prevState);
        newState.progress[1][r][c] = prevState.arr[r][c].length;
        newState.row[1] = r;
        newState.col[1] = c;
        return newState;
      })
    });
    sock.on('start', () => {
      console.log('game started!');
      setStatus('started');
    });
  }, [sock]);

  // Get game information
  useEffect(() => {
    if (!gid) {
      return;
    }
    sock.emit('get', gid, (res) => {
      // Failed to get game information
      if (!res) {
        console.log('failed to get game info');
        setStatus('err');
      }
      // OK got game information
      console.log('ok got game information');
      setGameState((prevState) => {
        let newState = copyState(prevState);
        newState.arr = res;
        return newState;
      });
      // We don't want a race
      setStatus((prevStatus) => {
        if (prevStatus !== 'started') {
          return 'waiting';
        }
        return 'started';
      });
    });
  }, [sock, gid]);

  // Start countdown on gameStarted
  useEffect(() => {
    if (status !== 'started') {
      return;
    }
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
  }, [status, countdown]);

  return (
    <div className="game">
      <div className="fix-w">
        <h1>LetterGrid</h1>
        <h2>Hack the North 2021 submission</h2>
      </div>
      {/* What thing do you put in the middle? */}
      {status === 'create' ? <div className="ctr">
        <button className="create-btn fix-w" onClick={() => {
          sock.emit('create', (res) => {
            console.log(`got response ${res}`);
            history.push(`/${res}`);
          })
        }}>
          Create a new game
        </button>
      </div> : status === 'waiting' ? <div className="fix-w ctr">
        <p className="font-md">
          Share this link with your opponent to get them to join the game:
        </p>
        <div className="link-share">
          <div>
            <p>{window.location.href}</p>
          </div>
          <MdContentCopy
            className="copy-icon"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          />
        </div>
      </div> : status === 'started' ?
        <Grid countdown={countdown} gameOver={gameOver} {...gameState}
      /> : <div>
        The thing you're looking for isn't there lol
      </div>
      }
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
