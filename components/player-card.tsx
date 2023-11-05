import React from 'react'
import { Card, CardContent } from './ui/card';
import Image from 'next/image';

type Props = {
  playerNumber: 1 | 2;
  playerNumberString: 'one' | 'two';
  score: number;
}


const PlayerCard = (props: Props) => {
  return (
    <Card className='h-[110px] w-[150px] rounded-[2rem] border-4 border-solid border-black shadow-custom'>
      <CardContent className={`relative flex h-full w-full flex-col items-center justify-center p-0`}>
        <Image
          alt={`player ${props.playerNumber}`}
          src={`/images/player-${props.playerNumberString}.svg`}
          width={40}
          height={40}
          className={` absolute ${props.playerNumber === 1 ? '-left-5 top-5 ' : ' -right-5 top-5'}`}
        />
        <h1 className='font-bold'>PLAYER {props.playerNumber}</h1>
        <h1 className='mx-7 text-[2rem] font-bold'>{props?.score}</h1>
      </CardContent>
    </Card>
  )
}

export default PlayerCard;