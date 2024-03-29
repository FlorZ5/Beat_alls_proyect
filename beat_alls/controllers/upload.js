const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const prefix = 'imagen_'; // Prefijo que se agregará al nombre del archivo
        cb(null, prefix + Date.now() + file.originalname);
    }
});

const upload = multer({storage: storage})

exports.upload = upload.single('IMG');

exports.uploadFile = (req, res) => {
    res.send( {data: "Enviar un archivo"} )
}