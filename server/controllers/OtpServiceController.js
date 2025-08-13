// controllers/otpController.js
const { getDatabase, admin } = require("../config/DATABASE");
const BulkSMSService = require("../utils/bulkSMSService");

const generateOTP = async (req, res) => {
  const db = getDatabase();
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: "Phone number is required" });
  }

  try {
    // Request BulkSMS to generate and send OTP
    const result = await BulkSMSService.sendOTP(phoneNumber);
    
    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: result.error || "Failed to send OTP" 
      });
    }

    // Store the OTP reference in database
    const otpRecord = {
      phoneNumber,
      otpReference: result.otpReference,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    };

    await db.collection("otp_requests").add(otpRecord);

    res.status(200).json({ 
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
};

const verifyOTP = async (req, res) => {
  const db = getDatabase();
  const { phoneNumber, otpCode } = req.body;

  if (!phoneNumber || !otpCode) {
    return res.status(400).json({ 
      success: false, 
      error: "Phone number and OTP code are required" 
    });
  }

  try {
    // Find the most recent OTP request for this phone number
    const otpQuery = await db.collection("otp_requests")
      .where("phoneNumber", "==", phoneNumber)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (otpQuery.empty) {
      return res.status(404).json({ 
        success: false, 
        error: "No OTP request found for this number" 
      });
    }

    const otpDoc = otpQuery.docs[0];
    const otpData = otpDoc.data();

    // Verify OTP with BulkSMS
    const isVerified = await BulkSMSService.verifyOTP(otpData.otpReference, otpCode);

    if (!isVerified) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid OTP code" 
      });
    }

    // Mark OTP as verified
    await otpDoc.ref.update({ 
      status: 'verified',
      verifiedAt: admin.firestore.FieldValue.serverTimestamp() 
    });

    // Create/update user authentication record
    const authRecord = {
      phoneNumber,
      verified: true,
      lastVerified: admin.firestore.FieldValue.serverTimestamp()
    };

    // Check if user exists
    const authQuery = await db.collection("users")
      .where("phoneNumber", "==", phoneNumber)
      .limit(1)
      .get();

    let userRecord;
    if (authQuery.empty) {
      const newUserRef = await db.collection("users").add(authRecord);
      userRecord = { id: newUserRef.id, ...authRecord };
    } else {
      const userDoc = authQuery.docs[0];
      await userDoc.ref.update(authRecord);
      userRecord = { id: userDoc.id, ...userDoc.data(), ...authRecord };
    }

    // Create Firebase Auth user if needed
    try {
      await admin.auth().getUserByPhoneNumber(phoneNumber);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        await admin.auth().createUser({
          phoneNumber,
          uid: phoneNumber // Using phone number as UID
        });
      }
    }

    // Generate custom token
    const customToken = await admin.auth().createCustomToken(phoneNumber);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: userRecord,
      token: customToken
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
};

module.exports = {
  generateOTP,
  verifyOTP
};