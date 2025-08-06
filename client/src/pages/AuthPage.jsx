"use client"

import React, { useState, useEffect, useRef } from "react"
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
  const [successMessage, setSuccessMessage] = useState(null)

  const { loginWithPhoneNumber, confirmOtp, authError, currentUser, setAuthError } = useAuth()
  const navigate = useNavigate()
  const otpInputRef = useRef(null)

  useEffect(() => {
    if (currentUser) {
      if (currentUser.profileCompleted) {
        navigate("/dashboard", { replace: true })
      } else {
        navigate("/complete-profile", { replace: true })
      }
    }
  }, [currentUser, navigate])

  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [otpSent])

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    const trimmedPhone = phoneNumber.trim()
    if (!trimmedPhone) return

    setAuthError(null)
    setSuccessMessage(null)
    setLoading(true)

    const result = await loginWithPhoneNumber(trimmedPhone)

    if (result.success) {
      setOtpSent(true)
      if (result.otp) {
        setReceivedOtp(result.otp)
        setOtp(result.otp)
      }
    } else {
      setAuthError(result.message || "Failed to send OTP")
    }

    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      alert("Please enter a valid 6-digit OTP")
      return
    }

    setAuthError(null)
    setSuccessMessage(null)
    setLoading(true)

    const result = await confirmOtp(phoneNumber.trim(), otp)

    if (result.success) {
      setAuthError(null) // Clear any previous errors
      setSuccessMessage("OTP verified successfully!") // Optional success message
      // navigation handled by useEffect when currentUser is updated
    } else {
      setAuthError(result.message || "OTP verification failed")
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
          {successMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
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
                    maxLength={6}
                    required
                    disabled={loading}
                    ref={otpInputRef}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setOtpSent(false)
                  setOtp("")
                  setReceivedOtp("")
                  setAuthError(null)
                  setSuccessMessage(null)
                }}
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
