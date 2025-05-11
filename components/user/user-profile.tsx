"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, UserPlus, Users } from "lucide-react"
import { soundService } from "@/services/sound-service"

export function UserProfile() {
  const { state, getCurrentUser, getFriends, switchUser, addUser, addFriend } = useAppContext()
  const { users } = state
  const currentUser = getCurrentUser()
  const friends = getFriends()

  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("👤")

  const avatarOptions = ["👤", "👩", "👨", "👧", "👦", "👵", "👴", "🧑", "👱", "👸", "🤴", "🧙", "🦸", "🦹"]

  const handleAddUser = () => {
    if (newUserName.trim()) {
      soundService.playClick()
      addUser(newUserName.trim(), selectedAvatar)
      setNewUserName("")
      setSelectedAvatar("👤")
      setShowAddUser(false)
    }
  }

  const handleSwitchUser = (userId: string) => {
    soundService.playClick()
    switchUser(userId)
  }

  return (
    <div className="space-y-6">
      {/* Current User Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Profile</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                soundService.playClick()
                setShowAddUser(!showAddUser)
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 text-3xl">
                <AvatarFallback>{currentUser.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <p className="text-sm text-gray-500">Joined {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 mr-1 text-violet-500" />
                  <span className="text-sm">{friends.length} friends</span>
                </div>
              </div>
            </div>
          )}

          {/* Add User Form */}
          {showAddUser && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Choose Avatar</label>
                  <div className="grid grid-cols-7 gap-2">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-xl ${
                          selectedAvatar === avatar ? "bg-violet-100 border-2 border-violet-500" : "bg-gray-100"
                        }`}
                        onClick={() => setSelectedAvatar(avatar)}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      soundService.playClick()
                      setShowAddUser(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>Add User</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Switch User Card */}
      {users.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Switch User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users
                .filter((user) => user.id !== currentUser?.id)
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSwitchUser(user.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 text-xl">
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Switch to {user.name}</span>
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Friends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length > 0 ? (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 text-xl">
                      <AvatarFallback>{friend.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{friend.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Friend
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No friends yet</p>
              <p className="text-sm">Add other users as friends to share tasks</p>
            </div>
          )}

          {users.length > 1 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Add Friends</h3>
              <div className="space-y-2">
                {users
                  .filter((user) => user.id !== currentUser?.id && !currentUser?.friends.includes(user.id))
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 text-xl">
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          soundService.playClick()
                          addFriend(user.id)
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Friend
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
