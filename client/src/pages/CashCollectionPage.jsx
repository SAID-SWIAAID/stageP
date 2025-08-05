"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
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
import { CheckCircle, XCircle, PlusCircle } from "lucide-react"
import  AppSidebar  from "../components/Sidebar" // Assuming Sidebar is now AppSidebar

function CashCollectionPage() {
  const [collections, setCollections] = useState([])
  const [newCollection, setNewCollection] = useState({ date: "", amount: "", source: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Dummy data for demonstration
  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    // fetch(`${BACKEND_URL}/cash-collections`).then(res => res.json()).then(data => setCollections(data)).catch(setError);
    const dummyCollections = [
      { id: "CC001", date: "2024-07-25", amount: 500.0, source: "Client A Payment" },
      { id: "CC002", date: "2024-07-24", amount: 120.5, source: "Retail Sales" },
      { id: "CC003", date: "2024-07-23", amount: 750.0, source: "Client B Payment" },
    ]
    setCollections(dummyCollections)
  }, [])

  const handleAddCollection = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newCollection.date || !newCollection.amount || !newCollection.source) {
      setError("All fields are required.")
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const addedCollection = {
        id: `CC${Date.now()}`,
        ...newCollection,
        amount: Number.parseFloat(newCollection.amount),
      }
      setCollections((prev) => [...prev, addedCollection])
      setSuccess("Cash collection recorded successfully!")
      setNewCollection({ date: "", amount: "", source: "" })
      setDialogOpen(false)
    } catch (err) {
      setError(err.message || "Error recording cash collection.")
    }
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setNewCollection({ date: "", amount: "", source: "" })
    setError("")
    setSuccess("")
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Cash Collection</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Record Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record New Cash Collection</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCollection} className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newCollection.date}
                    onChange={(e) => setNewCollection({ ...newCollection, date: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount ($)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newCollection.amount}
                    onChange={(e) => setNewCollection({ ...newCollection, amount: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="source" className="text-right">
                    Source
                  </Label>
                  <Input
                    id="source"
                    type="text"
                    value={newCollection.source}
                    onChange={(e) => setNewCollection({ ...newCollection, source: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Client Payment, Retail Sales"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Record Collection</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={closeDialog}>
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {success && (
          <Alert className="mb-4" variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-4" variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Cash Collection History</CardTitle>
          </CardHeader>
          <CardContent>
            {collections.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No cash collections recorded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">{collection.date}</TableCell>
                      <TableCell>${collection.amount?.toFixed(2)}</TableCell>
                      <TableCell>{collection.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default CashCollectionPage
