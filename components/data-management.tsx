"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { exportAppData, importAppData } from "@/utils/data-utils"
import { ActionType } from "@/types"
import { soundService } from "@/services/sound-service"

export function DataManagement() {
  const { state, dispatch } = useAppContext()
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle export button click
  const handleExport = () => {
    soundService.playClick()
    try {
      exportAppData(state)
      setImportStatus("success")
      setStatusMessage("Data exported successfully!")

      // Reset status after 3 seconds
      setTimeout(() => {
        setImportStatus("idle")
        setStatusMessage("")
      }, 3000)
    } catch (error) {
      setImportStatus("error")
      setStatusMessage("Failed to export data. Please try again.")
    }
  }

  // Handle import button click
  const handleImportClick = () => {
    soundService.playClick()
    fileInputRef.current?.click()
  }

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setImportStatus("idle")
      setStatusMessage("Importing data...")

      const importedData = await importAppData(file)

      // Update app state with imported data
      dispatch({
        type: ActionType.INIT_STATE,
        payload: importedData,
      })

      setImportStatus("success")
      setStatusMessage("Data imported successfully!")

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Reset status after 3 seconds
      setTimeout(() => {
        setImportStatus("idle")
        setStatusMessage("")
      }, 3000)
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus("error")
      setStatusMessage("Failed to import data. Invalid file format.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Data Management</CardTitle>
        <CardDescription>Export your data for backup or import from a previous backup</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleExport} className="flex items-center justify-center" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>

            <Button onClick={handleImportClick} className="flex items-center justify-center" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
          </div>

          {importStatus !== "idle" && (
            <Alert variant={importStatus === "error" ? "destructive" : "default"}>
              {importStatus === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertTitle>{importStatus === "error" ? "Error" : "Success"}</AlertTitle>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
