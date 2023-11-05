'use client'

import React from 'react'
import pb from '@/lib/pb'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import Image from 'next/image'

const Page = () => {

  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md rounded-[2rem] border-4 border-none border-black bg-transparent p-5 md:border-solid md:shadow-custom">
        <CardContent>
          <Image
            src={"/images/logo.svg"}
            alt="logo"
            width={70}
            height={70}
            className="m-auto mt-10"
          />
          <div className="mt-20 flex flex-col space-y-5">
            <input
              placeholder='Enter room code'
              className='rounded-2xl border-4 border-black bg-white px-8 py-6 font-mono text-xl font-bold'
            />
            <Button
              className="flex justify-between text-2xl font-bold shadow-custom"
            >
              <Link href="/room" className="flex w-full justify-between">
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default Page