/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

import {
  checkWinner,
  createUser,
  gameStatus,
  getMoves,
  restartGame,
  updateMoves,
} from "@/lib/api/gameLogic"
import {
  checkForDiagonalWin,
  checkForHorizontalWin,
  checkForVerticalWin,
} from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Menu from "@/components/menu"
import PlayerCard from "@/components/player-card"
import TurnsCard from "@/components/turns-card"
import WinningCard from "@/components/winning-card"
import GameColumn from "@/components/game-board"

type Props = {}

type Cell = {
  player: 0 | 1 | 2
  falling: boolean
}

type Score = {
  player1: number
  player2: number
}

const Page = (props: Props) => {
  // get the slug from the url
  const params = useParams()

  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)
  const [boardState, setBoardState] = useState<Cell[][]>([])
  const [playerTurn, setPlayerTurn] = useState<1 | 2>(1)
  const [time, setTime] = useState<number>(45)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [score, setScore] = useState<Score>({
    player1: 0,
    player2: 0,
  })
  const [currentPlayer, setCurrentPlayer] = useState<number | null>(null)
  const [onStart, setOnStart] = useState<boolean>(false)
  const [playerWin, setPlayerWin] = useState<1 | 2 | null>(null)
  const [winningPattern, setWinningPattern] = useState<number[][]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  // ==================================== FUNCTIONS ====================================

  const { mutateAsync: createPlayer2 } = useMutation({
    mutationKey: ["createPlayer2"],
    mutationFn: (props: any) => createUser(props?.player, props?.gameId),
    onSuccess: () => {
      localStorage.setItem("player", "2");
      setCurrentPlayer(2)
    }
  })

  const initializeGame = () => {
    const board: Cell[][] = Array.from(Array(7), () =>
      new Array(6).fill({ player: 0, falling: false })
    )
    setBoardState(board)
  }

  useEffect(() => {
    if (!params || currentPlayer) return

    setCurrentPlayer(parseInt(localStorage.getItem("player") || "1"));

    const createPlayerAsync = async () => {
      if (!localStorage.getItem("player")) {
        await createPlayer2({ player: "player 2", gameId: params?.id })
      }
      setOnStart(true)
      setPlayerTurn(1)
      initializeGame()
    }

    createPlayerAsync()
  }, [params, currentPlayer, createPlayer2])

  useEffect(() => {
    let isSubscribed = true; // Flag to track mounted state

    const setupSubscription = async () => {
      const unsubscribeFn = await getMoves(params?.id, (res) => {
        if (isSubscribed) {
          // Using functional update to ensure we're working with the most recent state
          setBoardState(prevBoardState => {
            const newBoardState = prevBoardState.map(row => [...row]); // Deep copy of the board
            newBoardState[res?.column][res?.row] = {
              player: res?.player === "player 1" ? 1 : 2,
              falling: true,
            };
            return newBoardState;
          });

          // Set the timeout for falling animation
          setTimeout(() => {
            setBoardState(prevBoardState => {
              const newBoardState = prevBoardState.map(row => [...row]); // Deep copy of the board
              newBoardState[res?.column][res?.row] = {
                player: res?.player === "player 1" ? 1 : 2,
                falling: false,
              };
              return newBoardState;
            });
          }, 500);

          // Update player turn and reset timer
          setPlayerTurn(res?.player === "player 1" ? 2 : 1);
          setTime(45);
        }
      });

      return unsubscribeFn;
    };

    setupSubscription().then((unsubscribeFn) => {
      return () => {
        if (unsubscribeFn) {
          unsubscribeFn(); // Clean up the subscription
        }
        isSubscribed = false;
      };
    });

    // Cleanup on unmount or when dependencies change
    return () => {
      isSubscribed = false;
    };
  }, [params?.id]); // Dependency array


  useEffect(() => {
    let isSubscribed = true
    let unsubscribeFunc: () => void

    // Async function to handle subscription
    const setupSubscription = async () => {
      unsubscribeFunc = await gameStatus(params.id, (action) => {
        if (isSubscribed && action === "start") {
          // Perform the necessary actions when the game starts
          initializeGame();
          setWinningPattern([]);
          setPlayerTurn(1);
          setPlayerWin(null);
          setTime(45)
          setScore({ player1: score.player1, player2: score.player2 })
          setHoveredColumn(null)
          setOnStart(true)
          setIsPaused(false)
        }
      })
    }
    setupSubscription()
    // Cleanup function to handle component unmount
    return () => {
      isSubscribed = false
      if (unsubscribeFunc) {
        unsubscribeFunc() // Unsubscribe from the updates
      }
    }
  }, [params.id, score.player1, score.player2]);

  useEffect(() => {
    if (isPaused || !onStart) return

    if (time === 0) {
      playerTurn === 1
        ? setScore({ ...score, player2: score.player2 + 1 })
        : setScore({ ...score, player1: score.player1 + 1 })
      return setIsPaused(true)
    }

    const timer = setTimeout(() => setTime(time - 1), 1000)
    return () => clearTimeout(timer)
  }, [isPaused, onStart, playerTurn, score, time])

  const handleColumnHover = (columnIndex: number) => {
    if (currentPlayer !== playerTurn || playerWin) return
    setHoveredColumn(columnIndex)
  }

  const handleColumnClick = async (row: number, column: number) => {
    if (
      boardState[column][0]?.player !== 0 ||
      playerWin ||
      playerTurn !== currentPlayer
    )
      return
    let emptyRow = 0

    for (let i = 0; i < boardState[column].length; i++) {
      if (boardState[column][i]?.player === 0) {
        emptyRow = i
      }
    }
    try {
      await updateMoves(params?.id, `player ${playerTurn}`, {
        column,
        row: emptyRow,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const checkForWin = useCallback(() => {
    const verticalWin = checkForVerticalWin(boardState)
    if (verticalWin) return verticalWin

    const horizontalWin = checkForHorizontalWin(boardState)
    if (horizontalWin) return horizontalWin

    const diagonalWin = checkForDiagonalWin(boardState)
    if (diagonalWin) return diagonalWin

    return null
  }, [boardState])

  useEffect(() => {
    if (playerWin || !onStart) return

    const winner = checkForWin()
    if (winner) {
      if (
        winner?.player === 0 ||
        !winner?.player ||
        playerWin
      )
        return
      setTimeout(() => {
        setWinningPattern(winner.winningCells)
        setPlayerWin(winner.player !== 0 ? winner.player : null)
        winner?.player === 1
          ? setScore({ ...score, player1: score.player1 + 1 })
          : setScore({ ...score, player2: score.player2 + 1 });
      }, 1000)
    }
  }, [checkForWin, playerWin, onStart, score, boardState])

  const restart = () => {
    try {
      return restartGame(params.id, "start")
    } catch (error) {
      console.log(error)
    }
  }

  const onPause = () => {
    setIsPaused(!isPaused)
    setIsOpen(!isOpen)
  }

  return (
    <div className="mx-auto mt-10 min-h-max max-w-[500px] px-5 md:max-w-[600px] xl:max-w-7xl">
      <Menu isShow={isOpen} openChange={() => setIsOpen(!isOpen)} />
      <div className="flex items-center justify-between xl:m-auto xl:max-w-[900px]">
        <Button
          variant={"menu"}
          size={"sm"}
          className="h-6 w-28 rounded-3xl py-5 font-bold text-white"
          onClick={onPause}
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
          onClick={restart}
        >
          RESTART
        </Button>
      </div>
      <div className="relative mx-auto mt-10 flex flex-col items-center justify-between xl:flex-row xl:justify-between">
        <div className="flex w-full flex-row items-center justify-between xl:w-[200px]">
          <PlayerCard
            playerNumber={1}
            playerNumberString="one"
            score={score?.player1}
          />
          <div className="block xl:hidden">
            <PlayerCard
              playerNumber={2}
              playerNumberString="two"
              score={score?.player2}
            />
          </div>
        </div>
        <div className="relative mt-10 flex h-[350px] w-[350px] md:mt-24 md:h-[500px] md:w-[550px] xl:h-[700px] xl:w-[800px]">
          <div className="mx-auto grid grid-cols-7 md:p-1">
            {boardState.map((col, columnIndex) => (
              <GameColumn
                key={columnIndex}
                columnIndex={columnIndex}
                col={col}
                onColumnHover={handleColumnHover}
                onColumnClick={handleColumnClick}
                hoveredColumn={hoveredColumn}
                currentPlayer={currentPlayer}
                playerTurn={playerTurn}
                winningPattern={winningPattern}
              />
            )
            )}
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
            {playerWin ? (
              <WinningCard playerWin={playerWin} playAgain={restart} />
            ) : (
              <TurnsCard playerTurn={playerTurn} time={time} />
            )}
          </div>
        </div>
        <div className="hidden justify-end xl:flex xl:w-[200px]">
          <PlayerCard
            playerNumber={2}
            playerNumberString="two"
            score={score?.player2}
          />
        </div>
      </div>
    </div>
  )
}

export default Page
