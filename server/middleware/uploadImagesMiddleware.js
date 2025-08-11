const multer = require('multer')
const os = require('os')

const upload = multer({ dest: os.tmpdir() })
const uploadImagesMiddleware = upload.array('images', 5) // max 5 images

module.exports = uploadImagesMiddleware
