const checkPermission = (userRole, requestedRoute) => {
    // Lógica para verificar si el usuario tiene permiso para acceder a la ruta solicitada
    // Implementa la lógica de acuerdo a tus necesidades específicas
    // Por ejemplo, podrías tener un mapeo de rutas a roles permitidos y verificar si el usuario tiene el rol necesario para acceder a la ruta
    // Aquí solo se muestra un ejemplo básico
    if (userRole === 'Administrador') {
        // El administrador tiene acceso a todas las rutas
        return true;
    } else if (userRole === 'Empleado' && (requestedRoute === 'usuariosRegistrados' || requestedRoute === 'proveedoresRegistrados')) {
        // Los empleados tienen acceso a las rutas de proveedores y pedidos
        return true;
    } else if (userRole === 'Cliente' && (requestedRoute === 'productos' || requestedRoute === 'login')) {
        // Los clientes tienen acceso a las rutas de productos y carrito de compras
        return true;
    }
    // Por defecto, el usuario no tiene permiso para acceder a la ruta solicitada
    return false;
};

// Exporta la función checkPermission para que pueda ser utilizada en otras partes de la aplicación
module.exports = checkPermission;
