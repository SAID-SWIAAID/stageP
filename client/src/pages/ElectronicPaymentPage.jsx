"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, XCircle, CreditCard, DollarSign } from "lucide-react"
import AppSidebar from "../components/Sidebar"

function ElectronicPaymentPage() {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setPaymentData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleMethodChange = (value) => {
    setPaymentData((prevData) => ({
      ...prevData,
      method: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    if (!paymentData.amount || !paymentData.method) {
      setError("Amount and Payment Method are required.")
      setLoading(false)
      return
    }

    if (
      paymentData.method === "credit_card" &&
      (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv)
    ) {
      setError("Credit card details are required for card payments.")
      setLoading(false)
      return
    }

    try {
      // Simulate API call to a payment gateway
      // const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      // const response = await fetch(`${BACKEND_URL}/process-payment`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentData),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Payment failed.');
      // }
      // const result = await response.json();
      // setMessage(result.message || 'Payment processed successfully!');

      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay
      setMessage(
        `Payment of $${Number.parseFloat(paymentData.amount).toFixed(2)} processed successfully via ${paymentData.method}! (Simulated)`,
      )
      setPaymentData({ amount: "", method: "", cardNumber: "", expiryDate: "", cvv: "" }) // Clear form
    } catch (err) {
      console.error("Payment error:", err)
      setError(err.message || "An error occurred during payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Electronic Payment</h1>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Process Payment</CardTitle>
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
              <Alert variant="default" className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 100.00"
                    value={paymentData.amount}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select onValueChange={handleMethodChange} value={paymentData.method} disabled={loading}>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentData.method === "credit_card" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={paymentData.cardNumber}
                        onChange={handleChange}
                        maxLength="19" // Includes spaces
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={handleChange}
                        maxLength="5"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="XXX"
                        value={paymentData.cvv}
                        onChange={handleChange}
                        maxLength="4"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing Payment..." : "Submit Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default ElectronicPaymentPage
