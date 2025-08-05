"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import Layout from "../components/Layout"
import CategorySelector from "../components/CategorySelector"
import { useAuth } from "../context/AuthContext"

function AddProductPage() {
  const { currentUser } = useAuth()
  const [boutiques, setBoutiques] = useState([])
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    sku: "",
    weight: "",
    dimensions: "",
    color: "",
    material: "",
    warranty: "",
    supplier: "",
    supplierId: currentUser?.uid || "",
    boutiqueId: "",
    tags: "",
    images: []
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // Fix the backend URL - use the correct port
  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (currentUser?.uid) {
      fetchBoutiques()
    }
  }, [currentUser])

  const fetchBoutiques = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/boutiques/${currentUser.uid}`)
      if (response.ok) {
        const data = await response.json()
        setBoutiques(data)
      }
    } catch (err) {
      console.error("Error fetching boutiques:", err)
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setProductData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleCategoryChange = (category) => {
    setProductData((prevData) => ({
      ...prevData,
      category,
      subcategory: "" // Reset subcategory when category changes
    }))
  }

  const handleSubcategoryChange = (subcategory) => {
    setProductData((prevData) => ({
      ...prevData,
      subcategory
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Check if user is authenticated
    if (!currentUser?.uid) {
      setError("You must be logged in to add products.")
      setLoading(false)
      return
    }

    // Enhanced validation - remove supplierId from validation since it's auto-set
    if (!productData.name || !productData.price || !productData.stock || !productData.category || !productData.subcategory) {
      setError("Name, Price, Stock, Category, and Subcategory are required fields.")
      setLoading(false)
      return
    }

    try {
      console.log("Sending product data to:", `${BACKEND_URL}/products`)
      console.log("Product data:", productData)

      const productPayload = {
        ...productData,
        price: Number.parseFloat(productData.price),
        stock: Number.parseInt(productData.stock, 10),
        weight: productData.weight ? Number.parseFloat(productData.weight) : null,
        tags: productData.tags ? productData.tags.split(',').map(tag => tag.trim()) : [],
        supplierId: currentUser.uid, // Always set the supplier ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      console.log("Final product payload:", productPayload)

      const response = await fetch(`${BACKEND_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error:", errorData)
        throw new Error(errorData.message || "Failed to add product.")
      }

      const result = await response.json()
      console.log("Product added successfully:", result)

      setSuccess("Product added successfully!")
      setProductData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        subcategory: "",
        brand: "",
        model: "",
        sku: "",
        weight: "",
        dimensions: "",
        color: "",
        material: "",
        warranty: "",
        supplier: "",
        supplierId: currentUser?.uid || "",
        boutiqueId: "",
        tags: "",
        images: []
      })
    } catch (err) {
      console.error("Error adding product:", err)
      setError(err.message || "Error adding product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Add New Product</h1>
        </div>

        <Card className="card-container max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 border-b pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={productData.description}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Provide a detailed description of the product"
                    rows={4}
                  />
                </div>

                {/* Boutique Selection */}
                {boutiques.length > 0 && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="boutiqueId" className="text-right">
                      Boutique
                    </Label>
                    <div className="col-span-3">
                      <Select 
                        value={productData.boutiqueId} 
                        onValueChange={(value) => setProductData({...productData, boutiqueId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a boutique (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No specific boutique</SelectItem>
                          {boutiques.map((boutique) => (
                            <SelectItem key={boutique.id} value={boutique.id}>
                              {boutique.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Category Selection */}
                <CategorySelector
                  selectedCategory={productData.category}
                  selectedSubcategory={productData.subcategory}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={handleSubcategoryChange}
                  required={true}
                />

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="brand" className="text-right">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">
                    Model
                  </Label>
                  <Input
                    id="model"
                    value={productData.model}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Enter model number"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    value={productData.sku}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Enter SKU (Stock Keeping Unit)"
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 border-b pb-2">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.price}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={productData.stock}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Physical Properties */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 border-b pb-2">
                  Physical Properties
                </h3>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.weight}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dimensions" className="text-right">
                    Dimensions
                  </Label>
                  <Input
                    id="dimensions"
                    value={productData.dimensions}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="L x W x H (cm)"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Color
                  </Label>
                  <Input
                    id="color"
                    value={productData.color}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Enter color"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="material" className="text-right">
                    Material
                  </Label>
                  <Input
                    id="material"
                    value={productData.material}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Enter material"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 border-b pb-2">
                  Additional Information
                </h3>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="warranty" className="text-right">
                    Warranty
                  </Label>
                  <Input
                    id="warranty"
                    value={productData.warranty}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="e.g., 1 year, 2 years"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier Name
                  </Label>
                  <Input
                    id="supplier"
                    value={productData.supplier}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Enter supplier name"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={productData.tags}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={loading} className="px-8">
                  {loading ? "Adding Product..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default AddProductPage
