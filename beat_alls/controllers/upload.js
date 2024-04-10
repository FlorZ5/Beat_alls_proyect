const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const prefix = 'imagen_';
        cb(null, prefix + Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Verificar la extensión del archivo
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
    }
});

exports.upload = upload.single('IMG');

exports.uploadFile = (req, res) => {
    res.send( {data: "Enviar un archivo"} )
}