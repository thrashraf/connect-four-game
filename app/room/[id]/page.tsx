import React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import PlayerCard from "@/components/player-card"
import TurnsCard from "@/components/turns-card"

type Props = {}

const Page = (props: Props) => {

  const board = Array.from(Array(7), () => new Array(6).fill(0))

  return (
    <div className="mx-auto mt-10 min-h-max max-w-[500px] px-5 md:max-w-[600px]">
      <div className="flex items-center justify-between">
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
      <div className="relative mx-auto mt-10 flex flex-col items-center justify-between xl:flex-row">
        <div className="flex w-full flex-row items-center justify-between">
          <PlayerCard playerNumber={1} playerNumberString="one" score={0} />
          <PlayerCard playerNumber={2} playerNumberString="two" score={0} />
        </div>
        <div className="relative mt-10 flex h-[350px] w-[350px] md:h-[500px] md:w-[550px]">
          <div className='mx-auto grid grid-cols-7'>
            {board.map((col, index) => (
              <div key={index} className="flex flex-col md:gap-4">
                {col.map((row, index) => (
                  <div key={index} className="mt-1 h-12 w-12 border-none bg-red-500 md:mx-3 md:mt-0 md:h-[65px] md:w-[65px]"></div>
                ))}
              </div>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="board"
            src="/images/board-layer-black-large.svg"
            className="absolute left-1/2 h-[350px]  w-[350px] -translate-x-1/2 md:h-[500px] md:w-[600px]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="board"
            src="/images/board-layer-white-large.svg"
            className="absolute left-1/2 h-[350px] w-[350px] -translate-x-1/2 md:h-[500px] md:w-[600px]"
          />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2">
            <TurnsCard playerTurn={1} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
