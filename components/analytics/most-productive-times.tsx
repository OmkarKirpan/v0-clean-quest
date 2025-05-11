"use client"

import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MostProductiveTimes() {
  const { state } = useAppContext()
  const { analytics } = state

  // Analyze task completions by time of day
  const analyzeCompletionTimes = () => {
    const timeSlots = [
      { name: "Morning (6am-12pm)", count: 0, slot: 0 },
      { name: "Afternoon (12pm-6pm)", count: 0, slot: 1 },
      { name: "Evening (6pm-12am)", count: 0, slot: 2 },
      { name: "Night (12am-6am)", count: 0, slot: 3 },
    ]

    analytics.taskCompletions.forEach((completion) => {
      const date = new Date(completion.completedAt)
      const hour = date.getHours()

      if (hour >= 6 && hour < 12) {
        timeSlots[0].count++
      } else if (hour >= 12 && hour < 18) {
        timeSlots[1].count++
      } else if (hour >= 18 && hour < 24) {
        timeSlots[2].count++
      } else {
        timeSlots[3].count++
      }
    })

    // Calculate percentages
    const total = timeSlots.reduce((sum, slot) => sum + slot.count, 0)
    if (total > 0) {
      timeSlots.forEach((slot) => {
        slot.percentage = Math.round((slot.count / total) * 100)
      })
    } else {
      timeSlots.forEach((slot) => {
        slot.percentage = 0
      })
    }

    // Sort by count (most productive first)
    return timeSlots.sort((a, b) => b.count - a.count)
  }

  const productiveTimes = analyzeCompletionTimes()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Most Productive Times</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productiveTimes.map((timeSlot) => (
            <div key={timeSlot.slot} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{timeSlot.name}</span>
                <span className="text-sm text-gray-500">
                  {timeSlot.count} tasks ({timeSlot.percentage || 0}%)
                </span>
              </div>
              <Progress value={timeSlot.percentage || 0} className="h-2" />
            </div>
          ))}

          {analytics.taskCompletions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>No task completion data yet</p>
              <p className="text-sm">Complete tasks to see your productive times</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
