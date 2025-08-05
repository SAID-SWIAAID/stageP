"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Badge } from "../components/ui/badge"
import { CheckCircle, XCircle, Plus, Edit, Trash2, Store } from "lucide-react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"

function BoutiqueManagementPage() {
  const { currentUser } = useAuth()
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBoutique, setEditingBoutique] = useState(null)
  const [boutiqueData, setBoutiqueData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    category: "",
    logo: "",
    banner: ""
  })

  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (currentUser?.uid) {
      fetchBoutiques()
    }
  }, [currentUser])

  const fetchBoutiques = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/boutiques/${currentUser.uid}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch boutiques")
      }
      
      const data = await response.json()
      setBoutiques(data)
    } catch (err) {
      console.error("Error fetching boutiques:", err)
      setError("Failed to load boutiques.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!boutiqueData.name || !boutiqueData.description) {
      setError("Name and description are required.")
      return
    }

    try {
      const url = editingBoutique 
        ? `${BACKEND_URL}/boutiques/${editingBoutique.id}`
        : `${BACKEND_URL}/boutiques`
      
      const method = editingBoutique ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...boutiqueData,
          supplierId: currentUser.uid,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save boutique.")
      }

      setSuccess(editingBoutique ? "Boutique updated successfully!" : "Boutique created successfully!")
      setIsDialogOpen(false)
      setEditingBoutique(null)
      setBoutiqueData({
        name: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        category: "",
        logo: "",
        banner: ""
      })
      fetchBoutiques()
    } catch (err) {
      console.error("Error saving boutique:", err)
      setError(err.message || "Error saving boutique. Please try again.")
    }
  }

  const handleEdit = (boutique) => {
    setEditingBoutique(boutique)
    setBoutiqueData({
      name: boutique.name,
      description: boutique.description,
      address: boutique.address,
      phone: boutique.phone,
      email: boutique.email,
      category: boutique.category,
      logo: boutique.logo,
      banner: boutique.banner
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (boutiqueId) => {
    if (!confirm("Are you sure you want to delete this boutique?")) {
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/boutiques/${boutiqueId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete boutique.")
      }

      setSuccess("Boutique deleted successfully!")
      fetchBoutiques()
    } catch (err) {
      console.error("Error deleting boutique:", err)
      setError("Failed to delete boutique.")
    }
  }

  const openNewBoutiqueDialog = () => {
    setEditingBoutique(null)
    setBoutiqueData({
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      category: "",
      logo: "",
      banner: ""
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">My Boutiques</h1>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading boutiques...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">My Boutiques</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewBoutiqueDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Boutique
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingBoutique ? "Edit Boutique" : "Create New Boutique"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Boutique Name *</Label>
                    <Input
                      id="name"
                      value={boutiqueData.name}
                      onChange={(e) => setBoutiqueData({...boutiqueData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={boutiqueData.category}
                      onChange={(e) => setBoutiqueData({...boutiqueData, category: e.target.value})}
                      placeholder="e.g., Electronics, Fashion"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={boutiqueData.description}
                    onChange={(e) => setBoutiqueData({...boutiqueData, description: e.target.value})}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={boutiqueData.phone}
                      onChange={(e) => setBoutiqueData({...boutiqueData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={boutiqueData.email}
                      onChange={(e) => setBoutiqueData({...boutiqueData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={boutiqueData.address}
                    onChange={(e) => setBoutiqueData({...boutiqueData, address: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={boutiqueData.logo}
                      onChange={(e) => setBoutiqueData({...boutiqueData, logo: e.target.value})}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="banner">Banner URL</Label>
                    <Input
                      id="banner"
                      value={boutiqueData.banner}
                      onChange={(e) => setBoutiqueData({...boutiqueData, banner: e.target.value})}
                      placeholder="https://example.com/banner.png"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBoutique ? "Update Boutique" : "Create Boutique"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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

        {boutiques.length === 0 ? (
          <Card className="card-container">
            <CardContent className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                No boutiques yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first boutique to start selling your products.
              </p>
              <Button onClick={openNewBoutiqueDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Boutique
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boutiques.map((boutique) => (
              <Card key={boutique.id} className="card-container hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Store className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-lg">{boutique.name}</CardTitle>
                    </div>
                    <Badge variant={boutique.isActive ? "default" : "secondary"}>
                      {boutique.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {boutique.description}
                    </p>
                    
                    {boutique.category && (
                      <Badge variant="outline" className="text-xs">
                        {boutique.category}
                      </Badge>
                    )}

                    <div className="text-sm text-gray-500 space-y-1">
                      {boutique.address && (
                        <p>📍 {boutique.address}</p>
                      )}
                      {boutique.phone && (
                        <p>📞 {boutique.phone}</p>
                      )}
                      {boutique.email && (
                        <p>✉️ {boutique.email}</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Products
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(boutique)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(boutique.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default BoutiqueManagementPage 