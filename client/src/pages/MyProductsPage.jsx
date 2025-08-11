"use client"

import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { app } from "../lib/firebase" // adjust this if firebase.js is in a different folder

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle, PlusCircle, Edit, Trash2 } from "lucide-react"
import Layout from "../components/Layout"

function MyProductsPage() {
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", category: "" })
  const [editingProduct, setEditingProduct] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  // Track auth state
  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user)
      else setCurrentUser(null)
    })
    return () => unsubscribe()
  }, [])

  // Fetch products after auth is ready
  useEffect(() => {
    if (currentUser) fetchProducts()
  }, [currentUser])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/products?supplierId=${currentUser.uid}`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newProduct.name || !newProduct.price) {
      setError("Name and Price are required.")
      return
    }

    try {
      const productWithUser = {
        ...newProduct,
        supplierId: currentUser.uid,
      }

      const response = await fetch(`${BACKEND_URL}/products/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productWithUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add product.")
      }

      setSuccess("Product added successfully!")
      setNewProduct({ name: "", price: "", description: "", category: "" })
      setDialogOpen(false)
      fetchProducts()
    } catch (err) {
      setError(err.message || "Error adding product.")
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!editingProduct.name || !editingProduct.price) {
      setError("Name and Price are required.")
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingProduct),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update product.")
      }

      setSuccess("Product updated successfully!")
      setEditingProduct(null)
      setDialogOpen(false)
      fetchProducts()
    } catch (err) {
      setError(err.message || "Error updating product.")
    }
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      const response = await fetch(`${BACKEND_URL}/products/${productToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete product.")
      }

      setSuccess("Product deleted successfully!")
      setProductToDelete(null)
      setDeleteDialogOpen(false)
      fetchProducts()
    } catch (err) {
      setError(err.message || "Error deleting product.")
    }
  }

  const openEditDialog = (product) => {
    setEditingProduct({ ...product })
    setDialogOpen(true)
  }

  const openDeleteConfirmDialog = (product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const closeDialogs = () => {
    setError("")
    setSuccess("")
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="text-center text-lg py-10 text-gray-600">
          Please log in to view and manage your products.
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">My Products</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingProduct(null)
                  setNewProduct({ name: "", price: "", description: "", category: "" })
                  setDialogOpen(true)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({ ...editingProduct, name: e.target.value })
                        : setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({ ...editingProduct, price: e.target.value })
                        : setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={editingProduct ? editingProduct.category : newProduct.category}
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({ ...editingProduct, category: e.target.value })
                        : setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({ ...editingProduct, description: e.target.value })
                        : setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={closeDialogs}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="card-container">
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No products found. Add your first product to get started.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.category || "N/A"}</TableCell>
                      <TableCell>{product.description || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteConfirmDialog(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to delete {productToDelete?.name}? This action cannot be undone.
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

export default MyProductsPage
