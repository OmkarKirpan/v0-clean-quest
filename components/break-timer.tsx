"use client"

import { useEffect } from "react"
import { useAppContext } from "@/context/app-context"
import { soundService } from "@/services/sound-service"

export function BreakTimer() {
  const { state, endBreak, dispatch } = useAppContext()
  const { breakActive, breakTimeLeft, currentBreakId } = state

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (breakActive && breakTimeLeft > 0) {
      timer = setInterval(() => {
        if (breakTimeLeft > 1) {
          dispatch({
            type: "UPDATE_BREAK_TIME",
            payload: { timeLeft: breakTimeLeft - 1 },
          })
        } else {
          // Break ended
          soundService.playBreakEnd()
          endBreak(true)
          alert("Break time is over! Ready to continue cleaning?")
        }
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [breakActive, breakTimeLeft, endBreak, dispatch])

  return null // This is a non-visual component
}
