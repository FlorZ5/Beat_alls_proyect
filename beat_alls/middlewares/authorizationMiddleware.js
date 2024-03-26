const checkPermission = require('../middlewares/checkPermission');

// Define un middleware de autorización
const authorizationMiddleware = (req, res, next) => {

    // Obtén el rol del usuario de alguna manera (por ejemplo, desde el objeto req)
    const userRole = req.session.userRole; 

    // Obtiene la ruta solicitada desde el objeto req
    const requestedRoute = req.path;

    // Verifica si el usuario tiene permiso para acceder a la ruta solicitada utilizando checkPermission
    const hasPermission = checkPermission(userRole, requestedRoute);

    // Si el usuario tiene permiso, permite que la solicitud continúe hacia la ruta protegida
    if (hasPermission) {
        next();
    } else {
        // Si el usuario no tiene permiso, devuelve un código de estado 403 (Prohibido)
        res.status(403).send('Acceso denegado');
        console.log(userRole)
    }
};

module.exports = authorizationMiddleware;
