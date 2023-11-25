/* eslint-disable @next/next/no-img-element */
"use client"

import { type } from "os"
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

  const [restartSignal, setRestartSignal] = useState(false)

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

  const { mutateAsync: saveWinner } = useMutation({
    mutationKey: ["checkWinner"],
    mutationFn: (props: any) => checkWinner(props?.winner, props?.gameId),
  })

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
    if (!params || boardState.length > 0) return

    setCurrentPlayer(parseInt(localStorage.getItem("player") || "1"));

    const createPlayerAsync = async () => {
      if (!localStorage.getItem("player")) {
        await createPlayer2({ player: "player 2", gameId: params?.id })
      }

      setOnStart(true)
      setPlayerTurn(1)
      initializeGame()
      setRestartSignal(!restartSignal)
    }

    createPlayerAsync()
  }, [params, currentPlayer, boardState, onStart, restartSignal, createPlayer2])

  useEffect(() => {
    let isSubscribed = true // Flag to track mounted state
    const setupSubscription = async () => {
      const unsubscribeFn = await getMoves(params?.id, (res) => {
        if (isSubscribed && boardState && boardState.length > 0) {
          const newBoardState = [...boardState]

          newBoardState[res?.column][res?.row] = {
            player: res?.player === "player 1" ? 1 : 2,
            falling: true,
          }
          setBoardState(newBoardState)

          setTimeout(() => {
            newBoardState[res?.column][res?.row] = {
              player: res?.player === "player 1" ? 1 : 2,
              falling: false,
            }
            setBoardState(newBoardState)
          }, 500)

          setPlayerTurn(res?.player === "player 1" ? 2 : 1)
          setTime(45)
          setRestartSignal(!restartSignal)
        }
      })
      return unsubscribeFn
    }

    setupSubscription().then((unsubscribeFn) => {
      return () => {
        if (unsubscribeFn) {
          unsubscribeFn()
        }
      }
    })
  }, [boardState, params?.id, restartSignal]);

  useEffect(() => {
    let isSubscribed = true
    let unsubscribeFunc: () => void

    // Async function to handle subscription
    const setupSubscription = async () => {
      unsubscribeFunc = await gameStatus(params.id, (action) => {
        if (isSubscribed && action === "start") {
          // Perform the necessary actions when the game starts
          setRestartSignal(false)
          setOnStart(true)
          setPlayerTurn(1)
          setBoardState([])
          initializeGame()
          setPlayerWin(null)
          setWinningPattern([])
          setTime(45)
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
  }, [params.id, playerWin, restartSignal])

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
  }, [playerTurn, score, time, isPaused, onStart])

  const handleColumnHover = (columnIndex: number) => {

    console.log(currentPlayer, 'currentPlayer', playerTurn, 'playerTurn', playerWin, 'playerWin')

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
      }).then(() => {
        const newBoardState = [...boardState]
        newBoardState[column][emptyRow] = { player: playerTurn, falling: true }

        setBoardState(newBoardState)

        setTimeout(() => {
          newBoardState[column][emptyRow] = {
            player: playerTurn,
            falling: false,
          }
          setBoardState(newBoardState)
        }, 500)

        setPlayerTurn(playerTurn === 1 ? 2 : 1)
        return setTime(45)
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
    if (playerWin) return
    const winner = checkForWin()
    if (winner) {
      ; (async () => {
        if (
          winner?.player === 0 ||
          !winner?.player ||
          playerWin ||
          status === "pending"
        )
          return

        setTimeout(() => {
          setWinningPattern(winner.winningCells)
          setPlayerWin(winner.player !== 0 ? winner.player : null)
          winner?.player === 1
            ? setScore({ ...score, player1: score.player1 + 1 })
            : setScore({ ...score, player2: score.player2 + 1 });
        }, 1000)
      })()
    }
  }, [checkForWin, saveWinner, params.id, playerWin, score])

  const restart = () => {
    try {
      setRestartSignal(true)
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
              <div
                key={columnIndex}
                className={`z-10 flex flex-col md:gap-3`}
                onMouseEnter={() => handleColumnHover(columnIndex)}
              >
                {hoveredColumn === columnIndex &&
                  playerTurn === currentPlayer ? (
                  <img
                    src={`/images/marker-${playerTurn === 1 ? "red" : "yellow"
                      }.svg`}
                    alt="marker"
                    className="absolute -top-7 z-10 mx-3 h-6 w-6 md:-top-12 md:mx-5 md:h-10 md:w-10"
                  />
                ) : null}
                {col.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`relative z-10 mt-1 h-12 w-12 border-none ${rowIndex === 0 && "xl:mt-3"
                      } ${columnIndex === 5 || columnIndex === 6
                        ? "md:mx-1 xl:mx-2"
                        : "md:mx-2"
                      } bg-transparent md:mt-0 md:h-[65px] md:w-[65px] xl:h-[95px] xl:w-[95px]`}
                    onClick={() => handleColumnClick(rowIndex, columnIndex)}
                  >
                    {row?.player !== 0 ? (
                      <>
                        <img
                          src={`/images/counter-${row?.player !== 1 ? "yellow" : "red"
                            }-small.svg`}
                          alt="counter"
                          className={`absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 border-none md:h-[70px] md:w-[70px] xl:h-[100px] xl:w-[100px] ${row.falling ? "falling" : ""
                            }`}
                        />
                        {winningPattern?.some(
                          (pattern) =>
                            pattern[0] === columnIndex &&
                            pattern[1] === rowIndex
                        ) ? (
                          <div className="absolute left-1/2 top-1/2 z-20 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-transparent md:h-[30px] md:w-[30px] xl:h-[50px] xl:w-[50px] xl:border-8" />
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ))}
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
