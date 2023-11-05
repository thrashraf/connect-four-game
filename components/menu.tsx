import React from 'react'
import { AlertDialog, AlertDialogTitle, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { AlertDialogCancel, AlertDialogOverlay } from '@radix-ui/react-alert-dialog'

type Props = {
  isShow: boolean;
  openChange: () => void;
}

const Menu = (props: Props) => {
  return (
    <AlertDialog open={props?.isShow} onOpenChange={props?.openChange}>
      <AlertDialogContent className='rounded-[2rem] border-2 border-solid border-black text-center shadow-custom'>
        <AlertDialogTitle className='text-7xl font-bold text-white'>
          PAUSE
        </AlertDialogTitle>
        <div className='mx-10 my-5 flex flex-col gap-5'>
          <AlertDialogCancel className='w-full text-2xl font-bold shadow-custom'>
            <Button
              variant={"secondary"}
              className="flex w-full justify-start text-2xl font-bold shadow-custom"
              onClick={props?.openChange}
            >
              CONTINUE
            </Button>
          </AlertDialogCancel>
          <Button
            variant={"secondary"}
            className="flex justify-start text-2xl font-bold shadow-custom"
          >
            RESTART
          </Button>
          <Button
            variant={"secondary"}
            className="flex justify-start bg-[#fd6687] text-2xl font-bold text-white shadow-custom"
          >
            QUIT GAME
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Menu