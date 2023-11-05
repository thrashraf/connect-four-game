import React from 'react'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'

type Props = {
  playerTurn: 1 | 2;
  time: number;
}

const TurnsCard = (props: Props) => {
  return (
    <div className='relative'>
      <>
        <Image
          alt={`player ${props.playerTurn}`}
          src={`/images/turn-background-${props.playerTurn === 1 ? 'red' : 'yellow'}.svg`}
          width={200}
          height={200}
        />
        <div className='absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2'>
          <h1 className='font-bold'>PLAYER {props.playerTurn}</h1>
          <h1 className='mx-7 text-[2rem] font-bold'>{props?.time}</h1>
        </div>
      </>
    </div>
  )
}

export default TurnsCard