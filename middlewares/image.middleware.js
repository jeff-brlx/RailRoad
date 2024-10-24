const multer = require("multer")

const upload = multer({
    dest:"temp/",
    // storage: multer.memoryStorage()
    limits:{
        fileSize: 5*1024*1024,//5MB
    },
    // additional check
})
module.exports= {
    upload
}