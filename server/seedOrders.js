// server/seedOrders.js
const { initializeDatabase, getDatabase, FieldValue } = require("./config/DATABASE");

async function seedOrders() {
  try {
    // 1️⃣ Initialiser Firebase et Firestore
    await initializeDatabase();
    const db = getDatabase();

    // 2️⃣ Référence à la collection "orders"
    const ordersRef = db.collection("orders");

    // 3️⃣ Données de test
    const sampleOrders = [
      {
        supplier_id: "supplier123",
        client_id: "client002",
        status: "new",
        total_amount: 45.0,
        delivery_mode: "pickup",
        created_at: FieldValue.serverTimestamp(),
        items: [
          { product_id: "p1", name: "Burger", quantity: 2, price: 10 },
          { product_id: "p2", name: "Fries", quantity: 1, price: 5 },
        ],
      },
      {
        supplier_id: "supplier123",
        client_id: "client002",
        status: "in_preparation",
        total_amount: 30.0,
        delivery_mode: "delivery",
        created_at: FieldValue.serverTimestamp(),
        items: [
          { product_id: "p3", name: "Pizza", quantity: 1, price: 20 },
          { product_id: "p4", name: "Soda", quantity: 2, price: 5 },
        ],
      },
      {
        supplier_id: "supplier999",
        client_id: "client002",
        status: "delivered",
        total_amount: 60.0,
        delivery_mode: "delivery",
        created_at: FieldValue.serverTimestamp(),
        items: [
          { product_id: "p5", name: "Pasta", quantity: 3, price: 15 },
          { product_id: "p6", name: "Juice", quantity: 1, price: 15 },
        ],
      },
    ];

    // 4️⃣ Ajout des commandes dans Firestore
    for (const order of sampleOrders) {
      const ref = await ordersRef.add(order);
      console.log(`📝 Order added with ID: ${ref.id}`);
    }

    console.log("✅ Sample orders added successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding orders:", err.message);
    process.exit(1);
  }
}

seedOrders();
