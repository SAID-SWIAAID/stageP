const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.resolve(__dirname, "../firebase-service-account.json");

let db = null;
let useInMemory = false; // Flag to track if we're using in-memory store

const initializeDatabase = async () => {
  try {
    const serviceAccount = require(serviceAccountPath);

    if (!serviceAccount.project_id || serviceAccount.project_id.includes("REPLACE_WITH")) {
      throw new Error("Invalid Firebase service account credentials.");
    }

    console.log("🔧 Initializing Firebase Admin SDK...");
    console.log("📊 Project ID:", serviceAccount.project_id);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();

    console.log("✅ Firebase Admin SDK initialized successfully.");
    
    // Test connection
    await db.collection("test").doc("connection-test").set({
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    await db.collection("test").doc("connection-test").delete();
    
    console.log("✅ Firestore connection test successful!");
    
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:", error.message);
    console.log("🔄 Falling back to in-memory database...");
    
    // Fall back to in-memory store
    db = createInMemoryStore();
    useInMemory = true;
    console.log("✅ In-memory database initialized");
  }
};

const createInMemoryStore = () => {
  const collections = {
    orders: new Map(),
    suppliers: new Map(),
    products: new Map(),
    users: new Map(),
    test: new Map()
  };

  return {
    collection: (name) => {
      if (!collections[name]) {
        collections[name] = new Map();
      }

      return {
        add: async (data) => {
          const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
          const docData = { id, ...data, createdAt: new Date() };
          collections[name].set(id, docData);
          console.log(`📝 [IN-MEMORY] Added to ${name}:`, docData);
          return { id };
        },
        
        doc: (id) => ({
          get: async () => ({
            exists: collections[name].has(id),
            data: () => collections[name].get(id)
          }),
          update: async (data) => {
            const existing = collections[name].get(id);
            if (existing) {
              const updated = { ...existing, ...data, updatedAt: new Date() };
              collections[name].set(id, updated);
              console.log(`✏️ [IN-MEMORY] Updated ${name}/${id}:`, data);
            }
          },
          delete: async () => {
            collections[name].delete(id);
            console.log(`🗑️ [IN-MEMORY] Deleted ${name}/${id}`);
          },
          collection: (subName) => this.collection(subName)
        }),
        
        where: (field, operator, value) => ({
          get: async () => {
            const docs = [];
            for (const [id, data] of collections[name]) {
              if (data[field] === value) {
                docs.push({
                  id,
                  data: () => data,
                  ref: {
                    update: async (updateData) => {
                      const existing = collections[name].get(id);
                      if (existing) {
                        const updated = { ...existing, ...updateData, updatedAt: new Date() };
                        collections[name].set(id, updated);
                      }
                    }
                  }
                });
              }
            }
            return { empty: docs.length === 0, docs };
          },
          
          orderBy: (field, direction = 'asc') => ({
            get: async () => {
              const docs = [];
              for (const [id, data] of collections[name]) {
                if (data[field] === value) {
                  docs.push({
                    id,
                    data: () => data,
                    ref: {
                      update: async (updateData) => {
                        const existing = collections[name].get(id);
                        if (existing) {
                          const updated = { ...existing, ...updateData, updatedAt: new Date() };
                          collections[name].set(id, updated);
                        }
                      }
                    }
                  });
                }
              }
              
              // Simple sorting
              docs.sort((a, b) => {
                const aValue = a.data()[field];
                const bValue = b.data()[field];
                if (direction === 'asc') {
                  return aValue > bValue ? 1 : -1;
                } else {
                  return aValue < bValue ? 1 : -1;
                }
              });
              
              return { empty: docs.length === 0, docs };
            }
          })
        }),
        
        get: async () => {
          const docs = [];
          for (const [id, data] of collections[name]) {
            docs.push({
              id,
              data: () => data,
              exists: true
            });
          }
          return { empty: docs.length === 0, docs };
        }
      };
    }
  };
};

const getDatabase = () => {
  if (!db) {
    console.warn("⚠️ Database not initialized, using in-memory fallback");
    db = createInMemoryStore();
    useInMemory = true;
  }
  return db;
};

const getAuth = () => {
  if (!admin.apps.length) throw new Error("Firebase app not initialized.");
  return admin.auth();
};

const isUsingInMemory = () => useInMemory;

module.exports = {
  initializeDatabase,
  getDatabase,
  getAuth,
  admin,
  isUsingInMemory,
  FieldValue: admin.firestore.FieldValue,
};