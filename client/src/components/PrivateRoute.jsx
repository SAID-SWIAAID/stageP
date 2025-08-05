"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div>Loading authentication...</div> // Or a spinner component
  }

  if (!currentUser) {
    // Not logged in, redirect to auth page
    return <Navigate to="/auth" />
  }

  // If logged in but profile not completed, redirect to complete profile page
  // This check ensures that if a user is logged in but hasn't completed their profile,
  // they are redirected to the /complete-profile page, unless they are already on it.
  if (currentUser && currentUser.profileCompleted === false && window.location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" />
  }

  return children
}

export default PrivateRoute
