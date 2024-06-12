const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    // filename: (req, file, cb) => {
    //     const modifiedFilename = Date.now() + path.extname(file.originalname);

    //     cb(null, modifiedFilename);
    filename: function (req, file, cb) {
        const updatedName = Date.now() + path.extname(file.originalname);
        cb(null, updatedName);
    },
});

// const upload = multer({ storage: storage });
const fileFilter = function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|svg|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Images Only!");
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});


module.exports = upload;