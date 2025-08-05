"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { XCircle } from "lucide-react"
import Layout from "../components/Layout"

function StockPage() {
  const [products, setProducts] = useState([])
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
      setError(err.message || "Error fetching products.")
    }
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Stock Management</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="card-container">
          <CardHeader>
            <CardTitle>Current Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No products found in stock.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category || "N/A"}</TableCell>
                      <TableCell>{product.stock || 0}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          (product.stock || 0) > 20 
                            ? "bg-green-100 text-green-800" 
                            : (product.stock || 0) > 5 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }`}>
                          {(product.stock || 0) > 20 ? "Well Stocked" : (product.stock || 0) > 5 ? "Low Stock" : "Critical"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default StockPage
