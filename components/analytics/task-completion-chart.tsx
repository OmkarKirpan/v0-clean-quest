"use client"

import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function TaskCompletionChart() {
  const { state } = useAppContext()
  const { quests } = state

  // Calculate completion percentage for each day
  const dayCompletionData = quests.map((quest, dayIndex) => {
    const totalTasks = quest.tasks.length
    const completedTasks = quest.tasks.filter((task) => task.completed).length
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      day: dayIndex + 1,
      title: quest.title,
      completed: completedTasks,
      total: totalTasks,
      percentage,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Task Completion by Day</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dayCompletionData.map((day) => (
            <div key={day.day} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Day {day.day}</span>
                <span className="text-sm text-gray-500">
                  {day.completed}/{day.total} tasks ({day.percentage}%)
                </span>
              </div>
              <Progress value={day.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
