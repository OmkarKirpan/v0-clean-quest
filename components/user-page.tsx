"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "./user/user-profile"
import { SharedTasks } from "./user/shared-tasks"
import { Notifications } from "./user/notifications"
import { soundService } from "@/services/sound-service"
import { useAppContext } from "@/context/app-context"
import { Bell, Share2, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function UserPage() {
  const { getUnreadNotificationsCount } = useAppContext()
  const unreadCount = getUnreadNotificationsCount()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="profile"
            className="flex items-center justify-center gap-1"
            onClick={() => soundService.playClick()}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="shared"
            className="flex items-center justify-center gap-1"
            onClick={() => soundService.playClick()}
          >
            <Share2 className="h-4 w-4" />
            <span>Shared Tasks</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center justify-center gap-1 relative"
            onClick={() => soundService.playClick()}
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <UserProfile />
        </TabsContent>

        <TabsContent value="shared" className="mt-4">
          <SharedTasks />
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Notifications />
        </TabsContent>
      </Tabs>
    </div>
  )
}
