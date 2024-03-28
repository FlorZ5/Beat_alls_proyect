const checkPermission = (userRole, requestedRoute) => {
    if (userRole === 'Administrador') {
        return true;
    } else if (userRole === 'Empleado' && (requestedRoute === "/usuariosRegistrados" || requestedRoute === "/proveedoresRegistrados")) {
        return true;
    } else if (userRole === 'Cliente' && (requestedRoute === '/productos' || requestedRoute === '/login')) {
        const header = './layout/headerCliente.ejs';
        return true;
    }
    return false;
};

module.exports = checkPermission;
