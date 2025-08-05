import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB5HQ__xR1nWZVvftDIDl0wG6gyMqtS_qk",
  authDomain: "supplier-bbb9c.firebaseapp.com",
  projectId: "supplier-bbb9c",
  storageBucket: "supplier-bbb9c.firebasestorage.app",
  messagingSenderId: "177970701453",
  appId: "1:177970701453:web:5fc005e8e00007132ceec4",
}

let app = null
let auth = null
let db = null

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  console.log("Firebase: App initialized successfully.")
  console.log("Firebase: Auth instance:", auth ? "available" : "NOT available")
  console.log("Firebase: Firestore instance:", db ? "available" : "NOT available")
  console.log("Firebase: Project ID:", firebaseConfig.projectId)
} catch (error) {
  console.error("Firebase: Error initializing Firebase app:", error)
}

export { app, auth, db }
