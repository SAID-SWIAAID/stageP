"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { useAuth } from "../context/AuthContext"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

function CompleteProfilePage() {
  const navigate = useNavigate()
  const { currentUser, completeProfile, loading } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formLoading, setFormLoading] = useState(false)

  // Redirect to /auth if user not authenticated
  useEffect(() => {
    if (!loading && (!currentUser || !currentUser.uid)) {
      navigate("/auth", { replace: true })
    }
  }, [loading, currentUser, navigate])

  // If user has already completed their profile, redirect to /dashboard
  useEffect(() => {
    if (!loading && currentUser?.profileCompleted) {
      navigate("/dashboard")
    }
  }, [loading, currentUser?.profileCompleted, navigate])

  // Pre-fill fields if user exists
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "")
      setEmail(currentUser.email || "")
      setUserType(currentUser.userType || "")
      setPhoneNumber(currentUser.phoneNumber || "")
    }
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setFormLoading(true)

    if (loading) {
      setError("User data is still loading. Please wait.")
      setFormLoading(false)
      return
    }

    if (!currentUser?.uid) {
      setError("User not authenticated. Please login again.")
      setFormLoading(false)
      return
    }

    if (!name || !email || !userType || !phoneNumber) {
      setError("Please fill in all required fields.")
      setFormLoading(false)
      return
    }

    try {
     const res = await completeProfile({
  fullName: name,
  email,
  userType,
  phoneNumber,
})

      if (res.success) {
        setSuccess("Profile completed successfully! Redirecting...")
        setTimeout(() => {
          navigate("/dashboard")
        }, 2000)
      } else {
        setError(res.message || "Failed to complete profile.")
      }
    } catch (err) {
      console.error("Failed to complete profile:", err)
      setError(err.message || "Something went wrong.")
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading user data...
      </div>
    )
  }

  if (currentUser?.profileCompleted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert>
          <AlertTitle>Profile Already Completed</AlertTitle>
          <AlertDescription>Redirecting to dashboard...</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide a few more details to set up your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="flex items-center space-x-2">
              <XCircle className="h-5 w-5" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <div>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </div>
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
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                disabled
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select
                value={userType}
                onValueChange={setUserType}
                disabled={formLoading || loading || !currentUser}
                aria-required="true"
              >
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
            <Button
              type="submit"
              className="w-full"
              disabled={formLoading || loading || !currentUser}
            >
              {formLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompleteProfilePage
