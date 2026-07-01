import multer from "multer";

// storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/");
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    },
});

// upload middleware
export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});