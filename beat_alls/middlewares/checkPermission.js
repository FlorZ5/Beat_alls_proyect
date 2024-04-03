const checkPermission = (userRole, requestedRoute) => {
    if (userRole === 'Administrador') {
        return true;
    } else if (userRole === 'Empleado' && ( requestedRoute === "/proveedoresRegistrados" || requestedRoute === "/actualizacionProveedores" || requestedRoute === '/visualizarPedido' || requestedRoute === '/visualizarCarrito' || requestedRoute === '/panelNavegacion' || requestedRoute === '/pedidosFinalizados' || requestedRoute === "/proveedoresRegistrados/:id" || requestedRoute === "/registroProveedores" || requestedRoute === "/registroProductos" || requestedRoute === "/productosRegistrados" || requestedRoute === "/productosRegistrados/:id" || requestedRoute === "/actualizacionProductos" || requestedRoute === "/clientesRegistrados" || requestedRoute === "/actualizacionClientes"  || requestedRoute === '/pedidosEnCurso')) {
        return true;
    } else if (userRole === 'Cliente' && (requestedRoute === '/productos' || requestedRoute === '/login' || requestedRoute === '/visualizarPedido' || requestedRoute === '/visualizarCarrito' || requestedRoute === '/panelNavegacion' || requestedRoute === '/pedidosFinalizados')) {
        return true;
    }
    return false;
};

module.exports = checkPermission;
