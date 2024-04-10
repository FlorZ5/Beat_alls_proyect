-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2024 a las 22:20:11
-- Versión del servidor: 10.4.16-MariaDB
-- Versión de PHP: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `beat_alls`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `ID_Carrito` int(11) NOT NULL,
  `ID_Cliente` int(11) NOT NULL,
  `ID_Producto` int(11) NOT NULL,
  `Nombre_producto` varchar(30) NOT NULL,
  `Descripcion` varchar(50) NOT NULL,
  `Cantidad_producto` smallint(6) NOT NULL,
  `Precio_unitario_producto` smallint(6) NOT NULL,
  `Precio_total_productos` int(11) NOT NULL,
  `Cantidad_pagar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `ID_Cliente` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Apellido` varchar(30) NOT NULL,
  `Direccion` varchar(75) NOT NULL,
  `Edad` smallint(6) NOT NULL,
  `Fecha_nacimiento` date NOT NULL,
  `Telefono` bigint(20) NOT NULL,
  `Correo` varchar(30) NOT NULL,
  `Rol` varchar(25) NOT NULL,
  `Nombre_usuario` varchar(15) NOT NULL,
  `Contrasena` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`ID_Cliente`, `Nombre`, `Apellido`, `Direccion`, `Edad`, `Fecha_nacimiento`, `Telefono`, `Correo`, `Rol`, `Nombre_usuario`, `Contrasena`) VALUES
(12, 'Luis Salvador', 'Delgado', 'Francisco Javier Martínez Hernandez 306', 26, '1997-08-01', 4651164831, 'Luis_salvador97@outlook.com', 'Usuario', 'LuisS', '$2b$10$zRUmhNNQfL4vheD5e5bANuXCsJ4UN7Ty47r8Uo0qVKbAAKUMsfGuK'),
(13, 'Flor Guadalupe', 'Llamas Zamorano', 'No tengo idea #104', 21, '2003-03-28', 4492852204, 'Flor@gmail.com', 'Usuario', 'Flor', '$2b$10$ecjtIbeX6r5uwdaerItlYeama1N2fjH.awp5GZjW949AB3jJ.5Rl6'),
(14, 'Astrid Jimena', 'Rodríguez Ramírez', 'Me vale vergas #207', 20, '2003-04-17', 8342566492, 'Astrid@gmail.com', 'Usuario', 'Astrid', '$2b$10$nkYdHEsYHWHmBShabn/HceEyUBPcK.Y/BEidCmZy8x669JZzqdPYm'),
(15, 'Alondra', 'Elías Dávila', 'Ni puta idea 102', 21, '2002-05-14', 4494241803, 'Alondra@gmail.com', 'Usuario', 'Alondra', '$2b$10$JPrdIeCiEWtFpKT9WCQIHOmMsfj4WJOssjhdZpAgRYlp4dPYGa//C'),
(25, 'Yeivi', 'Jara Ruiz', 'Av universidad 101 Rincon de Romos', 26, '2000-01-01', 8527419630, 'Yeivi@gmail.com', 'Usuario', 'YeiviProfesor', '$2b$10$0RUPuQ2Az2CMaJVbGRHShO8l7Lk6wBgwHj9nhvXjz9lv5n.ziG61u');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial`
--

CREATE TABLE `historial` (
  `Entrada` int(11) NOT NULL,
  `No_pedido` int(11) NOT NULL,
  `ID_Cliente` int(11) NOT NULL,
  `Nombre_cliente` varchar(15) NOT NULL,
  `ID_producto` int(11) NOT NULL,
  `Nombre_producto` varchar(30) NOT NULL,
  `Descripcion` varchar(50) NOT NULL,
  `Cantidad_producto` smallint(6) NOT NULL,
  `Precio_unitario_producto` smallint(6) NOT NULL,
  `Precio_total_productos` int(11) NOT NULL,
  `Cantidad_pagar` int(11) NOT NULL,
  `Fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `Estatus` varchar(25) NOT NULL,
  `motivo_Cancelacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_cliente`
--

CREATE TABLE `logs_cliente` (
  `ID` int(11) NOT NULL,
  `ID_Cliente` int(11) NOT NULL,
  `Rol` varchar(25) NOT NULL,
  `Nombre_cliente` varchar(30) NOT NULL,
  `Accion` varchar(30) NOT NULL,
  `Descripcion` varchar(300) NOT NULL,
  `Fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `IP` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `logs_cliente`
--

INSERT INTO `logs_cliente` (`ID`, `ID_Cliente`, `Rol`, `Nombre_cliente`, `Accion`, `Descripcion`, `Fecha_hora`, `IP`) VALUES
(1, 14, 'Usuario', 'Astrid Jimena', 'Creación de carrito', 'Se da de alta un nuevo carrito', '2024-04-05 05:39:12', '192.168.0.10'),
(2, 15, 'Usuario', 'Alondra', 'Adición al carrito', 'Se agrega producto al carrito', '2024-04-05 05:43:21', '192.168.0.10'),
(3, 15, 'Usuario', 'Alondra', 'Adición al carrito', 'Se agrega producto al carrito', '2024-04-05 05:52:26', '192.168.0.10'),
(4, 15, 'Usuario', 'Alondra', 'Adición al carrito', 'Se agrega producto al carrito', '2024-04-05 05:52:30', '192.168.0.10'),
(5, 15, 'Usuario', 'Alondra', 'Creación de pedido', 'Se envía carrito de compras a pedido', '2024-04-05 05:52:38', '192.168.0.10'),
(6, 13, 'Usuario', 'Flor Guadalupe', 'Adición al carrito', 'Se agrega producto al carrito', '2024-04-05 06:04:41', '192.168.0.10'),
(7, 13, 'Usuario', 'Flor Guadalupe', 'Creación de pedido', 'Se envía carrito de compras a pedido', '2024-04-05 06:04:49', '192.168.0.10'),
(8, 13, 'Usuario', 'Flor Guadalupe', 'Cancelación de pedid', ' por parte del usuario', '2024-04-05 06:04:53', '192.168.0.10'),
(18, 12, 'Usuario', 'Luis Salvador', 'Adición al carrito', 'Se agrega producto al carrito', '2024-04-05 06:13:29', '192.168.0.10'),
(19, 12, 'Usuario', 'Luis Salvador', 'Creación de pedido', 'Se envía carrito de compras a pedido', '2024-04-05 06:13:39', '192.168.0.10'),
(20, 12, 'Usuario', 'Luis Salvador', 'Cancelación de pedido', 'Se cancela pedido número 15 por parte del cliente', '2024-04-05 06:13:46', '192.168.0.10'),
(21, 12, 'Usuario', 'Luis Salvador', 'Adición al carrito', 'Se agrega producto al carrito', '2024-04-05 06:31:08', '192.168.0.10'),
(22, 14, 'Usuario', 'Astrid Jimena', 'Adición al carrito', 'Se agrega producto al carrito', '2024-04-05 06:31:16', '192.168.0.10'),
(23, 13, 'Usuario', 'Flor Guadalupe', 'Adición al carrito', 'Se agrega producto al carrito', '2024-04-05 06:31:19', '192.168.0.10'),
(24, 12, 'Usuario', 'Luis Salvador', 'Creación de pedido', 'Se envía carrito de compras a pedido', '2024-04-05 06:31:36', '192.168.0.10'),
(25, 13, 'Usuario', 'Flor Guadalupe', 'Creación de pedido', 'Se envía carrito de compras a pedido', '2024-04-05 06:31:38', '192.168.0.10'),
(26, 14, 'Usuario', 'Astrid Jimena', 'Creación de pedido', 'Se envía carrito de compras a pedido', '2024-04-05 06:31:39', '192.168.0.10'),
(27, 12, 'Usuario', 'Luis Salvador', 'Cancelación de pedido', 'Se cancela pedido número 15 por parte del cliente', '2024-04-05 06:31:42', '192.168.0.10'),
(28, 14, 'Usuario', 'Astrid Jimena', 'Cancelación de pedido', 'Se cancela pedido número 11 por parte del cliente', '2024-04-05 06:31:45', '192.168.0.10'),
(29, 13, 'Usuario', 'Flor Guadalupe', 'Cancelación de pedido', 'Se cancela pedido número 16 por parte del cliente', '2024-04-05 06:31:47', '192.168.0.10'),
(30, 19, 'Cliente', 'Lizbeth', 'Registro de cliente', 'Se registra nuevo cliente', '2024-04-05 07:11:32', '192.168.0.10'),
(31, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-05 13:56:17', '192.168.3.123'),
(32, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-05 13:57:18', '192.168.3.123'),
(33, 13, 'Usuario', 'Flor Guadalupe', 'Logout', 'Cierre de sesión de cliente: Flor', '2024-04-05 13:57:21', '192.168.3.123'),
(34, 20, 'Cliente', 'Luis', 'Registro', 'Se registra nuevo cliente', '2024-04-05 14:10:05', '192.168.3.123'),
(35, 21, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-05 14:11:48', '192.168.3.123'),
(36, 22, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-05 14:12:49', '192.168.3.123'),
(37, 23, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-05 14:14:00', '192.168.3.123'),
(38, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-05 19:01:18', '192.168.3.123'),
(39, 13, 'Usuario', 'Flor Guadalupe', 'Logout', 'Cierre de sesión de cliente: Flor', '2024-04-05 19:01:24', '192.168.3.123'),
(40, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-05 19:01:58', '192.168.3.123'),
(41, 13, 'Usuario', 'Flor Guadalupe', 'Logout', 'Cierre de sesión de cliente: Flor', '2024-04-05 19:02:39', '192.168.3.123'),
(42, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-05 19:02:43', '192.168.3.123'),
(43, 14, 'Usuario', 'Astrid Jimena', 'Cancelación', 'Se cancela pedido número 12 por parte del cliente', '2024-04-05 19:02:49', '192.168.3.123'),
(44, 14, 'Usuario', 'Astrid Jimena', 'Cancelación', 'Se cancela pedido número 17 por parte del cliente', '2024-04-05 19:03:12', '192.168.3.123'),
(45, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-05 19:03:40', '192.168.3.123'),
(46, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-05 19:03:47', '192.168.3.123'),
(47, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 01:12:59', '10.20.52.30'),
(48, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 01:13:05', '10.20.52.30'),
(49, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-06 01:14:49', '10.20.52.30'),
(50, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 01:15:03', '10.20.52.30'),
(51, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 01:15:06', '10.20.52.30'),
(52, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 01:15:13', '10.20.52.30'),
(53, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-06 01:16:34', '10.20.52.30'),
(54, 14, 'Usuario', 'Astrid Jimena', 'Cancelación', 'Se cancela pedido número 18 por parte del cliente', '2024-04-06 01:17:07', '10.20.52.30'),
(55, 14, 'Usuario', 'Astrid Jimena', 'Cancelación', 'Se cancela pedido número 20 por parte del cliente', '2024-04-06 01:17:21', '10.20.52.30'),
(56, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-06 01:18:19', '10.20.52.30'),
(57, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 01:22:08', '10.20.52.30'),
(58, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 01:29:12', '10.20.52.30'),
(59, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 06:28:18', '192.168.0.10'),
(60, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 06:31:49', '192.168.0.10'),
(61, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 06:40:54', '192.168.0.10'),
(62, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 06:41:41', '192.168.0.10'),
(63, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-06 06:42:26', '192.168.0.10'),
(64, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 06:42:40', '192.168.0.10'),
(65, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 06:43:30', '192.168.0.10'),
(66, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 06:48:09', '192.168.0.10'),
(67, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 06:48:15', '192.168.0.10'),
(68, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 06:49:29', '192.168.0.10'),
(69, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 06:50:36', '192.168.0.10'),
(70, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 07:06:23', '192.168.0.10'),
(71, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 07:11:22', '192.168.0.10'),
(72, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-06 07:11:34', '192.168.0.10'),
(73, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 07:11:53', '192.168.0.10'),
(74, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 07:11:57', '192.168.0.10'),
(75, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 07:12:04', '192.168.0.10'),
(76, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-06 07:12:19', '192.168.0.10'),
(77, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 07:21:09', '192.168.0.10'),
(78, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-06 07:24:59', '192.168.0.10'),
(79, 14, 'Usuario', 'Astrid Jimena', 'Cancelación', 'Se cancela el pedido número 19 por parte del cliente', '2024-04-06 07:25:16', '192.168.0.10'),
(80, 14, 'Usuario', 'Astrid Jimena', 'Cancelación', 'Se cancela el pedido número 23 por parte del cliente', '2024-04-06 07:25:48', '192.168.0.10'),
(81, 18, 'Usuario', 'Esly Karina', 'Login', 'Inicio de sesión en empleado: Esly', '2024-04-06 08:10:56', '192.168.0.10'),
(82, 18, 'Usuario', 'Esly Karina', 'Logout', 'Cierre de sesión de cliente: Esly', '2024-04-06 08:10:58', '192.168.0.10'),
(83, 18, 'Usuario', 'Esly Karina', 'Login', 'Inicio de sesión en empleado: Esly', '2024-04-06 08:11:12', '192.168.0.10'),
(84, 18, 'Usuario', 'Esly Karina', 'Logout', 'Cierre de sesión de cliente: Esly', '2024-04-06 08:11:14', '192.168.0.10'),
(85, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-06 08:15:09', '192.168.0.10'),
(86, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-06 08:17:35', '192.168.0.10'),
(87, 13, 'Usuario', 'Flor Guadalupe', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 08:17:57', '192.168.0.10'),
(88, 13, 'Usuario', 'Flor Guadalupe', 'Logout', 'Cierre de sesión de cliente: Flor', '2024-04-06 08:26:30', '192.168.0.10'),
(89, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-06 08:40:44', '192.168.0.10'),
(90, 13, 'Usuario', 'Flor Guadalupe', 'Logout', 'Cierre de sesión de cliente: Flor', '2024-04-06 08:40:50', '192.168.0.10'),
(91, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-06 15:50:56', '192.168.0.10'),
(92, 13, 'Usuario', 'Flor Guadalupe', 'Agregar', 'Se agrega producto al carrito', '2024-04-06 15:51:07', '192.168.0.10'),
(93, 13, 'Usuario', 'Flor Guadalupe', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-06 15:51:29', '192.168.0.10'),
(94, 13, 'Usuario', 'Flor Guadalupe', 'Cancelación', 'Se cancela el pedido número 24 por parte del cliente', '2024-04-06 15:52:05', '192.168.0.10'),
(95, 13, 'Usuario', 'Flor Guadalupe', 'Login', 'Inicio de sesión en empleado: Flor', '2024-04-06 18:36:04', '192.168.2.8'),
(96, 13, 'Usuario', 'Flor Guadalupe', 'Logout', 'Cierre de sesión de cliente: Flor', '2024-04-06 18:36:07', '192.168.2.8'),
(97, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-08 03:48:25', '192.168.0.12'),
(98, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-08 03:54:48', '192.168.0.12'),
(99, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-08 03:54:51', '192.168.0.12'),
(100, 12, 'Usuario', 'Luis Salvador', 'Login', 'Inicio de sesión en empleado: LuisS', '2024-04-08 07:19:37', '192.168.0.12'),
(101, 12, 'Usuario', 'Luis Salvador', 'Logout', 'Cierre de sesión de cliente: LuisS', '2024-04-08 07:19:41', '192.168.0.12'),
(102, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-08 08:30:37', '192.168.0.12'),
(103, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-08 08:30:47', '192.168.0.12'),
(104, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-08 08:31:09', '192.168.0.12'),
(105, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-08 08:31:20', '192.168.0.12'),
(106, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-08 08:34:00', '192.168.0.12'),
(107, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-08 08:34:04', '192.168.0.12'),
(108, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-08 08:36:41', '192.168.0.12'),
(109, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-08 18:39:42', '192.168.3.123'),
(110, 12, 'Usuario', 'Luis Salvador', 'Login', 'Inicio de sesión en empleado: LuisS', '2024-04-08 18:58:37', '192.168.3.123'),
(111, 12, 'Usuario', 'Luis Salvador', 'Login', 'Inicio de sesión en empleado: LuisS', '2024-04-08 19:00:38', '192.168.3.123'),
(112, 12, 'Usuario', 'Luis Salvador', 'Agregar', 'Se agrega producto al carrito', '2024-04-08 19:00:52', '192.168.3.123'),
(113, 12, 'Usuario', 'Luis Salvador', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-08 19:01:01', '192.168.3.123'),
(114, 12, 'Usuario', 'Luis Salvador', 'Login', 'Inicio de sesión en empleado: LuisS', '2024-04-08 19:06:23', '192.168.3.123'),
(115, 12, 'Usuario', 'Luis Salvador', 'Agregar', 'Se agrega producto al carrito', '2024-04-08 19:06:28', '192.168.3.123'),
(116, 12, 'Usuario', 'Luis Salvador', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-08 19:06:43', '192.168.3.123'),
(117, 15, 'Usuario', 'Alondra', 'Login', 'Inicio de sesión en empleado: Alondra', '2024-04-09 01:02:41', '10.10.43.203'),
(118, 15, 'Usuario', 'Alondra', 'Logout', 'Cierre de sesión de cliente: Alondra', '2024-04-09 01:02:43', '10.10.43.203'),
(119, 24, 'Cliente', 'Alejandra', 'Registro', 'Se registra nuevo cliente', '2024-04-09 01:13:13', '10.10.43.203'),
(120, 25, 'Cliente', 'Yeivi', 'Registro', 'Se registra nuevo cliente', '2024-04-09 01:20:37', '10.10.43.203'),
(121, 25, 'Usuario', 'Yeivi', 'Login', 'Inicio de sesión en empleado: YeiviProfesor', '2024-04-09 01:21:12', '10.10.43.203'),
(122, 25, 'Usuario', 'Yeivi', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 01:22:14', '10.10.43.203'),
(123, 25, 'Usuario', 'Yeivi', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 01:22:48', '10.10.43.203'),
(124, 25, 'Usuario', 'Yeivi', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 01:23:32', '10.10.43.203'),
(125, 25, 'Usuario', 'Yeivi', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 01:23:38', '10.10.43.203'),
(126, 25, 'Usuario', 'Yeivi', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-09 01:23:58', '10.10.43.203'),
(127, 25, 'Usuario', 'Yeivi', 'Cancelación', 'Se cancela el pedido número 27 por parte del cliente', '2024-04-09 01:25:05', '10.10.43.203'),
(128, 25, 'Usuario', 'Yeivi', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 01:25:28', '10.10.43.203'),
(129, 25, 'Usuario', 'Yeivi', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-09 01:25:44', '10.10.43.203'),
(130, 25, 'Usuario', 'Yeivi', 'Logout', 'Cierre de sesión de cliente: YeiviProfesor', '2024-04-09 01:25:51', '10.10.43.203'),
(131, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-09 01:26:01', '10.10.43.203'),
(132, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 01:26:07', '10.10.43.203'),
(133, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 01:26:18', '10.10.43.203'),
(134, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-09 01:26:30', '10.10.43.203'),
(135, 26, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-09 04:22:49', '192.168.0.12'),
(136, 27, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-09 04:27:27', '192.168.0.12'),
(137, 28, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-09 04:29:40', '192.168.0.12'),
(138, 29, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-09 04:33:28', '192.168.0.12'),
(139, 30, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-09 04:36:32', '192.168.0.12'),
(140, 31, 'Cliente', 'Luis Salvador', 'Registro', 'Se registra nuevo cliente', '2024-04-09 04:42:32', '192.168.0.12'),
(141, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-09 12:15:35', '192.168.0.12'),
(142, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-09 12:16:24', '192.168.0.12'),
(143, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-09 12:20:06', '192.168.0.12'),
(144, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-09 12:20:20', '192.168.0.12'),
(145, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 12:20:54', '192.168.0.12'),
(146, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-09 12:21:16', '192.168.0.12'),
(147, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-09 12:23:35', '192.168.0.12'),
(148, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-09 12:23:40', '192.168.0.12'),
(149, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 12:23:51', '192.168.0.12'),
(150, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-09 12:24:07', '192.168.0.12'),
(151, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-09 12:28:35', '192.168.0.12'),
(152, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-09 12:28:44', '192.168.0.12'),
(153, 14, 'Usuario', 'Astrid Jimena', 'Agregar', 'Se agrega producto al carrito', '2024-04-09 12:28:52', '192.168.0.12'),
(154, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-09 12:29:36', '192.168.0.12'),
(155, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-09 12:29:40', '192.168.0.12'),
(156, 14, 'Usuario', 'Astrid Jimena', 'Creación', 'Se envía carrito de compras a pedido', '2024-04-09 12:29:47', '192.168.0.12'),
(157, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-09 16:29:04', '192.168.3.123'),
(158, 14, 'Usuario', 'Astrid Jimena', 'Login', 'Inicio de sesión en empleado: Astrid', '2024-04-09 19:54:59', '192.168.3.123'),
(159, 14, 'Usuario', 'Astrid Jimena', 'Logout', 'Cierre de sesión de cliente: Astrid', '2024-04-09 19:58:15', '192.168.3.123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_usuario`
--

CREATE TABLE `logs_usuario` (
  `ID` int(11) NOT NULL,
  `ID_Usuario` int(11) NOT NULL,
  `Rol` varchar(50) NOT NULL,
  `Nombre_usuario` varchar(30) NOT NULL,
  `Accion` varchar(30) NOT NULL,
  `Descripcion` varchar(300) NOT NULL,
  `Fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `IP` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `logs_usuario`
--

INSERT INTO `logs_usuario` (`ID`, `ID_Usuario`, `Rol`, `Nombre_usuario`, `Accion`, `Descripcion`, `Fecha_hora`, `IP`) VALUES
(1, 17, 'Administrador', 'EdgeSlayer', 'Creación de empleado', 'Se crea un nuevo empleado', '2024-04-05 07:06:30', '192.168.0.10'),
(3, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 12', '2024-04-05 07:26:41', '192.168.0.10'),
(4, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos del usuario: 21', '2024-04-05 07:30:47', '192.168.0.10'),
(5, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos de cliente : 19', '2024-04-05 07:34:29', '192.168.0.10'),
(6, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza producto con el ID: 20', '2024-04-05 07:42:09', '192.168.0.10'),
(7, 17, 'Administrador', 'Luis Salvador', 'Creación', 'Se registra nuevo proveedor: Flor', '2024-04-05 07:52:09', '192.168.0.10'),
(8, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina el usuario: 22', '2024-04-05 07:58:01', '192.168.0.10'),
(9, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos de cliente : 19', '2024-04-05 07:59:58', '192.168.0.10'),
(10, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza producto con el ID: 24', '2024-04-05 08:04:58', '192.168.0.10'),
(11, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina producto número: 24', '2024-04-05 08:05:02', '192.168.0.10'),
(15, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-05 13:56:04', '192.168.3.123'),
(16, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-05 13:56:06', '192.168.3.123'),
(19, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-05 14:15:57', '192.168.3.123'),
(20, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-05 14:26:42', '192.168.3.123'),
(21, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-05 14:26:47', '192.168.3.123'),
(22, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina el cliente número: 23', '2024-04-05 14:26:58', '192.168.3.123'),
(23, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina el cliente número: 22', '2024-04-05 14:27:02', '192.168.3.123'),
(24, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina el cliente número: 21', '2024-04-05 14:27:07', '192.168.3.123'),
(25, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-05 16:43:04', '192.168.3.123'),
(27, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-05 19:01:28', '192.168.3.123'),
(28, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-05 19:01:53', '192.168.3.123'),
(29, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 01:10:51', '10.20.52.30'),
(30, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 01:10:51', '10.20.52.30'),
(31, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 01:12:47', '10.20.52.30'),
(32, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 01:18:19', '10.20.52.30'),
(33, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 01:18:24', '10.20.52.30'),
(34, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 01:22:03', '10.20.52.30'),
(35, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 01:33:18', '10.20.52.30'),
(36, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina el cliente número: 20', '2024-04-06 01:34:20', '10.20.52.30'),
(37, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina el cliente número: 19', '2024-04-06 01:34:27', '10.20.52.30'),
(38, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 04:34:06', '192.168.0.10'),
(39, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 04:35:11', '192.168.0.10'),
(40, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 04:37:39', '192.168.0.10'),
(41, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 04:57:16', '192.168.0.10'),
(42, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 04:58:30', '192.168.0.10'),
(43, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:00:23', '192.168.0.10'),
(44, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:03:56', '192.168.0.10'),
(45, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:04:52', '192.168.0.10'),
(46, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:08:59', '192.168.0.10'),
(47, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:10:35', '192.168.0.10'),
(48, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos de cliente : 12', '2024-04-06 05:10:48', '192.168.0.10'),
(49, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:16:28', '192.168.0.10'),
(50, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:18:19', '192.168.0.10'),
(51, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 05:22:57', '192.168.0.10'),
(52, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:23:01', '192.168.0.10'),
(53, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:25:33', '192.168.0.10'),
(54, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 05:26:50', '192.168.0.10'),
(55, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:26:54', '192.168.0.10'),
(56, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:28:19', '192.168.0.10'),
(57, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:29:27', '192.168.0.10'),
(58, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:30:57', '192.168.0.10'),
(59, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:33:09', '192.168.0.10'),
(60, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos de cliente : 12', '2024-04-06 05:37:00', '192.168.0.10'),
(61, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos de cliente : 12', '2024-04-06 05:37:19', '192.168.0.10'),
(62, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 05:38:25', '192.168.0.10'),
(63, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:38:29', '192.168.0.10'),
(64, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:41:51', '192.168.0.10'),
(65, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:45:35', '192.168.0.10'),
(66, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:47:12', '192.168.0.10'),
(67, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos de cliente : 18', '2024-04-06 05:47:30', '192.168.0.10'),
(68, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 05:56:51', '192.168.0.10'),
(69, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 06:40:42', '192.168.0.10'),
(70, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 06:40:44', '192.168.0.10'),
(71, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 06:42:31', '192.168.0.10'),
(72, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 06:42:33', '192.168.0.10'),
(73, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 08:10:20', '192.168.0.10'),
(74, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 08:10:35', '192.168.0.10'),
(113, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 15:37:22', '192.168.0.10'),
(114, 17, 'Administrador', 'EdgeSlayer', 'Creación', 'Se crea un nuevo empleado', '2024-04-06 15:38:13', '192.168.0.10'),
(115, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-06 15:38:30', '192.168.0.10'),
(116, 23, 'Empleado', 'Luis', 'Login', 'Inicio de sesión en empleado: LuisChalan', '2024-04-06 15:38:54', '192.168.0.10'),
(117, 23, 'Empleado', 'Luis', 'Creación', 'Se registra nuevo proveedor: Shein', '2024-04-06 15:39:32', '192.168.0.10'),
(118, 23, 'Empleado', 'Luis', 'Creación', 'Se registra nuevo producto del proveedor: 3', '2024-04-06 15:40:40', '192.168.0.10'),
(119, 23, 'Empleado', 'Luis', 'Logout', 'Cierre de sesión de usuario: LuisChalan', '2024-04-06 15:44:35', '192.168.0.10'),
(120, 23, 'Empleado', 'Luis', 'Login', 'Inicio de sesión en empleado: LuisChalan', '2024-04-06 15:44:56', '192.168.0.10'),
(121, 23, 'Empleado', 'Luis', 'Creación', 'Se registra nuevo proveedor: Shein', '2024-04-06 15:45:28', '192.168.0.10'),
(122, 23, 'Empleado', 'Luis', 'Creación', 'Se registra nuevo producto del proveedor: 4', '2024-04-06 15:46:20', '192.168.0.10'),
(123, 23, 'Empleado', 'Luis', 'Logout', 'Cierre de sesión de usuario: LuisChalan', '2024-04-06 15:47:53', '192.168.0.10'),
(124, 23, 'Empleado', 'Luis', 'Login', 'Inicio de sesión en empleado: LuisChalan', '2024-04-06 15:48:39', '192.168.0.10'),
(125, 23, 'Empleado', 'Luis', 'Creación', 'Se registra nuevo proveedor: Shein', '2024-04-06 15:49:24', '192.168.0.10'),
(126, 23, 'Empleado', 'Luis', 'Creación', 'Se registra nuevo producto del proveedor: 5', '2024-04-06 15:50:36', '192.168.0.10'),
(127, 23, 'Empleado', 'Luis', 'Logout', 'Cierre de sesión de usuario: LuisChalan', '2024-04-06 15:50:50', '192.168.0.10'),
(128, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 18:36:16', '192.168.2.8'),
(129, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina el cliente número: 18', '2024-04-06 18:36:28', '192.168.2.8'),
(130, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos de cliente : 15', '2024-04-06 18:36:42', '192.168.2.8'),
(131, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 18:55:15', '192.168.2.8'),
(132, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos del usuario: 20', '2024-04-06 18:55:57', '192.168.2.8'),
(133, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos del usuario: 20', '2024-04-06 18:56:14', '192.168.2.8'),
(134, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 19:03:42', '192.168.2.8'),
(135, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-06 20:49:25', '192.168.2.8'),
(136, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 21', '2024-04-06 20:49:37', '192.168.2.8'),
(137, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-07 22:55:10', '192.168.2.4'),
(138, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 03:37:08', '192.168.0.12'),
(139, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 03:46:59', '192.168.0.12'),
(140, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 03:55:01', '192.168.0.12'),
(141, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 04:19:24', '192.168.0.12'),
(142, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 04:33:51', '192.168.0.12'),
(143, 17, 'Administrador', 'Luis Salvador', 'Creación', 'Se registra nuevo producto del proveedor: 1', '2024-04-08 04:38:17', '192.168.0.12'),
(144, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-08 04:44:05', '192.168.0.12'),
(145, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 04:44:09', '192.168.0.12'),
(146, 17, 'Administrador', 'Luis Salvador', 'Creación', 'Se registra nuevo producto del proveedor: 2', '2024-04-08 04:45:48', '192.168.0.12'),
(147, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 04:50:14', '192.168.0.12'),
(148, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 04:53:06', '192.168.0.12'),
(149, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 05:28:25', '192.168.0.12'),
(150, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 05:56:51', '192.168.0.12'),
(151, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 06:03:36', '192.168.0.12'),
(152, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 06:19:04', '192.168.0.12'),
(153, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 07:01:12', '192.168.0.12'),
(154, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-08 07:01:14', '192.168.0.12'),
(155, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 07:13:18', '192.168.0.12'),
(156, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos del proveedor: 1', '2024-04-08 07:13:45', '192.168.0.12'),
(157, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-08 07:14:28', '192.168.0.12'),
(158, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 07:52:49', '192.168.0.12'),
(159, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 08:16:55', '192.168.0.12'),
(160, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 08:30:05', '192.168.0.12'),
(161, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-08 08:30:07', '192.168.0.12'),
(162, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 08:30:13', '192.168.0.12'),
(163, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-08 08:30:32', '192.168.0.12'),
(164, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 09:10:01', '192.168.0.12'),
(165, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 09:22:05', '192.168.0.12'),
(166, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 09:35:40', '192.168.0.12'),
(167, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 09:36:52', '192.168.0.12'),
(168, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 09:41:12', '192.168.0.12'),
(169, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 18:39:36', '192.168.3.123'),
(170, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-08 18:39:38', '192.168.3.123'),
(171, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-08 20:09:00', '192.168.3.123'),
(172, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 01:26:37', '10.10.43.203'),
(173, 17, 'Administrador', 'Luis Salvador', 'Creación', 'Se registra nuevo producto del proveedor: 5', '2024-04-09 01:29:50', '10.10.43.203'),
(174, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 01:30:52', '10.10.43.203'),
(175, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 06:28:47', '192.168.0.12'),
(176, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 14', '2024-04-09 06:32:17', '192.168.0.12'),
(177, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 22', '2024-04-09 06:33:35', '192.168.0.12'),
(178, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 06:35:30', '192.168.0.12'),
(179, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 06:35:36', '192.168.0.12'),
(180, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 14', '2024-04-09 06:35:47', '192.168.0.12'),
(181, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 06:36:21', '192.168.0.12'),
(182, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 06:36:33', '192.168.0.12'),
(183, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 06:39:56', '192.168.0.12'),
(184, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 06:40:02', '192.168.0.12'),
(185, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 06:41:16', '192.168.0.12'),
(186, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 06:41:20', '192.168.0.12'),
(187, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 06:43:19', '192.168.0.12'),
(188, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 06:43:23', '192.168.0.12'),
(189, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 06:47:31', '192.168.0.12'),
(190, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 06:47:38', '192.168.0.12'),
(191, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 06:50:12', '192.168.0.12'),
(192, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 06:50:18', '192.168.0.12'),
(193, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:12:31', '192.168.0.12'),
(194, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 14', '2024-04-09 11:12:41', '192.168.0.12'),
(195, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:15:14', '192.168.0.12'),
(196, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 14', '2024-04-09 11:15:50', '192.168.0.12'),
(197, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:18:48', '192.168.0.12'),
(198, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 14', '2024-04-09 11:18:58', '192.168.0.12'),
(199, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:20:14', '192.168.0.12'),
(200, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 11:22:41', '192.168.0.12'),
(201, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:22:47', '192.168.0.12'),
(202, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 14', '2024-04-09 11:22:58', '192.168.0.12'),
(203, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 11:24:17', '192.168.0.12'),
(204, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:24:22', '192.168.0.12'),
(205, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza pedido número: 14', '2024-04-09 11:24:35', '192.168.0.12'),
(206, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:42:20', '192.168.0.12'),
(207, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 11:44:37', '192.168.0.12'),
(208, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:44:42', '192.168.0.12'),
(209, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 11:49:16', '192.168.0.12'),
(210, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:49:21', '192.168.0.12'),
(211, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:51:37', '192.168.0.12'),
(212, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 11:52:45', '192.168.0.12'),
(213, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:52:50', '192.168.0.12'),
(214, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:55:51', '192.168.0.12'),
(215, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 11:58:39', '192.168.0.12'),
(216, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 11:58:44', '192.168.0.12'),
(217, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 12:01:52', '192.168.0.12'),
(218, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 12:03:14', '192.168.0.12'),
(219, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualiza producto con el ID: 20', '2024-04-09 12:03:30', '192.168.0.12'),
(220, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 12:11:33', '192.168.0.12'),
(221, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 12:11:40', '192.168.0.12'),
(222, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos del proveedor: 1', '2024-04-09 12:13:09', '192.168.0.12'),
(223, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 12:16:24', '192.168.0.12'),
(224, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 12:16:28', '192.168.0.12'),
(225, 17, 'Administrador', 'Luis Salvador', 'Eliminación', 'Se elimina el cliente número: 28', '2024-04-09 12:16:37', '192.168.0.12'),
(226, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 12:19:46', '192.168.0.12'),
(227, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 12:19:52', '192.168.0.12'),
(228, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 12:20:01', '192.168.0.12'),
(229, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 14:03:23', '192.168.3.123'),
(230, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 14:04:00', '192.168.3.123'),
(231, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 14:08:04', '192.168.3.123'),
(232, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 14:08:08', '192.168.3.123'),
(233, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos del usuario: 17', '2024-04-09 14:08:45', '192.168.3.123'),
(234, 17, 'Administrador', 'Luis Salvador', 'Actualización', 'Se actualizan datos del usuario: 17', '2024-04-09 16:05:27', '192.168.3.123'),
(235, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 16:10:27', '192.168.3.123'),
(236, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 16:26:40', '192.168.3.123'),
(237, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 16:28:56', '192.168.3.123'),
(238, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 16:44:40', '192.168.3.123'),
(239, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 16:47:53', '192.168.3.123'),
(240, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 16:48:12', '192.168.3.123'),
(241, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 16:59:50', '192.168.3.123'),
(242, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 16:59:58', '192.168.3.123'),
(243, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 17:03:37', '192.168.3.123'),
(244, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 17:03:43', '192.168.3.123'),
(245, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 17:06:27', '192.168.3.123'),
(246, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 17:29:56', '192.168.3.123'),
(247, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 17:30:04', '192.168.3.123'),
(248, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 17:33:04', '192.168.3.123'),
(249, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 17:33:09', '192.168.3.123'),
(250, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 17:38:21', '192.168.3.123'),
(251, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 17:38:29', '192.168.3.123'),
(252, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 17:40:36', '192.168.3.123'),
(253, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 17:40:42', '192.168.3.123'),
(254, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 17:43:57', '192.168.3.123'),
(255, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 17:44:00', '192.168.3.123'),
(256, 17, 'Administrador', 'Luis Salvador', 'Creación', 'Se registra nuevo producto del proveedor: 5', '2024-04-09 17:46:41', '192.168.3.123'),
(257, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 19:20:43', '192.168.3.123'),
(258, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 19:20:55', '192.168.3.123'),
(259, 17, 'Administrador', 'Luis Salvador', 'Login', 'Inicio de sesión en administrador: EdgeSlayer', '2024-04-09 19:54:16', '192.168.3.123'),
(260, 17, 'Administrador', 'Luis Salvador', 'Logout', 'Cierre de sesión de usuario: EdgeSlayer', '2024-04-09 19:58:15', '192.168.3.123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `No_pedido` int(11) NOT NULL,
  `ID_Cliente` int(11) NOT NULL,
  `Nombre_cliente` varchar(15) NOT NULL,
  `ID_Producto` int(11) NOT NULL,
  `Nombre_producto` varchar(30) NOT NULL,
  `Descripcion` varchar(50) NOT NULL,
  `Cantidad_producto` smallint(6) NOT NULL,
  `Precio_unitario_producto` smallint(6) NOT NULL,
  `Precio_total_productos` int(11) NOT NULL,
  `Cantidad_pagar` int(11) NOT NULL,
  `Ubicacion` varchar(50) NOT NULL,
  `Fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `Estatus` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`No_pedido`, `ID_Cliente`, `Nombre_cliente`, `ID_Producto`, `Nombre_producto`, `Descripcion`, `Cantidad_producto`, `Precio_unitario_producto`, `Precio_total_productos`, `Cantidad_pagar`, `Ubicacion`, `Fecha`, `Estatus`) VALUES
(21, 14, 'Astrid Jimena', 20, 'Blusa', 'Blusa negra manga corta', 3, 500, 1500, 0, 'Guanajuato', '2024-04-06 07:06:35', 'En ruta de entrega'),
(22, 14, 'Astrid Jimena', 20, 'Blusa', 'Blusa negra manga corta', 3, 500, 1500, 0, 'Ciudad de Mexico', '2024-04-06 07:11:34', 'En ruta de entrega'),
(25, 12, 'Luis Salvador', 21, 'Vestido', 'Vestido negro corte de corazón en el pecho', 1, 700, 700, 0, 'Aguascalientes', '2024-04-08 19:01:00', 'Pendiente de pago'),
(26, 12, 'Luis Salvador', 20, 'Blusa', 'Blusa negra manga corta', 1, 500, 500, 0, 'Aguascalientes', '2024-04-08 19:06:43', 'Pendiente de pago'),
(28, 25, 'Yeivi', 23, 'Pantalón', 'Pantalón de Mezclilla', 9, 500, 4500, 0, 'Aguascalientes', '2024-04-09 01:25:44', 'Pendiente de pago'),
(29, 14, 'Astrid Jimena', 21, 'Vestido', 'Vestido negro corte de corazón en el pecho', 1, 700, 700, 0, 'Aguascalientes', '2024-04-09 12:20:19', 'Pendiente de pago'),
(30, 14, 'Astrid Jimena', 23, 'Pantalón', 'Pantalón de Mezclilla', 1, 500, 500, 0, 'Aguascalientes', '2024-04-09 12:21:15', 'Pendiente de pago'),
(31, 14, 'Astrid Jimena', 20, 'Blusa', 'Blusa negra manga corta', 1, 500, 500, 0, 'Aguascalientes', '2024-04-09 12:24:07', 'Pendiente de pago'),
(32, 14, 'Astrid Jimena', 22, 'Blusa deportiva', 'Blusa deportiva', 1, 300, 300, 0, 'Aguascalientes', '2024-04-09 12:29:47', 'Pendiente de pago');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `ID_Producto` int(11) NOT NULL,
  `Nombre_producto` varchar(30) NOT NULL,
  `Descripcion` varchar(50) NOT NULL,
  `Color` varchar(15) NOT NULL,
  `Talla` varchar(20) NOT NULL,
  `Material` varchar(15) NOT NULL,
  `Marca` varchar(25) NOT NULL,
  `Temporada` varchar(30) NOT NULL,
  `Existencias` smallint(6) NOT NULL,
  `Precio` float NOT NULL,
  `Precio_publico` float NOT NULL,
  `ID_Proveedor` int(11) NOT NULL,
  `filepath` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`ID_Producto`, `Nombre_producto`, `Descripcion`, `Color`, `Talla`, `Material`, `Marca`, `Temporada`, `Existencias`, `Precio`, `Precio_publico`, `ID_Proveedor`, `filepath`) VALUES
(20, 'Blusa', 'Blusa negra manga corta', 'Negro', 'Chica', 'Algodon', 'Aeropostale', 'Primavera', 3, 250, 500, 1, 'uploads\\imagen_1711755328299imagen_1711671472712playeras-aeropostale-dama-nuevas-mayoreo-original-D_NQ_NP_967231-MLM31214568647_062019-Q.jpg'),
(21, 'Vestido', 'Vestido negro corte de corazón en el pecho', 'Negro', 'XL', 'Algodón', 'Shein Curvy', 'Verano', 6, 350, 700, 1, 'uploads\\imagen_1711755402343imagen_1711671505231b8fb775acf84732fe4a7766ada080d69.jpg'),
(22, 'Blusa deportiva', 'Blusa deportiva', 'Rojo', 'Grande', 'Algodón', 'Adidas', 'Verano', 11, 150, 300, 1, 'uploads\\imagen_17117554339281711669092760-IN-GN2902-1.png'),
(23, 'Pantalón', 'Pantalón de Mezclilla', 'Azul', 'Grande', 'Mezclilla', 'Levis', 'Verano', 4, 250, 500, 1, 'uploads\\imagen_17120822643361680213793_PANTALON FRENTE.png'),
(25, 'Blusa deportiva', 'Chamarra de piel para caballero rockera', 'Negro', 'Grande', 'Vinipiel', 'Aeropostale', 'Invierno', 2, 150, 300, 1, 'uploads\\imagen_171239520969123-4-300x300.png'),
(26, 'Panties', 'Panties calavera', 'Negro', 'Chica', 'Algodon', 'Rotten Cherry', 'Verano', 50, 100, 200, 2, 'uploads\\imagen_1712417413491images.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `ID_Proveedor` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Apellido` varchar(30) NOT NULL,
  `Telefono` bigint(20) NOT NULL,
  `Correo` varchar(30) NOT NULL,
  `Empresa` varchar(20) NOT NULL,
  `filepath` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`ID_Proveedor`, `Nombre`, `Apellido`, `Telefono`, `Correo`, `Empresa`, `filepath`) VALUES
(1, 'Luis Salvador', 'Delgado', 4651164877, 'EdgeSlayer98@gmail.com', 'Epic Games Store', 'uploads\\images (1).jpeg'),
(2, 'Astrid Jimena', 'Rodríguez Ramírez', 8342566491, 'AstridJ@gmail.com', 'The Rotten Cherry', 'uploads\\imagen_1712410693824images (1).png'),
(5, 'Alondra', 'Elías Dávila', 7897897897, 'AlondraED@gmail.com', 'Shein', 'uploads\\imagen_1712418546354fkehnxzexbetqozch34y.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Apellido` varchar(30) NOT NULL,
  `Direccion` varchar(75) NOT NULL,
  `Edad` smallint(6) NOT NULL,
  `Fecha_nacimiento` date NOT NULL,
  `Telefono` bigint(20) NOT NULL,
  `Correo` varchar(30) NOT NULL,
  `Rol` varchar(25) NOT NULL,
  `Nombre_usuario` varchar(15) NOT NULL,
  `Contrasena` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre`, `Apellido`, `Direccion`, `Edad`, `Fecha_nacimiento`, `Telefono`, `Correo`, `Rol`, `Nombre_usuario`, `Contrasena`) VALUES
(17, 'Luis Salvador', 'Delgado Romo', 'Francisco Javier Martínez Hernandez #306', 26, '1997-08-01', 4651164831, 'EdgeSlayer97@gmail.com', 'Administrador', 'EdgeSlayer', '$2b$10$wEuruXQ4gR/lhQZaPqHwCO097FAlByKtAgnwIdjXxwA1m9vu9.MM2'),
(21, 'Alondra', 'Elías Dávila', 'Ni puta idea 101', 21, '2002-05-14', 1234567890, 'AlondraE@gmail.com', 'Administrador', 'AlondraX', '$2b$10$cSeGrWWIuCoqtZ8B9AAl4.tr7.kIMesikEaoOn2jzPKe4rL061y/m'),
(23, 'Luis', 'Delgado', 'Francisco Javier Martínez Hernandez 304', 26, '1997-08-01', 4651164835, 'Luis_salvador97@hotmail.com', 'Empleado', 'LuisChalan', '$2b$10$auNlBed7qZLnMDNP7Qya.e137omC8QDRjajtcgIHBQfbIkEg05ouu');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD KEY `fk_idcliente` (`ID_Cliente`),
  ADD KEY `fk_idproducto` (`ID_Producto`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`ID_Cliente`),
  ADD UNIQUE KEY `Telefono` (`Telefono`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD UNIQUE KEY `Nombre_usuario` (`Nombre_usuario`),
  ADD KEY `ID_Clientex` (`ID_Cliente`);

--
-- Indices de la tabla `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`Entrada`),
  ADD KEY `fk_idclienteH` (`ID_Cliente`),
  ADD KEY `fk_idproductoH` (`ID_producto`);

--
-- Indices de la tabla `logs_cliente`
--
ALTER TABLE `logs_cliente`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_cliente` (`ID_Cliente`);

--
-- Indices de la tabla `logs_usuario`
--
ALTER TABLE `logs_usuario`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_usuario_logs` (`ID_Usuario`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD KEY `fk_idclienteP` (`ID_Cliente`),
  ADD KEY `fk_idproductoP` (`ID_Producto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`ID_Producto`),
  ADD KEY `fk_proveedor` (`ID_Proveedor`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`ID_Proveedor`),
  ADD UNIQUE KEY `Telefono` (`Telefono`),
  ADD UNIQUE KEY `Correo` (`Correo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD UNIQUE KEY `Telefono` (`Telefono`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD UNIQUE KEY `Nombre_usuario` (`Nombre_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `ID_Cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `historial`
--
ALTER TABLE `historial`
  MODIFY `Entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `logs_cliente`
--
ALTER TABLE `logs_cliente`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT de la tabla `logs_usuario`
--
ALTER TABLE `logs_usuario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=263;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `ID_Proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `fk_idcliente` FOREIGN KEY (`ID_Cliente`) REFERENCES `cliente` (`ID_Cliente`),
  ADD CONSTRAINT `fk_idproducto` FOREIGN KEY (`ID_Producto`) REFERENCES `productos` (`ID_Producto`);

--
-- Filtros para la tabla `historial`
--
ALTER TABLE `historial`
  ADD CONSTRAINT `fk_idclienteH` FOREIGN KEY (`ID_Cliente`) REFERENCES `cliente` (`ID_Cliente`),
  ADD CONSTRAINT `fk_idproductoH` FOREIGN KEY (`ID_producto`) REFERENCES `productos` (`ID_Producto`);

--
-- Filtros para la tabla `logs_usuario`
--
ALTER TABLE `logs_usuario`
  ADD CONSTRAINT `fk_usuario_logs` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_idclienteP` FOREIGN KEY (`ID_Cliente`) REFERENCES `cliente` (`ID_Cliente`),
  ADD CONSTRAINT `fk_idproductoP` FOREIGN KEY (`ID_Producto`) REFERENCES `productos` (`ID_Producto`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_proveedor` FOREIGN KEY (`ID_Proveedor`) REFERENCES `proveedor` (`ID_Proveedor`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
