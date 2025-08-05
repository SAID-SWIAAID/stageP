"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import  AppSidebar  from "../components/Sidebar" // Assuming Sidebar is now AppSidebar

function ConfigurationPage() {
  const [appName, setAppName] = useState("Supplier Portal")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [currencySymbol, setCurrencySymbol] = useState("$")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Simulate API call to save configuration
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      console.log("Saving configuration:", { appName, notificationsEnabled, currencySymbol })
      setSuccess("Configuration saved successfully!")
    } catch (err) {
      console.error("Error saving configuration:", err)
      setError(err.message || "Failed to save configuration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Configuration</h1>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>Manage general settings for your application.</CardDescription>
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
              <Alert variant="default" className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input
                  id="appName"
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Your App Name"
                  required
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notificationsEnabled">Enable Notifications</Label>
                <Switch
                  id="notificationsEnabled"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currencySymbol">Default Currency Symbol</Label>
                <Input
                  id="currencySymbol"
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  placeholder="$"
                  maxLength={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Configuration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default ConfigurationPage
