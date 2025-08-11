const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.resolve(__dirname, "../firebase-service-account.json");

let db = null;

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
    console.log("🔗 Firestore instance:", db ? "Connected" : "Failed");

    // Test connection by writing and deleting a test doc
    await db.collection("test").doc("connection-test").set({
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("✅ Firestore connection test successful!");

    await db.collection("test").doc("connection-test").delete();
    console.log("🧹 Test document cleaned up");
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:", error.message);
    console.log("🔄 Falling back to in-memory storage for development...");
    db = createInMemoryStore();
    console.log("⚠️ Using in-memory storage for development mode.");
  }
};

const createInMemoryStore = () => {
  const inMemoryStore = {
    otps: new Map(),
    users: new Map(),
    products: new Map(),
    clients: new Map(),
    suppliers: new Map(),
    boutiques: new Map(),

    collection: (name) => ({
      add: async (data) => {
        const id = Date.now().toString();
        inMemoryStore[name].set(id, { id, ...data });
        console.log(`📝 [IN-MEMORY] Added to ${name}:`, { id, ...data });
        return { id };
      },
      get: async () => {
        const docs = Array.from(inMemoryStore[name].values()).map((data) => ({
          id: data.id,
          data: () => data,
        }));
        console.log(`📖 [IN-MEMORY] Retrieved ${docs.length} from ${name}`);
        return { docs };
      },
      where: (field, operator, value) => ({
        limit: (limit) => ({
          get: async () => {
            const results = [];
            for (const [id, data] of inMemoryStore[name]) {
              if (data[field] === value) {
                results.push({
                  data: () => data,
                  ref: {
                    update: async (updateData) => {
                      inMemoryStore[name].set(id, { ...data, ...updateData });
                      console.log(`✏️ [IN-MEMORY] Updated ${name}/${id}:`, updateData);
                    },
                    delete: async () => {
                      inMemoryStore[name].delete(id);
                      console.log(`🗑️ [IN-MEMORY] Deleted ${name}/${id}`);
                    },
                    get: async () => ({
                      data: () => inMemoryStore[name].get(id),
                    }),
                  },
                });
              }
            }
            return { empty: results.length === 0, docs: results };
          },
        }),
      }),
      doc: (id) => ({
        update: async (data) => {
          const existing = inMemoryStore[name].get(id);
          if (existing) {
            inMemoryStore[name].set(id, { ...existing, ...data });
            console.log(`✏️ [IN-MEMORY] Updated ${name}/${id}:`, data);
          }
        },
        delete: async () => {
          inMemoryStore[name].delete(id);
          console.log(`🗑️ [IN-MEMORY] Deleted ${name}/${id}`);
        },
        get: async () => ({
          data: () => inMemoryStore[name].get(id),
        }),
      }),
    }),
  };

  return inMemoryStore;
};

const getDatabase = () => db;

module.exports = {
  initializeDatabase,
  getDatabase,
  admin,
  FieldValue: admin.firestore.FieldValue,
};
  