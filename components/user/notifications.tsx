"use client"

import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Check, Share2, Trophy, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { soundService } from "@/services/sound-service"

export function Notifications() {
  const { state, markNotificationRead, updateSharedTask } = useAppContext()
  const { notifications, users, currentUserId } = state

  // Get notifications for current user
  const userNotifications = notifications
    .filter((notification) => notification.toUserId === currentUserId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Get user by ID
  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Handle notification click
  const handleNotificationClick = (notificationId: string) => {
    soundService.playClick()
    markNotificationRead(notificationId)
  }

  // Handle shared task response
  const handleSharedTaskResponse = (sharedTaskId: string, status: "accepted" | "rejected") => {
    soundService.playClick()
    updateSharedTask(sharedTaskId, status)
  }

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_shared":
        return <Share2 className="h-5 w-5 text-blue-500" />
      case "task_completed":
        return <Trophy className="h-5 w-5 text-green-500" />
      case "friend_request":
        return <UserPlus className="h-5 w-5 text-violet-500" />
      case "friend_accepted":
        return <UserPlus className="h-5 w-5 text-violet-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // Get notification content
  const getNotificationContent = (notification) => {
    const fromUser = getUserById(notification.fromUserId)
    const fromUserName = fromUser ? fromUser.name : "Someone"

    switch (notification.type) {
      case "task_shared": {
        const sharedTask = state.sharedTasks.find((task) => task.relatedId === notification.relatedId)
        const taskInfo = sharedTask
          ? state.quests[sharedTask.dayIndex]?.tasks.find((t) => t.id === sharedTask.taskId)
          : null

        return (
          <div>
            <p>
              <span className="font-medium">{fromUserName}</span> shared a task with you:
              {taskInfo && <span className="font-medium"> "{taskInfo.description}"</span>}
            </p>
            {sharedTask && sharedTask.status === "pending" && (
              <div className="flex space-x-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500 text-green-700 hover:bg-green-50"
                  onClick={() => handleSharedTaskResponse(sharedTask.id, "accepted")}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-700 hover:bg-red-50"
                  onClick={() => handleSharedTaskResponse(sharedTask.id, "rejected")}
                >
                  Decline
                </Button>
              </div>
            )}
          </div>
        )
      }
      case "task_completed": {
        const taskInfo = state.quests.flatMap((quest) => quest.tasks).find((task) => task.id === notification.relatedId)

        return (
          <p>
            <span className="font-medium">{fromUserName}</span> completed a task you shared:
            {taskInfo && <span className="font-medium"> "{taskInfo.description}"</span>}
          </p>
        )
      }
      case "friend_request":
        return (
          <p>
            <span className="font-medium">{fromUserName}</span> sent you a friend request
          </p>
        )
      case "friend_accepted":
        return (
          <p>
            <span className="font-medium">{fromUserName}</span> accepted your friend request
          </p>
        )
      default:
        return <p>New notification</p>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userNotifications.length > 0 ? (
          <div className="space-y-4">
            {userNotifications.map((notification) => {
              const fromUser = getUserById(notification.fromUserId)
              return (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-lg ${notification.read ? "bg-gray-50" : "bg-blue-50 border-blue-200"}`}
                  onClick={() => !notification.read && handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-grow">
                      <div className="flex items-center mb-1">
                        {fromUser && (
                          <Avatar className="h-6 w-6 text-sm mr-2">
                            <AvatarFallback>{fromUser.avatar}</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs text-gray-500">{formatNotificationTime(notification.createdAt)}</span>
                        {!notification.read && (
                          <Badge className="ml-2 bg-blue-500" variant="default">
                            New
                          </Badge>
                        )}
                      </div>
                      {getNotificationContent(notification)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
