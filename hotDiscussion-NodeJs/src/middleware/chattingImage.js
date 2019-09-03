const multer = require('multer')
const fs = require('fs')

// const stor = multer.diskStorage({
//     destination: function (req, file, myFunc) {
//         myFunc(null, './temp/')
//     },
//     filename: function (req, file, cb){
//         cb (null, Date.now() + '.jpg')
//     }
// })

// middleware that create directory and accept, store uploading images
const up = multer.diskStorage({
    destination: function (req, file, cb) {
        let date = Date.now()
        let basePath = 'upload/' + req.user.name + '&&' + date
        let commentsPath = basePath + '/' + 'comments'
        let likesPath = basePath + '/' + 'likes'

        let baseServerUrl = 'http://localhost:3000/'
        req.myFileUrl = baseServerUrl + req.user.name + '&&' + date + '/' + 'main.jpg'

        fs.mkdirSync(basePath)
        fs.mkdirSync(commentsPath)
        fs.mkdirSync(likesPath)

        cb (null, basePath)
    },
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only jpg jpeg png image formate accepted.'))
        }
        cb(undefined, true)
    },
    filename(req, file, cb){
        cb (null, 'main.jpg')
    }
})

const upload = multer({storage: up})

module.exports = upload