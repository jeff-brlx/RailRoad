const multer = require("multer")

const upload = multer({
    dest:"temp/",
    // storage: multer.memoryStorage()

    limits:{
        fileSize: 5*1024*1024,//5MB
    },
})

const handleUploadErrors = (error,req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send({
                message: "File too Large . Please choose a lighter picture"
            });
        }
    }
};
module.exports= {
    upload,
    handleUploadErrors
}