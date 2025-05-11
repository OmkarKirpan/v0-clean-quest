"use client"

import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function ActivityCalendar() {
  const { state } = useAppContext()
  const { analytics } = state

  // Generate calendar data for the last 4 weeks
  const generateCalendarData = () => {
    const today = new Date()
    const calendar = []

    // Go back 4 weeks (28 days)
    for (let i = 27; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      const dateStr = date.toISOString().split("T")[0]
      const activity = analytics.dailyActivity[dateStr]

      let intensity = 0
      if (activity) {
        // Calculate intensity based on tasks completed (0-4)
        intensity = Math.min(4, Math.floor(activity.tasksCompleted / 2))
      }

      calendar.push({
        date: dateStr,
        day: date.getDate(),
        month: date.getMonth(),
        intensity,
        tasksCompleted: activity?.tasksCompleted || 0,
        xpEarned: activity?.xpEarned || 0,
        activeTimeMinutes: activity?.activeTimeMinutes || 0,
      })
    }

    return calendar
  }

  const calendarData = generateCalendarData()

  // Group by week for display
  const weeks = []
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7))
  }

  // Format minutes as hours and minutes
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex justify-between">
              {week.map((day) => (
                <TooltipProvider key={day.date}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-sm flex items-center justify-center text-xs cursor-pointer",
                          day.intensity === 0 && "bg-gray-100",
                          day.intensity === 1 && "bg-green-100",
                          day.intensity === 2 && "bg-green-200",
                          day.intensity === 3 && "bg-green-300",
                          day.intensity === 4 && "bg-green-400",
                        )}
                      >
                        {day.day}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                        <p className="text-xs">Tasks: {day.tasksCompleted}</p>
                        <p className="text-xs">XP: {day.xpEarned}</p>
                        <p className="text-xs">Active: {formatTime(day.activeTimeMinutes)}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Less</span>
            <div className="w-4 h-4 bg-gray-100 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-100 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-200 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-300 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
            <span className="text-xs text-gray-500">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
