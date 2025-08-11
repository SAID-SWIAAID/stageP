"use client"

import { useState, useEffect } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "../components/ui/card"
import {
  Alert, AlertDescription, AlertTitle,
} from "../components/ui/alert"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../components/ui/select"
import {
  Button
} from "../components/ui/button"
import {
 Input
} from "../components/ui/input"
import {
   Label
} from "../components/ui/label"
import {
 Textarea
} from "../components/ui/textarea"
import { CheckCircle, XCircle, ImagePlus } from "lucide-react"
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
    boutiqueId: "",
    images: []
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [previewImages, setPreviewImages] = useState([])

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (currentUser?.uid) {
      fetchBoutiques()
    }
  }, [currentUser])

  const fetchBoutiques = async () => {
    try {
      console.log("Fetching boutiques from:", `${BACKEND_URL}/boutiques/${currentUser.uid}`);
      const res = await fetch(`${BACKEND_URL}/boutiques/${currentUser.uid}`)
      const data = await res.json()
      setBoutiques(data || [])
    } catch (err) {
      console.error("Error fetching boutiques:", err)
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setProductData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCategoryChange = (category) => {
    setProductData((prev) => ({ ...prev, category, subcategory: "" }))
  }

  const handleSubcategoryChange = (subcategory) => {
    setProductData((prev) => ({ ...prev, subcategory }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setProductData((prev) => ({ ...prev, images: files }))
    const previews = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(previews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!currentUser?.uid) {
      setError("You must be logged in to add a product.")
      setLoading(false)
      return
    }

    const required = ["name", "price", "stock", "category", "subcategory"]
    const missing = required.find((key) => !productData[key])
    if (missing) {
      setError(`Missing required field: ${missing}`)
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      const payload = {
        ...productData,
        supplierId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock)
      }

      for (const [key, value] of Object.entries(payload)) {
        if (key !== "images") {
          formData.append(key, value)
        }
      }

      productData.images.forEach((file) => {
        formData.append("images", file)
      })

      const res = await fetch(`${BACKEND_URL}/products/create`, {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Product creation failed")
      }

      setSuccess("Product created successfully!")
      setProductData({
        name: "", description: "", price: "", stock: "",
        category: "", subcategory: "", brand: "", model: "",
        sku: "", boutiqueId: "", images: []
      })
      setPreviewImages([])
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Add New Product</h1>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name*</Label>
                <Input id="name" value={productData.name} onChange={handleChange} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" value={productData.description} onChange={handleChange} className="col-span-3" />
              </div>

              {boutiques.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="boutiqueId" className="text-right">Boutique</Label>
                  <div className="col-span-3">
                    <Select value={productData.boutiqueId} onValueChange={(val) => setProductData({ ...productData, boutiqueId: val })}>
                      <SelectTrigger><SelectValue placeholder="Select boutique" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No specific boutique</SelectItem>
                        {boutiques.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <CategorySelector
                selectedCategory={productData.category}
                selectedSubcategory={productData.subcategory}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
              />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price ($)*</Label>
                <Input id="price" type="number" step="0.01" value={productData.price} onChange={handleChange} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock*</Label>
                <Input id="stock" type="number" value={productData.stock} onChange={handleChange} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="images" className="text-right">Upload Images</Label>
                <div className="col-span-3">
                  <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {previewImages.map((src, i) => (
                      <img key={i} src={src} className="h-20 w-20 object-cover border rounded" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Add Product"}
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