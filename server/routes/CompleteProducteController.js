const completeUserProfile = async (req, res) => {
  const db = getDatabase()
  if (!db) return res.status(500).json({ message: "Database not initialized" })

  const { uid, name, email, userType, boutiques } = req.body
  if (!uid || !name || !email || !userType) {
    return res.status(400).json({ message: "uid, name, email and userType are required" })
  }

  try {
    const usersRef = db.collection('users')
    const userQuery = await usersRef.where('uid', '==', uid).limit(1).get()

    if (userQuery.empty) {
      return res.status(404).json({ message: "User not found" })
    }

    const userDoc = userQuery.docs[0]

    await userDoc.ref.update({
      name: name.trim(),
      email: email.trim(),
      userType: userType.trim(),
      boutiques: boutiques || [],
      profileCompleted: true,
      updatedAt: new Date(),
    })

    res.status(200).json({ message: "Profile completed successfully" })
  } catch (error) {
    console.error("Error completing profile:", error)
    res.status(500).json({ message: error.message })
  }
}
