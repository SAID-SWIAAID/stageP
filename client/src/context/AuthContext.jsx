"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { requestOtp, verifyOtp } from "../services/otpService"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const navigate = useNavigate()

  // Load user from localStorage on app start
  useEffect(() => {
    setLoading(true)
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored)
        if (parsedUser && parsedUser.uid) {
          setCurrentUser(parsedUser)
        } else {
          setCurrentUser(null)
          localStorage.removeItem("user")
        }
      } catch {
        setCurrentUser(null)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  // Request OTP
  const loginWithPhoneNumber = async (phoneNumber) => {
    setAuthError(null)
    try {
      const data = await requestOtp(phoneNumber)
      return {
        success: true,
        otp: data.otp, // optional — backend may send this only in dev
      }
    } catch (error) {
      setAuthError(error.message || "Failed to request OTP")
      return {
        success: false,
        message: error.message || "Failed to request OTP",
      }
    }
  }

  // Confirm OTP
  const confirmOtp = async (phoneNumber, otp) => {
  setAuthError(null)
  try {
    const data = await verifyOtp(phoneNumber, otp)

    if (data.message === "OTP verified successfully!" && data.user) {
      setCurrentUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      return { success: true }
    } else {
      setAuthError(data.message || "OTP verification failed")
      return { success: false }
    }
  } catch (error) {
    setAuthError(error.message || "An unexpected error occurred.")
    return { success: false }
  }
}




  // Complete profile
  const completeProfile = async (profileData) => {
    setAuthError(null)
    if (!currentUser?.uid) {
      setAuthError("No authenticated user found to complete profile.")
      return {
        success: false,
        message: "No authenticated user found.",
      }
    }

    try {
      const response = await fetch("http://localhost:3001/api/users/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser.uid,
          ...profileData,
          profileCompleted: true,
        }),
      })

      const updatedProfile = await response.json()

      if (response.ok) {
        setCurrentUser(updatedProfile.user)
        localStorage.setItem("user", JSON.stringify(updatedProfile.user))
        return { success: true }
      } else {
        setAuthError(updatedProfile.message || "Failed to complete profile.")
        return {
          success: false,
          message: updatedProfile.message || "Failed to complete profile.",
        }
      }
    } catch (error) {
      setAuthError(error.message || "An unexpected error occurred.")
      return {
        success: false,
        message: error.message || "An unexpected error occurred.",
      }
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem("user")
    setCurrentUser(null)
    navigate("/auth")
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginWithPhoneNumber,
        confirmOtp,
        completeProfile,
        logout,
        authError,
        loading,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
