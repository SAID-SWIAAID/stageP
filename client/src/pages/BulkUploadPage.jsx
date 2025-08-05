"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Progress } from "../components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle, UploadCloud } from "lucide-react"
import Layout from "../components/Layout"

function BulkUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      const allowedTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"]
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file)
        setError("")
      } else {
        setSelectedFile(null)
        setError("Invalid file type. Please upload an Excel (.xlsx) or CSV (.csv) file.")
      }
    } else {
      setSelectedFile(null)
    }
    setUploadProgress(0)
    setSuccess("")
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    setUploadProgress(0)

    if (!selectedFile) {
      setError("Please select a file to upload.")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      // Simulate progress for demonstration
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 10
        if (currentProgress <= 90) {
          setUploadProgress(currentProgress)
        } else {
          clearInterval(interval)
        }
      }, 200)

      const response = await fetch(`${BACKEND_URL}/bulk-upload`, {
        method: "POST",
        body: formData,
        // No 'Content-Type' header needed for FormData, browser sets it automatically
      })

      clearInterval(interval) // Stop simulation
      setUploadProgress(100) // Set to 100% on completion

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to upload file.")
      }

      const result = await response.json()
      setSuccess(result.message || "File uploaded and processed successfully!")
      setSelectedFile(null)
    } catch (err) {
      console.error("Error during bulk upload:", err)
      setError(err.message || "Error uploading file. Please try again.")
      setUploadProgress(0) // Reset progress on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Bulk Upload Products</h1>
        </div>

        <Card className="card-container max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Upload Product Data</CardTitle>
            <CardDescription>
              Upload an Excel (.xlsx) or CSV (.csv) file to add multiple products at once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-gray-500">
                  {selectedFile ? `Selected: ${selectedFile.name}` : "No file chosen"}
                </p>
              </div>

              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <Label>Upload Progress</Label>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                </div>
              )}

              <Button type="submit" disabled={loading || !selectedFile} className="w-full">
                <UploadCloud className="mr-2 h-4 w-4" />
                {loading ? "Uploading and Processing..." : "Upload and Process"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default BulkUploadPage
