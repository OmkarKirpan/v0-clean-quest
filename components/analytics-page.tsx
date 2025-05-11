"use client"

import { TaskCompletionChart } from "./analytics/task-completion-chart"
import { TimeTrackingStats } from "./analytics/time-tracking-stats"
import { ActivityCalendar } from "./analytics/activity-calendar"
import { MostProductiveTimes } from "./analytics/most-productive-times"
import { DataManagement } from "./data-management"
import { AudioTest } from "./audio-test"

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <TimeTrackingStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskCompletionChart />
        <MostProductiveTimes />
      </div>

      <ActivityCalendar />

      <DataManagement />

      <AudioTest />
    </div>
  )
}
