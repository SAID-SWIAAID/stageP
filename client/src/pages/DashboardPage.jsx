"use client"

import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"

function DashboardPage() {
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out:", error)
      alert("Failed to log out. Please try again.")
    }
  }

  return (
    <Layout>
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h1>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>

        {/* Welcome Card */}
        <div className="mb-10">
          <Card className="card-container">
            <CardHeader>
              <CardTitle className="text-center">
                Welcome, {currentUser?.name || currentUser?.email || currentUser?.phoneNumber || "User"}!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                This is your personalized dashboard. You can navigate through different sections using the sidebar.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>Your UID: {currentUser?.uid}</p>
                <p>Phone: {currentUser?.phoneNumber}</p>
                <p>Email: {currentUser?.email}</p>
                <p>Profile Completed: {currentUser?.profileCompleted ? "Yes" : "No"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-container">
            <CardHeader>
              <CardTitle>My Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your product listings.</p>
              <Link to="/my-products">
                <Button className="w-full">Go to Products</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">View and manage your stock.</p>
              <Link to="/inventory">
                <Button className="w-full">View Inventory</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your client relationships.</p>
              <Link to="/clients">
                <Button className="w-full">Manage Clients</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Track and process customer orders.</p>
              <Link to="/orders">
                <Button className="w-full">View Orders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">View your sales performance.</p>
              <Link to="/sales-history">
                <Button className="w-full">View Sales</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Analyze your business metrics.</p>
              <Link to="/statistics">
                <Button className="w-full">View Stats</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage