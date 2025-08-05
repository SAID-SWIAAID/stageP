"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
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

function ClientsPage() {
  const [clients, setClients] = useState([])
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", address: "" })
  const [editingClient, setEditingClient] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState(null)

  const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/clients`)
      if (!response.ok) {
        throw new Error("Failed to fetch clients.")
      }
      const data = await response.json()
      setClients(data || [])
    } catch (err) {
      setError(err.message || "Error fetching clients.")
    }
  }

  const handleAddClient = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newClient.name || !newClient.email || !newClient.phone) {
      setError("Name, Email, and Phone are required.")
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add client.")
      }

      setSuccess("Client added successfully!")
      setNewClient({ name: "", email: "", phone: "", address: "" })
      setDialogOpen(false)
      fetchClients()
    } catch (err) {
      setError(err.message || "Error adding client.")
    }
  }

  const handleUpdateClient = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!editingClient.name || !editingClient.email || !editingClient.phone) {
      setError("Name, Email, and Phone are required.")
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/clients/${editingClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingClient),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update client.")
      }

      setSuccess("Client updated successfully!")
      setEditingClient(null)
      setDialogOpen(false)
      fetchClients()
    } catch (err) {
      setError(err.message || "Error updating client.")
    }
  }

  const handleDeleteClient = async () => {
    if (!clientToDelete) return

    try {
      const response = await fetch(`${BACKEND_URL}/clients/${clientToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete client.")
      }

      setSuccess("Client deleted successfully!")
      setClientToDelete(null)
      setDeleteDialogOpen(false)
      fetchClients()
    } catch (err) {
      setError(err.message || "Error deleting client.")
    }
  }

  const openEditDialog = (client) => {
    setEditingClient({ ...client })
    setDialogOpen(true)
  }

  const openDeleteConfirmDialog = (client) => {
    setClientToDelete(client)
    setDeleteDialogOpen(true)
  }

  const closeDialogs = () => {
    setError("")
    setSuccess("")
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Clients</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingClient(null)
                  setNewClient({ name: "", email: "", phone: "", address: "" })
                  setDialogOpen(true)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingClient ? handleUpdateClient : handleAddClient} className="grid gap-4 py-4">
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
                    value={editingClient ? editingClient.name : newClient.name}
                    onChange={(e) =>
                      editingClient
                        ? setEditingClient({ ...editingClient, name: e.target.value })
                        : setNewClient({ ...newClient, name: e.target.value })
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
                    value={editingClient ? editingClient.email : newClient.email}
                    onChange={(e) =>
                      editingClient
                        ? setEditingClient({ ...editingClient, email: e.target.value })
                        : setNewClient({ ...newClient, email: e.target.value })
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
                    value={editingClient ? editingClient.phone : newClient.phone}
                    onChange={(e) =>
                      editingClient
                        ? setEditingClient({ ...editingClient, phone: e.target.value })
                        : setNewClient({ ...newClient, phone: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={editingClient ? editingClient.address : newClient.address}
                    onChange={(e) =>
                      editingClient
                        ? setEditingClient({ ...editingClient, address: e.target.value })
                        : setNewClient({ ...newClient, address: e.target.value })
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
                    {editingClient ? "Update Client" : "Add Client"}
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
            <CardTitle>Client List</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No clients found. Add your first client to get started.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.address || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteConfirmDialog(client)}
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
              Are you sure you want to delete {clientToDelete?.name}? This action cannot be undone.
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteClient}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

export default ClientsPage
 