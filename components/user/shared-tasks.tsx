"use client"

import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, Circle, Share2, UserCheck } from "lucide-react"
import { soundService } from "@/services/sound-service"
import { cn } from "@/lib/utils"

export function SharedTasks() {
  const { state, toggleTask } = useAppContext()
  const { sharedTasks, users, quests, currentUserId } = state

  // Get tasks shared with current user
  const tasksSharedWithMe = sharedTasks.filter((task) => task.toUserId === currentUserId)

  // Get tasks shared by current user
  const tasksSharedByMe = sharedTasks.filter((task) => task.fromUserId === currentUserId)

  // Get user by ID
  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  // Get task details
  const getTaskDetails = (taskId: string, dayIndex: number) => {
    return quests[dayIndex]?.tasks.find((task) => task.id === taskId)
  }

  // Handle task toggle
  const handleToggleTask = (dayIndex: number, taskId: string) => {
    soundService.playClick()
    toggleTask(dayIndex, taskId)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Tasks shared with me */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Tasks Shared With Me
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksSharedWithMe.length > 0 ? (
            <div className="space-y-3">
              {tasksSharedWithMe.map((sharedTask) => {
                const fromUser = getUserById(sharedTask.fromUserId)
                const taskDetails = getTaskDetails(sharedTask.taskId, sharedTask.dayIndex)

                if (!taskDetails) return null

                return (
                  <div
                    key={sharedTask.id}
                    className={cn(
                      "p-3 border rounded-lg",
                      taskDetails.completed ? "bg-green-50 border-green-200" : "hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div onClick={() => handleToggleTask(sharedTask.dayIndex, sharedTask.taskId)}>
                          {taskDetails.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className={taskDetails.completed ? "line-through text-gray-500" : ""}>
                            {taskDetails.description}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>Shared by: </span>
                            {fromUser && (
                              <div className="flex items-center ml-1">
                                <Avatar className="h-4 w-4 text-xs mr-1">
                                  <AvatarFallback>{fromUser.avatar}</AvatarFallback>
                                </Avatar>
                                <span>{fromUser.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {taskDetails.xp} XP
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Share2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No tasks shared with you</p>
              <p className="text-sm">When someone shares a task, it will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks shared by me */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Tasks I've Shared
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksSharedByMe.length > 0 ? (
            <div className="space-y-3">
              {tasksSharedByMe.map((sharedTask) => {
                const toUser = getUserById(sharedTask.toUserId)
                const taskDetails = getTaskDetails(sharedTask.taskId, sharedTask.dayIndex)

                if (!taskDetails) return null

                return (
                  <div
                    key={sharedTask.id}
                    className={cn(
                      "p-3 border rounded-lg",
                      sharedTask.status === "completed" ? "bg-green-50 border-green-200" : "hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          {sharedTask.status === "completed" ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className={sharedTask.status === "completed" ? "line-through text-gray-500" : ""}>
                            {taskDetails.description}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>Shared with: </span>
                            {toUser && (
                              <div className="flex items-center ml-1">
                                <Avatar className="h-4 w-4 text-xs mr-1">
                                  <AvatarFallback>{toUser.avatar}</AvatarFallback>
                                </Avatar>
                                <span>{toUser.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "ml-2",
                          sharedTask.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : sharedTask.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : sharedTask.status === "rejected"
                                ? "bg-red-50 text-red-700"
                                : "",
                        )}
                      >
                        {sharedTask.status.charAt(0).toUpperCase() + sharedTask.status.slice(1)}
                      </Badge>
                    </div>
                    {sharedTask.status === "completed" && sharedTask.completedAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        Completed on: {formatDate(sharedTask.completedAt)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <UserCheck className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>You haven't shared any tasks</p>
              <p className="text-sm">Share tasks with friends to collaborate on cleaning</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
