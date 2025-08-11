// controllers/otpController.js
const { getDatabase, admin } = require("../config/DATABASE");

// Helper: Generate 6-digit OTP
const createRandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateOTP = async (req, res) => {
  const db = getDatabase();
  if (!db) return res.status(500).json({ message: "Database not initialized." });

  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ message: "Phone number is required." });

  try {
    const otp = createRandomOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const otpData = {
      phoneNumber,
      otp,
      expiresAt,
      used: false,
      createdAt: new Date(),
    };

    const existingOtp = await db.collection("otps").where("phoneNumber", "==", phoneNumber).limit(1).get();

    if (!existingOtp.empty) {
      await existingOtp.docs[0].ref.update(otpData);
      console.log(`Updated OTP for ${phoneNumber}: ${otp}`);
    } else {
      await db.collection("otps").add(otpData);
      console.log(`Created OTP for ${phoneNumber}: ${otp}`);
    }

    // TODO: Send OTP via SMS provider (Twilio, etc.)
    // In dev only, we return the OTP. In prod, never return otp.
    res.status(200).json({
      message: "OTP generated successfully.",
      otp, // remove in production
      expiresAt,
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ message: "Failed to generate OTP.", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const db = getDatabase();
  if (!db) return res.status(500).json({ message: "Database not initialized." });

  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) return res.status(400).json({ message: "Phone number and OTP are required." });

  try {
    const otpQuery = await db.collection("otps").where("phoneNumber", "==", phoneNumber).limit(1).get();
    if (otpQuery.empty) return res.status(400).json({ message: "OTP not found." });

    const otpDoc = otpQuery.docs[0];
    const otpData = otpDoc.data();

    if (otpData.expiresAt.toDate() < new Date()) {
      await otpDoc.ref.delete();
      return res.status(400).json({ message: "OTP expired." });
    }

    if (otpData.used) return res.status(400).json({ message: "OTP already used." });

    if (otpData.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

    // Mark used
    await otpDoc.ref.update({ used: true });

    // Update/Create authentication record in Firestore (your own table)
    const authQuery = await db.collection("authentication").where("phoneNumber", "==", phoneNumber).limit(1).get();
    let authRecord;
    if (authQuery.empty) {
      const newAuthRef = await db.collection("authentication").add({
        phoneNumber,
        verified: true,
        role: "supplier",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      authRecord = { id: newAuthRef.id, phoneNumber, verified: true, role: "supplier" };
    } else {
      const authDoc = authQuery.docs[0];
      await authDoc.ref.update({ verified: true, updatedAt: new Date() });
      authRecord = { id: authDoc.id, ...authDoc.data(), verified: true };
    }

    // Remove OTP after usage
    await otpDoc.ref.delete();

    // Ensure a Firebase Auth user exists for this phoneNumber. We'll use phoneNumber as uid.
    // IMPORTANT: Firebase phone number format should include the country code, e.g. "+33648653390"
    const uid = phoneNumber; // choose a unique uid; using phoneNumber is ok if normalized
    try {
      // Try get user by phone number
      await admin.auth().getUserByPhoneNumber(phoneNumber);
      // user exists
    } catch (err) {
      // not found -> create user
      if (err.code === "auth/user-not-found") {
        await admin.auth().createUser({
          uid,
          phoneNumber,
        });
        console.log(`Created Firebase Auth user for ${phoneNumber}`);
      } else {
        // other error
        console.error("Error while checking/creating Firebase user:", err);
        return res.status(500).json({ message: "Auth server error.", error: err.message });
      }
    }

    // Create custom token for client to sign in with
    const customToken = await admin.auth().createCustomToken(uid);

    // Return custom token to client (client must signInWithCustomToken or exchange it for ID token)
    res.status(200).json({
      message: "OTP verified successfully.",
      authentication: authRecord,
      customToken,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP.", error: error.message });
  }
};

module.exports = {
  generateOTP,
  verifyOTP,
};
