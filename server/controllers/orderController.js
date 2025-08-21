// controllers/orderController.js
const { getDatabase } = require("../config/DATABASE");

const getSupplierOrders = async (req, res) => {
  try {
  const { status } = req.query; //
    console.log(`🔐 Full user object from JWT:`, JSON.stringify(req.user, null, 2));
    console.log(`🔐 Real Supplier UID from JWT: ${req.user.uid}`);
    console.log(`📋 Status filter: ${status || 'none'}`);

    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: "Authentication required - No supplier ID in token"
      });
    }

    const db = getDatabase();
    
    // Get all orders for this supplier
    const snapshot = await db.collection("orders")
      .where("supplier_id", "==", req.user.uid)
      .get();

    if (snapshot.empty) {
      console.log("📭 No orders found for supplier:", req.user.uid);
      return res.status(200).json({
        success: true,
        message: "No orders found",
        data: [],
        total: 0,
        supplier_id: req.user.uid,
        status_filter: status || "all"
      });
    }

    // Filter by status and format data
    let orders = [];
    snapshot.forEach(doc => {
      const orderData = doc.data();
      
      // Apply status filter if provided
      if (!status || orderData.status === status) {
        orders.push({
          id: doc.id,
          order_number: orderData.order_number || `ORD-${doc.id.slice(-6)}`,
          client_id: orderData.client_id,
          client_name: orderData.client_name || "Unknown Client",
          items: orderData.items || [],
          total_amount: orderData.total_amount || 0,
          status: orderData.status || "new",
          delivery_mode: orderData.delivery_mode || "pickup",
          delivery_address: orderData.delivery_address,
          note: orderData.note || "",
          created_at: orderData.createdAt?.toDate() || orderData.created_at?.toDate() || null,
          updated_at: orderData.updatedAt?.toDate() || orderData.updated_at?.toDate() || null
        });
      }
    });

    // Sort by creation date (newest first)
    orders.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB - dateA; // Descending order (newest first)
    });

    console.log(`✅ Found ${orders.length} orders for supplier ${req.user.uid}`);

    return res.status(200).json({
      success: true,
      message: status ? `Orders with status '${status}' retrieved` : "All orders retrieved",
      data: orders,
      total: orders.length,
      supplier_id: req.user.uid,
      status_filter: status || "all"
    });

  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
      supplier_id: req.user?.uid
    });
  }
};

module.exports = {
  getSupplierOrders
};