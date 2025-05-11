"use client"

import CleanQuestApp from "../clean-quest-app"
import { AppProvider } from "@/context/app-context"
import { AudioFallback } from "@/components/audio-fallback"

export default function Page() {
  return (
    <AppProvider>
      <AudioFallback />
      <CleanQuestApp />
    </AppProvider>
  )
}
