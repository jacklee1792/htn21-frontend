import './App.css';
import { Grid } from './Grid';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { MdContentCopy } from 'react-icons/md';

import Audio1 from './audio/1.mp3';
import Audio2 from './audio/2.mp3';
import Audio3 from './audio/3.mp3';
import Audio4 from './audio/4.mp3';
import Audio5 from './audio/5.mp3';
import Audio6 from './audio/6.mp3';
import Audio7 from './audio/7.mp3';
import Audio8 from './audio/8.mp3';
import Audio9 from './audio/9.mp3';
import Audio10 from './audio/10.mp3';
import Audio11 from './audio/11.mp3';
import Audio12 from './audio/12.mp3';
import Audio13 from './audio/13.mp3';

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
  const [winner, setWinner] = useState(0);

  const { gid } = useParams();
  const history = useHistory();

  // When gameState updates, check if someone won
  useEffect(() => {
    const tgt = gameState.arr[n - 1][n - 1].length;
    if (gameState.progress[0][n - 1][n - 1] === tgt) {
      setWinner(1);
      setEnableInput(false);
    } else if (gameState.progress[1][n - 1][n - 1] === tgt) {
      setWinner(-1);
      setEnableInput(false);
    }
  }, [gameState])

  // Listen for keydown
  useEffect(() => {
    const handleKeyDown = (e) => {
      const audios = [
        new Audio(Audio1),
        new Audio(Audio2),
        new Audio(Audio3),
        new Audio(Audio4),
        new Audio(Audio5),
        new Audio(Audio6),
        new Audio(Audio7),
        new Audio(Audio8),
        new Audio(Audio9),
        new Audio(Audio10),
        new Audio(Audio11),
        new Audio(Audio12),
        new Audio(Audio13)
      ]
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
          const rem = parr[pMyRow + 1][pMyCol].length - newState.progress[0][pMyRow + 1][pMyCol];
          audios[12 - rem].play();
          // move to that square
          if (rem === 0) {
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
          const rem = parr[pMyRow][pMyCol + 1].length - newState.progress[0][pMyRow][pMyCol + 1];
          audios[12 - rem].play();
          // move to that square
          if (rem === 0) {
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
      setStatus('started');
      const audio = new Audio(Audio1);
      audio.play();
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
        setStatus('err');
        return;
      }
      // OK got game information
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
          const audio = new Audio(Audio13);
          audio.play();
        } else {
          const audio = new Audio(Audio1);
          audio.play();
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
        <Grid countdown={countdown} winner={winner} {...gameState}
      /> : <div className="fix-w ctr">
        Uh oh! The game you're looking for either doesn't exist or has already started.
        <button className="create-btn fix-w mt" onClick={() => {
          history.push('/');
          setStatus('create');
        }}>
          Back to main page
        </button>
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
