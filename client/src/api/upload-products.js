import multer from "multer"
import xlsx from "xlsx"
import csv from "csv-parser"
import { Readable } from "stream"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../lib/firebase.js" // Ensure correct import path for Firebase

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only Excel and CSV files are allowed."))
    }
  },
})

// Middleware to handle file upload
const uploadMiddleware = upload.single("file")

// Function to parse Excel file
function parseExcelFile(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  return xlsx.utils.sheet_to_json(worksheet)
}

// Function to parse CSV file
function parseCSVFile(buffer) {
  return new Promise((resolve, reject) => {
    const results = []
    const stream = Readable.from(buffer.toString())

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject)
  })
}

// Function to validate product data
function validateProduct(product, rowIndex) {
  const errors = []

  if (!product.name || product.name.trim() === "") {
    errors.push(`Row ${rowIndex + 2}: Product name is required`)
  }

  if (!product.price || isNaN(Number.parseFloat(product.price))) {
    errors.push(`Row ${rowIndex + 2}: Valid price is required`)
  }

  if (!product.category || product.category.trim() === "") {
    errors.push(`Row ${rowIndex + 2}: Category is required`)
  }

  if (!product.quantity || isNaN(Number.parseInt(product.quantity))) {
    errors.push(`Row ${rowIndex + 2}: Valid quantity is required`)
  }

  return errors
}

// Function to normalize product data
function normalizeProduct(product) {
  return {
    name: product.name?.toString().trim() || "",
    description: product.description?.toString().trim() || "",
    price: Number.parseFloat(product.price) || 0,
    category: product.category?.toString().trim().toLowerCase() || "",
    quantity: Number.parseInt(product.quantity) || 0,
    isSelling: false, // Default to not selling
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function POST(request) {
  return new Promise((resolve) => {
    uploadMiddleware(request, {}, async (err) => {
      if (err) {
        return resolve(
          new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }),
        )
      }

      try {
        const { file } = request
        const { userId } = request.body

        if (!file) {
          return resolve(
            new Response(JSON.stringify({ error: "No file uploaded" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          )
        }

        if (!userId) {
          return resolve(
            new Response(JSON.stringify({ error: "User ID is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          )
        }

        let products = []

        // Parse file based on type
        if (file.mimetype === "text/csv") {
          products = await parseCSVFile(file.buffer)
        } else {
          products = parseExcelFile(file.buffer)
        }

        if (products.length === 0) {
          return resolve(
            new Response(JSON.stringify({ error: "No data found in file" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          )
        }

        // Validate and process products
        const results = {
          success: true,
          totalRows: products.length,
          successCount: 0,
          errorCount: 0,
          skippedCount: 0,
          errors: [],
          preview: [],
        }

        for (let i = 0; i < products.length; i++) {
          const product = products[i]
          const validationErrors = validateProduct(product, i)

          if (validationErrors.length > 0) {
            results.errors.push(
              ...validationErrors.map((error) => ({
                row: i + 2,
                message: error.split(": ")[1],
              })),
            )
            results.errorCount++
            results.preview.push({
              ...product,
              success: false,
              error: validationErrors[0],
            })
            continue
          }

          try {
            const normalizedProduct = normalizeProduct(product)

            // Save to Firestore
            await addDoc(collection(db, `users/${userId}/products`), normalizedProduct)

            results.successCount++
            results.preview.push({
              ...normalizedProduct,
              success: true,
            })
          } catch (error) {
            console.error(`Error saving product ${i + 1}:`, error)
            results.errorCount++
            results.errors.push({
              row: i + 2,
              message: `Failed to save: ${error.message}`,
            })
            results.preview.push({
              ...product,
              success: false,
              error: error.message,
            })
          }
        }

        if (results.errorCount > 0) {
          results.success = false
        }

        return resolve(
          new Response(JSON.stringify(results), { status: 200, headers: { "Content-Type": "application/json" } }),
        )
      } catch (error) {
        console.error("Upload processing error:", error)
        return resolve(
          new Response(JSON.stringify({ error: "Failed to process file: " + error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }),
        )
      }
    })
  })
}
