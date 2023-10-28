import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Icons } from './icons'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const GameRulesDialog = (props: Props) => {
  return (
    <Dialog open={props.open} onOpenChange={() => props.setOpen(false)}>
      <DialogContent className='rounded-[2rem] border-2 border-solid border-black bg-white py-10 shadow-custom'>
        <DialogHeader className='relative'>
          <DialogTitle className='text-center text-[60px]'>RULES</DialogTitle>
          <div className='space-y-8'>
            <div className='font-mono'>
              <DialogTitle className='text-background'>OBJECTIVE</DialogTitle>
              <DialogDescription className='mt-5 font-semibold'>
                Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).
              </DialogDescription>
            </div>
            <div className='font-mono'>
              <DialogTitle className='text-background'>HOW TO PLAY</DialogTitle>
              <DialogDescription className='mt-5 font-semibold'>
                <ol className='ml-7 list-decimal space-y-6'>
                  <li>Red goes first in the first game.</li>
                  <li>Players must alternate turns, and only one disc can be dropped in each turn.</li>
                  <li>The game ends when there is a 4-in-a-row or a stalemate.</li>
                  <li>The starter of the previous game goes second on the next game.</li>
                </ol>
              </DialogDescription>
            </div>
          </div>
          <Button
            className='absolute -bottom-20 left-[40%] h-[80px] w-[80px] rounded-full shadow-button'
            onClick={() => props.setOpen(false)}
          >
            <Icons.check className=' text-white' />
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default GameRulesDialog