"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useAuth } from "../context/AuthContext"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

function CompleteProfilePage() {
  const { currentUser, completeProfile, loading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [userType, setUserType] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formLoading, setFormLoading] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")
  setSuccess("")
  setFormLoading(true)

  // Prevent submit if loading or user not ready
  if (loading || !currentUser || !currentUser.uid) {
    setError("User not loaded yet. Please wait a moment and try again.")
    setFormLoading(false)
    return
  }

  if (!name || !email || !userType) {
    setError("Please fill in all required fields.")
    setFormLoading(false)
    return
  }

  try {
    await completeProfile({ name, email, userType })
    setSuccess("Profile completed successfully! Redirecting to dashboard...")
    // Redirection is handled by AuthContext
  } catch (err) {
    console.error("Failed to complete profile:", err)
    setError(err.message || "Failed to complete profile.")
  } finally {
    setFormLoading(false)
  }
}

 if (loading) {
  return <div className="flex justify-center items-center min-h-screen">Loading user data...</div>
}
  if (currentUser && currentUser.profileCompleted === true) {
    // If profile is already completed, redirect to dashboard
    // This is handled by PrivateRoute, but a fallback here is good.
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert>
          <AlertTitle>Profile Already Completed</AlertTitle>
          <AlertDescription>You will be redirected to the dashboard shortly.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Please provide a few more details to set up your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          <Button type="submit" className="w-full" disabled={formLoading || loading || !currentUser}>
  {formLoading ? "Saving..." : "Complete Profile"}
</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompleteProfilePage
