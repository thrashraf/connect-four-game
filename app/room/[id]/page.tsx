import React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="mx-7 mt-10">
      <div className="flex items-center justify-between">
        <Button
          variant={"menu"}
          size={"sm"}
          className="h-6 w-28 rounded-3xl py-5 font-bold text-white"
        >
          MENU
        </Button>
        <Image
          src={"/images/logo.svg"}
          alt="arrow"
          width={60}
          height={60}
          className="ml-2"
        />
        <Button
          variant={"menu"}
          size={"sm"}
          className="h-6 w-28 rounded-3xl py-5 font-bold text-white"
        >
          RESTART
        </Button>
      </div>
      <div>

      </div>
    </div>
  )
}

export default Page
