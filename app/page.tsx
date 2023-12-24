"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

import { createGame } from "@/lib/api/gameLogic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GameRulesDialog from "@/components/game-rules-dialog"
import { Icons } from "@/components/icons"

export default function IndexPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()

  const {
    mutateAsync: initializeGame,
    status,
    isPending,
  } = useMutation({
    mutationKey: ["checkWinner"],
    mutationFn: () => createGame(),
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (props) => {
      console.log(props)
      localStorage.setItem("playerId", props?.playerId)
      localStorage.setItem("player", "1")
      localStorage.setItem("id", props?.gamesId)

      if (!props?.gamesId) return

      router.push(`/create-room`)
    },
  })

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
              onClick={() => initializeGame()}
            >
              MULTIPLAYER
              {isPending ? (
                <Icons.spinner className="animate-spin" />
              ) : (
                <Image
                  src={"/images/player-vs-player.svg"}
                  alt="arrow"
                  width={60}
                  height={60}
                  className="ml-2"
                />
              )}
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
