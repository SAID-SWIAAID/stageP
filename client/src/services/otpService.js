// This file handles client-side interactions with your backend's OTP APIs.

// Use import.meta.env for Vite environment variables
const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

/**
 * Requests an OTP from the backend for a given phone number.
 * @param {string} phoneNumber - The phone number to send the OTP to.
 * @returns {Promise<object>} The response from the backend, typically containing a success message.
 */
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

/**
 * Verifies an OTP with the backend for a given phone number.
 * @param {string} phoneNumber - The phone number associated with the OTP.
 * @param {string} otp - The OTP entered by the user.
 * @returns {Promise<object>} The response from the backend, typically containing a success message.
 */
export async function verifyOtp(phoneNumber, otp) {
  try {
    console.log(`Verifying OTP for phone number: ${phoneNumber}`)
    console.log(`OTP: ${otp}`)
    
    const response = await fetch(`${BACKEND_URL}/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, otp }),
    })

    console.log(`Verification response status: ${response.status}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to verify OTP.")
    }

    const data = await response.json()
    console.log("OTP verification response:", data)
    return data
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}
