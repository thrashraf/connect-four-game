'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { isPlayer2Created } from '@/lib/api/gameLogic'
import WaitingCard from '@/components/waiting-card'
import { Icons } from '@/components/icons'
import { useToast } from "@/components/ui/use-toast"
import { WhatsappShareButton } from "react-share";


const Page = () => {

  const router = useRouter();
  const [id, setId] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setId(localStorage?.getItem('id') ?? '');

    if (!id) return;

    const fetchData = async () => {
      try {
        await isPlayer2Created(id)
          .then(player2Created => {
            if (player2Created) {
              localStorage.removeItem('id');
              router.push(`/room/${id}`);
            }
          })
          .catch(error => {
            console.error(error);
          });
      } catch (error) {
        console.error('Error checking if Player 2 is created:', error);
      }
    };

    fetchData();
  }, [id, router]);

  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md rounded-[2rem] border-4 border-none border-black bg-transparent p-5 text-center md:border-solid md:shadow-custom">
        <CardContent>
          <Image
            src={"/images/logo.svg"}
            alt="logo"
            width={70}
            height={70}
            className="m-auto mt-10"
          />
          <p className='mt-10 text-xl font-semibold text-white'>Ready to play? Share the Room ID with player 2 to start the game!</p>
          <div className="mt-10 flex flex-col space-y-5">
            <WaitingCard id={id} />
            {typeof window !== 'undefined' && window?.location?.origin && (
              <WhatsappShareButton
                url={`${window?.location?.origin}/room/${id}`}
                title="Let's play!"
                className='w-full'
              >
                <Button
                  className="w-full text-2xl font-bold shadow-custom"
                >
                  <span className='mr-5'>COPY ROOM ID</span>
                  <Icons.whatsapp className='w-10' />
                </Button>
              </WhatsappShareButton>
            )}
          </div>

        </CardContent>
      </Card>
    </main>
  )
}

export default Page