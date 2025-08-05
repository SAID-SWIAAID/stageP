const multer = require('multer')

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() })

module.exports = upload