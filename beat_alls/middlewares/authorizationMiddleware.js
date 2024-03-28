const checkPermission = require('../middlewares/checkPermission');

const authorizationMiddleware = (req, res, next) => {
    const userRole = req.session.userRole; 
    const requestedRoute = req.path;
    const hasPermission = checkPermission(userRole, requestedRoute);

    if (hasPermission) {
        next();
    } else {
        res.status(403).send('Acceso denegado');
    }
};

module.exports = authorizationMiddleware;
