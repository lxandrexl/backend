-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         5.7.24 - MySQL Community Server (GPL)
-- SO del servidor:              Win64
-- HeidiSQL Versión:             9.5.0.5332
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para bd_chat
CREATE DATABASE IF NOT EXISTS `bd_chat` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `bd_chat`;

-- Volcando estructura para tabla bd_chat.tbl_chat
CREATE TABLE IF NOT EXISTS `tbl_chat` (
  `id_chat` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `id_psiquica` int(11) DEFAULT NULL,
  `tiempo` varchar(50) DEFAULT NULL,
  `token` text,
  `evaluacion` int(11) DEFAULT NULL,
  `comentario` varchar(255) DEFAULT NULL,
  `fecha_inicio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` int(11) DEFAULT '1',
  PRIMARY KEY (`id_chat`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_citas
CREATE TABLE IF NOT EXISTS `tbl_citas` (
  `id_cita` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `tiempo` int(11) DEFAULT NULL,
  `hora` varchar(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `estado` int(11) DEFAULT '1' COMMENT '1:Pendiente; 2:Activo; 0:Cerrado',
  PRIMARY KEY (`id_cita`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_conversacion
CREATE TABLE IF NOT EXISTS `tbl_conversacion` (
  `id_chat` int(11) DEFAULT NULL,
  `emisor` char(1) DEFAULT NULL COMMENT 'P = Psiquica U = Usuario',
  `mensaje` text,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_horarios_cita
CREATE TABLE IF NOT EXISTS `tbl_horarios_cita` (
  `id` varchar(20) NOT NULL DEFAULT '',
  `horario` varchar(20) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_pagos
CREATE TABLE IF NOT EXISTS `tbl_pagos` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(50) DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `obj_pago` varchar(75) DEFAULT NULL,
  `tipo_pago` varchar(50) DEFAULT NULL,
  `cod_cargo` varchar(100) DEFAULT NULL,
  `email_comprador` varchar(75) DEFAULT NULL,
  `monto_pagado` double DEFAULT '0',
  `tipo_moneda` varchar(15) DEFAULT NULL,
  `otros_datos` text,
  `fecha_reg` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_productos
CREATE TABLE IF NOT EXISTS `tbl_productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT '0',
  `tiempo` int(11) DEFAULT '0',
  `estado` int(11) DEFAULT '1',
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_psiquicas
CREATE TABLE IF NOT EXISTS `tbl_psiquicas` (
  `id_psiquica` int(11) NOT NULL AUTO_INCREMENT,
  `estado` int(11) DEFAULT NULL COMMENT '0:off - 1:ocupado - 2:ocupado',
  `email` varchar(150) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `foto` text,
  `descripcion` text,
  `signo` varchar(50) DEFAULT NULL,
  `elemento` varchar(50) DEFAULT NULL,
  `piedra` varchar(50) DEFAULT NULL,
  `deleted` int(11) DEFAULT '0' COMMENT '1 = deleted',
  PRIMARY KEY (`id_psiquica`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_usuarios
CREATE TABLE IF NOT EXISTS `tbl_usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_usuario` int(11) NOT NULL DEFAULT '0' COMMENT '0 : user  -- 1: psiquica',
  `email` varchar(50) NOT NULL,
  `token` text,
  `nombre` varchar(50) NOT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL,
  `sexo` char(50) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `foto` varchar(355) NOT NULL DEFAULT 'default.png',
  `direccion` varchar(100) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `citas_josie` int(11) DEFAULT '0',
  `min_psiquica` int(11) NOT NULL DEFAULT '0',
  `min_gratis` int(11) DEFAULT '0',
  `verificado` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_videos
CREATE TABLE IF NOT EXISTS `tbl_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `url` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla bd_chat.tbl_zodiaco
CREATE TABLE IF NOT EXISTS `tbl_zodiaco` (
  `id_zodiaco` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `imagen` varchar(50) DEFAULT NULL,
  `fecha` varchar(50) DEFAULT NULL,
  `descripcion` text,
  `color` varchar(100) DEFAULT NULL,
  `planeta` varchar(100) DEFAULT NULL,
  `frase` varchar(100) DEFAULT NULL,
  `elemento` varchar(100) DEFAULT NULL,
  `piedra` varchar(100) DEFAULT NULL,
  `audio_semanal` varchar(100) DEFAULT NULL,
  `audio_ritual` varchar(100) DEFAULT NULL,
  `audio_conquistas` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_zodiaco`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
