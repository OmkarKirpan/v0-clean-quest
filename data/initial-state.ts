import type { AppState, Quest, User } from "@/types"

// Quest/Task data structure
export const questData: Quest[] = [
  {
    day: 1,
    title: "The Hall & Balcony Cleanup",
    operation: "Living Light",
    tasks: [
      {
        id: "1-1",
        description: "Declutter hall (trash, misplaced items)",
        xp: 10,
        completed: false,
        tip: "Start by gathering a trash bag and a 'belongs elsewhere' basket. Work from one end of the hall to the other, making quick decisions about each item.",
      },
      {
        id: "1-2",
        description: "Sweep hall & balconies",
        xp: 20,
        completed: false,
        tip: "Sweep from the inside corners outward. For balconies, sweep debris into a dustpan rather than over the edge to be considerate to neighbors below.",
      },
      {
        id: "1-3",
        description: "Dust balcony railings & furniture",
        xp: 10,
        completed: false,
        tip: "Use a slightly damp microfiber cloth for railings to trap dust instead of spreading it. For outdoor furniture, wipe in the direction of the grain.",
      },
      {
        id: "1-4",
        description: "Mop floor with Vim floor cleaner",
        xp: 30,
        completed: false,
        tip: "Dilute as directed on the bottle. Start from the farthest corner and work your way toward the exit to avoid stepping on wet areas.",
      },
      {
        id: "1-5",
        description: "Wipe surfaces with Lizol + tissue",
        xp: 20,
        completed: false,
        tip: "Spray Lizol on the tissue rather than directly on surfaces to prevent over-wetting and potential damage to electronics or wooden surfaces.",
      },
      {
        id: "1-6",
        description: "Light incense/open windows (Bonus)",
        xp: 10,
        completed: false,
        tip: "Open windows on opposite sides of your home if possible to create cross-ventilation. This air exchange is more effective than just opening one window.",
      },
    ],
    reward: "Surface Sweeper",
    totalXP: 100,
  },
  {
    day: 2,
    title: "Bedroom & Bathroom Blitz",
    operation: "Sleep & Sanitize",
    tasks: [
      {
        id: "2-1",
        description: "Declutter bedroom",
        xp: 10,
        completed: false,
        tip: "Use the '4-box method': Keep, Donate, Store, Trash. Limit yourself to 10 minutes to avoid getting overwhelmed with decisions.",
      },
      {
        id: "2-2",
        description: "Make bed & fold clothes",
        xp: 10,
        completed: false,
        tip: "For efficient bed-making, start with the fitted sheet, smoothing from the center outward. For clothes, use the KonMari vertical folding method to see all items at once.",
      },
      {
        id: "2-3",
        description: "Dust bedroom surfaces",
        xp: 10,
        completed: false,
        tip: "Dust from top to bottom: start with ceiling fans, then shelves, then furniture surfaces, and finally baseboards to avoid re-dusting areas.",
      },
      {
        id: "2-4",
        description: "Sweep & mop bedroom",
        xp: 20,
        completed: false,
        tip: "Move furniture slightly rather than skipping areas. Focus on corners and under the bed where dust bunnies accumulate.",
      },
      {
        id: "2-5",
        description: "Apply Harpic & clean toilet",
        xp: 20,
        completed: false,
        tip: "Apply Harpic under the rim and let it sit for 10 minutes before scrubbing for maximum effectiveness. Don't forget to clean the often-missed area where the toilet meets the floor.",
      },
      {
        id: "2-6",
        description: "Wipe sink, taps, and bathroom tiles",
        xp: 20,
        completed: false,
        tip: "For chrome taps, use a vinegar solution to remove water spots and limescale. Dry with a microfiber cloth to prevent new water spots from forming.",
      },
      {
        id: "2-7",
        description: "Mop bathroom floor",
        xp: 10,
        completed: false,
        tip: "Use a separate mop or mop head for the bathroom than what you use in other areas of your home for better hygiene.",
      },
    ],
    reward: "Sanitation Sorcerer",
    totalXP: 100,
  },
  {
    day: 3,
    title: "Kitchen Combat",
    operation: "Grease Hunter",
    tasks: [
      {
        id: "3-1",
        description: "Clear expired items & general clutter",
        xp: 10,
        completed: false,
        tip: "Check not just expiration dates but also 'best before' dates. Some items are still safe to eat after the best before date but may have reduced quality.",
      },
      {
        id: "3-2",
        description: "Clean stove & counters with Lizol",
        xp: 20,
        completed: false,
        tip: "For stubborn stove stains, make a paste with baking soda and water, apply to the stain, and let sit for 15 minutes before scrubbing.",
      },
      {
        id: "3-3",
        description: "Wipe cabinets and sink",
        xp: 20,
        completed: false,
        tip: "For wooden cabinets, use a gentle cleaner with a small amount of olive oil to clean and condition the wood simultaneously.",
      },
      {
        id: "3-4",
        description: "Wash dishes with Pril",
        xp: 20,
        completed: false,
        tip: "Wash in the right order: glasses first, then silverware, then plates, and pots and pans last. This keeps your dishwater cleaner for longer.",
      },
      {
        id: "3-5",
        description: "Sweep kitchen floor",
        xp: 10,
        completed: false,
        tip: "Use a dustpan with a rubber edge that sits flush with the floor to avoid that annoying line of dust that never seems to go into the dustpan.",
      },
      {
        id: "3-6",
        description: "Mop with Vim floor cleaner",
        xp: 20,
        completed: false,
        tip: "For tile floors with grout, use a soft brush to scrub the grout lines occasionally. Regular mopping often misses the recessed grout areas.",
      },
    ],
    reward: "Kitchen Commander",
    totalXP: 100,
  },
]

// Default user
const defaultUser: User = {
  id: "user-1",
  name: "Default User",
  avatar: "👤",
  createdAt: new Date().toISOString(),
  friends: [],
}

export const initialState: AppState = {
  currentDay: 1,
  totalXP: 0,
  level: 1,
  dayCompleted: [false, false, false],
  quests: questData,
  breakActive: false,
  breakTimeLeft: 300, // 5 minutes in seconds
  currentBreakId: null,
  breakHistory: [],
  realRewards: [
    { id: 1, name: "Coffee Shop Voucher", xpRequired: 100, redeemed: false, icon: "☕" },
    { id: 2, name: "Movie Ticket", xpRequired: 200, redeemed: false, icon: "🎬" },
    { id: 3, name: "Food Delivery Coupon", xpRequired: 300, redeemed: false, icon: "🍕" },
  ],
  soundEnabled: true,

  // Analytics data
  analytics: {
    taskCompletions: [],
    dailyActivity: {},
    totalActiveTimeMinutes: 0,
    lastActiveTimestamp: null,
  },

  // User data
  users: [defaultUser],
  currentUserId: defaultUser.id,
  sharedTasks: [],
  notifications: [],
}
