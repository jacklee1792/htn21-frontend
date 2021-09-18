export const Grid = ({ arr, progress, row, col }) => {

  let items = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const item = arr[i][j];
      const pos = progress[i][j];
      const rem = item.length - pos;
      const opacity = 0.5 * rem / 13;
      const show = (i === row + 1 && j === col) || (i === row && j === col + 1);
      items.push(
        <div
          className={`grid-item ${i === row && j === col ? "grid-item-sel" : ""}`}
          style={{
            "background-color": `rgba(0, 0, 0, ${opacity})`
          }}
        >
          {show && <p>{item[pos]}<sub>{rem}</sub></p>}
        </div>
      )
    }
  }

  return (
    <div className="grid">
      {items}
    </div>
  );
}