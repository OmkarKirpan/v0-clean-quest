import { type AppAction, type AppState, ActionType, type SharedTask, type Notification } from "@/types"

// Helper function to get today's date string
const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0]
}

// Helper function to update daily activity
const updateDailyActivity = (state: AppState, tasksCompleted = 0, xpEarned = 0): AppState => {
  const today = getTodayString()
  const dailyActivity = { ...state.analytics.dailyActivity }

  // Initialize today's activity if it doesn't exist
  if (!dailyActivity[today]) {
    dailyActivity[today] = {
      date: today,
      tasksCompleted: 0,
      xpEarned: 0,
      activeTimeMinutes: 0,
      breaksCompleted: 0,
    }
  }

  // Update today's activity
  dailyActivity[today] = {
    ...dailyActivity[today],
    tasksCompleted: dailyActivity[today].tasksCompleted + tasksCompleted,
    xpEarned: dailyActivity[today].xpEarned + xpEarned,
  }

  return {
    ...state,
    analytics: {
      ...state.analytics,
      dailyActivity,
    },
  }
}

// Generate a unique ID
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ActionType.INIT_STATE:
      return action.payload

    case ActionType.TOGGLE_TASK: {
      const { dayIndex, taskId } = action.payload
      const updatedQuests = [...state.quests]
      const taskIndex = updatedQuests[dayIndex].tasks.findIndex((task) => task.id === taskId)

      if (taskIndex !== -1) {
        const task = updatedQuests[dayIndex].tasks[taskIndex]
        const wasCompleted = task.completed

        // Toggle completion
        updatedQuests[dayIndex].tasks[taskIndex] = {
          ...task,
          completed: !wasCompleted,
        }

        // Update XP based on completion status
        const xpChange = wasCompleted ? -task.xp : task.xp
        const newTotalXP = state.totalXP + xpChange

        // Calculate new level
        let newLevel = 1
        if (newTotalXP >= 300) {
          newLevel = 3
        } else if (newTotalXP >= 200) {
          newLevel = 2
        }

        // Update analytics if task was completed
        let updatedState = {
          ...state,
          quests: updatedQuests,
          totalXP: newTotalXP,
          level: newLevel,
        }

        if (!wasCompleted) {
          // Add task completion record
          const taskCompletions = [
            ...state.analytics.taskCompletions,
            {
              taskId,
              dayIndex,
              completedAt: new Date().toISOString(),
            },
          ]

          // Update daily activity
          updatedState = updateDailyActivity(
            {
              ...updatedState,
              analytics: {
                ...updatedState.analytics,
                taskCompletions,
              },
            },
            1, // One task completed
            task.xp, // XP earned
          )

          // If this was a shared task, update its status
          if (task.shared && task.assignedTo === state.currentUserId) {
            const updatedSharedTasks = state.sharedTasks.map((sharedTask) => {
              if (sharedTask.taskId === taskId && sharedTask.toUserId === state.currentUserId) {
                return {
                  ...sharedTask,
                  status: "completed",
                  completedAt: new Date().toISOString(),
                }
              }
              return sharedTask
            })

            // Create notification for task completion
            const sharedTask = state.sharedTasks.find(
              (st) => st.taskId === taskId && st.toUserId === state.currentUserId,
            )

            if (sharedTask) {
              const newNotification: Notification = {
                id: generateId("notification"),
                type: "task_completed",
                fromUserId: state.currentUserId!,
                toUserId: sharedTask.fromUserId,
                relatedId: taskId,
                read: false,
                createdAt: new Date().toISOString(),
              }

              updatedState = {
                ...updatedState,
                sharedTasks: updatedSharedTasks,
                notifications: [...updatedState.notifications, newNotification],
              }
            }
          }
        } else {
          // Remove task completion record
          const taskCompletions = state.analytics.taskCompletions.filter(
            (tc) => !(tc.taskId === taskId && tc.dayIndex === dayIndex),
          )

          // Update daily activity (negative values to subtract)
          updatedState = updateDailyActivity(
            {
              ...updatedState,
              analytics: {
                ...updatedState.analytics,
                taskCompletions,
              },
            },
            -1, // One task uncompleted
            -task.xp, // XP lost
          )
        }

        return updatedState
      }
      return state
    }

    case ActionType.COMPLETE_DAY: {
      const { dayIndex } = action.payload
      const updatedDayCompleted = [...state.dayCompleted]
      updatedDayCompleted[dayIndex] = true

      return {
        ...state,
        dayCompleted: updatedDayCompleted,
        currentDay: dayIndex < 2 ? dayIndex + 2 : state.currentDay,
      }
    }

    case ActionType.START_BREAK: {
      const { breakId, startTime } = action.payload
      const newBreak = {
        id: breakId,
        startTime,
        duration: 300, // 5 minutes in seconds
        completed: false,
        date: new Date().toLocaleDateString(),
      }

      return {
        ...state,
        breakActive: true,
        breakTimeLeft: 300,
        currentBreakId: breakId,
        breakHistory: [newBreak, ...state.breakHistory],
      }
    }

    case ActionType.END_BREAK: {
      const { completed } = action.payload
      const updatedBreakHistory = state.breakHistory.map((b) =>
        b.id === state.currentBreakId ? { ...b, completed } : b,
      )

      // Update analytics for completed breaks
      let updatedState = {
        ...state,
        breakActive: false,
        breakTimeLeft: 300,
        currentBreakId: null,
        breakHistory: updatedBreakHistory,
      }

      if (completed) {
        // Update daily activity with completed break
        const today = getTodayString()
        const dailyActivity = { ...updatedState.analytics.dailyActivity }

        if (!dailyActivity[today]) {
          dailyActivity[today] = {
            date: today,
            tasksCompleted: 0,
            xpEarned: 0,
            activeTimeMinutes: 0,
            breaksCompleted: 0,
          }
        }

        dailyActivity[today] = {
          ...dailyActivity[today],
          breaksCompleted: dailyActivity[today].breaksCompleted + 1,
        }

        updatedState = {
          ...updatedState,
          analytics: {
            ...updatedState.analytics,
            dailyActivity,
          },
        }
      }

      return updatedState
    }

    case ActionType.UPDATE_BREAK_TIME: {
      return {
        ...state,
        breakTimeLeft: action.payload.timeLeft,
      }
    }

    case ActionType.REDEEM_REWARD: {
      const { rewardId } = action.payload
      const updatedRewards = state.realRewards.map((r) => (r.id === rewardId ? { ...r, redeemed: true } : r))

      return {
        ...state,
        realRewards: updatedRewards,
      }
    }

    case ActionType.TOGGLE_SOUND: {
      return {
        ...state,
        soundEnabled: !state.soundEnabled,
      }
    }

    case ActionType.SWITCH_DAY: {
      return {
        ...state,
        currentDay: action.payload.day,
      }
    }

    case ActionType.UPDATE_ACTIVE_TIME: {
      const { timestamp } = action.payload
      const lastTimestamp = state.analytics.lastActiveTimestamp

      // If this is the first time tracking or after a break
      if (!lastTimestamp) {
        return {
          ...state,
          analytics: {
            ...state.analytics,
            lastActiveTimestamp: timestamp,
          },
        }
      }

      // Calculate minutes since last update
      const lastTime = new Date(lastTimestamp).getTime()
      const currentTime = new Date(timestamp).getTime()
      const minutesDiff = Math.floor((currentTime - lastTime) / 60000)

      // Only update if at least 1 minute has passed
      if (minutesDiff < 1) {
        return state
      }

      // Update total active time
      const totalActiveTimeMinutes = state.analytics.totalActiveTimeMinutes + minutesDiff

      // Update daily activity
      const today = getTodayString()
      const dailyActivity = { ...state.analytics.dailyActivity }

      if (!dailyActivity[today]) {
        dailyActivity[today] = {
          date: today,
          tasksCompleted: 0,
          xpEarned: 0,
          activeTimeMinutes: 0,
          breaksCompleted: 0,
        }
      }

      dailyActivity[today] = {
        ...dailyActivity[today],
        activeTimeMinutes: dailyActivity[today].activeTimeMinutes + minutesDiff,
      }

      return {
        ...state,
        analytics: {
          ...state.analytics,
          totalActiveTimeMinutes,
          lastActiveTimestamp: timestamp,
          dailyActivity,
        },
      }
    }

    // New user-related actions
    case ActionType.ADD_USER: {
      const { name, avatar } = action.payload
      const newUser = {
        id: generateId("user"),
        name,
        avatar,
        createdAt: new Date().toISOString(),
        friends: [],
      }

      return {
        ...state,
        users: [...state.users, newUser],
        currentUserId: newUser.id, // Switch to the new user
      }
    }

    case ActionType.SWITCH_USER: {
      const { userId } = action.payload
      // Verify user exists
      if (!state.users.some((user) => user.id === userId)) {
        return state
      }

      return {
        ...state,
        currentUserId: userId,
      }
    }

    case ActionType.ADD_FRIEND: {
      const { userId, friendId } = action.payload
      // Verify both users exist
      if (!state.users.some((user) => user.id === userId) || !state.users.some((user) => user.id === friendId)) {
        return state
      }

      // Update user's friends list
      const updatedUsers = state.users.map((user) => {
        if (user.id === userId) {
          // Only add if not already a friend
          if (!user.friends.includes(friendId)) {
            return {
              ...user,
              friends: [...user.friends, friendId],
            }
          }
        }
        return user
      })

      // Create notification for friend request
      const newNotification: Notification = {
        id: generateId("notification"),
        type: "friend_accepted",
        fromUserId: userId,
        toUserId: friendId,
        read: false,
        createdAt: new Date().toISOString(),
      }

      return {
        ...state,
        users: updatedUsers,
        notifications: [...state.notifications, newNotification],
      }
    }

    case ActionType.REMOVE_FRIEND: {
      const { userId, friendId } = action.payload
      // Update user's friends list
      const updatedUsers = state.users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            friends: user.friends.filter((id) => id !== friendId),
          }
        }
        return user
      })

      return {
        ...state,
        users: updatedUsers,
      }
    }

    case ActionType.SHARE_TASK: {
      const { taskId, dayIndex, fromUserId, toUserId } = action.payload
      // Verify both users exist
      if (!state.users.some((user) => user.id === fromUserId) || !state.users.some((user) => user.id === toUserId)) {
        return state
      }

      // Create shared task
      const newSharedTask: SharedTask = {
        id: generateId("shared-task"),
        taskId,
        dayIndex,
        fromUserId,
        toUserId,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      // Mark the task as shared in the quests
      const updatedQuests = [...state.quests]
      const taskIndex = updatedQuests[dayIndex].tasks.findIndex((task) => task.id === taskId)

      if (taskIndex !== -1) {
        updatedQuests[dayIndex].tasks[taskIndex] = {
          ...updatedQuests[dayIndex].tasks[taskIndex],
          shared: true,
          assignedTo: toUserId,
          assignedBy: fromUserId,
        }
      }

      // Create notification for shared task
      const newNotification: Notification = {
        id: generateId("notification"),
        type: "task_shared",
        fromUserId,
        toUserId,
        relatedId: taskId,
        read: false,
        createdAt: new Date().toISOString(),
      }

      return {
        ...state,
        quests: updatedQuests,
        sharedTasks: [...state.sharedTasks, newSharedTask],
        notifications: [...state.notifications, newNotification],
      }
    }

    case ActionType.UPDATE_SHARED_TASK: {
      const { sharedTaskId, status, completedAt } = action.payload
      // Update shared task status
      const updatedSharedTasks = state.sharedTasks.map((task) => {
        if (task.id === sharedTaskId) {
          return {
            ...task,
            status,
            completedAt: completedAt || task.completedAt,
          }
        }
        return task
      })

      // If task was rejected, remove the shared flag from the task
      const updatedQuests = [...state.quests]
      if (status === "rejected") {
        const sharedTask = state.sharedTasks.find((task) => task.id === sharedTaskId)
        if (sharedTask) {
          const { dayIndex, taskId } = sharedTask
          const taskIndex = updatedQuests[dayIndex].tasks.findIndex((task) => task.id === taskId)

          if (taskIndex !== -1) {
            updatedQuests[dayIndex].tasks[taskIndex] = {
              ...updatedQuests[dayIndex].tasks[taskIndex],
              shared: false,
              assignedTo: undefined,
              assignedBy: undefined,
            }
          }
        }
      }

      return {
        ...state,
        quests: updatedQuests,
        sharedTasks: updatedSharedTasks,
      }
    }

    case ActionType.ADD_NOTIFICATION: {
      const { type, fromUserId, toUserId, relatedId } = action.payload
      const newNotification: Notification = {
        id: generateId("notification"),
        type,
        fromUserId,
        toUserId,
        relatedId,
        read: false,
        createdAt: new Date().toISOString(),
      }

      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      }
    }

    case ActionType.MARK_NOTIFICATION_READ: {
      const { notificationId } = action.payload
      const updatedNotifications = state.notifications.map((notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            read: true,
          }
        }
        return notification
      })

      return {
        ...state,
        notifications: updatedNotifications,
      }
    }

    default:
      return state
  }
}
