const checkPermission = (userRole, requestedRoute) => {
    if (userRole === 'Administrador') {
        return true;
    } else if (userRole === 'Empleado' && ( requestedRoute === "/proveedoresRegistrados" || requestedRoute === "/actualizacionProveedores" || requestedRoute === '/visualizarPedido' || requestedRoute === '/visualizarCarrito' || requestedRoute === '/panelNavegacion' || requestedRoute === '/pedidosFinalizados' || requestedRoute === "/proveedoresRegistrados/:id" || requestedRoute === "/registroProveedores" || requestedRoute === "/registroProductos" || requestedRoute === "/productosRegistrados" || requestedRoute === "/productosRegistrados/:id" || requestedRoute === "/actualizacionProductos" || requestedRoute === "/clientesRegistrados" || requestedRoute === "/actualizacionClientes"  || requestedRoute === '/pedidosEnCurso' || requestedRoute === '/logsClientes')) {
        return true;
    } else if (userRole === 'Cliente' && (requestedRoute === '/productos' || requestedRoute === '/login' || requestedRoute === '/visualizarPedido' || requestedRoute === '/visualizarCarrito' || requestedRoute === '/panelNavegacion' || requestedRoute === '/pedidosFinalizados' || requestedRoute === '/agregarAlCarrito' || requestedRoute === '/enviarCarrito' || requestedRoute === '/crearPedido')) {
        return true;
    }
    return false;
};

module.exports = checkPermission;
