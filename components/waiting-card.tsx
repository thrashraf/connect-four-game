import React from 'react'

type Props = {
  id: string;
}

const WaitingCard = (props: Props) => {
  return (
    <div className='relative flex flex-col items-center gap-1 rounded-2xl border-4 border-black bg-white px-10 py-3 text-center font-bold shadow-custom'>
      <div className='mb-3 flex items-center justify-center'>
        <h1 className='mr-5 text-2xl'>{props.id}</h1>
      </div>
    </div>
  )
}

export default WaitingCard