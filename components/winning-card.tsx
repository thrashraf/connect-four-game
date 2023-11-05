import React from 'react'
import { Button } from './ui/button';

type Props = {
  playerWin: 1 | 2;
  playAgain: () => void;
}

const WinningCard = (props: Props) => {
  return (
    <div className='relative flex flex-col items-center gap-1 rounded-2xl border-4 border-black bg-white px-10 py-3 text-center font-bold shadow-custom'>
      <h1 className='text-lg md:text-xl'>PLAYER {props?.playerWin}</h1>
      <h1 className='text-2xl md:text-4xl'>WINS</h1>

      <Button
        variant={"menu"}
        size={"sm"}
        className="mb-2 h-6 w-28 rounded-3xl py-5 font-bold text-white"
        onClick={props?.playAgain}
      >
        RESTART
      </Button>

    </div>
  )
}

export default WinningCard