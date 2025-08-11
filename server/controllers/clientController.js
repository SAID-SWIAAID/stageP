// controllers/otpServiceController.js
const { getDatabase } = require('../config/DATABASE.JS')

/**
 * Generate and store an OTP for phone verification
 */
const generateOTP = async (req, res) => {
  const db = getDatabase()

  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }

  const { phoneNumber } = req.body

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required." })
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes validity

    const otpData = {
      phoneNumber,
      otp,
      timestamp: new Date(),
      expiresAt: new Date(expiresAt),
      used: false
    }

    // Check for existing OTP
    const existingOtpQuery = await db.collection("otps").where("phoneNumber", "==", phoneNumber).limit(1).get()

    if (!existingOtpQuery.empty) {
      // Update existing OTP
      const existingDoc = existingOtpQuery.docs[0]
      await existingDoc.ref.update(otpData)
      console.log(`Updated OTP for ${phoneNumber}: ${otp}`)
    } else {
      // Create new OTP
      await db.collection("otps").add(otpData)
      console.log(`Generated new OTP for ${phoneNumber}: ${otp}`)
    }

    res.status(200).json({
      message: "OTP sent successfully!",
      otp, // ⚠️ Remove in production
      expiresAt: new Date(expiresAt)
    })
  } catch (error) {
    console.error("Error generating OTP:", error)
    res.status(500).json({ message: "Failed to generate OTP.", error: error.message })
  }
}

/**
 * Verify OTP and create/update authentication record
 */
const verifyOTP = async (req, res) => {
  const db = getDatabase()

  if (!db) return res.status(500).json({ message: "Database not initialized. Check setup." })

  const { phoneNumber, otp } = req.body
  if (!phoneNumber || !otp) return res.status(400).json({ message: "Phone number and OTP are required." })

  try {
    // 1️⃣ Find OTP document
    const otpQuery = await db.collection("otps").where("phoneNumber", "==", phoneNumber).limit(1).get()
    if (otpQuery.empty) return res.status(400).json({ message: "No OTP found for this phone number." })

    const otpDoc = otpQuery.docs[0]
    const otpData = otpDoc.data()

    // 2️⃣ Check expiration
    const expiresAt = otpData.expiresAt.toDate ? otpData.expiresAt.toDate() : new Date(otpData.expiresAt)
    if (expiresAt < new Date()) {
      await otpDoc.ref.delete()
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    // 3️⃣ Check if already used
    if (otpData.used) return res.status(400).json({ message: "OTP has already been used." })

    // 4️⃣ Validate OTP
    if (otpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." })
    }

    // 5️⃣ Mark as used
    await otpDoc.ref.update({ used: true })

    // 6️⃣ Create or update authentication table
    const authQuery = await db.collection("authentication").where("phoneNumber", "==", phoneNumber).limit(1).get()
    let authRecord

    if (authQuery.empty) {
      const newAuthRef = await db.collection("authentication").add({
        phoneNumber,
        role: "supplier",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      authRecord = { id: newAuthRef.id, phoneNumber, role: "supplier", verified: true }
    } else {
      const doc = authQuery.docs[0]
      await doc.ref.update({
        verified: true,
        updatedAt: new Date()
      })
      authRecord = { id: doc.id, ...doc.data(), verified: true }
    }

    // 7️⃣ Delete OTP document
    await otpDoc.ref.delete()

    res.status(200).json({
      message: "OTP verified and authentication record created/updated successfully!",
      authentication: authRecord
    })

  } catch (error) {
    console.error("Error verifying OTP:", error)
    res.status(500).json({ message: "Failed to verify OTP.", error: error.message })
  }
}

/**
 * Remove expired OTPs
 */
const cleanupExpiredOTPs = async (req, res) => {
  const db = getDatabase()

  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }

  try {
    const now = new Date()
    const expiredOtpsQuery = await db.collection("otps")
      .where("expiresAt", "<", now)
      .get()

    const deletePromises = expiredOtpsQuery.docs.map(doc => doc.ref.delete())
    await Promise.all(deletePromises)

    console.log(`Cleaned up ${expiredOtpsQuery.docs.length} expired OTPs`)
    res.status(200).json({
      message: `Cleaned up ${expiredOtpsQuery.docs.length} expired OTPs`
    })
  } catch (error) {
    console.error("Error cleaning up expired OTPs:", error)
    res.status(500).json({ message: "Failed to cleanup expired OTPs.", error: error.message })
  }
}

/**
 * Get OTP status for a phone number
 */
const getOTPStatus = async (req, res) => {
  const db = getDatabase()

  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }

  const { phoneNumber } = req.params

  try {
    const otpQuery = await db.collection("otps").where("phoneNumber", "==", phoneNumber).limit(1).get()

    if (otpQuery.empty) {
      return res.status(404).json({ message: "No OTP found for this phone number." })
    }

    const otpDoc = otpQuery.docs[0]
    const otpData = otpDoc.data()

    res.status(200).json({
      phoneNumber: otpData.phoneNumber,
      expiresAt: otpData.expiresAt.toDate(),
      used: otpData.used,
      isExpired: otpData.expiresAt.toDate() < new Date()
    })
  } catch (error) {
    console.error("Error getting OTP status:", error)
    res.status(500).json({ message: "Failed to get OTP status.", error: error.message })
  }
}

module.exports = {
  generateOTP,
  verifyOTP,
  cleanupExpiredOTPs,
  getOTPStatus
}
