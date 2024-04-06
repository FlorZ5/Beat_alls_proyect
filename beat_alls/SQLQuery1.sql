create database beat_alls;
go
use beat_alls;
create table Cliente
(
ID_Cliente int primary key not null identity(1,1),
Nombre Varchar(30) not null,
Apellido Varchar(30) not null, 
Direccion Varchar(75) not null, 
Edad smallint not null,
Telefono bigint not null unique, 
Correo Varchar (30) not null unique,
Rol Varchar (25) not null,
Nombre_usuario Varchar (15) not null unique, 
Contrasena Varchar (150) not null
);
go
create table Proveedor 
(
ID_Proveedor int primary key not null identity(1,1),
Nombre Varchar (30) not null,
Apellido Varchar (30) not null,
Telefono bigint not null unique,
Correo Varchar (30) not null unique,
Empresa Varchar (20) not null,
filepath Varchar (300) not null
);
go
create table Productos
(
ID_Producto int Primary key not null identity (1,1),
Nombre_producto Varchar (30) not null,
Descripcion Varchar (50) not null,
Color Varchar (15) not null,
Talla Varchar (20) not null,
Material Varchar (15) not null,
Marca Varchar(25) not null,
Temporada Varchar (30) not null,
Existencias smallint not null,
ID_Proveedor Int not null,
filepath varchar(300) not null,
constraint fk_proveedor foreign key (ID_Proveedor) references Proveedor
);
go
create table Carrito
(
ID_Carrito int  not null,
ID_Cliente int not null,
constraint fk_idcliente foreign key (ID_Cliente) references Cliente,
ID_Producto int not null,
constraint fk_idproducto foreign key (ID_Producto) references Productos,
Nombre_producto Varchar (30) not null,
Descripcion Varchar (50) not null,
Cantidad_producto smallint not null,
Precio_unitario_producto smallint not null,
Precio_total_productos int not null,
Cantidad_pagar int not null
);
go
create table Pedidos
(
No_pedido int not null,
ID_Cliente int not null,
constraint fk_idclienteP foreign key (ID_Cliente) references Cliente,
Nombre_cliente Varchar(15) not null unique,
ID_Producto int not null,
constraint fk_idproductoP foreign key (ID_Producto) references Productos,
Nombre_producto Varchar (30) not null,
Descripcion Varchar (50) not null,
Cantidad_producto smallint not null,
Precio_unitario_producto smallint not null,
Precio_total_productos int not null,
Cantidad_pagar int not null,
Ubicacion Varchar (50) not null,
Fecha date not null default getdate(),
Estatus Varchar (25)
);
go
create table usuario
(
ID_Usuario Int Primary key not null Identity (1,1),
Nombre Varchar (30) not null,
Apellido Varchar (30) not null,
Direccion Varchar (75) not null,
Edad Smallint not null,
Fecha_nacimiento Date not null,
Telefono bigint not null unique,
Correo Varchar (30) not null unique,
Rol Varchar (25) not null,
Nombre_usuario Varchar(15) not null unique,
Contrasena Varchar (150) not null
);
go
create table logs_cliente
(
ID int Primary key not null identity (1,1),
ID_cliente int not null,
constraint fk_cliente_logs foreign key (ID_cliente) references Cliente,
Nombre_cliente Varchar (30) not null,
Accion Varchar (30) not null,
Descripcion Varchar (300) not null,
Fecha_hora date default current_timestamp not null,
IP Varchar (15) not null
);
go
create table logs_usuario
(
ID int Primary key not null identity (1,1),
ID_usuario int not null,
constraint fk_usuario_logs foreign key (ID_usuario) references Usuario,
Nombre_usuario Varchar (30) not null,
Accion Varchar (30) not null,
Descripcion Varchar (300) not null,
Fecha_hora date default current_timestamp not null,
IP Varchar (15) not null
);
go
create table Historial
(
Entrada int Primary Key not null,
No_pedido int not null,
ID_Cliente int not null,
constraint fk_idclienteP foreign key (ID_Cliente) references Cliente(ID_Cliente),
Nombre_cliente Varchar(15) not null,
ID_Producto int not null,
constraint fk_idproductoP foreign key (ID_Producto) references Productos(ID_Producto),
Nombre_producto Varchar(30) not null,
Descripcion Varchar(50) not null,
Cantidad_producto smallint not null,
Precio_unitario_producto smallint not null,
Precio_total_productos int not null,
Cantidad_pagar int not null,
Fecha date not null default CURRENT_TIMESTAMP,
Estatus Varchar(25),
motivo_Cancelacion varchar(100) not null
)