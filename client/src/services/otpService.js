// otpService.js

const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

export async function requestOtp(phoneNumber) {
  try {
    console.log(`Requesting OTP for phone number: ${phoneNumber}`)
    console.log(`Backend URL: ${BACKEND_URL}`)

    const response = await fetch(`${BACKEND_URL}/otp/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    })

    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to request OTP.")
    }

    const data = await response.json()
    console.log("OTP response:", data)
    return data
  } catch (error) {
    console.error("Error requesting OTP:", error)
    throw error
  }
}

export async function verifyOtp(phoneNumber, otp) {
  try {
    const response = await fetch(`${BACKEND_URL}/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, otp }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify OTP.")
    }

    return data // data.message + data.user
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}
