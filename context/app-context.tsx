"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { appReducer } from "./app-reducer"
import { initialState } from "@/data/initial-state"
import { ActionType, type AppAction, type AppState, type BreakRecord, type User } from "@/types"

// Create context
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Existing actions
  toggleTask: (dayIndex: number, taskId: string) => void
  completeDay: (dayIndex: number) => void
  startBreak: () => void
  endBreak: (completed: boolean) => void
  redeemReward: (rewardId: number) => void
  toggleSound: () => void
  switchDay: (day: number) => void
  calculateDayProgress: (dayIndex: number) => number
  calculateTotalProgress: () => number
  getBreakStats: () => { total: number; completed: number; avgDuration: number; thisWeek: number }
  formatTime: (seconds: number) => string
  formatDate: (dateString: string) => string

  // New user-related actions
  addUser: (name: string, avatar: string) => void
  switchUser: (userId: string) => void
  addFriend: (friendId: string) => void
  removeFriend: (friendId: string) => void
  shareTask: (taskId: string, dayIndex: number, toUserId: string) => void
  updateSharedTask: (sharedTaskId: string, status: "accepted" | "rejected" | "completed") => void
  markNotificationRead: (notificationId: string) => void
  getCurrentUser: () => User | undefined
  getFriends: () => User[]
  getUnreadNotificationsCount: () => number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem("cleanQuestState")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: ActionType.INIT_STATE, payload: parsedState })

        // Check for active break
        if (parsedState.breakActive && parsedState.currentBreakId) {
          const activeBreak = parsedState.breakHistory.find((b: BreakRecord) => b.id === parsedState.currentBreakId)
          if (activeBreak) {
            const elapsedTime = Math.floor((Date.now() - new Date(activeBreak.startTime).getTime()) / 1000)

            // If the break should still be active
            if (elapsedTime < activeBreak.duration) {
              dispatch({
                type: ActionType.UPDATE_BREAK_TIME,
                payload: { timeLeft: activeBreak.duration - elapsedTime },
              })
            } else {
              // Break should have ended while app was closed
              dispatch({
                type: ActionType.END_BREAK,
                payload: { completed: true },
              })
            }
          }
        }
      } catch (e) {
        console.error("Error loading state:", e)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cleanQuestState", JSON.stringify(state))
  }, [state])

  // Existing action creators
  const toggleTask = (dayIndex: number, taskId: string) => {
    dispatch({
      type: ActionType.TOGGLE_TASK,
      payload: { dayIndex, taskId },
    })

    // Check if day is completed after toggling task
    const dayQuests = state.quests[dayIndex]
    const allCompleted = dayQuests.tasks.every((task) => (task.id === taskId ? !task.completed : task.completed))

    if (allCompleted && !state.dayCompleted[dayIndex]) {
      completeDay(dayIndex)
    }
  }

  const completeDay = (dayIndex: number) => {
    dispatch({
      type: ActionType.COMPLETE_DAY,
      payload: { dayIndex },
    })
  }

  const startBreak = () => {
    const breakId = Date.now().toString()
    const startTime = new Date().toISOString()

    dispatch({
      type: ActionType.START_BREAK,
      payload: { breakId, startTime },
    })
  }

  const endBreak = (completed: boolean) => {
    dispatch({
      type: ActionType.END_BREAK,
      payload: { completed },
    })
  }

  const redeemReward = (rewardId: number) => {
    dispatch({
      type: ActionType.REDEEM_REWARD,
      payload: { rewardId },
    })
  }

  const toggleSound = () => {
    dispatch({ type: ActionType.TOGGLE_SOUND })
  }

  const switchDay = (day: number) => {
    dispatch({
      type: ActionType.SWITCH_DAY,
      payload: { day },
    })
  }

  // New user-related action creators
  const addUser = (name: string, avatar: string) => {
    dispatch({
      type: ActionType.ADD_USER,
      payload: { name, avatar },
    })
  }

  const switchUser = (userId: string) => {
    dispatch({
      type: ActionType.SWITCH_USER,
      payload: { userId },
    })
  }

  const addFriend = (friendId: string) => {
    if (state.currentUserId) {
      dispatch({
        type: ActionType.ADD_FRIEND,
        payload: { userId: state.currentUserId, friendId },
      })
    }
  }

  const removeFriend = (friendId: string) => {
    if (state.currentUserId) {
      dispatch({
        type: ActionType.REMOVE_FRIEND,
        payload: { userId: state.currentUserId, friendId },
      })
    }
  }

  const shareTask = (taskId: string, dayIndex: number, toUserId: string) => {
    if (state.currentUserId) {
      dispatch({
        type: ActionType.SHARE_TASK,
        payload: { taskId, dayIndex, fromUserId: state.currentUserId, toUserId },
      })
    }
  }

  const updateSharedTask = (sharedTaskId: string, status: "accepted" | "rejected" | "completed") => {
    dispatch({
      type: ActionType.UPDATE_SHARED_TASK,
      payload: { sharedTaskId, status, completedAt: status === "completed" ? new Date().toISOString() : undefined },
    })
  }

  const markNotificationRead = (notificationId: string) => {
    dispatch({
      type: ActionType.MARK_NOTIFICATION_READ,
      payload: { notificationId },
    })
  }

  // Utility functions
  const calculateDayProgress = (dayIndex: number) => {
    const dayQuests = state.quests[dayIndex]
    const completedTasks = dayQuests.tasks.filter((task) => task.completed).length
    return Math.round((completedTasks / dayQuests.tasks.length) * 100)
  }

  const calculateTotalProgress = () => {
    const totalTasks = state.quests.reduce((acc, day) => acc + day.tasks.length, 0)
    const completedTasks = state.quests.reduce((acc, day) => acc + day.tasks.filter((task) => task.completed).length, 0)
    return Math.round((completedTasks / totalTasks) * 100)
  }

  const getBreakStats = () => {
    if (state.breakHistory.length === 0) return { total: 0, completed: 0, avgDuration: 0, thisWeek: 0 }

    const completed = state.breakHistory.filter((b) => b.completed).length

    // Calculate average duration of completed breaks
    const completedBreaks = state.breakHistory.filter((b) => b.completed)
    const avgDuration =
      completedBreaks.length > 0
        ? Math.round(completedBreaks.reduce((acc, b) => acc + b.duration, 0) / completedBreaks.length)
        : 0

    // Count breaks from this week
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Start of current week (Sunday)

    const thisWeek = state.breakHistory.filter((b) => {
      const breakDate = new Date(b.date)
      return breakDate >= startOfWeek
    }).length

    return {
      total: state.breakHistory.length,
      completed,
      avgDuration,
      thisWeek,
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // User-related utility functions
  const getCurrentUser = () => {
    return state.users.find((user) => user.id === state.currentUserId)
  }

  const getFriends = () => {
    const currentUser = getCurrentUser()
    if (!currentUser) return []

    return state.users.filter((user) => currentUser.friends.includes(user.id))
  }

  const getUnreadNotificationsCount = () => {
    if (!state.currentUserId) return 0

    return state.notifications.filter(
      (notification) => notification.toUserId === state.currentUserId && !notification.read,
    ).length
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        toggleTask,
        completeDay,
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
        addUser,
        switchUser,
        addFriend,
        removeFriend,
        shareTask,
        updateSharedTask,
        markNotificationRead,
        getCurrentUser,
        getFriends,
        getUnreadNotificationsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
