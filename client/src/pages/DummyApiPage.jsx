"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import Layout from "../components/Layout"

function DummyApiPage() {
  const [apiResponse, setApiResponse] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  const handleApiCall = async () => {
    setError("")
    setApiResponse(null)
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/dummy`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      console.error("Error calling dummy API:", err)
      setError(err.message || "Failed to fetch from dummy API.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Dummy API Test</h1>
        </div>

        <Card className="card-container max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Test Backend Connection</CardTitle>
            <CardDescription>Click the button to call a dummy API endpoint on your backend.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleApiCall} disabled={loading}>
              {loading ? "Calling API..." : "Call Dummy API"}
            </Button>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {apiResponse && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>API Response:</AlertTitle>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(apiResponse, null, 2)}</pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default DummyApiPage
