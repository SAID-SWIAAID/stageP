"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle, Download } from "lucide-react"
import Layout from "../components/Layout"

function ExportProductsPage() {
  const [exportFormat, setExportFormat] = useState("csv")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleExport = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    try {
      // In a real application, you would trigger a backend endpoint
      const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'
      const response = await fetch(`${BACKEND_URL}/export-products?format=${exportFormat}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Product export failed.")
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `products.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setMessage(`Products exported successfully as ${exportFormat.toUpperCase()}!`)
    } catch (err) {
      console.error("Export error:", err)
      setError(err.message || "An error occurred during export. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Export Products</h1>
        </div>

        <Card className="card-container max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Export Product Data</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleExport} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="export-format">Select Export Format</Label>
                <Select onValueChange={setExportFormat} value={exportFormat} disabled={loading}>
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    {/* Add other formats if supported by your backend */}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Export Products
                  </>
                )}
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              Your product data will be exported in the selected format.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default ExportProductsPage
