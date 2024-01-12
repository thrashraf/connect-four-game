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
