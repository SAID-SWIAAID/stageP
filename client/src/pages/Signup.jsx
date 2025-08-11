"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Phone, Shield, Clock, Key, Copy } from "lucide-react"

const validatePhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/[^\d+]/g, "")

  if (!cleaned.startsWith("+")) {
    return { valid: false, message: "Phone number must start with country code (e.g., +1)" }
  }

  if (cleaned.startsWith("+1") && cleaned.length !== 12) {
    return { valid: false, message: "US phone numbers must be +1 followed by 10 digits" }
  }

  if (cleaned.length < 10) {
    return { valid: false, message: "Phone number is too short" }
  }

  return { valid: true, message: "" }
}

export default function OTPApiTest() {
  const [apiUrl, setApiUrl] = useState("http://localhost:3001/api/v1/otp")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [generatedOTP, setGeneratedOTP] = useState("")
  const [customToken, setCustomToken] = useState("")

  // OTP Generation form state
  const [generateData, setGenerateData] = useState({
    phoneNumber: "",
  })

  // OTP Verification form state
  const [verifyData, setVerifyData] = useState({
    phoneNumber: "",
    otp: "",
  })

  const handleGenerateChange = (field, value) => {
    setGenerateData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleVerifyChange = (field, value) => {
    setVerifyData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const testGenerateOTP = async () => {
    const phoneValidation = validatePhoneNumber(generateData.phoneNumber)
    if (!phoneValidation.valid) {
      setResponse({
        success: false,
        status: 400,
        error: `Invalid phone number: ${phoneValidation.message}`,
        type: "validation",
      })
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generateData),
      })

      const data = await res.json()

      if (res.ok && data.otp) {
        setGeneratedOTP(data.otp)
        // Auto-fill the verification form
        setVerifyData({
          phoneNumber: generateData.phoneNumber,
          otp: data.otp,
        })
      }

      setResponse({
        success: res.ok,
        status: res.status,
        data: res.ok ? data : undefined,
        error: !res.ok ? data.message || data.error || "Unknown error" : undefined,
        type: "generate",
      })
    } catch (error) {
      setResponse({
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : "Network error",
        type: "network",
      })
    } finally {
      setLoading(false)
    }
  }

  const testVerifyOTP = async () => {
    if (!verifyData.phoneNumber || !verifyData.otp) {
      setResponse({
        success: false,
        status: 400,
        error: "Phone number and OTP are required",
        type: "validation",
      })
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch(`${apiUrl}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyData),
      })

      const data = await res.json()

      if (res.ok && data.customToken) {
        setCustomToken(data.customToken)
      }

      setResponse({
        success: res.ok,
        status: res.status,
        data: res.ok ? data : undefined,
        error: !res.ok ? data.message || data.error || "Unknown error" : undefined,
        type: "verify",
      })
    } catch (error) {
      setResponse({
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : "Network error",
        type: "network",
      })
    } finally {
      setLoading(false)
    }
  }

  const fillSampleData = () => {
    const samplePhone = "+12345678901"
    setGenerateData({ phoneNumber: samplePhone })
    setVerifyData({ phoneNumber: samplePhone, otp: "" })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "bg-green-500"
    if (status >= 400 && status < 500) return "bg-yellow-500"
    if (status >= 500) return "bg-red-500"
    return "bg-gray-500"
  }

  const formatExpiryTime = (expiresAt) => {
    if (!expiresAt) return "N/A"
    const date = new Date(expiresAt)
    return date.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">OTP API Test Page</h1>
          <p className="text-gray-600">Test your OTP generation and verification endpoints</p>
        </div>

        {/* API URL Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="api-url">OTP API Base URL</Label>
              <Input
                id="api-url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:3000/api/otp"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Test</CardTitle>
            <CardDescription>Generate and verify OTP in one flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fillSampleData} variant="outline" className="w-full bg-transparent">
              Fill Sample Phone Number
            </Button>
            {generatedOTP && (
              <Alert className="border-green-200 bg-green-50">
                <Key className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Generated OTP:</strong> {generatedOTP} (Auto-filled in verification form)
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Main Testing Interface */}
        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate OTP</TabsTrigger>
            <TabsTrigger value="verify">Verify OTP</TabsTrigger>
          </TabsList>

          {/* Generate OTP Tab */}
          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate OTP</CardTitle>
                <CardDescription>Send OTP to a phone number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="generate_phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="generate_phone"
                    value={generateData.phoneNumber}
                    onChange={(e) => handleGenerateChange("phoneNumber", e.target.value)}
                    placeholder="+12345678901 (with country code)"
                    className={`${
                      generateData.phoneNumber && !validatePhoneNumber(generateData.phoneNumber).valid
                        ? "border-red-300 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {generateData.phoneNumber && !validatePhoneNumber(generateData.phoneNumber).valid && (
                    <p className="text-sm text-red-600">{validatePhoneNumber(generateData.phoneNumber).message}</p>
                  )}
                </div>

                <Button onClick={testGenerateOTP} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating OTP...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Generate OTP
                    </>
                  )}
                </Button>

                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Note:</strong> OTP expires in 15 minutes. In development, the OTP is returned in the
                    response for testing purposes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verify OTP Tab */}
          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Verify OTP</CardTitle>
                <CardDescription>Verify the OTP code sent to the phone number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="verify_phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="verify_phone"
                      value={verifyData.phoneNumber}
                      onChange={(e) => handleVerifyChange("phoneNumber", e.target.value)}
                      placeholder="+12345678901"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verify_otp" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      OTP Code *
                    </Label>
                    <Input
                      id="verify_otp"
                      value={verifyData.otp}
                      onChange={(e) => handleVerifyChange("otp", e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                </div>

                <Button onClick={testVerifyOTP} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying OTP...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Verify OTP
                    </>
                  )}
                </Button>

                {customToken && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Custom Token (for Firebase Auth):</Label>
                    <div className="flex gap-2">
                      <Input value={customToken} readOnly className="font-mono text-xs" />
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(customToken)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Response Display */}
        {response && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {response.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                API Response
                <Badge className={`ml-auto ${getStatusColor(response.status)} text-white`}>
                  {response.status || "Network Error"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {response.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Success!</strong>{" "}
                    {response.type === "generate"
                      ? "OTP generated successfully. Check the response for the OTP code."
                      : "OTP verified successfully. Authentication record created."}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Error:</strong> {response.error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-4">
                <Label className="text-sm font-medium">Response Data:</Label>
                <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(response.data || { error: response.error }, null, 2)}
                </pre>
              </div>

              {/* Special handling for different response types */}
              {response.success && response.type === "generate" && response.data && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">OTP Details:</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div>
                      <strong>OTP Code:</strong> {response.data.otp}
                    </div>
                    <div>
                      <strong>Expires At:</strong> {formatExpiryTime(response.data.expiresAt)}
                    </div>
                    <div>
                      <strong>Valid For:</strong> 15 minutes
                    </div>
                  </div>
                </div>
              )}

              {response.success && response.type === "verify" && response.data && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Authentication Success:</h4>
                  <div className="space-y-1 text-sm text-green-700">
                    {response.data.authentication && (
                      <>
                        <div>
                          <strong>User ID:</strong> {response.data.authentication.id}
                        </div>
                        <div>
                          <strong>Phone:</strong> {response.data.authentication.phoneNumber}
                        </div>
                        <div>
                          <strong>Role:</strong> {response.data.authentication.role}
                        </div>
                        <div>
                          <strong>Verified:</strong> {response.data.authentication.verified ? "Yes" : "No"}
                        </div>
                      </>
                    )}
                    {response.data.customToken && (
                      <div>
                        <strong>Custom Token:</strong> Generated for Firebase Auth
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Test Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Test Scenarios</CardTitle>
            <CardDescription>Common test cases for OTP functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-700">✅ Valid Test Cases</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Generate OTP with valid phone number</li>
                  <li>• Verify OTP with correct code</li>
                  <li>• Complete flow: Generate → Verify</li>
                  <li>• Check custom token generation</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-red-700">❌ Error Test Cases</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Generate OTP without phone number</li>
                  <li>• Verify with wrong OTP code</li>
                  <li>• Verify expired OTP (wait 15+ minutes)</li>
                  <li>• Verify already used OTP</li>
                  <li>• Invalid phone number format</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Flow Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>OTP Flow Explanation</CardTitle>
            <CardDescription>Understanding how your OTP system works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">1</Badge>
                <div>
                  <h4 className="font-medium">Generate OTP</h4>
                  <p className="text-sm text-gray-600">
                    Creates a 6-digit OTP, stores it in Firestore with 15-minute expiry
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">2</Badge>
                <div>
                  <h4 className="font-medium">Send OTP</h4>
                  <p className="text-sm text-gray-600">
                    In production, OTP would be sent via SMS. In development, it's returned in the response
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">3</Badge>
                <div>
                  <h4 className="font-medium">Verify OTP</h4>
                  <p className="text-sm text-gray-600">
                    Validates OTP, creates/updates authentication record, generates Firebase custom token
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">4</Badge>
                <div>
                  <h4 className="font-medium">Firebase Integration</h4>
                  <p className="text-sm text-gray-600">
                    Creates Firebase Auth user if needed, returns custom token for client authentication
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
