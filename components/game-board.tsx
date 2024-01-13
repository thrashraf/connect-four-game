const GameColumn = ({ columnIndex, col, onColumnHover, onColumnClick, hoveredColumn, currentPlayer, playerTurn, winningPattern }: GameColumnProps) => {
  return (
    <div
      key={columnIndex}
      className="z-10 flex flex-col md:gap-3"
      onMouseEnter={() => onColumnHover(columnIndex)}
    >
      {hoveredColumn === columnIndex && playerTurn === currentPlayer && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/marker-${playerTurn === 1 ? "red" : "yellow"}.svg`}
          alt="marker"
          className="absolute -top-7 z-10 mx-3 h-6 w-6 md:-top-12 md:mx-5 md:h-10 md:w-10"
        />
      )}
      {col.map((row, rowIndex) => (
        <GameCell
          key={rowIndex}
          row={row}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          onColumnClick={onColumnClick}
          winningPattern={winningPattern}
        />
      ))}
    </div>
  );
};

const GameCell = ({ row, columnIndex, rowIndex, onColumnClick, winningPattern }: GameCellProps) => {
  return (
    <div
      className={`relative z-10 mt-1 h-12 w-12 border-none ${rowIndex === 0 && "xl:mt-3"} ${columnIndex === 5 || columnIndex === 6 ? "md:mx-1 xl:mx-2" : "md:mx-2"} bg-transparent md:mt-0 md:h-[65px] md:w-[65px] xl:h-[95px] xl:w-[95px]`}
      onClick={() => onColumnClick(rowIndex, columnIndex)}
    >
      {row?.player !== 0 && (
        <>
          <img
            src={`/images/counter-${row?.player !== 1 ? "yellow" : "red"}-small.svg`}
            alt="counter"
            className={`absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 border-none md:h-[70px] md:w-[70px] xl:h-[100px] xl:w-[100px] ${row.falling ? "falling" : ""}`}
          />
          {winningPattern?.some(
            (pattern) =>
              pattern[0] === columnIndex &&
              pattern[1] === rowIndex
          ) ? (
            <div className="absolute left-1/2 top-1/2 z-20 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-transparent md:h-[30px] md:w-[30px] xl:h-[50px] xl:w-[50px] xl:border-8" />
          ) : null}
        </>
      )}
    </div>
  );
};


export default GameColumn;
