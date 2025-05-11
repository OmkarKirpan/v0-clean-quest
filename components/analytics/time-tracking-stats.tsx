"use client"

import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar, Award, Coffee } from "lucide-react"

export function TimeTrackingStats() {
  const { state } = useAppContext()
  const { analytics, breakHistory } = state

  // Format minutes as hours and minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Calculate total break time
  const totalBreakTimeMinutes = breakHistory.filter((b) => b.completed).reduce((total, b) => total + b.duration / 60, 0)

  // Get today's activity
  const today = new Date().toISOString().split("T")[0]
  const todayActivity = analytics.dailyActivity[today] || {
    tasksCompleted: 0,
    xpEarned: 0,
    activeTimeMinutes: 0,
    breaksCompleted: 0,
  }

  // Calculate streak (consecutive days with activity)
  const calculateStreak = (): number => {
    const dates = Object.keys(analytics.dailyActivity).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (dates.length === 0) return 0

    let streak = 1
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayStr = today.toISOString().split("T")[0]

    // Check if there's activity today
    if (dates[0] !== todayStr) return 0

    // Check consecutive days
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i - 1])
      const prevDate = new Date(dates[i])

      // Calculate difference in days
      const diffTime = currentDate.getTime() - prevDate.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const streak = calculateStreak()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Time & Activity Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-violet-50 rounded-lg">
            <Clock className="h-8 w-8 text-violet-500 mb-2" />
            <span className="text-sm text-gray-500">Total Active Time</span>
            <span className="text-xl font-bold">{formatTime(analytics.totalActiveTimeMinutes)}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
            <Coffee className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-sm text-gray-500">Total Break Time</span>
            <span className="text-xl font-bold">{formatTime(totalBreakTimeMinutes)}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg">
            <Award className="h-8 w-8 text-amber-500 mb-2" />
            <span className="text-sm text-gray-500">Current Streak</span>
            <span className="text-xl font-bold">{streak} days</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
            <Calendar className="h-8 w-8 text-blue-500 mb-2" />
            <span className="text-sm text-gray-500">Today's Activity</span>
            <span className="text-xl font-bold">{formatTime(todayActivity.activeTimeMinutes)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
