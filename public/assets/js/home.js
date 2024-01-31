var localidades = []
$.ajax({
    url: 'https://localhost:8000/localidad/api',
    type: 'GET',
    dataType: 'json', // Puedes cambiarlo según el tipo de datos que esperas
    success: function (data) {

        $.each(data, function (index, elemento) {
            localidades.push(elemento.nombre);
        });
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // Maneja los errores de la llamada AJAX
        console.error('Error en la solicitud: ', textStatus, errorThrown);
    }
});

function rellenarUl() {
    $.ajax({
        url: 'https://localhost:8000/item/api',
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            $.each(data, function (index, elemento) {
                var nuevoElemento = $("<li>")
                    .addClass("ui-state-default")
                    .text(elemento.titulo)
                    .attr({
                        'lat': elemento.latitud,
                        'long': elemento.longitud
                    });


                $("#sortable1").append(nuevoElemento);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la llamada AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}
rellenarUl()

$("#ciudad").autocomplete({
    source: localidades
});

$("#register").click(function () {
    $.ajax({
        url: 'https://localhost:8000/usuario/api/crear',
        type: 'POST',
        contentType: 'application/json', // Especifica el tipo de contenido como JSON
        data: JSON.stringify({
            email: $("#registerEmail").val(),
            plainpassword: $("#registerPass").val()
        }),
        success: function (respuesta) {
            alert("Usuario creado con éxito");
            location.reload(true);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });

});

var latitud = 0;
var longitud = 0;
var map2

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;

        // Después de obtener las coordenadas, crea el mapa y añade la capa de baldosas
        var map = L.map('map').setView([latitud, longitud], 13);
        map2 = L.map('map-items').setView([latitud, longitud], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map2);

        $("#findItem").click(function (ev) {
            ev.preventDefault()
            L.marker([$("#lat").val(), $("#long").val()]).addTo(map)
                .bindPopup($("#tituloItem").val())
                .openPopup();
        })

    }, function (error) {
        console.error("Error al obtener la ubicación: " + error.message);
    });
} else {
    console.error("Geolocalización no es compatible con este navegador.");
}

var imagebase64 = "";

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        imagebase64 = reader.result;
    }
    reader.readAsDataURL(file);
}

$("#newItem").click(function (ev) {
    ev.preventDefault()
    $.ajax({
        url: 'https://localhost:8000/item/api/crear',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            titulo: $("#tituloItem").val(),
            descripcion: $("#descItem").val(),
            foto: imagebase64,
            latitud: $("#lat").val(),
            longitud: $("#long").val()
        })
    })
        .done(function (respuesta) {
            // Manejar la respuesta del servidor en caso de éxito
            alert("Item creado con éxito");
            $('#itemForm')[0].reset();
            rellenarUl()
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        });
})

$("#tituloItem").on("blur", function () {
    var direccion = $("#tituloItem").val();

    // Utilizar el servicio de geocodificación de OpenStreetMap Nominatim
    var nominatimURL = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(direccion);

    $.ajax({
        url: nominatimURL,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                // Coordenadas del lugar
                var latitud = data[0].lat;
                var longitud = data[0].lon;

                // Hacer algo con las coordenadas (puedes mostrarlas en la consola o en un elemento HTML)
                $("#lat").val(latitud)
                $("#long").val(longitud)
            } else {
                alert("No se encontraron coordenadas para la dirección proporcionada.");
            }
        },
        error: function () {
            alert("Error al obtener las coordenadas. Por favor, inténtalo de nuevo.");
        }
    });
});

var marcadoresPorTitulo = {}; // Declarar la variable fuera del evento receive

$("#sortable1, #sortable2").sortable({
    connectWith: ".connectedSortable",
    receive: function (event, ui) {
        var titulo = ui.item.text();
        var latitud = ui.item.attr("lat");
        var longitud = ui.item.attr("long");
        var sourceListId = ui.sender.attr("id");
        var targetListId = $(this).attr("id");
        var nuevoMarcador;

        if (targetListId == 'sortable2') {
            nuevoMarcador = L.marker([latitud, longitud]).addTo(map2)
                .bindPopup(titulo)
                .openPopup();

            marcadoresPorTitulo[titulo] = nuevoMarcador;
        } else {
            // Verificar si el marcador existe antes de intentar quitarlo
            if (marcadoresPorTitulo[titulo]) {
                map2.removeLayer(marcadoresPorTitulo[titulo]);
                // También puedes eliminar la referencia del objeto si es necesario
                delete marcadoresPorTitulo[titulo];
            }
        }

        // Puedes realizar más acciones aquí según tus necesidades
    }
}).disableSelection();
