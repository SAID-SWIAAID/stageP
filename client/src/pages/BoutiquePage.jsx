"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { XCircle } from "lucide-react"
import Layout from "../components/Layout"

function BoutiquePage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/products`)
      if (!response.ok) {
        throw new Error("Failed to fetch products.")
      }
      const data = await response.json()
      setProducts(data || [])
    } catch (err) {
      setError(err.message || "Error fetching products for boutique.")
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Boutique</h1>
        </div>

        <Card className="card-container mb-6">
          <CardHeader>
            <CardTitle>Browse Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="search">Search Products</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="card-container">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{product.description || "No description available"}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                    ${product.price?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">In Stock: {product.stock || 0}</p>
                  <Button className="mt-4 w-full">Add to Cart</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default BoutiquePage
