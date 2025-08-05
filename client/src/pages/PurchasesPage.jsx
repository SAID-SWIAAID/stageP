"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import AppSidebar from "../components/Sidebar"

function PurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [error, setError] = useState("")

  // Dummy data for demonstration
  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    // fetch(`${BACKEND_URL}/purchases`).then(res => res.json()).then(data => setPurchases(data)).catch(setError);
    const dummyPurchases = [
      {
        id: "P001",
        date: "2024-07-15",
        supplier: "Supplier X",
        total: 500.0,
        items: [{ name: "Raw Material A", qty: 10 }],
      },
      {
        id: "P002",
        date: "2024-07-10",
        supplier: "Supplier Y",
        total: 250.5,
        items: [{ name: "Component B", qty: 5 }],
      },
      {
        id: "P003",
        date: "2024-07-05",
        supplier: "Supplier X",
        total: 1200.0,
        items: [{ name: "Packaging Z", qty: 100 }],
      },
    ]
    setPurchases(dummyPurchases)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Purchases</h1>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            {purchases.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No purchase records found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.id}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>${purchase.total.toFixed(2)}</TableCell>
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

export default PurchasesPage
