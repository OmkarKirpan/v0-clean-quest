class SoundService {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled = true
  private soundsLoaded = false

  constructor() {
    if (typeof window !== "undefined") {
      this.initSounds()
    }
  }

  private initSounds() {
    try {
      // Create audio elements
      const completeSound = new Audio()
      const rewardSound = new Audio()
      const breakStartSound = new Audio()
      const breakEndSound = new Audio()
      const clickSound = new Audio()

      // Set sources with error handling
      this.setSources(completeSound, "/complete.mp3")
      this.setSources(rewardSound, "/reward.mp3")
      this.setSources(breakStartSound, "/break-start.mp3")
      this.setSources(breakEndSound, "/break-end.mp3")
      this.setSources(clickSound, "/click.mp3")

      // Add to map
      this.sounds.set("complete", completeSound)
      this.sounds.set("reward", rewardSound)
      this.sounds.set("breakStart", breakStartSound)
      this.sounds.set("breakEnd", breakEndSound)
      this.sounds.set("click", clickSound)

      // Preload sounds
      this.sounds.forEach((sound) => {
        sound.load()
      })

      this.soundsLoaded = true
      console.log("Sound service initialized successfully")
    } catch (e) {
      console.error("Error initializing sound service:", e)
      this.soundsLoaded = false
    }
  }

  // Helper to set sources with fallbacks
  private setSources(audioElement: HTMLAudioElement, primarySource: string) {
    try {
      audioElement.src = primarySource

      // Add error handling for loading
      audioElement.addEventListener("error", (e) => {
        console.warn(`Could not load audio from ${primarySource}:`, e)
      })
    } catch (e) {
      console.error(`Error setting source ${primarySource}:`, e)
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  play(soundName: string) {
    if (!this.enabled || !this.soundsLoaded) return

    try {
      const sound = this.sounds.get(soundName)
      if (sound) {
        // Check if the audio element is properly loaded
        if (sound.readyState === 0) {
          console.warn(`Sound ${soundName} not loaded yet, attempting to reload`)
          sound.load()
          return
        }

        // Reset playback position and play
        sound.currentTime = 0

        // Use a promise with catch to handle play errors
        const playPromise = sound.play()
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn(`Error playing sound ${soundName}:`, e)
          })
        }
      } else {
        console.warn(`Sound ${soundName} not found`)
      }
    } catch (e) {
      console.warn(`Error playing sound ${soundName}:`, e)
    }
  }

  playComplete() {
    this.play("complete")
  }

  playReward() {
    this.play("reward")
  }

  playBreakStart() {
    this.play("breakStart")
  }

  playBreakEnd() {
    this.play("breakEnd")
  }

  playClick() {
    this.play("click")
  }

  // Check if sounds are available
  areSoundsAvailable(): boolean {
    return this.soundsLoaded
  }
}

// Singleton instance
export const soundService = new SoundService()
