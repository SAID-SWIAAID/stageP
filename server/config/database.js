const admin = require("firebase-admin")
const path = require("path")

// Resolve the path to firebase-service-account.json
const serviceAccountPath = path.resolve(__dirname, "../firebase-service-account.json")

let firebaseAppInitialized = false
let db = null

const initializeDatabase = async () => {
  try {
    const serviceAccount = require(serviceAccountPath)
    
    // Validate service account
    if (!serviceAccount.project_id || serviceAccount.project_id.includes('REPLACE_WITH')) {
      throw new Error('Service account contains placeholder values. Please update with real credentials.')
    }
    
    console.log("🔧 Initializing Firebase Admin SDK...")
    console.log("📊 Project ID:", serviceAccount.project_id)
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    firebaseAppInitialized = true
    db = admin.firestore()
    console.log("✅ Firebase Admin SDK initialized successfully.")
    console.log("🔗 Firestore instance:", db ? "Connected" : "Failed")
    
    // Test the connection with better error handling
    console.log("🧪 Testing Firestore connection...")
    await db.collection('test').doc('connection-test').set({
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })

    console.log("✅ Firestore connection test successful!")
    // Clean up test document
    await db.collection('test').doc('connection-test').delete()
    console.log("🧹 Test document cleaned up")
    
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:", error.message)
    console.log("🔄 Falling back to in-memory storage for development...")
    
    // Create in-memory storage fallback
    db = createInMemoryStore()
    console.log("⚠️ Using in-memory storage for development.")
    console.log("💡 To use real Firestore, enable Firestore in Firebase Console and check security rules.")
  }
}

const createInMemoryStore = () => {
  const inMemoryStore = {
    otps: new Map(),
    users: new Map(),
    products: new Map(),
    clients: new Map(),
    suppliers: new Map(),
    boutiques: new Map(),
    
    // Simulate Firestore methods
    collection: (name) => ({
      add: async (data) => {
        const id = Date.now().toString()
        inMemoryStore[name].set(id, { id, ...data })
        console.log(`📝 [IN-MEMORY] Added to ${name}:`, { id, ...data })
        return { id }
      },
      get: async () => {
        const docs = Array.from(inMemoryStore[name].values()).map(data => ({
          id: data.id,
          data: () => data
        }))
        console.log(`📖 [IN-MEMORY] Retrieved from ${name}:`, docs.length, 'documents')
        return { docs }
      },
      where: (field, operator, value) => ({
        limit: (limit) => ({
          get: async () => {
            const results = []
            for (const [id, data] of inMemoryStore[name]) {
              if (data[field] === value) {
                results.push({
                  data: () => data,
                  ref: {
                    update: async (updateData) => {
                      inMemoryStore[name].set(id, { ...data, ...updateData })
                      console.log(`✏️ [IN-MEMORY] Updated ${name}/${id}:`, updateData)
                    },
                    delete: async () => {
                      inMemoryStore[name].delete(id)
                      console.log(`🗑️ [IN-MEMORY] Deleted ${name}/${id}`)
                    },
                    get: async () => ({
                      data: () => inMemoryStore[name].get(id)
                    })
                  }
                })
              }
            }
            return { empty: results.length === 0, docs: results }
          }
        })
      }),
      doc: (id) => ({
        update: async (data) => {
          const existing = inMemoryStore[name].get(id)
          if (existing) {
            inMemoryStore[name].set(id, { ...existing, ...data })
            console.log(`✏️ [IN-MEMORY] Updated ${name}/${id}:`, data)
          }
        },
        delete: async () => {
          inMemoryStore[name].delete(id)
          console.log(`🗑️ [IN-MEMORY] Deleted ${name}/${id}`)
        },
        get: async () => ({
          data: () => inMemoryStore[name].get(id)
        })
      })
    })
  }
  
  return inMemoryStore
}

const getDatabase = () => db

module.exports = {
  initializeDatabase,
  getDatabase,
  admin
}