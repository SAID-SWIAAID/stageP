"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import AppSidebar from "../components/Sidebar"

function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  // Dummy data for demonstration
  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    // fetch(`${BACKEND_URL}/invoices`).then(res => res.json()).then(data => setInvoices(data)).catch(setError);
    const dummyInvoices = [
      { id: "INV001", customer: "Alice Johnson", date: "2024-07-20", total: 150.25, status: "Paid" },
      { id: "INV002", customer: "Bob Williams", date: "2024-07-18", total: 75.5, status: "Pending" },
      { id: "INV003", customer: "Charlie Brown", date: "2024-07-15", total: 300.0, status: "Overdue" },
      { id: "INV004", customer: "Alice Johnson", date: "2024-07-10", total: 50.0, status: "Paid" },
    ]
    setInvoices(dummyInvoices)
    setLoading(false)
  }, [])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Invoices</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="search">Search by Invoice ID or Customer Name</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select onValueChange={setFilterStatus} value={filterStatus}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading invoices...</p>
            ) : filteredInvoices.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No invoices found matching your criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>${invoice.total.toFixed(2)}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
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

export default InvoicesPage
