"use client"

import { useState, useEffect } from "react"
import {
  Star,
  Award,
  Home,
  Gift,
  AlertCircle,
  CheckCircle,
  Circle,
  Coffee,
  Calendar,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
  BarChart,
  Clock,
  History,
  PieChart,
  User,
  Share2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAppContext } from "@/context/app-context"
import { soundService } from "@/services/sound-service"
import { BreakTimer } from "@/components/break-timer"
import { TaskTimer } from "@/components/task-timer"
import { AnalyticsPage } from "@/components/analytics-page"
import { UserPage } from "@/components/user-page"
import { ShareTaskDialog } from "@/components/user/share-task-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const CleanQuestApp = () => {
  // UI state (not persisted)
  const [activeTab, setActiveTab] = useState("quests")
  const [showReward, setShowReward] = useState(false)
  const [rewardTitle, setRewardTitle] = useState("")
  const [showBreakDialog, setShowBreakDialog] = useState(false)
  const [breakHistoryView, setBreakHistoryView] = useState<"list" | "stats">("list")
  const [showRewardRedeemed, setShowRewardRedeemed] = useState(false)
  const [redeemedReward, setRedeemedReward] = useState(null)
  const [showTipsDialog, setShowTipsDialog] = useState(false)
  const [currentTip, setCurrentTip] = useState({ title: "", content: "" })
  const [showShareTaskDialog, setShowShareTaskDialog] = useState(false)
  const [taskToShare, setTaskToShare] = useState({ id: "", dayIndex: 0, description: "" })

  // Get app state and actions from context
  const {
    state,
    toggleTask,
    startBreak,
    endBreak,
    redeemReward,
    toggleSound,
    switchDay,
    calculateDayProgress,
    calculateTotalProgress,
    getBreakStats,
    formatTime,
    formatDate,
    getCurrentUser,
    getUnreadNotificationsCount,
  } = useAppContext()

  // Destructure state for easier access
  const {
    currentDay,
    totalXP,
    level,
    dayCompleted,
    quests,
    breakActive,
    breakTimeLeft,
    breakHistory,
    realRewards,
    soundEnabled,
  } = state

  const currentUser = getCurrentUser()
  const unreadNotifications = getUnreadNotificationsCount()

  // Add this function near the top of the component
  const safePlaySound = (soundFunction: () => void) => {
    try {
      if (soundService.areSoundsAvailable()) {
        soundFunction()
      }
    } catch (e) {
      console.warn("Error playing sound:", e)
    }
  }

  // Update sound service when sound preference changes
  useEffect(() => {
    soundService.setEnabled(soundEnabled)
  }, [soundEnabled])

  // Handle reward display when a day is completed
  useEffect(() => {
    const checkForCompletedDay = () => {
      for (let i = 0; i < quests.length; i++) {
        const dayQuests = quests[i]
        const allCompleted = dayQuests.tasks.every((task) => task.completed)

        if (allCompleted && dayCompleted[i] && !showReward) {
          setRewardTitle(dayQuests.reward)
          setShowReward(true)
          safePlaySound(() => soundService.playReward())
          return
        }
      }

      // Check for all days completed
      if (totalXP >= 300 && dayCompleted.every((day) => day) && !showReward) {
        setRewardTitle("Flat Master: Level 1")
        setShowReward(true)
        safePlaySound(() => soundService.playReward())
      }
    }

    checkForCompletedDay()
  }, [quests, dayCompleted, totalXP, showReward])

  // Start break with sound
  const handleStartBreak = () => {
    safePlaySound(() => soundService.playBreakStart())
    startBreak()
    setShowBreakDialog(false)
  }

  // End break early
  const handleEndBreakEarly = () => {
    safePlaySound(() => soundService.playClick())
    endBreak(false)
  }

  // Handle reward redemption
  const handleRedeemReward = (reward) => {
    if (totalXP >= reward.xpRequired && !reward.redeemed) {
      safePlaySound(() => soundService.playReward())
      redeemReward(reward.id)
      setRedeemedReward(reward)
      setShowRewardRedeemed(true)
    }
  }

  // Handle day switching with sound
  const handleSwitchDay = (day) => {
    safePlaySound(() => soundService.playClick())
    switchDay(day)
  }

  // Handle task toggling with sound
  const handleToggleTask = (dayIndex, taskId) => {
    const task = quests[dayIndex].tasks.find((t) => t.id === taskId)
    if (task && !task.completed) {
      safePlaySound(() => soundService.playComplete())
    } else {
      safePlaySound(() => soundService.playClick())
    }
    toggleTask(dayIndex, taskId)
  }

  // Dismiss reward dialog
  const dismissReward = () => {
    safePlaySound(() => soundService.playClick())
    setShowReward(false)
  }

  // Open share task dialog
  const openShareTaskDialog = (taskId: string, dayIndex: number, description: string) => {
    setTaskToShare({ id: taskId, dayIndex, description })
    setShowShareTaskDialog(true)
    safePlaySound(() => soundService.playClick())
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Include the non-visual break timer component */}
      <BreakTimer />

      {/* Include the non-visual task timer component */}
      <TaskTimer />

      {/* Header */}
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Home className="mr-2" />
            <h1 className="text-xl font-bold">CleanQuest: Home Harmony</h1>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                      <Avatar className="h-6 w-6 text-sm mr-1">
                        <AvatarFallback>{currentUser.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{currentUser.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current User</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-300" />
                    <span>{totalXP} XP</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Experience Points</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                    <Award className="h-4 w-4 mr-1 text-yellow-300" />
                    <span>Level {level}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your Current Level</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {breakActive && (
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                <Timer className="h-4 w-4 mr-1 text-yellow-300 animate-pulse" />
                <span>{formatTime(breakTimeLeft)}</span>
              </div>
            )}

            <button
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                toggleSound()
              }}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
              aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className="bg-white shadow-md p-4 mb-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Mission Progress</h2>
            <Badge variant="outline" className="bg-violet-50">
              {calculateTotalProgress()}% Complete
            </Badge>
          </div>
          <Progress value={calculateTotalProgress()} className="h-2" />
        </div>
      </div>

      {/* Main Tabs */}
      <div className="container mx-auto px-4 mb-4">
        <Tabs defaultValue="quests" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="quests"
              className="flex items-center justify-center gap-1"
              onClick={() => safePlaySound(() => soundService.playClick())}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Quests</span>
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex items-center justify-center gap-1"
              onClick={() => safePlaySound(() => soundService.playClick())}
            >
              <Trophy className="h-4 w-4" />
              <span>Rewards</span>
            </TabsTrigger>
            <TabsTrigger
              value="break"
              className="flex items-center justify-center gap-1"
              onClick={() => safePlaySound(() => soundService.playClick())}
            >
              <Coffee className="h-4 w-4" />
              <span>Break</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center justify-center gap-1"
              onClick={() => safePlaySound(() => soundService.playClick())}
            >
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center justify-center gap-1 relative"
              onClick={() => safePlaySound(() => soundService.playClick())}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="mt-4">
            {/* Day Selection Tabs */}
            <div className="mb-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleSwitchDay(day)}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-t-lg font-medium transition-all",
                      currentDay === day
                        ? "bg-white shadow-md text-violet-600 border-t-2 border-violet-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Day {day}
                      {dayCompleted[day - 1] && <CheckCircle className="h-4 w-4 ml-1 text-green-500" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Day Content */}
            <Card>
              <CardContent className="p-4">
                {quests.map(
                  (quest, index) =>
                    quest.day === currentDay && (
                      <div key={index}>
                        <div className="border-b pb-3 mb-4">
                          <h2 className="text-xl font-bold text-violet-600">{quest.title}</h2>
                          <div className="flex items-center text-gray-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="font-medium">Operation: {quest.operation}</span>
                          </div>

                          {/* Day Progress */}
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress:</span>
                              <span>{calculateDayProgress(index)}%</span>
                            </div>
                            <Progress value={calculateDayProgress(index)} className="h-2" />
                          </div>
                        </div>

                        {/* Tasks */}
                        <ul className="space-y-3 mb-4">
                          {quest.tasks.map((task) => (
                            <li
                              key={task.id}
                              className={cn(
                                "flex items-center p-3 rounded-lg cursor-pointer border transition-all",
                                task.completed ? "bg-green-50 border-green-200" : "hover:bg-gray-50 border-gray-200",
                              )}
                            >
                              <div className="mr-3" onClick={() => handleToggleTask(index, task.id)}>
                                {task.completed ? (
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                ) : (
                                  <Circle className="h-6 w-6 text-gray-300" />
                                )}
                              </div>
                              <div className="flex-grow" onClick={() => handleToggleTask(index, task.id)}>
                                <span className={task.completed ? "line-through text-gray-500" : ""}>
                                  {task.description}
                                </span>
                                {task.shared && (
                                  <div className="flex items-center mt-1 text-xs text-violet-600">
                                    <Share2 className="h-3 w-3 mr-1" />
                                    {task.assignedTo === state.currentUserId
                                      ? "Shared with you"
                                      : "Shared with a friend"}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => {
                                          safePlaySound(() => soundService.playClick())
                                          setCurrentTip({
                                            title: task.description,
                                            content: task.tip,
                                          })
                                          setShowTipsDialog(true)
                                        }}
                                      >
                                        <AlertCircle className="h-4 w-4 text-violet-500" />
                                        <span className="sr-only">Cleaning Tip</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left" className="max-w-xs">
                                      <p className="font-medium text-sm">Cleaning Tip:</p>
                                      <p className="text-xs">{task.tip}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {/* Share Task Button */}
                                {!task.shared && !task.completed && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 rounded-full"
                                          onClick={() => openShareTaskDialog(task.id, index, task.description)}
                                        >
                                          <Share2 className="h-4 w-4 text-violet-500" />
                                          <span className="sr-only">Share Task</span>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="left">
                                        <p>Share this task with a friend</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}

                                <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                                  {task.xp} XP
                                </Badge>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {/* Reward Info */}
                        <Card className="bg-amber-50 border-amber-200">
                          <CardContent className="p-3 flex items-center">
                            <Gift className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                            <div>
                              <span className="text-sm text-amber-700">Complete all tasks to earn:</span>
                              <div className="font-semibold text-amber-900">
                                "{quest.reward}" Title + {quest.totalXP} XP
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ),
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                  Real World Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {realRewards.map((reward) => (
                    <Card
                      key={reward.id}
                      className={cn(
                        "border transition-all",
                        reward.redeemed ? "bg-gray-100" : totalXP >= reward.xpRequired ? "border-green-300" : "",
                      )}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="text-3xl mr-3">{reward.icon}</div>
                          <div>
                            <h3 className="font-medium">{reward.name}</h3>
                            <p className="text-sm text-gray-500">{reward.xpRequired} XP required</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRedeemReward(reward)}
                          disabled={totalXP < reward.xpRequired || reward.redeemed}
                          variant={reward.redeemed ? "outline" : "default"}
                          className={reward.redeemed ? "cursor-not-allowed" : ""}
                        >
                          {reward.redeemed ? "Redeemed" : "Redeem"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 bg-violet-50 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-2 text-violet-500" />
                    Your Achievements
                  </h3>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {dayCompleted[0] && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 border-green-200 text-green-700 flex items-center justify-center py-2"
                      >
                        <Award className="h-4 w-4 mr-1" />
                        Surface Sweeper
                      </Badge>
                    )}
                    {dayCompleted[1] && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 border-green-200 text-green-700 flex items-center justify-center py-2"
                      >
                        <Award className="h-4 w-4 mr-1" />
                        Sanitation Sorcerer
                      </Badge>
                    )}
                    {dayCompleted[2] && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 border-green-200 text-green-700 flex items-center justify-center py-2"
                      >
                        <Award className="h-4 w-4 mr-1" />
                        Kitchen Commander
                      </Badge>
                    )}
                    {dayCompleted.every((day) => day) && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 border-amber-200 text-amber-700 flex items-center justify-center py-2"
                      >
                        <Trophy className="h-4 w-4 mr-1" />
                        Flat Master
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-violet-500" />
                        Cleaning Tips Collection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Unlock cleaning tips as you complete tasks. View your collected wisdom here:
                      </p>
                      <div className="space-y-2">
                        <Accordion type="single" collapsible className="w-full">
                          {quests.map((quest, questIndex) => (
                            <AccordionItem key={questIndex} value={`day-${quest.day}`}>
                              <AccordionTrigger className="text-sm font-medium">
                                Day {quest.day}: {quest.title}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 pl-2">
                                  {quest.tasks.map((task, taskIndex) => (
                                    <div key={taskIndex} className="border-l-2 border-violet-200 pl-3 py-1">
                                      <p className="text-sm font-medium">{task.description}</p>
                                      <p className="text-xs text-gray-600 mt-1">{task.tip}</p>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="break" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coffee className="h-5 w-5 mr-2 text-amber-500" />
                  Break Time
                </CardTitle>
                {!breakActive && (
                  <div className="flex justify-end">
                    <div className="flex space-x-2">
                      <Button
                        variant={breakHistoryView === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          safePlaySound(() => soundService.playClick())
                          setBreakHistoryView("list")
                        }}
                      >
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>
                      <Button
                        variant={breakHistoryView === "stats" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          safePlaySound(() => soundService.playClick())
                          setBreakHistoryView("stats")
                        }}
                      >
                        <BarChart className="h-4 w-4 mr-1" />
                        Stats
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="text-center">
                {breakActive ? (
                  <div className="space-y-6">
                    <div className="text-5xl font-bold text-violet-600">{formatTime(breakTimeLeft)}</div>
                    <Progress value={(breakTimeLeft / 300) * 100} className="h-2" />
                    <p className="text-gray-600">Take a moment to relax. Your break will end soon.</p>
                    <Button variant="outline" onClick={handleEndBreakEarly}>
                      End Break Early
                    </Button>
                  </div>
                ) : breakHistoryView === "list" ? (
                  <div>
                    <div className="space-y-6 py-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Need a break from cleaning?</h3>
                        <Button onClick={() => setShowBreakDialog(true)}>Start 5-Minute Break</Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-left mb-3">Break History</h3>
                      {breakHistory.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                          {breakHistory.map((breakRecord) => (
                            <Card
                              key={breakRecord.id}
                              className={cn("border", breakRecord.completed ? "border-green-200" : "border-amber-200")}
                            >
                              <CardContent className="p-3 flex justify-between items-center">
                                <div className="text-left">
                                  <p className="text-sm font-medium">{formatDate(breakRecord.startTime)}</p>
                                  <p className="text-xs text-gray-500">
                                    Duration: {Math.floor(breakRecord.duration / 60)} minutes
                                  </p>
                                </div>
                                <Badge variant={breakRecord.completed ? "success" : "secondary"}>
                                  {breakRecord.completed ? "Completed" : "Ended Early"}
                                </Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
                          <p>No break history yet</p>
                          <p className="text-sm">Take your first break to start tracking</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-6 py-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Need a break from cleaning?</h3>
                        <Button onClick={() => setShowBreakDialog(true)}>Start 5-Minute Break</Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-left mb-3">Break Statistics</h3>

                      {breakHistory.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-4xl font-bold text-violet-600">{getBreakStats().total}</p>
                              <p className="text-sm text-gray-600">Total Breaks</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-4xl font-bold text-green-600">{getBreakStats().completed}</p>
                              <p className="text-sm text-gray-600">Completed Breaks</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-4xl font-bold text-amber-600">{getBreakStats().thisWeek}</p>
                              <p className="text-sm text-gray-600">Breaks This Week</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-4xl font-bold text-blue-600">
                                {getBreakStats().avgDuration > 0 ? formatTime(getBreakStats().avgDuration) : "0:00"}
                              </p>
                              <p className="text-sm text-gray-600">Avg. Duration</p>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BarChart className="h-12 w-12 mx-auto mb-2 opacity-30" />
                          <p>No statistics available</p>
                          <p className="text-sm">Take your first break to generate stats</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <AnalyticsPage />
          </TabsContent>

          <TabsContent value="profile" className="mt-4">
            <UserPage />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto">
        <nav className="bg-white shadow-lg border-t">
          <div className="container mx-auto flex justify-around p-3">
            <button
              className={`flex flex-col items-center ${activeTab === "quests" ? "text-violet-600" : "text-gray-500"}`}
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                setActiveTab("quests")
              }}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Quests</span>
            </button>
            <button
              className={`flex flex-col items-center ${activeTab === "rewards" ? "text-violet-600" : "text-gray-500"}`}
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                setActiveTab("rewards")
              }}
            >
              <Award className="h-6 w-6" />
              <span className="text-xs mt-1">Rewards</span>
            </button>
            <button
              className={`flex flex-col items-center ${activeTab === "break" ? "text-violet-600" : "text-gray-500"}`}
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                setActiveTab("break")
              }}
            >
              <Coffee className="h-6 w-6" />
              <span className="text-xs mt-1">Break</span>
            </button>
            <button
              className={`flex flex-col items-center ${activeTab === "analytics" ? "text-violet-600" : "text-gray-500"}`}
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                setActiveTab("analytics")
              }}
            >
              <PieChart className="h-6 w-6" />
              <span className="text-xs mt-1">Analytics</span>
            </button>
            <button
              className={`flex flex-col items-center relative ${
                activeTab === "profile" ? "text-violet-600" : "text-gray-500"
              }`}
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                setActiveTab("profile")
              }}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {unreadNotifications}
                </Badge>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Reward Popup */}
      <Dialog open={showReward} onOpenChange={setShowReward}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Achievement Unlocked!</DialogTitle>
            <DialogDescription className="text-center">You've earned the title:</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Award className="h-12 w-12 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-violet-600 mb-2">"{rewardTitle}"</div>
            <div className="flex items-center justify-center mt-2 bg-violet-100 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 mr-1 text-violet-600" />
              <span className="text-violet-700">+{currentDay === 3 ? 100 : currentDay === 2 ? 100 : 100} XP</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={dismissReward} className="w-full">
              Awesome!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Break Confirmation Dialog */}
      <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start a Break?</DialogTitle>
            <DialogDescription>
              Taking regular breaks improves productivity. Your 5-minute break timer will start immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                setShowBreakDialog(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleStartBreak}>Start Break</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reward Redeemed Dialog */}
      <Dialog open={showRewardRedeemed} onOpenChange={setShowRewardRedeemed}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Reward Redeemed!</DialogTitle>
          </DialogHeader>
          {redeemedReward && (
            <div className="flex flex-col items-center py-6">
              <div className="text-5xl mb-4">{redeemedReward.icon}</div>
              <div className="text-xl font-bold mb-2">{redeemedReward.name}</div>
              <p className="text-center text-gray-600 mb-4">
                Your reward has been redeemed. Check your email for the voucher code or present this screen to claim
                your reward.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg w-full text-center">
                <p className="text-sm text-gray-500">Redemption Code</p>
                <p className="font-mono font-bold text-lg">
                  CLEAN-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                setShowRewardRedeemed(false)
              }}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cleaning Tips Dialog */}
      <Dialog open={showTipsDialog} onOpenChange={setShowTipsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-violet-500" />
              Cleaning Tip
            </DialogTitle>
            <DialogDescription>{currentTip.title}</DialogDescription>
          </DialogHeader>
          <div className="bg-violet-50 p-4 rounded-lg my-2">
            <p>{currentTip.content}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                safePlaySound(() => soundService.playClick())
                setShowTipsDialog(false)
              }}
              className="w-full"
            >
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Task Dialog */}
      <ShareTaskDialog
        open={showShareTaskDialog}
        onOpenChange={setShowShareTaskDialog}
        taskId={taskToShare.id}
        dayIndex={taskToShare.dayIndex}
        taskDescription={taskToShare.description}
      />
    </div>
  )
}

export default CleanQuestApp
