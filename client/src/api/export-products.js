import xlsx from "xlsx"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase.js"

export async function POST(request) {
  try {
    const { userId, format } = await request.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Fetch products from Firestore
    const productsCollectionRef = collection(db, `users/${userId}/products`)
    const querySnapshot = await getDocs(productsCollectionRef)

    if (querySnapshot.empty) {
      return new Response(JSON.stringify({ error: "No products found to export" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Convert Firestore data to export format
    const products = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        category: data.category || "",
        quantity: data.quantity || 0,
        isSelling: data.isSelling ? "Yes" : "No",
        createdAt: data.createdAt?.toDate?.()?.toISOString?.()?.split("T")[0] || "",
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.()?.split("T")[0] || "",
      }
    })

    if (format === "csv") {
      // Generate CSV
      const headers = ["name", "description", "price", "category", "quantity", "isSelling", "createdAt", "updatedAt"]
      const csvRows = [
        headers.join(","), // Header row
        ...products.map((product) =>
          headers
            .map((header) => {
              const value = product[header]
              // Escape commas and quotes in CSV
              if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value
            })
            .join(","),
        ),
      ]

      const csvContent = csvRows.join("\n")

      return new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="products_export.csv"`,
        },
      })
    } else if (format === "xlsx") {
      // Generate Excel file
      const worksheet = xlsx.utils.json_to_sheet(products)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, "Products")

      // Generate buffer
      const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" })

      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="products_export.xlsx"`,
        },
      })
    } else {
      return new Response(JSON.stringify({ error: "Invalid format. Use 'csv' or 'xlsx'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error) {
    console.error("Export error:", error)
    return new Response(JSON.stringify({ error: "Failed to export products: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
