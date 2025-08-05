"use client"

import { useState, useEffect, useCallback } from "react"
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
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle, PlusCircle, Edit, Trash2 } from "lucide-react"
import Layout from "../components/Layout"

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [newSupplier, setNewSupplier] = useState({ name: "", email: "", phone: "", address: "", contactPerson: "" })
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState(null)
  const [loading, setLoading] = useState(false)

  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/suppliers`)
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers.")
      }
      const data = await response.json()
      setSuppliers(data || [])
    } catch (err) {
      setError(err.message || "Error fetching suppliers.")
    }
  }, [BACKEND_URL])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const handleAddSupplier = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!newSupplier.name || !newSupplier.email || !newSupplier.phone) {
      setError("Name, Email, and Phone are required.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSupplier),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add supplier.")
      }

      setSuccess("Supplier added successfully!")
      setNewSupplier({ name: "", email: "", phone: "", address: "", contactPerson: "" })
      setDialogOpen(false)
      fetchSuppliers()
    } catch (err) {
      setError(err.message || "Error adding supplier.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSupplier = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!editingSupplier.name || !editingSupplier.email || !editingSupplier.phone) {
      setError("Name, Email, and Phone are required.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/suppliers/${editingSupplier.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSupplier),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update supplier.")
      }

      setSuccess("Supplier updated successfully!")
      setEditingSupplier(null)
      setDialogOpen(false)
      fetchSuppliers()
    } catch (err) {
      setError(err.message || "Error updating supplier.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return

    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/suppliers/${supplierToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete supplier.")
      }

      setSuccess("Supplier deleted successfully!")
      setSupplierToDelete(null)
      setDeleteDialogOpen(false)
      fetchSuppliers()
    } catch (err) {
      setError(err.message || "Error deleting supplier.")
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (supplier) => {
    setEditingSupplier({ ...supplier })
    setDialogOpen(true)
  }

  const openDeleteConfirmDialog = (supplier) => {
    setSupplierToDelete(supplier)
    setDeleteDialogOpen(true)
  }

  const closeDialogs = () => {
    setError("")
    setSuccess("")
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSupplier(null)
                setNewSupplier({ name: "", email: "", phone: "", address: "", contactPerson: "" })
                setDialogOpen(true)
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={editingSupplier ? handleUpdateSupplier : handleAddSupplier} className="grid gap-4 py-4">
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
                  value={editingSupplier ? editingSupplier.name : newSupplier.name}
                  onChange={(e) =>
                    editingSupplier
                      ? setEditingSupplier({ ...editingSupplier, name: e.target.value })
                      : setNewSupplier({ ...newSupplier, name: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editingSupplier ? editingSupplier.email : newSupplier.email}
                  onChange={(e) =>
                    editingSupplier
                      ? setEditingSupplier({ ...editingSupplier, email: e.target.value })
                      : setNewSupplier({ ...newSupplier, email: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editingSupplier ? editingSupplier.phone : newSupplier.phone}
                  onChange={(e) =>
                    editingSupplier
                      ? setEditingSupplier({ ...editingSupplier, phone: e.target.value })
                      : setNewSupplier({ ...newSupplier, phone: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactPerson" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  value={editingSupplier ? editingSupplier.contactPerson : newSupplier.contactPerson}
                  onChange={(e) =>
                    editingSupplier
                      ? setEditingSupplier({ ...editingSupplier, contactPerson: e.target.value })
                      : setNewSupplier({ ...newSupplier, contactPerson: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={editingSupplier ? editingSupplier.address : newSupplier.address}
                  onChange={(e) =>
                    editingSupplier
                      ? setEditingSupplier({ ...editingSupplier, address: e.target.value })
                      : setNewSupplier({ ...newSupplier, address: e.target.value })
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
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingSupplier ? "Update Supplier" : "Add Supplier"}
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
          <CardTitle>Supplier List</CardTitle>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No suppliers found. Add your first supplier to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson || "N/A"}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.address || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteConfirmDialog(supplier)}
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
            Are you sure you want to delete {supplierToDelete?.name}? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteSupplier} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export default SuppliersPage
