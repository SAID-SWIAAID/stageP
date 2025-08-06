const { getDatabase } = require('../config/DATABASE.JS')

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
    const expiresAt = Date.now() + 15 * 60 * 1000 // OTP valid for 15 minutes

    // Store OTP data
    const otpData = {
      phoneNumber: phoneNumber,
      otp: otp,
      timestamp: new Date(),
      expiresAt: new Date(expiresAt),
      used: false
    }

    // Check if there's an existing OTP for this phone number
    const existingOtpQuery = await db.collection("otps").where("phoneNumber", "==", phoneNumber).limit(1).get()
    
    if (!existingOtpQuery.empty) {
      // Update existing OTP
      const existingDoc = existingOtpQuery.docs[0]
      await existingDoc.ref.update(otpData)
      console.log(`Updated OTP for ${phoneNumber}: ${otp}`)
    } else {
      // Create new OTP document
      await db.collection("otps").add(otpData)
      console.log(`Generated new OTP for ${phoneNumber}: ${otp}`)
    }

    res.status(200).json({ 
      message: "OTP sent successfully!", 
      otp: otp, // For development/testing purposes
      expiresAt: new Date(expiresAt)
    })
  } catch (error) {
    console.error("Error generating OTP:", error)
    res.status(500).json({ message: "Failed to generate OTP.", error: error.message })
  }
}

const verifyOTP = async (req, res) => {
  const db = getDatabase()
  
  if (!db) return res.status(500).json({ message: "Database not initialized. Check setup." })

  const { phoneNumber, otp } = req.body
  if (!phoneNumber || !otp) return res.status(400).json({ message: "Phone number and OTP are required." })

  try {
    const otpQuery = await db.collection("otps").where("phoneNumber", "==", phoneNumber).limit(1).get()
    if (otpQuery.empty) return res.status(400).json({ message: "No OTP found for this phone number." })

    const otpDoc = otpQuery.docs[0]
    const otpData = otpDoc.data()

    const expiresAt = otpData.expiresAt.toDate ? otpData.expiresAt.toDate() : new Date(otpData.expiresAt)
    if (expiresAt < new Date()) {
      await otpDoc.ref.delete()
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }
    if (otpData.used) return res.status(400).json({ message: "OTP has already been used." })

    if (otpData.otp === otp) {
      await otpDoc.ref.update({ used: true })

      // Create or fetch user
      let user
      const userQuery = await db.collection("users").where("phoneNumber", "==", phoneNumber).limit(1).get()
      if (userQuery.empty) {
        const newUserRef = await db.collection("users").add({
          phoneNumber,
          profileCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        user = { uid: newUserRef.id, phoneNumber, profileCompleted: false }
      } else {
        const doc = userQuery.docs[0]
        user = { uid: doc.id, ...doc.data() }
      }

      await otpDoc.ref.delete()
      return res.status(200).json({ message: "OTP verified successfully!", user })
    } else {
      return res.status(400).json({ message: "Invalid OTP." })
    }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    res.status(500).json({ message: "Failed to verify OTP.", error: error.message })
  }
}


const registerUser = async (req, res) => {
  const db = getDatabase()
  
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." })
  }
  
  const { phoneNumber, otp } = req.body
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: "Phone number and OTP are required." })
  }
  
  try {
    const userData = {
      phoneNumber: phoneNumber,
      otp: otp,
      timestamp: new Date(),
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    // Check if user already exists
    const existingUserQuery = await db.collection("users").where("phoneNumber", "==", phoneNumber).limit(1).get()
    
    if (!existingUserQuery.empty) {
      // Update existing user
      const existingDoc = existingUserQuery.docs[0]
      await existingDoc.ref.update({
        ...userData,
        updatedAt: new Date()
      })
      console.log(`Updated user profile for ${phoneNumber}`)
    } else {
      // Create new user
      await db.collection("users").add(userData)
      console.log(`Created new user profile for ${phoneNumber}`)
    }
    
    res.status(200).json({ message: "User registered successfully.", user: userData })
  } catch (error) {
    console.error("Error registering user:", error)
    res.status(500).json({ message: "Failed to register user.", error: error.message })
  }
}

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
  registerUser,
  cleanupExpiredOTPs,
  getOTPStatus
}
