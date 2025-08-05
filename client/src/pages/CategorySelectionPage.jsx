"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import  AppSidebar  from "../components/Sidebar" // Assuming Sidebar is now AppSidebar

function CategorySelectionPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const categories = [
    "Electronics",
    "Apparel",
    "Home Goods",
    "Books",
    "Sports & Outdoors",
    "Toys & Games",
    "Beauty & Personal Care",
    "Food & Beverages",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!selectedCategory) {
      setError("Please select a category.")
      setLoading(false)
      return
    }

    try {
      // Simulate API call to save category preference
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      console.log("Selected category:", selectedCategory)
      setSuccess(`Category "${selectedCategory}" saved successfully!`)
      // In a real app, you'd send this to your backend:
      // const response = await fetch('/api/user/category-preference', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ category: selectedCategory })
      // });
      // if (!response.ok) throw new Error('Failed to save category.');
    } catch (err) {
      console.error("Error saving category:", err)
      setError(err.message || "Failed to save category. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Category Selection</h1>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Choose Your Primary Product Category</CardTitle>
            <CardDescription>This helps us tailor your experience and recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="grid gap-6">
              <RadioGroup
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="grid grid-cols-2 gap-4"
              >
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value={category} id={category} />
                    <Label htmlFor={category}>{category}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Category"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default CategorySelectionPage
