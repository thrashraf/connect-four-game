'use client'
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GameRulesDialog from "@/components/game-rules-dialog"

export default function IndexPage() {
  const [openDialog, setOpenDialog] = useState(false)

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
            <Button
              className="flex justify-between text-2xl font-bold shadow-custom"
            >
              <Link href="/room" className="flex w-full justify-between">
                MULTIPLAYER
                <Image
                  src={"/images/player-vs-player.svg"}
                  alt="arrow"
                  width={60}
                  height={60}
                  className="ml-2"
                />
              </Link>
            </Button>
            <Button
              variant={"secondary"}
              className="flex justify-start text-2xl font-bold shadow-custom"
              onClick={() => setOpenDialog(true)}
            >
              GAMES RULES
            </Button>
          </div>
        </CardContent>
      </Card>
      <GameRulesDialog open={openDialog} setOpen={setOpenDialog} />
    </main>
  )
}
