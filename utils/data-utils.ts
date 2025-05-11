import type { AppState } from "@/types"

// Export app data to a JSON file
export const exportAppData = (state: AppState): void => {
  try {
    // Create a JSON string with the app state
    const dataStr = JSON.stringify(state, null, 2)

    // Create a blob with the data
    const blob = new Blob([dataStr], { type: "application/json" })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = url

    // Set the filename with current date
    const date = new Date().toISOString().split("T")[0]
    link.download = `cleanquest-backup-${date}.json`

    // Append the link to the body
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exporting data:", error)
    throw new Error("Failed to export data")
  }
}

// Import app data from a JSON file
export const importAppData = async (file: File): Promise<AppState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file")
        }

        const data = JSON.parse(event.target.result as string) as AppState

        // Validate the imported data
        if (!validateAppData(data)) {
          throw new Error("Invalid data format")
        }

        resolve(data)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsText(file)
  })
}

// Validate the imported data structure
const validateAppData = (data: any): boolean => {
  // Check for required top-level properties
  const requiredProps = ["currentDay", "totalXP", "level", "dayCompleted", "quests", "breakHistory", "realRewards"]

  for (const prop of requiredProps) {
    if (!(prop in data)) {
      return false
    }
  }

  // Check if quests have the expected structure
  if (!Array.isArray(data.quests) || data.quests.length === 0) {
    return false
  }

  // Check if at least one quest has tasks
  const hasValidQuest = data.quests.some(
    (quest) => quest && typeof quest === "object" && Array.isArray(quest.tasks) && quest.tasks.length > 0,
  )

  if (!hasValidQuest) {
    return false
  }

  return true
}
