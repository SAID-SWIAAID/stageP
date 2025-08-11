const createProduct = async (req, res) => {
  const db = getDatabase();
  if (!db) {
    return res.status(500).json({ message: "Database not initialized. Check setup." });
  }

  try {
    // Le middleware d'authentification ajoute `req.user`
    const supplierId = req.user.uid; // récupéré du token Firebase

    const {
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      brand,
      model,
      sku,
      weight,
    } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newProduct = {
      name,
      description: description || "",
      price,
      stock,
      category: category || "",
      subcategory: subcategory || "",
      brand: brand || "",
      model: model || "",
      sku: sku || "",
      weight: weight || "",
      supplierId,
      createdAt: new Date().toISOString(),
    };

    await db.collection("products").add(newProduct);

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createProduct };
