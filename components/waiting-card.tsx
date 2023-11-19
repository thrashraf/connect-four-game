import React from 'react'
import { Button } from './ui/button';
import { Icons } from './icons';

type Props = {
  id: string;
}

const WaitingCard = (props: Props) => {
  return (
    <div className='relative flex flex-col items-center gap-1 rounded-2xl border-4 border-black bg-white px-10 py-3 text-center font-bold shadow-custom'>
      <div className='mb-3 flex items-center justify-center'>
        <h1 className='mr-5 text-xl'>{props.id}</h1>
        <Button
          variant="link"
          className='m-0 p-0'
          onClick={() => {
            navigator.clipboard.writeText(props.id)
            alert('Copied to clipboard')
          }}
        >
          <Icons.copy className='w-10' />
        </Button>
      </div>
    </div>
  )
}

export default WaitingCard