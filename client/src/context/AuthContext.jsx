"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { onAuthChange, saveUserToBackend } from "../services/authService"
import { requestOtp, verifyOtp } from "../services/otpService" // Changed generateOtp to requestOtp
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const navigate = useNavigate()

 useEffect(() => {
  const unsubscribe = onAuthChange((user) => {
    if (user) {
      setCurrentUser(user)
    } else {
      // Try to restore from localStorage
      const stored = localStorage.getItem("user")
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored))
        } catch {
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    }
    setLoading(false)
  })

  return () => unsubscribe()
}, [])// Added navigate to dependencies to avoid lint warning [^4]

  const loginWithPhoneNumber = async (phoneNumber) => {
    setAuthError(null)
    try {
      const response = await requestOtp(phoneNumber) // Changed generateOtp to requestOtp
      console.log("OTP requested:", response)
      return { success: true, message: response.message }
    } catch (error) {
      console.error("Login with phone number failed:", error)
      setAuthError(error.message)
      return { success: false, message: error.message }
    }
  }

  const confirmOtp = async (phoneNumber, otp) => {
    setAuthError(null)
    try {
      const response = await verifyOtp(phoneNumber, otp)
      console.log("OTP verified:", response)

      // Simulate user object after successful OTP verification
      const user = {
        uid: phoneNumber, // Using phone number as a unique ID for simplicity
        phoneNumber: phoneNumber,
        profileCompleted: false, // Assume profile is not completed initially
      }

      // Save/update user profile in backend (Firestore)
      const savedUser = await saveUserToBackend(user)
      console.log("User saved to backend:", savedUser)

      // Update local storage and context with the user data from backend
      localStorage.setItem("user", JSON.stringify(savedUser))
      setCurrentUser(savedUser)

      // Redirect based on profile completion
      if (savedUser && !savedUser.profileCompleted) {
        navigate("/complete-profile")
      } else if (savedUser && savedUser.profileCompleted) {
        navigate("/dashboard")
      }

      return { success: true, message: response.message, user: savedUser }
    } catch (error) {
      console.error("OTP confirmation failed:", error)
      setAuthError(error.message)
      return { success: false, message: error.message }
    }
  }

  const completeProfile = async (profileData) => {
    setAuthError(null)
    try {
      if (!currentUser || !currentUser.uid) {
        throw new Error("No authenticated user found to complete profile.")
      }
      const updatedProfile = await saveUserToBackend({
        uid: currentUser.uid,
        phoneNumber: currentUser.phoneNumber,
        ...profileData,
        profileCompleted: true,
      })
      localStorage.setItem("user", JSON.stringify(updatedProfile))
      setCurrentUser(updatedProfile)
      navigate("/dashboard") // Redirect to dashboard after profile completion
      return { success: true, message: "Profile completed successfully." }
    } catch (error) {
      console.error("Error completing profile:", error)
      setAuthError(error.message)
      return { success: false, message: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setCurrentUser(null)
    navigate("/auth")
  }

  const value = {
    currentUser,
    loginWithPhoneNumber,
    confirmOtp,
    completeProfile,
    logout,
    authError,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
