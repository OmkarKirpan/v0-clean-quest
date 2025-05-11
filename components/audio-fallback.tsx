"use client"

import { useEffect } from "react"
import { soundService } from "@/services/sound-service"

export function AudioFallback() {
  useEffect(() => {
    // Check if audio is available
    if (!soundService.areSoundsAvailable()) {
      console.log("Creating fallback audio elements")

      // Create audio elements directly in the DOM
      const createAudio = (id: string, src: string) => {
        const existingAudio = document.getElementById(id)
        if (!existingAudio) {
          const audio = document.createElement("audio")
          audio.id = id
          audio.src = src
          audio.preload = "auto"
          document.body.appendChild(audio)
        }
      }

      // Create all required audio elements
      createAudio("complete-sound", "/complete.mp3")
      createAudio("reward-sound", "/reward.mp3")
      createAudio("break-start-sound", "/break-start.mp3")
      createAudio("break-end-sound", "/break-end.mp3")
      createAudio("click-sound", "/click.mp3")
    }
  }, [])

  return null
}
