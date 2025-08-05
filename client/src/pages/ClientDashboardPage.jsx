"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import  AppSidebar  from "../components/Sidebar" // Assuming Sidebar is now AppSidebar

function ClientDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Client Dashboard</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome, Client!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is your dedicated dashboard. Here you can manage your orders, view product catalogs, and more.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">View the status and history of your orders.</p>
              <Link to="/orders">
                <Button className="w-full">View Orders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Browse available products from suppliers.</p>
              <Link to="/catalog">
                <Button className="w-full">Browse Catalog</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Access and manage your invoices.</p>
              <Link to="/invoices">
                <Button className="w-full">View Invoices</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ClientDashboardPage
