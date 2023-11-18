import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type Cell = {
  player: 0 | 1 | 2
  falling: boolean
}

type ResponseCheckWin = {
  player: 0 | 1 | 2
  winningCells: number[][]
} | null

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkLine (indexes: number[][],boardState: Cell[][]) {
    const firstCell = boardState[indexes[0][0]][indexes[0][1]];
    return firstCell.player !== 0 && indexes.every(([i, j]) => boardState[i][j].player === firstCell.player);
};

export function checkForVerticalWin(boardState: Cell[][]): ResponseCheckWin {
  for (let col = 0; col < boardState.length; col++) {
    for (let row = 0; row < boardState[col].length - 3; row++) {
      const indexes = [[col, row], [col, row + 1], [col, row + 2], [col, row + 3]];
      if (checkLine(indexes, boardState))
        return {
          player: boardState[col][row].player,
          winningCells: indexes
        }
    }
  }
  return null;
}

export function checkForHorizontalWin(boardState: Cell[][]): ResponseCheckWin { 
  for (let col = 0; col < boardState.length - 3; col++) {
    for (let row = 0; row < boardState[col].length; row++) {
      const indexes = [[col, row], [col + 1, row], [col + 2, row], [col + 3, row]];
      if (checkLine(indexes, boardState)) return {
        player: boardState[col][row].player,
        winningCells: indexes
      };
    }
  }
  return null;
}

export function checkForDiagonalWin(boardState: Cell[][]): ResponseCheckWin {
  for (let col = 0; col < boardState.length - 3; col++) {
    for (let row = 0; row < boardState[col].length - 3; row++) {
      const indexes = [[col, row], [col + 1, row + 1], [col + 2, row + 2], [col + 3, row + 3]];
      if (checkLine(indexes, boardState)) return {
        player: boardState[col][row].player,
        winningCells: indexes
      };
    }
  }
  for (let col = 0; col < boardState.length - 3; col++) {
    for (let row = 3; row < boardState[col].length; row++) {
      const indexes = [[col, row], [col + 1, row - 1], [col + 2, row - 2], [col + 3, row - 3]];
      if (checkLine(indexes, boardState)) return {
        player: boardState[col][row].player,
        winningCells: indexes
      };
    }
  }
  return null;
}