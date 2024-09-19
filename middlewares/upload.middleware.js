const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    // Uploads is where the file will be saved
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Appending timestamp to filename
        cb(null, Date.now() + path.extname(file.originalname));     
    }
});


// initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // limit 10mb
    fileFilter: (req, file, cb) => {
        // Only allow specific filetypes
        const filetypes = /pdf|doc|docx|txt/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .pdf, .doc, .docx, and .txt formats are allowed'));
        }
    }
})

module.exports = upload