"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { soundService } from "@/services/sound-service"
import { Volume2 } from "lucide-react"

export function AudioTest() {
  const [testResult, setTestResult] = useState<string | null>(null)

  const testAudio = () => {
    try {
      // Try to play a sound
      soundService.playClick()
      setTestResult("Sound played successfully! If you didn't hear anything, check your volume settings.")
    } catch (e) {
      setTestResult(`Error playing sound: ${e.message}`)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Volume2 className="h-5 w-5 mr-2" />
          Audio Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">If you're experiencing sound issues, click the button below to test audio:</p>
        <Button onClick={testAudio} className="mb-2">
          Test Sound
        </Button>
        {testResult && <div className="mt-2 p-2 bg-gray-100 rounded text-sm">{testResult}</div>}
      </CardContent>
    </Card>
  )
}
