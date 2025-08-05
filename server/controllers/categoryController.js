const categories = require('../data/categories')

const getCategories = async (req, res) => {
  try {
    res.status(200).json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ message: "Failed to fetch categories.", error: error.message })
  }
}

module.exports = {
  getCategories
}