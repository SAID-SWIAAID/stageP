"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import AppSidebar from "../components/Sidebar"

function SalesHistoryPage() {
  const [sales, setSales] = useState([])
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  // Dummy data for demonstration
  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    // fetch(`${BACKEND_URL}/sales-history`).then(res => res.json()).then(data => setSales(data)).catch(setError);
    const dummySales = [
      { id: "S001", date: "2024-07-28", product: "Laptop Pro", quantity: 1, amount: 1200.0 },
      { id: "S002", date: "2024-07-27", product: "Wireless Mouse", quantity: 2, amount: 50.0 },
      { id: "S003", date: "2024-07-26", product: "Mechanical Keyboard", quantity: 1, amount: 150.0 },
      { id: "S004", date: "2024-06-15", product: "Monitor 27-inch", quantity: 1, amount: 300.0 },
      { id: "S005", date: "2024-05-01", product: "Webcam HD", quantity: 3, amount: 90.0 },
    ]
    setSales(dummySales)
    setLoading(false)
  }, [])

  const filterSalesByPeriod = (salesData, period) => {
    const now = new Date()
    return salesData.filter((sale) => {
      const saleDate = new Date(sale.date)
      if (period === "today") {
        return saleDate.toDateString() === now.toDateString()
      } else if (period === "last7days") {
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(now.getDate() - 7)
        return saleDate >= sevenDaysAgo
      } else if (period === "last30days") {
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(now.getDate() - 30)
        return saleDate >= thirtyDaysAgo
      } else if (period === "thismonth") {
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
      } else if (period === "thisyear") {
        return saleDate.getFullYear() === now.getFullYear()
      }
      return true // "all" or unrecognized period
    })
  }

  const filteredSales = filterSalesByPeriod(sales, filterPeriod).filter(
    (sale) =>
      sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Sales History</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="search">Search by Product or Sale ID</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter product name or sale ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="period-filter">Filter by Period</Label>
                <Select onValueChange={setFilterPeriod} value={filterPeriod}>
                  <SelectTrigger id="period-filter">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                    <SelectItem value="thismonth">This Month</SelectItem>
                    <SelectItem value="thisyear">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>All Sales Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading sales data...</p>
            ) : filteredSales.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No sales records found matching your criteria.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>${sale.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default SalesHistoryPage
