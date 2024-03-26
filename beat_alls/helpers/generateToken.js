const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    // Generar el token con el payload y la clave secreta
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
}
const { secretKey } = require('../config/config'); // Asegúrate de tener configurada la clave secreta en tu archivo de configuración

const verifyToken = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const token = req.headers['authorization'];

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
  }

  try {
    // Verificar el token utilizando la clave secreta
    const decoded = jwt.verify(token.split(' ')[1], secretKey);

    // Agregar los datos del usuario decodificados a la solicitud
    req.user = decoded;

    // Permitir que la solicitud continúe
    next();
  } catch (error) {
    // Si el token no es válido, devolver un error de autenticación
    return res.status(401).json({ message: 'Token de autenticación inválido' });
  }
};

module.exports = { generateToken, verifyToken };