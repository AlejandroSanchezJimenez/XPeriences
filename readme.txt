Proyecto de Turismo Local

Este proyecto de Turismo Local es una plataforma web que permite a los usuarios explorar y reservar tours y rutas locales. Los usuarios pueden buscar tours por ubicación, fecha y estrellas, visualizar detalles de los tours, realizar reservas, y valorar los tours después de completarlos.

Características principales

Exploración de Tours y Rutas: Los usuarios pueden explorar tours y rutas locales disponibles.
Búsqueda Avanzada: Los usuarios pueden buscar tours por ubicación, fecha y estrellas.
Reservas de Tours: Los usuarios pueden reservar tours disponibles.
Valoraciones de Tours: Los usuarios pueden valorar los tours después de completarlos.
Administración de Tours y Rutas: Los guías pueden administrar los tours y rutas que ofrecen.

Tecnologías utilizadas

Frontend: HTML, CSS, JavaScript (jQuery), Bootstrap
Backend: PHP (Symfony framework)
Base de datos: MySQL
Mapas: Leaflet.js
Calendario: FullCalendar.js

Estructura del Proyecto

El proyecto sigue una estructura de cliente-servidor, con el frontend implementado en HTML, CSS y JavaScript, y el backend desarrollado en PHP utilizando el framework Symfony. La base de datos MySQL se utiliza para almacenar los datos de los usuarios, tours, reservas y valoraciones.

La parte frontend del proyecto se organiza en diferentes archivos y carpetas para mantener una estructura clara y modular. La carpeta js contiene los scripts JavaScript utilizados para la funcionalidad interactiva del cliente, mientras que la carpeta css contiene los estilos CSS para el diseño de la interfaz de usuario. La carpeta media contiene las imágenes utilizadas en el proyecto.

La parte backend del proyecto se organiza siguiendo la arquitectura MVC (Modelo-Vista-Controlador) proporcionada por Symfony. Los controladores manejan las solicitudes del cliente, interactúan con los modelos para acceder a la base de datos y generan las respuestas adecuadas para enviar al cliente.

Instalación y Uso

Para instalar y ejecutar el proyecto en tu propio entorno de desarrollo, sigue estos pasos:

Clona el repositorio del proyecto en tu máquina local.
Configura el entorno de desarrollo local con PHP, MySQL y Symfony.
Importa la base de datos proporcionada en MySQL.
Actualiza la configuración de la base de datos en el archivo de configuración de Symfony.
Ejecuta el servidor Symfony utilizando el comando symfony server:start.
Accede al proyecto a través del navegador web utilizando la URL proporcionada por Symfony.

Créditos
Este proyecto fue desarrollado por Alejandro Sánchez Jiménez como parte del proyecto final de Enero del curso de Desarrollo Web.