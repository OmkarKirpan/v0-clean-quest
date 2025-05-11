"use client"

import { useEffect } from "react"
import { useAppContext } from "@/context/app-context"
import { ActionType } from "@/types"

export function TaskTimer() {
  const { state, dispatch } = useAppContext()

  // Track active time spent on tasks
  useEffect(() => {
    // Only track time if not on break
    if (state.breakActive) return

    // Create a timestamp for this session
    const timestamp = new Date().toISOString()

    // Update time tracking every minute
    const interval = setInterval(() => {
      dispatch({
        type: ActionType.UPDATE_ACTIVE_TIME,
        payload: { timestamp },
      })
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [state.breakActive, dispatch])

  return null // This is a non-visual component
}
