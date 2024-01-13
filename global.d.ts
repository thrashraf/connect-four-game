type Cell = {
  player: 0 | 1 | 2
  falling: boolean
}

type Score = {
  player1: number
  player2: number
}

interface IGameRoom {
  hoveredColumn: number | null
  boardState: Cell[][]
  playerTurn: 1 | 2
  time: number
  isPaused: boolean
  score: Score  
  currentPlayer: number | null
  onStart: boolean
  playerWin: 1 | 2 | null
  winningPattern: number[][]
  isOpen: boolean
}

type GameColumnProps = {
  columnIndex: number;
  col: GameCellType[];
  onColumnHover: (columnIndex: number) => void;
  onColumnClick: (rowIndex: number, columnIndex: number) => void;
  hoveredColumn: number | null;
  currentPlayer: number | null;
  playerTurn: number;
}

type GameCellProps = {
  row: GameCellType;
  columnIndex: number;
  rowIndex: number;
  onColumnClick: (rowIndex: number, columnIndex: number) => void;
}

type GameCellType = {
  player: number;
  falling: boolean;
}
