"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import AppSidebar from "../components/Sidebar"

function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  // Dummy data for demonstration
  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    // fetch(`${BACKEND_URL}/expenses`).then(res => res.json()).then(data => setExpenses(data)).catch(setError);
    const dummyExpenses = [
      { id: "EXP001", date: "2024-07-28", category: "Rent", amount: 1500.0, description: "Office rent" },
      { id: "EXP002", date: "2024-07-27", category: "Utilities", amount: 120.5, description: "Electricity bill" },
      { id: "EXP003", date: "2024-07-26", category: "Supplies", amount: 50.0, description: "Office supplies" },
      { id: "EXP004", date: "2024-07-25", category: "Salaries", amount: 5000.0, description: "Monthly salaries" },
    ]
    setExpenses(dummyExpenses)
    setLoading(false)
  }, [])

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Expenses</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="search">Search by Description or ID</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter description or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-filter">Filter by Category</Label>
                <Select onValueChange={setFilterCategory} value={filterCategory}>
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Salaries">Salaries</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading expenses...</p>
            ) : filteredExpenses.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No expenses found matching your criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.id}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>{expense.description}</TableCell>
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

export default ExpensesPage
