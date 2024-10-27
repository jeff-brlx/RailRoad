const multer = require("multer")
//  Resize the picture sent
const upload = multer({
    dest:"temp/",
    limits:{
        fileSize: 10*1024,//5MB
    },
})
// Error message to specify that the picture sent is to big
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