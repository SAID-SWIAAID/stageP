"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { XCircle, CheckCircle } from "lucide-react"
import Layout from "../components/Layout"
import { getCategoriesArray } from "../data/categories"

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/categories`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      
      const data = await response.json()
      setCategories(getCategoriesArray())
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Failed to load categories. Using local data.")
      // Fallback to local data
      setCategories(getCategoriesArray())
    } finally {
      setLoading(false)
    }
  }

  const getCategoryStats = (category) => {
    // This would typically come from the backend
    // For now, we'll show placeholder stats
    return {
      totalProducts: Math.floor(Math.random() * 100) + 10,
      activeProducts: Math.floor(Math.random() * 80) + 5,
      subcategories: category.subcategories.length
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Product Categories</h1>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Product Categories</h1>
          <Button onClick={fetchCategories} variant="outline">
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const stats = getCategoryStats(category)
            return (
              <Card key={category.key} className="card-container hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">{stats.subcategories}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
                        <div className="text-xs text-gray-500">Total Products</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
                        <div className="text-xs text-gray-500">Active</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{stats.subcategories}</div>
                        <div className="text-xs text-gray-500">Subcategories</div>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Subcategories:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 4).map((sub) => (
                          <Badge key={sub.key} variant="outline" className="text-xs">
                            {sub.name}
                          </Badge>
                        ))}
                        {category.subcategories.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subcategories.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        View Products
                      </Button>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-8">
          <Card className="card-container">
            <CardHeader>
              <CardTitle>Category Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
                  <div className="text-sm text-gray-500">Total Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Subcategories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {categories.reduce((sum, cat) => sum + getCategoryStats(cat).totalProducts, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {categories.reduce((sum, cat) => sum + getCategoryStats(cat).activeProducts, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Active Products</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default CategoriesPage 