"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { soundService } from "@/services/sound-service"

interface ShareTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
  dayIndex: number
  taskDescription: string
}

export function ShareTaskDialog({ open, onOpenChange, taskId, dayIndex, taskDescription }: ShareTaskDialogProps) {
  const { state, shareTask, getFriends } = useAppContext()
  const friends = getFriends()
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null)

  const handleShareTask = () => {
    if (selectedFriendId) {
      soundService.playReward()
      shareTask(taskId, dayIndex, selectedFriendId)
      onOpenChange(false)
      setSelectedFriendId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Task</DialogTitle>
          <DialogDescription>Share this task with a friend to help you complete it.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 p-3 bg-violet-50 rounded-lg">
            <p className="font-medium text-violet-800">{taskDescription}</p>
          </div>

          {friends.length > 0 ? (
            <RadioGroup value={selectedFriendId || ""} onValueChange={setSelectedFriendId}>
              <div className="space-y-2">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg ${
                      selectedFriendId === friend.id ? "border-violet-500 bg-violet-50" : ""
                    }`}
                  >
                    <RadioGroupItem value={friend.id} id={`friend-${friend.id}`} />
                    <Label htmlFor={`friend-${friend.id}`} className="flex items-center flex-1 cursor-pointer">
                      <Avatar className="h-8 w-8 text-lg mr-2">
                        <AvatarFallback>{friend.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{friend.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>You don't have any friends yet.</p>
              <p className="text-sm">Add friends in your profile to share tasks.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              soundService.playClick()
              onOpenChange(false)
              setSelectedFriendId(null)
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleShareTask} disabled={!selectedFriendId || friends.length === 0}>
            Share Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
