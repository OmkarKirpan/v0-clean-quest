// Task interface
export interface Task {
  id: string
  description: string
  xp: number
  completed: boolean
  tip: string
  assignedTo?: string // User ID of assigned user
  assignedBy?: string // User ID of user who assigned the task
  shared?: boolean
}

// Quest interface
export interface Quest {
  day: number
  title: string
  operation: string
  tasks: Task[]
  reward: string
  totalXP: number
}

// Break record interface
export interface BreakRecord {
  id: string
  startTime: string
  duration: number // in seconds
  completed: boolean
  date: string
}

// Reward interface
export interface Reward {
  id: number
  name: string
  xpRequired: number
  redeemed: boolean
  icon: string
}

// Task completion record
export interface TaskCompletion {
  taskId: string
  dayIndex: number
  completedAt: string
}

// Daily activity record
export interface DailyActivity {
  date: string
  tasksCompleted: number
  xpEarned: number
  activeTimeMinutes: number
  breaksCompleted: number
}

// Analytics data
export interface AnalyticsData {
  taskCompletions: TaskCompletion[]
  dailyActivity: Record<string, DailyActivity>
  totalActiveTimeMinutes: number
  lastActiveTimestamp: string | null
}

// User interface
export interface User {
  id: string
  name: string
  avatar: string
  createdAt: string
  friends: string[] // Array of friend user IDs
}

// Shared task interface
export interface SharedTask {
  id: string
  taskId: string
  dayIndex: number
  fromUserId: string
  toUserId: string
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: string
  completedAt?: string
}

// Notification interface
export interface Notification {
  id: string
  type: "task_shared" | "task_completed" | "friend_request" | "friend_accepted"
  fromUserId: string
  toUserId: string
  relatedId?: string // Task ID or other related ID
  read: boolean
  createdAt: string
}

// App state interface
export interface AppState {
  // Existing state properties
  currentDay: number
  totalXP: number
  level: number
  dayCompleted: boolean[]
  quests: Quest[]
  breakActive: boolean
  breakTimeLeft: number
  currentBreakId: string | null
  breakHistory: BreakRecord[]
  realRewards: Reward[]
  soundEnabled: boolean
  analytics: AnalyticsData

  // New multiplayer properties
  users: User[]
  currentUserId: string | null
  sharedTasks: SharedTask[]
  notifications: Notification[]
}

// Action types
export enum ActionType {
  // Existing action types
  INIT_STATE = "INIT_STATE",
  TOGGLE_TASK = "TOGGLE_TASK",
  COMPLETE_DAY = "COMPLETE_DAY",
  START_BREAK = "START_BREAK",
  END_BREAK = "END_BREAK",
  UPDATE_BREAK_TIME = "UPDATE_BREAK_TIME",
  REDEEM_REWARD = "REDEEM_REWARD",
  TOGGLE_SOUND = "TOGGLE_SOUND",
  SWITCH_DAY = "SWITCH_DAY",
  UPDATE_ACTIVE_TIME = "UPDATE_ACTIVE_TIME",

  // New action types
  ADD_USER = "ADD_USER",
  SWITCH_USER = "SWITCH_USER",
  ADD_FRIEND = "ADD_FRIEND",
  REMOVE_FRIEND = "REMOVE_FRIEND",
  SHARE_TASK = "SHARE_TASK",
  UPDATE_SHARED_TASK = "UPDATE_SHARED_TASK",
  ADD_NOTIFICATION = "ADD_NOTIFICATION",
  MARK_NOTIFICATION_READ = "MARK_NOTIFICATION_READ",
}

// Existing action interfaces
export interface InitStateAction {
  type: ActionType.INIT_STATE
  payload: AppState
}

export interface ToggleTaskAction {
  type: ActionType.TOGGLE_TASK
  payload: {
    dayIndex: number
    taskId: string
  }
}

export interface CompleteDayAction {
  type: ActionType.COMPLETE_DAY
  payload: {
    dayIndex: number
  }
}

export interface StartBreakAction {
  type: ActionType.START_BREAK
  payload: {
    breakId: string
    startTime: string
  }
}

export interface EndBreakAction {
  type: ActionType.END_BREAK
  payload: {
    completed: boolean
  }
}

export interface UpdateBreakTimeAction {
  type: ActionType.UPDATE_BREAK_TIME
  payload: {
    timeLeft: number
  }
}

export interface RedeemRewardAction {
  type: ActionType.REDEEM_REWARD
  payload: {
    rewardId: number
  }
}

export interface ToggleSoundAction {
  type: ActionType.TOGGLE_SOUND
}

export interface SwitchDayAction {
  type: ActionType.SWITCH_DAY
  payload: {
    day: number
  }
}

export interface UpdateActiveTimeAction {
  type: ActionType.UPDATE_ACTIVE_TIME
  payload: {
    timestamp: string
  }
}

// New action interfaces
export interface AddUserAction {
  type: ActionType.ADD_USER
  payload: {
    name: string
    avatar: string
  }
}

export interface SwitchUserAction {
  type: ActionType.SWITCH_USER
  payload: {
    userId: string
  }
}

export interface AddFriendAction {
  type: ActionType.ADD_FRIEND
  payload: {
    userId: string
    friendId: string
  }
}

export interface RemoveFriendAction {
  type: ActionType.REMOVE_FRIEND
  payload: {
    userId: string
    friendId: string
  }
}

export interface ShareTaskAction {
  type: ActionType.SHARE_TASK
  payload: {
    taskId: string
    dayIndex: number
    fromUserId: string
    toUserId: string
  }
}

export interface UpdateSharedTaskAction {
  type: ActionType.UPDATE_SHARED_TASK
  payload: {
    sharedTaskId: string
    status: "accepted" | "rejected" | "completed"
    completedAt?: string
  }
}

export interface AddNotificationAction {
  type: ActionType.ADD_NOTIFICATION
  payload: {
    type: "task_shared" | "task_completed" | "friend_request" | "friend_accepted"
    fromUserId: string
    toUserId: string
    relatedId?: string
  }
}

export interface MarkNotificationReadAction {
  type: ActionType.MARK_NOTIFICATION_READ
  payload: {
    notificationId: string
  }
}

// Update AppAction union type
export type AppAction =
  | InitStateAction
  | ToggleTaskAction
  | CompleteDayAction
  | StartBreakAction
  | EndBreakAction
  | UpdateBreakTimeAction
  | RedeemRewardAction
  | ToggleSoundAction
  | SwitchDayAction
  | UpdateActiveTimeAction
  | AddUserAction
  | SwitchUserAction
  | AddFriendAction
  | RemoveFriendAction
  | ShareTaskAction
  | UpdateSharedTaskAction
  | AddNotificationAction
  | MarkNotificationReadAction
