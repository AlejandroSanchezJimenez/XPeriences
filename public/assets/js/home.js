//Declaraciones de variables

var localidades = []
var fotoGrupo = "";
var imagebase64 = "";
var maps = {};
var marcadoresPorTitulo = {};
var fotoRuta = "";
var programacion = {
    fragmento: []
};
var eventos = [];
var lastElement = ''
var url = new URL(window.location.href);


/**
 * Realiza una solicitud AJAX para obtener datos de la API de localidad.
 * La URL, el tipo de solicitud y el tipo de datos esperados pueden ser configurados.
 */
$.ajax({
    url: 'https://localhost:8000/localidad/api', // URL de la API
    type: 'GET', // Método HTTP GET
    dataType: 'json', // Tipo de datos esperados en la respuesta (puedes cambiarlo según el tipo de datos que esperas)
    success: function (data) {
        /**
         * Función que se ejecuta cuando la solicitud AJAX es exitosa.
         * Itera sobre los datos recibidos y agrega opciones a elementos HTML select.
         */
        $.each(data, function (index, elemento) {
            $("#loc-datalist").append($('<option>', {
                // value: elemento.id, // Valor de la opción (puedes descomentar esto si el elemento tiene una propiedad 'id')
                value: elemento.nombre // Valor de la opción, en este caso se usa el nombre
            }));
            $("#sel-loc").append($('<option>', {
                value: elemento.id, // Valor de la opción (se asume que 'id' es una propiedad del elemento)
                text: elemento.nombre // Texto de la opción
            }));
            $("#sel-loc-upd").append($('<option>', {
                value: elemento.nombre, // Valor de la opción (se asume que 'id' es una propiedad del elemento)
                text: elemento.nombre // Texto de la opción
            }));
        });
    },
    error: function (jqXHR, textStatus, errorThrown) {
        /**
         * Función que maneja los errores de la llamada AJAX.
         * Registra un mensaje de error en la consola del navegador.
         */
        console.error('Error en la solicitud: ', textStatus, errorThrown);
    }
});

/**
 * Realiza una solicitud AJAX para obtener datos de la API de guía de usuario.
 * La URL, el tipo de solicitud y el tipo de datos esperados pueden ser configurados.
 */
$.ajax({
    url: 'https://localhost:8000/user/api/guia', // URL de la API
    type: 'GET', // Método HTTP GET
    dataType: 'json', // Tipo de datos esperados en la respuesta (puedes cambiarlo según el tipo de datos que esperas)
    success: function (data) {
        /**
         * Función que se ejecuta cuando la solicitud AJAX es exitosa.
         * Itera sobre los datos recibidos y agrega opciones a un elemento HTML select.
         */
        $.each(data, function (index, elemento) {
            $("#sel-guia").append($('<option>', {
                value: elemento.id, // Valor de la opción (se asume que 'id' es una propiedad del elemento)
                text: elemento.email // Texto de la opción (se asume que 'email' es una propiedad del elemento)
            }));
            $("#change-guia").append($('<option>', {
                value: elemento.id, // Valor de la opción (se asume que 'id' es una propiedad del elemento)
                text: elemento.email // Texto de la opción (se asume que 'email' es una propiedad del elemento)
            }));
            $("#sel-guia-upd").append($('<option>', {
                value: elemento.email, // Valor de la opción (se asume que 'id' es una propiedad del elemento)
                text: elemento.email, // Texto de la opción (se asume que 'email' es una propiedad del elemento)
                dataId: elemento.id
            }));
            $("#sel-new-guia").append($('<option>', {
                value: elemento.email, // Valor de la opción (se asume que 'id' es una propiedad del elemento)
                text: elemento.email, // Texto de la opción (se asume que 'email' es una propiedad del elemento)
                dataId: elemento.id
            }));
            $("#sel-guia-cal").append($('<option>', {
                value: elemento.email, // Valor de la opción (se asume que 'id' es una propiedad del elemento)
                text: elemento.email, // Texto de la opción (se asume que 'email' es una propiedad del elemento)
                dataId: elemento.id
            }));
        });
    },
    error: function (jqXHR, textStatus, errorThrown) {
        /**
         * Función que maneja los errores de la llamada AJAX.
         * Registra un mensaje de error en la consola del navegador.
         */
        console.error('Error en la solicitud: ', textStatus, errorThrown);
    }
});


/**
 * Función para rellenar una lista desordenada (ul) con elementos obtenidos de una API.
 * Realiza una solicitud AJAX para obtener datos de la API de elementos.
 * La URL, el tipo de solicitud y el tipo de datos esperados pueden ser configurados.
 * Los elementos obtenidos se agregan como elementos de lista (li) a un contenedor con el ID "sortable1".
 */
function rellenarUl() {
    $.ajax({
        url: 'https://localhost:8000/item/api', // URL de la API
        type: 'GET', // Método HTTP GET
        dataType: 'json', // Tipo de datos esperados en la respuesta
        success: function (data) {
            /**
             * Función que se ejecuta cuando la solicitud AJAX es exitosa.
             * Itera sobre los datos recibidos y agrega elementos de lista (li) al contenedor "sortable1".
             * Cada elemento de lista incluye el título del elemento, latitud, longitud y ID como atributos.
             */
            $.each(data, function (index, elemento) {
                var nuevoElemento = $("<li>") // Crea un nuevo elemento de lista
                    .addClass("ui-state-default") // Agrega una clase CSS al elemento
                    .text(elemento.titulo) // Establece el texto del elemento como el título del elemento obtenido
                    .attr({ // Agrega atributos al elemento
                        'lat': elemento.latitud, // Atributo "lat" con la latitud del elemento
                        'long': elemento.longitud, // Atributo "long" con la longitud del elemento
                        'id': elemento.id // Atributo "id" con el ID del elemento
                    });

                // Agrega el nuevo elemento de lista al contenedor con el ID "sortable1"
                $("#sortable1").append(nuevoElemento);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            /**
             * Función que maneja los errores de la llamada AJAX.
             * Registra un mensaje de error en la consola del navegador.
             */
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

// LLamada a la función
rellenarUl()

/**
 * Función que se ejecuta cuando se hace clic en el elemento con el ID "register".
 * Realiza una solicitud AJAX para enviar los datos de registro del usuario a la API.
 * La URL, el tipo de solicitud, el tipo de contenido y los datos a enviar pueden ser configurados.
 */
$("#register").click(function () {
    $.ajax({
        url: 'https://localhost:8000/usuario/api/crear', // URL de la API
        type: 'POST', // Método HTTP POST
        contentType: 'application/json', // Especifica el tipo de contenido como JSON
        data: JSON.stringify({ // Convierte los datos a un formato JSON y los envía en la solicitud
            email: $("#registerEmail").val(), // Obtiene el valor del campo de correo electrónico de registro
            plainpassword: $("#registerPass").val() // Obtiene el valor del campo de contraseña de registro
        }),
        success: function (respuesta) {
            /**
             * Función que se ejecuta cuando la solicitud AJAX es exitosa.
             * Muestra una alerta con un mensaje de éxito y recarga la página para aplicar los cambios.
             */
            alert("Usuario creado con éxito"); // Muestra una alerta con un mensaje de éxito
            location.reload(true); // Recarga la página para aplicar los cambios
        },
        error: function (jqXHR, textStatus, errorThrown) {
            /**
             * Función que maneja los errores de la llamada AJAX.
             * Registra un mensaje de error en la consola del navegador.
             */
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
});




/**
 * Inicializa un mapa utilizando Leaflet.
 * La función comprueba si la ubicación actual se encuentra en las páginas '/rutas' o '/searchPanel/tour'.
 * Si la geolocalización está disponible, establece la posición del mapa según la ubicación del dispositivo.
 * Se utiliza un temporizador para asegurar que el mapa se inicialice correctamente en la página '/rutas'.
 * Para la página '/searchPanel/tour', se añaden marcadores personalizados y se centra el mapa en un punto de encuentro.
 * También se maneja la opción de buscar un elemento y agregar un marcador en el mapa.
 * @param {string} mapName - El nombre del mapa a inicializar.
 */
function initializeMaps(mapName) {
    if (window.location.pathname == '/rutas' || window.location.pathname == '/searchPanel/tour') {
        if (navigator.geolocation) {
            // Si la geolocalización está disponible, obtiene la posición actual del dispositivo
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitud = position.coords.latitude;
                var longitud = position.coords.longitude;

                if (window.location.pathname == '/rutas') {
                    // Si la página es '/rutas', inicializa el mapa después de un tiempo para asegurarse de que otros elementos estén listos
                    setTimeout(function () {
                        var map = L.map(mapName).setView([latitud, longitud], 13);
                        initializeMap(map);
                        maps[mapName] = map;
                    }, 1000);
                } else if (window.location.pathname == '/searchPanel/tour') {
                    // Si la página es '/searchPanel/tour', inicializa el mapa y añade marcadores personalizados
                    var map4 = L.map('map-encounter-pt').setView([$('#map-encounter-pt').attr('data-lat'), $('#map-encounter-pt').attr('data-long')], 13);
                    initializeMap(map4);

                    // Crea un icono personalizado para los marcadores
                    var customIcon = L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [0, -41],
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                        shadowSize: [41, 41],
                        shadowAnchor: [12, 41]
                    });

                    customIcon.options.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png';

                    // Añade marcadores para cada elemento de la lista de items
                    $('#items li').each(function () {
                        var lat = $(this).data('lat');
                        var long = $(this).data('long');

                        L.marker([lat, long]).addTo(map4)
                            .bindPopup($(this).text())
                            .openPopup();
                    });

                    // Añade un marcador para el punto de encuentro con el icono personalizado
                    L.marker([$('#map-encounter-pt').attr('data-lat'), $('#map-encounter-pt').attr('data-long')], { icon: customIcon }).addTo(map4)
                        .bindPopup('Punto de encuentro')
                        .openPopup();
                }

                // Maneja el evento de clic en el botón "findItem" para buscar un elemento y agregar un marcador en el mapa
                $("#findItem").click(function (ev) {
                    ev.preventDefault();
                    L.marker([$("#lat").val(), $("#long").val()]).addTo(maps['map'])
                        .bindPopup($("#tituloItem").val())
                        .openPopup();
                });

            }, function (error) {
                console.error("Error al obtener la ubicación: " + error.message);
            });
        } else {
            console.error("Geolocalización no es compatible con este navegador.");
        }
    }
}


/**
 * Inicializa un mapa Leaflet con una capa de mosaico de OpenStreetMap.
 * @param {L.Map} map - El objeto de mapa Leaflet en el que se añadirá la capa de mosaico.
 */
function initializeMap(map) {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

/**
 * Codifica el contenido de un archivo de imagen como una URL en formato base64 y lo asigna a la variable imagebase64.
 * @param {HTMLInputElement} element - El elemento de entrada de archivo que contiene la imagen a codificar.
 */
function encodeImageFileAsURL(element) {
    // Obtiene el archivo de imagen seleccionado por el usuario
    var file = element.files[0];

    // Crea un nuevo objeto FileReader para leer el contenido del archivo
    var reader = new FileReader();

    // Configura el evento onloadend para manejar el final de la lectura del archivo
    reader.onloadend = function () {
        // Asigna el resultado de la lectura (imagen codificada en base64) a la variable imagebase64
        imagebase64 = reader.result;
    }

    // Lee el contenido del archivo como una URL en formato base64
    reader.readAsDataURL(file);
}


/**
 * Función que se ejecuta cuando se hace clic en el elemento con el ID "newItem".
 * Realiza una solicitud AJAX para crear un nuevo elemento a través de la API.
 * Los datos del elemento son obtenidos de los campos del formulario.
 * @param {Event} ev - El evento de clic que desencadena la función.
 */
$("#newItem").click(function (ev) {
    // Previene el comportamiento predeterminado del evento de clic
    ev.preventDefault();

    // Realiza una solicitud AJAX para enviar los datos del nuevo elemento a la API
    $.ajax({
        url: 'https://localhost:8000/item/api/crear', // URL de la API para crear un nuevo elemento
        type: 'POST', // Método HTTP POST
        contentType: 'application/json', // Tipo de contenido de la solicitud (JSON)
        data: JSON.stringify({ // Convierte los datos a un formato JSON y los envía en la solicitud
            titulo: $("#tituloItem").val(), // Obtiene el valor del campo de título del nuevo elemento
            descripcion: $("#descItem").val(), // Obtiene el valor del campo de descripción del nuevo elemento
            foto: imagebase64, // Utiliza la variable imagebase64 que almacena la imagen en formato base64
            latitud: $("#lat").val(), // Obtiene el valor del campo de latitud del nuevo elemento
            longitud: $("#long").val() // Obtiene el valor del campo de longitud del nuevo elemento
        })
    })
        .done(function (respuesta) {
            // Función que maneja la respuesta del servidor en caso de éxito
            alert("Item creado con éxito"); // Muestra una alerta con un mensaje de éxito
            $('#itemForm')[0].reset(); // Reinicia el formulario para borrar los datos ingresados
            rellenarUl(); // Vuelve a llenar la lista de elementos en la interfaz
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Función que maneja los errores de la solicitud AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        });
});


/**
 * Función que se ejecuta cuando se pierde el foco en el campo de título del elemento.
 * Realiza una solicitud AJAX para obtener las coordenadas (latitud y longitud) de una dirección utilizando el servicio de geocodificación de OpenStreetMap Nominatim.
 */
$("#tituloItem").on("blur", function () {
    // Obtiene la dirección del campo de título del elemento
    var direccion = $("#tituloItem").val();

    // URL para realizar la solicitud de geocodificación a Nominatim de OpenStreetMap
    var nominatimURL = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(direccion);

    // Realiza una solicitud AJAX para obtener las coordenadas de la dirección proporcionada
    $.ajax({
        url: nominatimURL, // URL de la solicitud de geocodificación
        type: 'GET', // Método HTTP GET
        dataType: 'json', // Tipo de datos esperados en la respuesta (JSON)
        success: function (data) {
            // Función que maneja la respuesta exitosa de la solicitud AJAX
            if (data.length > 0) {
                // Si se encuentran resultados, obtiene las coordenadas (latitud y longitud) del primer resultado
                var latitud = data[0].lat;
                var longitud = data[0].lon;

                // Asigna las coordenadas obtenidas a los campos de latitud y longitud en el formulario
                $("#lat").val(latitud);
                $("#long").val(longitud);
            } else {
                // Si no se encuentran resultados, muestra una alerta indicando que no se encontraron coordenadas
                alert("No se encontraron coordenadas para la dirección proporcionada.");
            }
        },
        error: function () {
            // Función que maneja los errores de la solicitud AJAX
            alert("Error al obtener las coordenadas. Por favor, inténtalo de nuevo.");
        }
    });
});

/**
 * Función que se ejecuta cuando se pierde el foco en el campo de inicio de la ruta.
 * Realiza una solicitud AJAX para obtener las coordenadas (latitud y longitud) de una dirección utilizando el servicio de geocodificación de OpenStreetMap Nominatim.
 */
$("#ini-ruta").on("blur", function () {
    // Obtiene la dirección del campo de inicio de la ruta
    var direccion = $("#ini-ruta").val();

    // URL para realizar la solicitud de geocodificación a Nominatim de OpenStreetMap
    var nominatimURL = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(direccion);

    // Realiza una solicitud AJAX para obtener las coordenadas de la dirección proporcionada
    $.ajax({
        url: nominatimURL, // URL de la solicitud de geocodificación
        type: 'GET', // Método HTTP GET
        dataType: 'json', // Tipo de datos esperados en la respuesta (JSON)
        success: function (data) {
            // Función que maneja la respuesta exitosa de la solicitud AJAX
            if (data.length > 0) {
                // Si se encuentran resultados, obtiene las coordenadas (latitud y longitud) del primer resultado
                var latitud = data[0].lat;
                var longitud = data[0].lon;

                // Asigna las coordenadas obtenidas a los campos de latitud y longitud en el formulario
                $("#latitudIni").val(latitud);
                $("#longitudIni").val(longitud);

                // Agrega un marcador en el mapa de inicio con las coordenadas obtenidas
                L.marker([latitud, longitud]).addTo(maps['map-inicio']).openPopup();
            } else {
                // Si no se encuentran resultados, muestra una alerta indicando que no se encontraron coordenadas
                alert("No se encontraron coordenadas para la dirección proporcionada.");
            }
        },
        error: function () {
            // Función que maneja los errores de la solicitud AJAX
            alert("Error al obtener las coordenadas. Por favor, inténtalo de nuevo.");
        }
    });
});


/**
 * Función que activa la funcionalidad de arrastrar y soltar elementos entre dos listas ordenables.
 * Los elementos de las listas con los IDs "sortable1" y "sortable2" pueden ser arrastrados y soltados entre sí.
 * Se ejecuta una función cuando un elemento es recibido en una de las listas.
 */
$("#sortable1, #sortable2").sortable({
    connectWith: ".connectedSortable", // Permite conectar las listas con la clase CSS "connectedSortable"
    receive: function (event, ui) {
        // Función que se ejecuta cuando un elemento es recibido en una de las listas
        var titulo = ui.item.text(); // Obtiene el texto del elemento recibido
        var latitud = ui.item.attr("lat"); // Obtiene la latitud del elemento recibido
        var longitud = ui.item.attr("long"); // Obtiene la longitud del elemento recibido
        var sourceListId = ui.sender.attr("id"); // Obtiene el ID de la lista de origen del elemento recibido
        var targetListId = $(this).attr("id"); // Obtiene el ID de la lista de destino del elemento recibido
        var nuevoMarcador; // Variable para almacenar el nuevo marcador en el mapa

        if (targetListId == 'sortable2') {
            // Si el elemento se recibió en la lista "sortable2"
            // Crea un nuevo marcador en el mapa de items con la latitud y longitud del elemento recibido
            nuevoMarcador = L.marker([latitud, longitud]).addTo(maps['map-items'])
                .bindPopup(titulo) // Asigna el título como contenido emergente del marcador
                .openPopup(); // Abre el contenido emergente del marcador

            // Almacena una referencia al nuevo marcador utilizando su título como clave en el objeto marcadoresPorTitulo
            marcadoresPorTitulo[titulo] = nuevoMarcador;

            $('#ruta-2-sig').removeAttr('disabled')
        } else {
            // Si el elemento se recibió en la lista "sortable1" o se movió de "sortable2" a "sortable1"
            // Verifica si existe un marcador asociado al título del elemento
            if (marcadoresPorTitulo[titulo]) {
                // Si existe, elimina el marcador del mapa de items
                maps['map-items'].removeLayer(marcadoresPorTitulo[titulo]);
                // También puedes eliminar la referencia del objeto si es necesario
                delete marcadoresPorTitulo[titulo];
            }

            if ($('#sortable2').find('li').length === 0) {
                $('#ruta-2-sig').attr('disabled', 'true')
            }
        }

        // Puedes realizar más acciones aquí según tus necesidades
    }
}).disableSelection(); // Deshabilita la selección de texto en las listas

/**
 * Codifica el contenido de un archivo de imagen de la ruta como una URL en formato base64 y lo asigna a la variable fotoRuta.
 * @param {HTMLInputElement} element - El elemento de entrada de archivo que contiene la imagen de la ruta a codificar.
 */
function encodeRutaFoto(element) {
    // Obtiene el archivo de imagen seleccionado por el usuario
    var file = element.files[0];

    // Crea un nuevo objeto FileReader para leer el contenido del archivo
    var reader = new FileReader();

    // Configura el evento onloadend para manejar el final de la lectura del archivo
    reader.onloadend = function () {
        // Asigna el resultado de la lectura (imagen codificada en base64) a la variable fotoRuta
        fotoRuta = reader.result;
    }

    // Lee el contenido del archivo como una URL en formato base64
    reader.readAsDataURL(file);
}

/**
 * Agrega una hora de programación al objeto de programación.
 * Obtiene los datos de fecha, hora y guía del formulario y los añade al objeto de programación.
 * Luego, actualiza la visualización de la programación en el elemento con ID "saco".
 */
function addHour() {
    // Obtiene los datos de fecha inicial, fecha final, hora y guía del formulario
    var datos = {
        dia: [], // Array para almacenar los días seleccionados
        inicio: $('#fechaIniPrg').val(), // Fecha inicial
        fin: $('#fechaFinPrg').val(), // Fecha final
        hora: $('#horaDia').val(), // Hora
        guia: $("#sel-guia option:selected").val() // Guía seleccionado
    };

    // Obtiene los días seleccionados del formulario y los agrega al array de días en datos
    $(".dias input[type='checkbox']:checked").each(function () {
        datos.dia.push($(this).val());
    });

    // Añade los datos al objeto de programación
    programacion.fragmento.push(datos);

    // Limpia el contenido del elemento con ID "saco"
    $('#saco').empty();

    // Itera sobre los fragmentos de programación y los muestra en el elemento "saco"
    programacion.fragmento.forEach(element => {
        $('#saco').append('<div>' + element.dia + ' / ' + element.inicio + ' : ' + element.fin + ' / ' + element.guia + ' / ' + element.hora + '</div>');
    });

    // Muestra el objeto de programación en la consola para fines de depuración
    console.log(programacion);
}

/**
 * Función que se ejecuta cuando se hace clic en el elemento con el ID "crearRuta".
 * Realiza una solicitud AJAX para crear una nueva ruta a través de la API.
 * Los datos de la ruta son obtenidos de los campos del formulario y variables globales.
 * @param {Event} ev - El evento de clic que desencadena la función.
 */
$("#crearRuta").click(function (ev) {
    // Previene el comportamiento predeterminado del evento de clic
    ev.preventDefault();

    // Inicializa un array para almacenar los IDs de los elementos de la ruta
    var items = [];

    // Itera sobre los elementos de la lista "sortable2" y añade sus IDs al array "items"
    $("#sortable2 li").each(function () {
        items.push($(this).attr("id"));
    });

    // Realiza una solicitud AJAX para enviar los datos de la nueva ruta a la API
    $.ajax({
        url: 'https://localhost:8000/ruta/api/crear', // URL de la API para crear una nueva ruta
        type: 'POST', // Método HTTP POST
        contentType: 'application/json', // Tipo de contenido de la solicitud (JSON)
        data: JSON.stringify({ // Convierte los datos a un formato JSON y los envía en la solicitud
            titulo: $("#tituloRuta").val(), // Obtiene el valor del campo de título de la ruta
            desc: $("#desc").val(), // Obtiene el valor del campo de descripción de la ruta
            aforo: $("#aforo").val(), // Obtiene el valor del campo de aforo de la ruta
            foto: fotoRuta, // Utiliza la variable fotoRuta que almacena la imagen en formato base64
            fec_ini: $("#fec_ini").val(), // Obtiene el valor del campo de fecha inicial de la ruta
            fec_fin: $("#fec_fin").val(), // Obtiene el valor del campo de fecha final de la ruta
            latitud: $("#latitudIni").val(), // Obtiene el valor del campo de latitud inicial de la ruta
            longitud: $("#longitudIni").val(), // Obtiene el valor del campo de longitud inicial de la ruta
            items: items, // Utiliza el array "items" que contiene los IDs de los elementos de la ruta
            programacion: programacion, // Utiliza el objeto de programación global
            localidad: $("#sel-loc option:selected").val() // Obtiene el valor del campo de localidad de la ruta
        })
    })
        .done(function (respuesta) {
            // Función que maneja la respuesta del servidor en caso de éxito
            alert("Ruta creada con éxito"); // Muestra una alerta con un mensaje de éxito
            window.location.href = "/rutas";
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Función que maneja los errores de la solicitud AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
            alert("Error al crear la ruta. Por favor, inténtalo de nuevo."); // Muestra una alerta con un mensaje de error
        });
});

/**
 * Función que se ejecuta cuando se hace clic en cualquier elemento con la clase "cancel".
 * Captura el valor del atributo 'data-id' del botón clicado y actualiza el contenido del modal con dicho valor.
 */
$('.cancel').on('click', function () {
    // Captura el valor del atributo 'data-id' del botón clicado y lo asigna a la variable 'id'
    var id = $(this).data('id');

    // Actualiza el valor del atributo 'data-id' del botón con ID "deleteBTN" con el valor capturado
    $('#deleteBTN').data('id', id);
});




/**
 * Verifica si la ruta de la ventana actual es "/searchPanel".
 * Si es así, actualiza los valores de los campos y textos correspondientes en la página.
 */
if (window.location.pathname == '/searchPanel') {
    // Establece el valor del campo de búsqueda de ubicación con el valor proporcionado en los parámetros de búsqueda de la URL
    $('#locationSearcher').val(url.searchParams.get('ciudad'));

    // Establece el valor del campo de búsqueda de fecha con el valor proporcionado en los parámetros de búsqueda de la URL
    $('#dateSearcher').val(url.searchParams.get('fecha'));

    // Actualiza el texto del título de la página con la ciudad proporcionada en los parámetros de búsqueda de la URL
    $('#titPage').text('Tours gratis en ' + url.searchParams.get('ciudad'));

    // Actualiza el texto del enlace del título con la ciudad proporcionada en los parámetros de búsqueda de la URL
    $('#link-tit').text('Tours en ' + url.searchParams.get('ciudad'));
}

/**
 * Realiza una solicitud AJAX para obtener los tours disponibles y mostrarlos en la página.
 * Actualiza la página con la información de los tours según los filtros de búsqueda aplicados.
 */
function mostrarTours() {
    // Muestra el overlay para indicar que se está cargando la información
    $('#overlay').show();

    // Realiza una solicitud AJAX para obtener los tours disponibles desde la API
    $.ajax({
        url: 'https://localhost:8000/tours/api', // URL de la API para obtener los tours
        type: 'GET', // Método HTTP GET
        dataType: 'json', // Tipo de datos esperados en la respuesta (JSON)
        success: function (data) {
            // Verifica si la ruta actual es "/rutas"
            if (window.location.href == '/rutas') {
                url = "https://localhost:8000/plantillaTour";
            }

            // Realiza una solicitud AJAX para obtener la plantilla de tour desde la API
            $.ajax({
                url: 'https://localhost:8000/plantillaTour', // URL de la API para obtener la plantilla de tour
                type: 'GET', // Método HTTP GET
                dataType: 'html', // Tipo de datos esperados en la respuesta (HTML)
                success: function (template) {
                    // Remueve los elementos clonados y las páginas internas existentes
                    $.each($('.clonedTemplate'), function () {
                        $(this).remove();
                    });
                    $.each($('.page-inner'), function () {
                        $(this).remove();
                    });

                    // Oculta el mensaje de "No hay tours disponibles" si estaba visible
                    $('#empty').hide();

                    // Filtra los datos de tours según los criterios de búsqueda aplicados por el usuario
                    data = $.grep(data, function (evento) {
                        var eventoDate = evento.fecha && moment(evento.fecha.date).format('YYYY-MM-DD');
                        var eventoLocation = evento.loc;
                        var eventoValoracion = evento.valoracion;

                        var fechaBusqueda = $('#dateSearcher').val();
                        var ubicacionBusqueda = $('#locationSearcher').val();
                        var valoracionSeleccionada = $('input[name="estrellas"]:checked').val();

                        var filtroFecha = !fechaBusqueda || (eventoDate === fechaBusqueda);
                        var filtroUbicacion = !ubicacionBusqueda || (eventoLocation === ubicacionBusqueda);
                        var filtroValoracion = !valoracionSeleccionada || (eventoValoracion >= valoracionSeleccionada);

                        return filtroFecha && filtroUbicacion && filtroValoracion;
                    });

                    // Actualiza el contador de resultados con la cantidad de tours disponibles
                    $('#tourCount').text('Disponible ' + data.length + ' resultados');

                    // Itera sobre los datos de tours y muestra la información en la página
                    $.each(data, function (index, elemento) {
                        // Clona la plantilla de tour
                        const clonedTemplate = $(template).clone();

                        // Calcula el sufijo de la página en función del índice actual
                        const suffix = Math.floor(index / 10) + 1;

                        // Agrega clases y atributos a la plantilla clonada
                        clonedTemplate.addClass('clonedTemplate-' + suffix).addClass('clonedTemplate').attr('data-loc', elemento.loc).attr('data-fec', moment(elemento.fecha.date).format('DD/MM/YY'));

                        // Actualiza el contenido de los elementos en la plantilla clonada con los datos del tour
                        clonedTemplate.find('#titulo').text(elemento.titulo);
                        clonedTemplate.find('#fecha').text(moment(elemento.fecha.date).format('DD/MM/YYYY'));
                        clonedTemplate.find('#hora').text(elemento.hora);
                        clonedTemplate.find('#apuntados').text(elemento.apuntados);
                        clonedTemplate.find('#foto').attr('src', elemento.foto);

                        if (window.location.pathname === '/rutas') {
                            clonedTemplate.find('#cancel').attr('data-tourid', elemento.id).attr('onclick', 'saveId(this)')
                            clonedTemplate.find('.main-btn').remove()
                        }

                        // Verifica si la ruta actual es "/searchPanel"
                        if (window.location.pathname === '/searchPanel') {
                            // Remueve el botón de cancelar y actualiza el botón de más información
                            clonedTemplate.find('#cancel').remove();
                            clonedTemplate.find('.main-btn').text('Info y reservas').addClass('ml-auto moreInfo').attr('data-id', elemento.id).attr('onclick', 'redirectToTour(this)');
                            clonedTemplate.find('#descripcion').text(elemento.desc);
                        }

                        // Oculta la plantilla clonada si no pertenece a la página actual
                        if (suffix > 1) {
                            clonedTemplate.hide();
                        }

                        // Verifica si es necesario agregar una nueva página interna
                        if (index % 10 === 0) {
                            const newPage = $('<li class="page-item page-inner" onclick=changePage(' + suffix + ')><a class="page-link" href="#">' + suffix + '</a></li>');
                            newPage.insertBefore($('#next'));
                        }

                        // Agrega la plantilla clonada al contenedor '#zona-tours'
                        clonedTemplate.insertBefore($('#pagination'));
                    });

                    // Verifica si no hay tours disponibles y muestra el mensaje correspondiente
                    if (data == '') {
                        $("#empty").show();
                        $('#listaPage').hide();
                    } else {
                        $('#listaPage').show();
                    }

                    // Oculta el overlay después de completar la carga de la información
                    $('#overlay').hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Maneja los errores de la llamada AJAX
                    console.error('Error en la solicitud: ', textStatus, errorThrown);
                }
            });

            // // Verifica si la ruta actual es "/rutas"
            // if (window.location.pathname == '/rutas') {
            //     var lastId;
            //     var color = []; // Arreglo para almacenar los colores por ID

            //     data = $.grep(data, function (evento) {
            //         var eventoGuia = evento.guia;

            //         var guia = $('#sel-guia-cal').val();

            //         var filtroGuia = !guia || (eventoGuia === guia);

            //         return filtroGuia;
            //     });

            //     console.log(data)

            //     // Itera sobre los datos y crea eventos para cada fecha
            //     data.forEach(function (elemento) {
            //         var partes = elemento.hora.split(":");
            //         var fecha = new Date(elemento.fecha.date);
            //         fecha.setHours(parseInt(partes[0], 10));

            //         // console.log(lastId)
            //         // console.log(elemento.guia)
            //         // Verificar si el id ya tiene un color asignado
            //         if (lastId != elemento.guia && !(color[elemento.guia])) {
            //             color[elemento.guia] = '#' + Math.floor(Math.random() * 16777215).toString(16);
            //         }

            //         eventos.push({
            //             title: elemento.titulo + ' Guia: ' + elemento.guia,
            //             start: fecha,
            //             color: color[elemento.guia],        // Fondo del evento
            //             borderColor: color[elemento.guia],  // Borde del evento
            //             textColor: 'white',
            //             id: elemento.id
            //             // Puedes agregar más propiedades según tus necesidades
            //         });
            //         lastId = elemento.guia;
            //     });

            // }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la llamada AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

/**
 * Verifica si la ruta actual es "/rutas" o "/searchPanel".
 * Si es así, llama a la función mostrarTours() para cargar y mostrar los tours disponibles en la página.
 */
if (window.location.pathname == '/rutas' || window.location.pathname == '/searchPanel') {
    mostrarTours();
}

/**
 * Cambia la página de tours mostrando los elementos correspondientes a la página indicada.
 * @param {number} index - El índice de la página a mostrar.
 */
function changePage(index) {
    // Oculta todos los elementos clonados
    $(".clonedTemplate").each(function () {
        $(this).hide();
    });
    // Muestra los elementos correspondientes a la página indicada
    $(".clonedTemplate-" + index).each(function () {
        $(this).show();
    });
}

function generarColorAleatorio() {
    // Generar componentes de color aleatorios en un rango que produzca colores intensos
    var r = Math.floor(Math.random() * 156) + 150; // Rojo
    var g = Math.floor(Math.random() * 156) + 150; // Verde
    var b = Math.floor(Math.random() * 156) + 150; // Azul

    // Devolver el color en formato hexadecimal
    return '#' + rgbToHex(r) + rgbToHex(g) + rgbToHex(b);
}

// Función para convertir un valor RGB a hexadecimal
function rgbToHex(rgb) {
    var hex = rgb.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

/**
 * Inicializa el calendario con los eventos proporcionados y configura sus opciones.
 */
function inicializarCalendario() {
    $.ajax({
        url: 'https://localhost:8000/tours/api', // URL de la API para obtener los tours
        type: 'GET', // Método HTTP GET
        dataType: 'json', // Tipo de datos esperados en la respuesta (JSON)
        success: function (data) {
            var lastId;
            var color = []; // Arreglo para almacenar los colores por ID

            data = $.grep(data, function (evento) {
                var eventoGuia = evento.guia;

                if (window.location.pathname == '/perfil') {
                    var guia = $('#wlc-user').text().split(':')[1].trim()
                } else {
                    var guia = $('#sel-guia-cal').val();
                }

                var filtroGuia = !guia || (eventoGuia === guia);

                return filtroGuia;
            });

            eventos.length = 0;
            // Itera sobre los datos y crea eventos para cada fecha
            data.forEach(function (elemento) {
                var partes = elemento.hora.split(":");
                var fecha = new Date(elemento.fecha.date);
                fecha.setHours(parseInt(partes[0], 10));

                // Verificar si el id ya tiene un color asignado
                if (lastId != elemento.guia && !(color[elemento.guia])) {
                    //5 valores para 125 colores
                    //0,50,100,150,200
                    // console.log('#' + (Math.floor(Math.random() * 6) * 50) + (Math.floor(Math.random() * 6) * 50) + (Math.floor(Math.random() * 6) * 50));
                    color[elemento.guia] = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    console.log(color[elemento.guia])
                }

                eventos.push({
                    title: elemento.titulo + ' Guia: ' + elemento.guia,
                    start: fecha,
                    color: color[elemento.guia],        // Fondo del evento
                    borderColor: color[elemento.guia],  // Borde del evento
                    textColor: 'white',
                    id: elemento.id
                });
                lastId = elemento.guia;
            });

            // Obtiene el elemento del calendario por su ID
            var calendarEl = document.getElementById('calendar');
            $('#calendar').show()

            // Crea una instancia del calendario con las opciones especificadas
            var calendar = new FullCalendar.Calendar(calendarEl, {
                // Configura la barra de herramientas del encabezado
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                },
                // Establece la vista inicial del calendario como 'dayGridMonth'
                initialView: 'dayGridMonth',
                // Establece el idioma del calendario como español
                locale: 'es',
                // Configura los eventos del calendario con los eventos proporcionados
                events: eventos,
                // Permite la edición de eventos en el calendario
                editable: true,
                // Permite soltar elementos en el calendario
                droppable: true,
                // Función que se ejecuta al hacer clic en un evento del calendario
                eventClick: function (info) {
                    localStorage.removeItem('tourId')
                    localStorage.setItem('tourId', info.event.id)
                    $('#calendarModal').modal('hide');
                    $('#cambiarGuia').modal('show');
                }
            });

            // Renderiza el calendario en el elemento seleccionado
            calendar.render();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la llamada AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    })
    // // Espera 1 segundo antes de inicializar el calendario para asegurar que el elemento esté presente en el DOM
    // setTimeout(function () {

    // }, 2000);
}

$('#sel-guia-cal').on('change', function () {
    // mostrarTours()
    inicializarCalendario()
})

/**
 * Maneja el evento "blur" del campo de búsqueda de ubicación.
 * Actualiza la visibilidad de los tours después de que el campo de búsqueda de ubicación pierda el foco.
 */
$("#locationSearcher").on("blur", function (ev) {
    // actualizarVisibilidadTours();
    mostrarTours();
});

/**
 * Maneja el evento "change" del campo de búsqueda de fecha.
 * Actualiza la visibilidad de los tours después de que el campo de búsqueda de fecha cambie.
 */
$("#dateSearcher").on("change", function (ev) {
    // actualizarVisibilidadTours();
    mostrarTours();
});

/**
 * Actualiza la visibilidad de los tours según la ubicación y fecha seleccionadas.
 */
function actualizarVisibilidadTours() {
    // Obtiene la ubicación seleccionada del campo de búsqueda de ubicación
    var selectedLocation = $("#locationSearcher").val();
    // Obtiene la fecha seleccionada del campo de búsqueda de fecha y la convierte a un objeto Moment
    var selectedDate = moment($("#dateSearcher").val());

    // Itera sobre todos los elementos con la clase ".tours"
    $(".tours").each(function () {
        // Obtiene la ubicación del tour y la fecha del atributo "data-loc" y "data-fec" respectivamente
        var tourLocation = $(this).data('loc');
        var tourFec = $(this).data('fec');
        // Convierte la fecha del tour a un objeto Moment con formato 'DD-MM-YYYY'
        var tourFecMoment = moment(tourFec, 'DD-MM-YYYY');

        // Determina si el tour debe mostrarse o no en función de la ubicación y fecha seleccionadas
        var mostrar = (tourLocation === selectedLocation || selectedLocation === '') &&
            (selectedDate.isSame(tourFecMoment, 'day') || !selectedDate.isValid());

        // Muestra u oculta el tour según la condición anterior
        if (mostrar) {
            // Muestra el tour si corresponde
            $(this).show();
            // Oculta el mensaje de "Sin resultados" y muestra la lista de tours
            $("#empty").hide();
            $('#listaPage').show();
        } else {
            // Oculta el tour si no corresponde
            $(this).hide();
            // Verifica si no hay tours visibles y realiza las acciones necesarias
            if ($(".tours:visible").length == 0) {
                // Aquí se podría agregar lógica adicional si no hay tours visibles
            }
        }
    });

    // Obtiene la cantidad de tours visibles y actualiza el contador de tours
    var cantidadVisible = $(".tours:visible").length;
    $('#tourCount').text('Disponible ' + cantidadVisible + ' resultados');
}


/**
 * Maneja el evento "click" del botón de limpiar.
 * Restablece los campos del formulario al valor predeterminado y muestra los tours actualizados.
 * @param {Event} ev - El evento de clic.
 */
$("#clean").on("click", function (ev) {
    ev.preventDefault();
    $(this).closest('form')[0].reset();
    mostrarTours();
});

$("#cleanRuta").on("click", function (ev) {
    ev.preventDefault();
    $(this).closest('form')[0].reset();
});


/**
 * Maneja el evento "click" del botón de búsqueda.
 * Redirige a la página de búsqueda con los parámetros de ciudad y fecha proporcionados.
 * @param {Event} ev - El evento de clic.
 */
$('#searchBtn-Lnd').on("click", function (ev) {
    ev.preventDefault();
    if ($('#ciudad').val()) {
        window.location.href = "/searchPanel?ciudad=" + $('#ciudad').val() + '&fecha=' + $('#fecha').val();
    } else {
        alert('Por favor, ingresa el nombre de la ciudad.');
    }
});

/**
 * Redirige a la página de detalles del tour correspondiente al botón clicado.
 * @param {HTMLElement} button - El botón que activó la función.
 */
function redirectToTour(button) {
    // Obtiene el ID del tour asociado al botón
    var dataId = $(button).data('id');
    // Redirige a la página de detalles del tour con el ID proporcionado
    window.location.href = "/searchPanel/tour?id=" + dataId;
}

/**
 * Verifica si la ruta actual es la página de detalles de un tour.
 * Si es así, inicializa los mapas, actualiza el título de la página y maneja el evento de clic en el botón de nueva reserva.
 */
if (window.location.pathname == '/searchPanel/tour') {
    // Inicializa los mapas
    initializeMaps();

    // Actualiza el título de la página (no se especifica el comportamiento en el código proporcionado)
    $('#titPage').text(/* Se debe especificar el nuevo título aquí */);

    // Maneja el evento de clic en el botón de nueva reserva
    $('#newReserva').on('click', function () {
        // Realiza una solicitud AJAX para crear una nueva reserva
        $.ajax({
            url: 'https://localhost:8000/reserva/api/crear',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                tour: url.searchParams.get('id'),
                user: $(this).attr('data-id'),
                apuntados: $('#apuntados').val()
            })
        })
            .done(function (respuesta) {
                // Maneja la respuesta del servidor en caso de éxito
                alert("Reserva creada con éxito");
                $('#ticket')[0].reset(); // Restablece el formulario de reserva
                window.location.href = "/"; // Redirige a la página de inicio
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                // Maneja errores de la solicitud
                console.error('Error en la solicitud: ', textStatus, errorThrown);
            });
    });
}

/**
 * Rellena el área de reservas con los datos recuperados del servidor y actualiza su visibilidad según el estado y el tipo de usuario.
 */
function rellenarReservas() {
    // Muestra el overlay mientras se carga la información de las reservas
    $('#overlay').show();

    // Determina la URL según el rol del usuario
    var url = '';
    if ($('#wlc-user').attr('data-roles').includes('ROLE_GUIA')) {
        url = 'https://localhost:8000/tour/api/' + $('#wlc-user').attr('data-id');
    } else {
        url = 'https://localhost:8000/reservas/api/' + $('#wlc-user').attr('data-id');
    }

    // Realiza una solicitud AJAX para obtener los datos de las reservas
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Elimina las plantillas clonadas y las páginas internas existentes
            $.each($('.clonedTemplate'), function () {
                $(this).remove();
            });
            $.each($('.page-inner'), function () {
                $(this).remove();
            });
            $('#empty').hide();

            // Realiza una solicitud AJAX para obtener la plantilla HTML de las reservas
            $.ajax({
                url: 'https://localhost:8000/plantillaReservas',
                type: 'GET',
                dataType: 'html',
                success: function (template) {
                    // Filtra los datos según la fecha y el rol del usuario
                    data = $.grep(data, function (evento) {
                        var eventoDate = evento.fecha && moment(evento.fecha.date).format('YYYY-MM-DD');
                        var fechaSistema = moment().format('YYYY-MM-DD');

                        if ($('#prox').is('[active]')) {
                            return eventoDate && eventoDate >= fechaSistema;
                        } else {
                            return eventoDate && eventoDate < fechaSistema;
                        }
                    });

                    // Ordena los datos por fecha
                    data.sort(function (a, b) {
                        var dateA = moment(a.fecha.date).toDate();
                        var dateB = moment(b.fecha.date).toDate();
                        return dateA - dateB;
                    });

                    // Itera sobre los datos y crea las plantillas clonadas
                    $.each(data, function (index, elemento) {
                        const clonedTemplate = $(template).clone();
                        const suffix = Math.floor(index / 10) + 1;
                        clonedTemplate.addClass('clonedTemplate-' + suffix).addClass('clonedTemplate');

                        // Actualiza el contenido de los elementos en la plantilla clonada
                        clonedTemplate.find('#titulo').append(elemento.titulo);
                        clonedTemplate.find('#fecha').append(moment(elemento.fecha.date).format('DD/MM/YYYY'));
                        clonedTemplate.find('#hora').append(elemento.hora);
                        clonedTemplate.find('#apuntados').append(elemento.apuntados);
                        clonedTemplate.find('#foto').attr('src', elemento.foto);

                        // Actualiza el comportamiento de los botones según el rol del usuario
                        if ($('#wlc-user').attr('data-roles').includes('ROLE_GUIA')) {
                            // Oculta el botón de cancelación y configura el botón de editar
                            clonedTemplate.find('#cancel').hide();
                            clonedTemplate.find('#edit').text('Pasar lista').attr('href', '#lista').attr('data-res', elemento.reservas).attr('onclick', 'saveId(this)');
                        } else {
                            // Configura el botón de cancelación y el botón de editar
                            clonedTemplate.find('#cancel').attr('data-id', elemento.id);
                            clonedTemplate.find('#edit').attr('data-id', elemento.id);
                        }

                        // Actualiza la visibilidad de la plantilla clonada según el tipo de usuario y el filtro de fecha
                        if ($('#before').is('[active]')) {
                            if ($('#wlc-user').attr('data-roles').includes('ROLE_GUIA')) {
                                clonedTemplate.find('#cancel').hide();
                                clonedTemplate.find('#edit').text('Informe').attr('href', '#informe').attr('data-id', elemento.id);
                            } else {
                                clonedTemplate.find('#cancel').hide();
                                clonedTemplate.find('#edit').text('Valorar').attr('data-bs-target', '#valorarReserva').removeAttr('href').attr('data-id', elemento.id).attr('data-ruta', elemento.ruta).attr('onclick', 'saveId(this)');
                            }
                        }

                        // Oculta las plantillas clonadas adicionales
                        if (suffix > 1) {
                            clonedTemplate.hide();
                        }

                        // Agrega la plantilla clonada al contenedor '#pagination'
                        clonedTemplate.insertBefore($('#pagination'));
                    });

                    // Muestra u oculta el mensaje de lista vacía según la cantidad de datos
                    if (data == '') {
                        $("#empty").show();
                        $('#listaPage').hide();
                    } else {
                        $('#listaPage').show();
                    }

                    // Oculta el overlay después de cargar los datos
                    $('#overlay').hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Maneja los errores de la llamada AJAX
                    console.error('Error en la solicitud: ', textStatus, errorThrown);
                    $('#overlay').hide();
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la llamada AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

/**
 * Si la página actual es la página de perfil, llama a la función 'rellenarReservas()' para cargar y mostrar las reservas del usuario en la interfaz.
 */
if (window.location.pathname == '/perfil') {
    rellenarReservas();
}

/**
 * Realiza una solicitud AJAX para agregar una nueva valoración.
 * La función realiza una solicitud POST a la API de valoraciones con los datos necesarios.
 * Una vez completada la solicitud, muestra un mensaje de éxito y recarga la página.
 */
function addVal() {
    $.ajax({
        url: 'https://localhost:8000/valoracion/api/crear',
        type: 'POST',
        contentType: 'application/json', // Especifica el tipo de contenido como JSON
        data: JSON.stringify({
            ruta: localStorage.getItem('rutaId'),
            reserva: localStorage.getItem('reservaId'),
            puntuacion: $('input[name="estrellas"]:checked').val()
        }),
        success: function (respuesta) {
            alert("Valoración creada con éxito");
            location.reload(true);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la solicitud AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

/**
 * Codifica la imagen seleccionada como base64.
 * Esta función se utiliza para leer el archivo de imagen seleccionado por el usuario y codificarlo como una URL base64.
 * Una vez que se ha codificado la imagen, se almacena en la variable global fotoGrupo.
 * 
 * @param {HTMLElement} element - El elemento de entrada de archivo que contiene la imagen seleccionada.
 */
function encodefotoGrupo(element) {
    var file = element.files[0]; // Obtiene el archivo seleccionado
    var reader = new FileReader(); // Crea un lector de archivos

    // Callback que se ejecuta cuando se completa la lectura del archivo
    reader.onloadend = function () {
        fotoGrupo = reader.result; // Almacena la imagen codificada como base64 en la variable fotoGrupo
    }

    // Lee el contenido del archivo como una URL de datos (data URL)
    reader.readAsDataURL(file);
}

/**
 * Agrega un nuevo informe mediante una solicitud AJAX.
 * Esta función realiza una solicitud POST para agregar un nuevo informe utilizando los datos proporcionados.
 * 
 * @global {string} fotoGrupo - Variable global que contiene la imagen codificada como base64.
 */
function addInf() {
    $.ajax({
        url: 'https://localhost:8000/informe/api/crear',
        type: 'POST',
        contentType: 'application/json', // Especifica el tipo de contenido como JSON
        data: JSON.stringify({
            tour: localStorage.getItem('tourId'), // Obtiene el ID del tour almacenado en el almacenamiento local
            foto: fotoGrupo, // Utiliza la imagen codificada como base64 almacenada en fotoGrupo
            observaciones: $('#observaciones').val(), // Obtiene las observaciones del campo de texto
            ingresos: $('#importeRecibido').val() // Obtiene el importe recibido del campo de texto
        }),
        success: function (respuesta) {
            alert("Informe creado con éxito"); // Muestra una alerta de éxito
            window.location.href = '/perfil'
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error en la solicitud: ', textStatus, errorThrown); // Registra cualquier error en la consola
        }
    });
}

/**
 * Cambia el estado activo de un botón de navegación.
 * Esta función elimina la clase 'active' de todos los elementos con la clase 'nav-link' y la agrega al botón clicado.
 * 
 * @param {HTMLElement} btn - El botón de navegación que se ha clicado.
 */
function changeActive(btn) {
    // Eliminar la clase 'active' de todos los elementos con la clase 'nav-link'
    $('.nav-link').removeClass('active').removeAttr('active');

    // Agregar la clase 'active' al elemento clicado
    $(btn).addClass('active').attr('active', 'true');

    if ($(btn).attr('id') == 'cal') {
        $.each($('.clonedTemplate'), function () {
            $(this).remove();
        });
        $.each($('.page-inner'), function () {
            $(this).remove();
        });
        $('#listaPage').hide()
        $('#empty').hide();
        inicializarCalendario();
    } else {
        $('#listaPage').show()
        $('#calendar').hide()
        // Llamar a la función para rellenar las reservas según el estado activo del botón de navegación
        rellenarReservas();
    }
}

/**
 * Guarda los identificadores de la ruta y la reserva en el almacenamiento local y rellena el modal de reservas si es necesario.
 * 
 * @param {HTMLElement} btn - El botón que contiene los datos de la reserva.
 */
function saveId(btn) {
    // Eliminar cualquier identificador previo almacenado en el almacenamiento local
    localStorage.removeItem('rutaId');
    localStorage.removeItem('reservaId');
    localStorage.removeItem('reservas');

    // Almacenar el identificador de la reserva en el almacenamiento local
    localStorage.setItem('reservaId', $(btn).data('id'));

    // Almacenar la lista de reservas asociadas al evento en el almacenamiento local
    localStorage.setItem('reservas', $(btn).data('res'));

    if (window.location.pathname === '/rutas') {
        // Almacenar la lista de reservas asociadas al evento en el almacenamiento local
        localStorage.setItem('tourId', $(btn).data('tourid'));
    } else if (window.location.pathname === '/perfil') {
        localStorage.setItem('tourId', $(btn).data('id'));
    }

    // Si la página actual es el perfil del usuario, almacenar también el identificador de la ruta
    if (window.location.pathname === '/perfil') {
        localStorage.setItem('rutaId', $(btn).data('ruta'));
    }

    // Si hay reservas asociadas al evento, rellenar el modal de reservas
    if (localStorage.getItem('reservas') !== '') {
        rellenarModal();
    }
}

/**
 * Elimina la reserva correspondiente al identificador almacenado en el almacenamiento local.
 */
function deleteReserva() {
    $.ajax({
        url: 'https://localhost:8000/reserva/api/eliminar/' + localStorage.getItem('reservaId'),
        type: 'DELETE',
        contentType: 'application/json', // Ajusta el tipo de contenido según tus necesidades
        success: function (data) {
            // Muestra un mensaje de éxito y elimina el identificador de reserva del almacenamiento local
            alert("Reserva eliminada con éxito");
            localStorage.removeItem('reservaId');
            window.location.href = '/perfil'
        },
        error: function (error) {
            // Muestra un mensaje de error si ocurre algún problema al eliminar la reserva
            alert("Ha ocurrido un error al intentar eliminar la reserva");
        }
    });
}

function updateReserva() {
    $.ajax({
        url: 'https://localhost:8000/reserva/api/edit/' + localStorage.getItem('reservaId'),
        type: 'PUT',
        contentType: 'application/json', // Ajusta el tipo de contenido según tus necesidades
        data: JSON.stringify({
            apuntados: $('#apuntadosInp').val(), // Obtiene el ID del tour almacenado en el almacenamiento local
        }),
        success: function (data) {
            // Muestra un mensaje de éxito y elimina el identificador de reserva del almacenamiento local
            alert("Reserva actualizada con éxito");
            localStorage.removeItem('reservaId');
            window.location.href = '/perfil'
        },
        error: function (error) {
            // Muestra un mensaje de error si ocurre algún problema al eliminar la reserva
            alert("Ha ocurrido un error al intentar actualizar la reserva");
        }
    });
}

/**
 * Elimina la reserva correspondiente al identificador almacenado en el almacenamiento local.
 */
function deleteTour() {
    $.ajax({
        url: 'https://localhost:8000/tour/api/eliminar/' + localStorage.getItem('tourId'),
        type: 'DELETE',
        contentType: 'application/json', // Ajusta el tipo de contenido según tus necesidades
        success: function (data) {
            // Muestra un mensaje de éxito y elimina el identificador de reserva del almacenamiento local
            alert("Tour eliminado con éxito");
            localStorage.removeItem('tourId');
            // Oculta el botón de cancelar reserva y actualiza la lista de reservas
            window.location.href = "/rutas";
        },
        error: function (error) {
            // Muestra un mensaje de error si ocurre algún problema al eliminar la reserva
            alert("Ha ocurrido un error al intentar eliminar la reserva");
        }
    });
}

/**
 * Rellena el modal con las reservas almacenadas en el almacenamiento local.
 */
function rellenarModal() {
    // Vacía el contenido actual del cuerpo del modal
    $('#body-reserva').empty();

    // Divide las reservas almacenadas en el almacenamiento local
    var partes = localStorage.getItem('reservas').split(',');

    // Itera sobre cada reserva y crea un nuevo elemento de checkbox y etiqueta para agregar al cuerpo del modal
    partes.forEach(reserva => {
        var newCheckboxDiv = $('<div class="form-check">');
        var newCheckbox = $('<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">');
        var newLabel = $('<label class="form-check-label" for="flexCheckDefault">').text(reserva);

        // Agrega el checkbox y la etiqueta al div
        newCheckboxDiv.append(newCheckbox);
        newCheckboxDiv.append(newLabel);

        // Agrega el div al cuerpo del modal
        $('#body-reserva').append(newCheckboxDiv);
    });
};

/**
 * Maneja el evento de cambio en el campo de valoración.
 * Actualiza los tours según la valoración seleccionada y muestra la valoración seleccionada en la consola.
 */
$('#valoracionFieldset').change(function () {
    // Actualiza los tours según la valoración seleccionada
    mostrarTours();

    // Obtiene el valor de la valoración seleccionada
    var valoracion = $('input[name="estrellas"]:checked').val();

    // Muestra la valoración seleccionada en la consola
    console.log("La valoración seleccionada es: " + valoracion);
    // Aquí puedes realizar otras acciones con la valoración seleccionada
});

function updateBox(event) {
    if (event.target.id == 'sel-guia-upd') {
        $.ajax({
            url: 'https://localhost:8000/tour/api/' + $('#sel-guia-upd option:selected').attr('dataid'),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var horasUnicas = {}; // Objeto para almacenar las horas únicas
                $("#sel-hora-upd").empty();
                $("#sel-hora-upd").append($('<option selected value="">Seleccione la hora</option>'));

                $.each(data, function (index, elemento) {
                    // Verifica si el objeto hora no está definido en el elemento actual
                    if (!horasUnicas[elemento.hora]) {
                        horasUnicas[elemento.hora] = true; // Marca la hora como única
                        var partes = elemento.hora.split("-");
                        var hora = partes[0];
                        $("#sel-hora-upd").append($('<option>', {
                            value: hora,
                            text: hora
                        }));
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error en la solicitud: ', textStatus, errorThrown);
            }
        });
    }
    $.ajax({
        url: 'https://localhost:8000/tours/api', // URL de la API
        type: 'GET', // Método HTTP GET
        dataType: 'json', // Tipo de datos esperados en la respuesta (puedes cambiarlo según el tipo de datos que esperas)
        success: function (data) {
            data = $.grep(data, function (evento) {
                var eventoDate = evento.fecha && moment(evento.fecha.date).format('YYYY-MM-DD');
                var eventoLocation = evento.loc;
                var eventoGuia = evento.guia;
                var partes = evento.hora.split("-");
                var eventoHora = partes[0];

                var guia = $('#sel-guia-upd').val();
                var ubicacionBusqueda = $('#sel-loc-upd').val();
                var fechaIniBusqueda = $('#fec_ini_upd').val();
                var fechaFinBusqueda = $('#fec_fin_upd').val();
                var horaBusqueda = $('#sel-hora-upd').val();

                var filtroFecha = !fechaIniBusqueda || !fechaFinBusqueda || (eventoDate >= fechaIniBusqueda && eventoDate <= fechaFinBusqueda);
                var filtroUbicacion = !ubicacionBusqueda || (eventoLocation === ubicacionBusqueda);
                var filtroGuia = !guia || (eventoGuia === guia);
                var filtroHora = !horaBusqueda || (eventoHora === horaBusqueda);

                return filtroFecha && filtroUbicacion && filtroGuia && filtroHora;
            });

            $("#toursAvalaible").empty()
            if (data != '') {
                data.forEach(element => {
                    var nuevoElemento = $("<li>") // Crea un nuevo elemento de lista
                        .addClass("ui-state-default") // Agrega una clase CSS al elemento
                        .text("Fecha: " + (element.fecha && moment(element.fecha.date).format('YYYY-MM-DD')) + ", Ubicación: " + element.loc + ", Guía: " + element.guia + ", Hora: " + element.hora.split("-")[0])
                        .attr('data-id', element.id)

                    // Agrega el nuevo elemento de lista al contenedor con el ID "sortable1"
                    $("#toursAvalaible").append(nuevoElemento);
                });
            } else {
                var nuevoElemento = $("<li>") // Crea un nuevo elemento de lista
                    .addClass("ui-state-default") // Agrega una clase CSS al elemento
                    .text('No hay elementos con esos filtros')

                // Agrega el nuevo elemento de lista al contenedor con el ID "sortable1"
                $("#toursAvalaible").append(nuevoElemento);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            /**
             * Función que maneja los errores de la llamada AJAX.
             * Registra un mensaje de error en la consola del navegador.
             */
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

function newFields() {
    if ($('#sel-upd-field').val() == 'hora') {
        $('#new-hora').hide()
        $('#new-fec').hide()
        $('#new-hora').show()
    } else if ($('#sel-upd-field').val() == 'guia') {
        $('#new-hora').hide()
        $('#new-fec').hide()
        $('#new-fec').show()
    } else {
        $('#new-hora').hide()
        $('#new-fec').hide()
    }
}

function updateTours() {
    var totalTours = $("#toursAvalaible li").length; // Total de tours a actualizar
    var completedTours = 0; // Contador de tours completados

    $("#toursAvalaible li").each(function () {
        var tourId = $(this).data('id'); // Usar .data() en lugar de .attr() para acceder a atributos de datos

        $.ajax({
            url: 'https://localhost:8000/tours/api/edit/' + tourId, // URL de la API
            type: 'PUT', // Método HTTP PUT para actualizar datos
            contentType: 'application/json', // Especifica el tipo de contenido como JSON
            data: JSON.stringify({ // Convierte los datos a un formato JSON y los envía en la solicitud
                guia: $("#sel-new-guia").data('id'), // Usar .data() en lugar de .attr() para acceder a atributos de datos
                hora: $("#new-hora-data").val() // Obtener el valor del campo de hora
            }),
            success: function (respuesta) {
                completedTours++; // Incrementar el contador de tours completados

                // Verificar si todas las solicitudes de actualización se han completado
                if (completedTours === totalTours) {
                    // Mostrar el alert y redirigir después de completar todas las actualizaciones
                    alert("Cambios masivos realizados con éxito");
                    window.location.href = "/rutas";
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                /**
                 * Función que maneja los errores de la llamada AJAX.
                 * Registra un mensaje de error en la consola del navegador.
                 */
                console.error('Error en la solicitud: ', textStatus, errorThrown);
            }
        });
    });
}


$('#apuntados').on('change', function () {
    console.log('hola');
    if ($(this).val() != '') {
        $('#newReserva').prop('disabled', false);
    } else {
        $('#newReserva').prop('disabled', true);
    }
});

$('input, textarea, select').on('change', function () {
    if (window.location.href == '/rutas') {
        // Validar el input actual
        $('#ruta-1')[0].validaOneByOne(this);
        $('#diahoraForm')[0].validaOneByOne(this);

        // Si el input actual es '#ini-ruta', validar '#latitudIni' y '#longitudIni' después de 2 segundos
        if (this.id == 'ini-ruta') {
            setTimeout(function () {
                $('#ruta-1')[0].validaOneByOne($('#latitudIni')[0]);
                $('#ruta-1')[0].validaOneByOne($('#longitudIni')[0]);
            }, 2000);
        }

        // Verificar si todos los elementos dentro de '#ruta-1' tienen la clase 'active'
        var todosActivos = $('#ruta-1').find('input, select, textarea').toArray().every(function (elemento) {
            return $(elemento).hasClass('valido');
        });

        // Si todos los elementos son activos, quitar el atributo 'disabled' de '#ruta-1-sig'
        if (todosActivos) {
            $('#ruta-1-sig').removeAttr('disabled');
        } else {
            $('#ruta-1-sig').attr('disabled', 'true');
        }

        var checkselec = $('#inp-dias').find('input:checked').length > 0;
        var todosActivosR2 = $('#diahoraForm').find('.inputs3').toArray().every(function (elemento) {
            return $(elemento).hasClass('valido');
        });

        if (checkselec && todosActivosR2) {
            $('#crearRuta').removeAttr('disabled');
        } else {
            $('#crearRuta').attr('disabled', 'true');
        }

        var filtros = $('.filtros').toArray().some(function (elemento) {
            return $(elemento).hasClass('invalido');
        });

        var todosActivosMasivos = $('.masivos:visible').toArray().every(function (elemento) {
            return $(elemento).hasClass('valido');
        });

        console.log(filtros)
        console.log(todosActivosMasivos)
        if (!filtros && todosActivosMasivos) {
            console.log('hola')
            $('#btn-chg').prop('disabled', false);
        } else {
            console.log('adios')
            $('#btn-chg').prop('disabled', true);
        }
    }
});

$('.box-2').on('drop', function (event) {
    console.log('Evento de drop detectado en el contenedor box-2');
    // Aquí puedes colocar la lógica que deseas ejecutar cuando ocurre el evento de drop
});

$('input[type="date"]').each(function (index, element) {
    $(element).on('change', function (ev) {
        console.log(element.value);
        switch (element.id) {
            case 'fec_ini':
                $('#fec_fin').prop('min', element.value);
                $('#fechaIniPrg').prop('min', element.value);
                $('#fechaFinPrg').prop('min', element.value);
                break;

            case 'fec_fin':
                $('#fec_ini').prop('max', element.value);
                $('#fechaFinPrg').prop('max', element.value);
                $('#fechaIniPrg').prop('max', element.value);
                break;
            case 'fechaIniPrg':
                $('#fechaFinPrg').prop('min', element.value);
                break;
            case 'fechaFinPrg':
                $('#fechaIniPrg').prop('max', element.value);
                break;
        }
    });
});

function changeGuia() {
    var tourId = localStorage.getItem('tourId');

    $.ajax({
        url: 'https://localhost:8000/tours/api/edit/' + tourId, // URL de la API
        type: 'PUT', // Método HTTP PUT para actualizar datos
        contentType: 'application/json', // Especifica el tipo de contenido como JSON
        data: JSON.stringify({ // Convierte los datos a un formato JSON y los envía en la solicitud
            guia: $("#change-guia").val(), // Usar .data() en lugar de .attr() para acceder a atributos de datos
        }),
        success: function (respuesta) {
            alert("Guia cambiado con éxito");
            window.location.href = "/rutas";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            /**
             * Función que maneja los errores de la llamada AJAX.
             * Registra un mensaje de error en la consola del navegador.
             */
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}










