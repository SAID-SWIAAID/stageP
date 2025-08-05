"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Phone, Lock } from "lucide-react"

const AuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [receivedOtp, setReceivedOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const { loginWithPhoneNumber, confirmOtp, authError, currentUser } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.profileCompleted) {
        navigate("/dashboard", { replace: true })
      } else {
        navigate("/complete-profile", { replace: true })
      }
    }
  }, [currentUser, navigate])

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await loginWithPhoneNumber(phoneNumber)
    if (result.success) {
      setOtpSent(true)
      // For demo purposes, if OTP is returned, you can display it
      if (result.otp) {
        console.log("Demo OTP:", result.otp)
        setReceivedOtp(result.otp)
        // Auto-fill the OTP input for convenience
        setOtp(result.otp)
      }
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await confirmOtp(phoneNumber, otp)
    if (result.success) {
      console.log("OTP verification successful, waiting for navigation...")
      // Redirection is handled by the useEffect based on currentUser state
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 space-y-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{otpSent ? "Verify OTP" : "Login / Sign Up"}</CardTitle>
          <p className="text-gray-500 dark:text-gray-400">
            {otpSent ? "Enter the 6-digit code sent to your phone." : "Enter your phone number to continue."}
          </p>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending OTP..." : "Request OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {receivedOtp && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <AlertTitle className="text-green-800">Demo OTP Received</AlertTitle>
                  <AlertDescription className="text-green-700">
                    For testing purposes, your OTP is: <strong className="text-lg">{receivedOtp}</strong>
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10"
                    maxLength="6"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setOtpSent(false)}
                className="w-full text-sm text-gray-500 dark:text-gray-400"
                disabled={loading}
              >
                Change Phone Number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthPage
