import { FaCircle, FaStar } from 'react-icons/fa';

export const Grid = ({ arr, progress, row, col, countdown, gameOver }) => {

  const n = arr.length;

  let items = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const item = arr[i][j];
      const myPos = progress[0][i][j], otherPos = progress[1][i][j];
      const myDone = myPos === item.length, otherDone = otherPos === item.length;
      const [myRow, otherRow] = row;
      const [myCol, otherCol] = col;
      const myRem = item.length - myPos;
      const opacity = 0.5 * myRem / 13;
      const myIsAdjacent = (i === myRow + 1 && j === myCol) || (i === myRow && j === myCol + 1);
      const showLtr = myIsAdjacent && !myDone && !otherDone;
      const isMySquare = i === myRow && j === myCol;
      const isOtherSquare = i === otherRow && j === otherCol;
      items.push(
        <div
          className={`grid-item ${
            isMySquare && isOtherSquare ? "outline-br" :
              isMySquare ? "outline-b" : 
              isOtherSquare ? "outline-r" : ""} ${
            myDone ? "bg-b" :
              otherDone ? "bg-r" : ""
          }`
          }
          style={!myDone && !otherDone && (i !== 0 || j !== 0) ? {
            backgroundColor: `rgba(0, 0, 0, ${opacity})`
          } : {}}
        >
          {/* Draw the circle at the beginning */}
          {(i === 0 && j === 0) && <FaCircle
            style={{
              height: '80%',
              width: '80%',
              color: 'rgba(0, 0, 0, 0.5)',
              position: 'absolute',
            }}
          />}
          {/* Draw the star at the end */}
          {(i === n - 1 && j === n - 1) && <FaStar
            style={{
              height: '80%',
              width: '80%',
              color: 'rgba(255, 255, 255, 0.3)',
              position: 'absolute',
            }}
          />}
          {/* Draw the letter if it's adjacent to you */}
          {showLtr && <p className="item-text">{item[myPos]}<sub>{myRem}</sub></p>}
        </div>
      )
    }
  }

  return (
    <div className="grid-container">
      {countdown !== 0 && <div className="overlay">
        <p className="cd-text">{countdown}</p>
      </div>}
      <div className="grid">
        {items}
      </div>
    </div>
  );
}