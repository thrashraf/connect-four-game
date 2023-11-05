/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useCallback, useEffect } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import PlayerCard from "@/components/player-card"
import TurnsCard from "@/components/turns-card"

type Props = {}

type Cell = {
  player: 0 | 1 | 2;
  falling: boolean;
};

const Page = (props: Props) => {

  const [hoveredColumn, setHoveredColumn] = React.useState<number | null>(null);
  const [boardState, setBoardState] = React.useState<Cell[][]>([]);
  const [playerTurn, setPlayerTurn] = React.useState<1 | 2>(1);

  // ==================================== FUNCTIONS ====================================

  useEffect(() => {
    // Initialize the board state with empty cells
    const board: Cell[][] = Array.from(Array(7), () =>
      new Array(6).fill({ player: 0, falling: false })
    );
    setBoardState(board);
  }, []);


  const handleColumnHover = (columnIndex: number) => {
    setHoveredColumn(columnIndex);
  }

  const handleColumnClick = (row: number, column: number) => {
    //... existing code
    //? check if the column is full
    if (boardState[column][0]?.player !== 0) return;

    //? find the last empty row
    let emptyRow = 0;

    for (let i = 0; i < boardState[column].length; i++) {
      if (boardState[column][i]?.player === 0) {
        emptyRow = i;
      }
    }

    //? update the board state
    const newBoardState = [...boardState];
    newBoardState[column][emptyRow] = { player: playerTurn, falling: true };

    setBoardState(newBoardState);

    // Remove the falling class after the animation is done
    setTimeout(() => {
      newBoardState[column][emptyRow] = { player: playerTurn, falling: false };
      setBoardState(newBoardState);
    }, 500);

    //? update the player turn
    return setPlayerTurn(playerTurn === 1 ? 2 : 1);
  }

  const checkForWin = useCallback(() => {
    //? check for vertical win
    for (let i = 0; i < boardState.length; i++) {
      for (let j = 0; j < boardState[i].length; j++) {
        if (
          boardState[i][j]?.player !== 0 &&
          boardState[i][j]?.player === boardState?.[i]?.[j + 1]?.player &&
          boardState[i][j]?.player === boardState?.[i]?.[j + 2]?.player &&
          boardState[i][j]?.player === boardState?.[i]?.[j + 3]?.player
        ) {
          return boardState[i][j]?.player;
        }
      }
    }

    //? check for horizontal win
    for (let i = 0; i < boardState.length; i++) {
      for (let j = 0; j < boardState[i].length; j++) {
        if (
          boardState[i][j]?.player !== 0 &&
          boardState[i][j]?.player === boardState?.[i + 1]?.[j]?.player &&
          boardState[i][j]?.player === boardState?.[i + 2]?.[j]?.player &&
          boardState[i][j]?.player === boardState?.[i + 3]?.[j]?.player
        ) {
          return boardState[i][j]?.player;
        }
      }
    }

    //? check for diagonal win (top left to bottom right)
    for (let i = 0; i < boardState.length; i++) {
      for (let j = 0; j < boardState[i].length; j++) {
        if (
          boardState[i][j]?.player !== 0 &&
          boardState[i][j]?.player === boardState?.[i + 1]?.[j + 1]?.player &&
          boardState[i][j]?.player === boardState?.[i + 2]?.[j + 2]?.player &&
          boardState[i][j]?.player === boardState?.[i + 3]?.[j + 3]?.player
        ) {
          return boardState[i][j]?.player;
        }
      }
    }

    //? check for diagonal win (bottom left to top right)
    for (let i = 0; i < boardState.length; i++) {
      for (let j = 0; j < boardState[i].length; j++) {
        if (
          boardState[i][j]?.player !== 0 &&
          boardState[i][j]?.player === boardState?.[i - 1]?.[j + 1]?.player &&
          boardState[i][j]?.player === boardState?.[i - 2]?.[j + 2]?.player &&
          boardState[i][j]?.player === boardState?.[i - 3]?.[j + 3]?.player
        ) {
          return boardState[i][j]?.player;
        }
      }
    }

    return null;
  }, [boardState])

  useEffect(() => {
    const winner = checkForWin();
    if (winner) {
      setTimeout(() => {
        alert(`Player ${winner} wins!`);
      }, 1000);
    }
  }
    , [checkForWin])



  return (
    <div className="mx-auto mt-10 min-h-max max-w-[500px] px-5 md:max-w-[600px] xl:max-w-7xl">
      <div className="flex items-center justify-between xl:m-auto xl:max-w-[900px]">
        <Button
          variant={"menu"}
          size={"sm"}
          className="h-6 w-28 rounded-3xl py-5 font-bold text-white"
        >
          MENU
        </Button>
        <Image
          src={"/images/logo.svg"}
          alt="arrow"
          width={60}
          height={60}
          className="ml-2"
        />
        <Button
          variant={"menu"}
          size={"sm"}
          className="h-6 w-28 rounded-3xl py-5 font-bold text-white"
        >
          RESTART
        </Button>
      </div>
      <div className="relative mx-auto mt-10 flex flex-col items-center justify-between xl:flex-row xl:justify-between">
        <div className="flex w-full flex-row items-center justify-between xl:w-[200px]">
          <PlayerCard playerNumber={1} playerNumberString="one" score={0} />
          <div className="block xl:hidden">
            <PlayerCard playerNumber={2} playerNumberString="two" score={0} />
          </div>
        </div>
        <div className="relative mt-10 flex h-[350px] w-[350px] md:mt-24 md:h-[500px] md:w-[550px] xl:h-[700px] xl:w-[800px]">
          <div className='mx-auto grid grid-cols-7 md:p-1'>
            {boardState.map((col, columnIndex) => (
              <div
                key={columnIndex}
                className={`z-10 flex flex-col md:gap-3`}
                onMouseEnter={() => handleColumnHover(columnIndex)}
              >
                {hoveredColumn === columnIndex ? (
                  <img
                    src={`/images/marker-${playerTurn === 1 ? 'red' : 'yellow'}.svg`}
                    alt="marker"
                    className="absolute -top-7 z-10 mx-3 h-6 w-6 md:-top-12 md:mx-5 md:h-10 md:w-10"
                  />
                ) : null}
                {col.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`relative z-10 mt-1 h-12 w-12 border-none ${rowIndex === 0 && 'xl:mt-3'} ${columnIndex === 5 || columnIndex === 6 ? 'md:mx-1 xl:mx-2' : 'md:mx-2'} bg-transparent md:mt-0 md:h-[65px] md:w-[65px] xl:h-[95px] xl:w-[95px]`}
                    onClick={() => handleColumnClick(rowIndex, columnIndex)}
                  >
                    {row?.player !== 0 ? (
                      <img
                        src={`/images/counter-${row?.player !== 1 ? 'yellow' : 'red'}-small.svg`}
                        alt="counter"
                        className={`absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 border-none md:h-[70px] md:w-[70px] xl:h-[100px] xl:w-[100px] ${row.falling ? 'falling' : ''}`}
                      />
                    ) : null}
                  </div>
                )
                )}
              </div>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="board"
            src="/images/board-layer-black-large.svg"
            className="absolute left-1/2 h-[350px]  w-[350px] -translate-x-1/2 md:h-[500px] md:w-[600px] xl:h-[700px] xl:w-[800px]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="board"
            src="/images/board-layer-white-large.svg"
            className="absolute left-1/2 h-[350px] w-[350px] -translate-x-1/2 md:h-[500px] md:w-[600px] xl:h-[700px] xl:w-[800px]"
          />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2">
            <TurnsCard playerTurn={playerTurn} />
          </div>
        </div>
        <div className="hidden justify-end xl:flex xl:w-[200px]">
          <PlayerCard playerNumber={2} playerNumberString="two" score={0} />
        </div>
      </div>
    </div>
  )
}

export default Page
