"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { XCircle } from "lucide-react"
import Layout from "../components/Layout"

function StatisticsPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentOrders: []
  })
  const [error, setError] = useState("")

  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      // In a real application, you would have a dedicated statistics endpoint
      // For now, we'll simulate the data
      const mockStats = {
        totalProducts: 25,
        totalOrders: 150,
        totalRevenue: 12500.50,
        averageOrderValue: 83.34,
        topProducts: [
          { name: "Product A", sales: 45 },
          { name: "Product B", sales: 32 },
          { name: "Product C", sales: 28 }
        ],
        recentOrders: [
          { id: "ORD001", customer: "Alice Johnson", amount: 150.25, date: "2024-01-15" },
          { id: "ORD002", customer: "Bob Williams", amount: 75.50, date: "2024-01-14" },
          { id: "ORD003", customer: "Charlie Brown", amount: 300.00, date: "2024-01-13" }
        ]
      }
      setStats(mockStats)
    } catch (err) {
      setError(err.message || "Error fetching statistics.")
    }
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Statistics</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active products in inventory</p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Orders processed</p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total sales revenue</p>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Average order value</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-container">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">{product.sales} sales</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{order.customer}</span>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <span className="font-medium">${order.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default StatisticsPage
