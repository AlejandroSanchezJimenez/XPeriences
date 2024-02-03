var localidades = []
$.ajax({
    url: 'https://localhost:8000/localidad/api',
    type: 'GET',
    dataType: 'json', // Puedes cambiarlo según el tipo de datos que esperas
    success: function (data) {

        $.each(data, function (index, elemento) {
            $("#loc-datalist").append($('<option>', {
                // value: elemento.id,
                value: elemento.nombre
            }));
            $("#sel-loc").append($('<option>', {
                value: elemento.id,
                text: elemento.nombre
            }));
        });
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // Maneja los errores de la llamada AJAX
        console.error('Error en la solicitud: ', textStatus, errorThrown);
    }
});

$.ajax({
    url: 'https://localhost:8000/user/api/guia',
    type: 'GET',
    dataType: 'json', // Puedes cambiarlo según el tipo de datos que esperas
    success: function (data) {

        $.each(data, function (index, elemento) {
            $("#sel-guia").append($('<option>', {
                value: elemento.id,
                text: elemento.email
            }));
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
                        'long': elemento.longitud,
                        'id': elemento.id
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
var map
var map2
var map3
var map4

if (window.location.pathname == '/rutas' || window.location.pathname == '/searchPanel/tour') {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;

            if (window.location.pathname == '/rutas') {
                map = L.map('map').setView([latitud, longitud], 13);
                map2 = L.map('map-items').setView([latitud, longitud], 13);
                map3 = L.map('map-inicio').setView([latitud, longitud], 13);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map2);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map3);
            } else if (window.location.pathname == '/searchPanel/tour') {
                console.log('hola2')
                map4 = L.map('map-encounter-pt').setView([latitud, longitud], 13);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map4);

                L.marker([$('#map-encounter-pt').attr('data-lat'),$('#map-encounter-pt').attr('data-long')]).addTo(map4)
                    .openPopup();
            }

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

$("#ini-ruta").on("blur", function () {
    var direccion = $("#ini-ruta").val();

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
                $("#latitudIni").val(latitud)
                $("#longitudIni").val(longitud)

                L.marker([latitud, longitud]).addTo(map3)
                    .openPopup();
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

var fotoRuta = "";

function encodeRutaFoto(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        fotoRuta = reader.result;
    }
    reader.readAsDataURL(file);
}

$("#crearRuta").click(function (ev) {
    var items = [];
    $("#sortable2 li").each(function () {
        items.push($(this).attr("id"));
    });

    var programacion = {
        dias: [],
        horas: [],
        guia: []
    };

    $(".dias input[type='checkbox']:checked").each(function () {
        programacion['dias'].push($(this).val());
    });

    $(".horas input[type='checkbox']:checked").each(function () {
        programacion['horas'].push($(this).parent().text().trim());
    });

    programacion['guia'].push($("#sel-guia option:selected").val());

    // Realizar la solicitud AJAX
    $.ajax({
        url: 'https://localhost:8000/ruta/api/crear',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            titulo: $("#titulo").val(),
            desc: $("#desc").val(),
            aforo: $("#aforo").val(),
            foto: fotoRuta,
            fec_ini: $("#fec_ini").val(),
            fec_fin: $("#fec_fin").val(),
            latitud: $("#latitudIni").val(),
            longitud: $("#longitudIni").val(),
            items: items,
            programacion: programacion,
            localidad: $("#sel-loc option:selected").val()
        })
    })
        .done(function (respuesta) {
            // Manejar la respuesta exitosa
            alert("Ruta creada con éxito");
            location.reload()
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Manejar errores
            console.error('Error en la solicitud: ', textStatus, errorThrown);
            alert("Error al crear la ruta. Por favor, inténtalo de nuevo.");
        });
});

$('.cancel').on('click', function () {
    // Capturar el valor del atributo 'data-mivalor' del botón
    var id = $(this).data('id');

    // Actualizar el contenido del modal con el valor capturado
    $('#deleteBTN').data('id') = id;
});

var eventos = [];
var lastElement = ''
var url = new URL(window.location.href);

if (window.location.pathname == '/searchPanel') {
    $('#locationSearcher').val(url.searchParams.get('ciudad'))
    $('#dateSearcher').val(url.searchParams.get('fecha'))
    $('#titPage').text('Tours gratis en ' + url.searchParams.get('ciudad'))
    $('#link-tit').text('Tours en ' + url.searchParams.get('ciudad'))
}

function mostrarTours() {
    $.ajax({
        url: 'https://localhost:8000/tours/api',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (window.location.href == '/rutas') {
                url = "https://localhost:8000/plantillaTour"
            }
            $.ajax({
                url: 'https://localhost:8000/plantillaTour',
                type: 'GET',
                dataType: 'html',
                success: function (template) {

                    $.each($('.clonedTemplate'), function () {
                        $(this).remove();
                    });
                    $.each($('.page-inner'), function () {
                        $(this).remove();
                    });
                    $('#empty').hide()

                    data = $.grep(data, function (evento) {
                        // Verificar si la propiedad 'fecha' existe antes de intentar acceder a 'date'
                        var eventoDate = evento.fecha && moment(evento.fecha.date).format('YYYY-MM-DD');

                        if ($('#dateSearcher').val() && $('#locationSearcher').val()) {
                            // Ambos campos tienen valores
                            return eventoDate === $('#dateSearcher').val() && evento.loc === $('#locationSearcher').val();
                        } else if ($('#dateSearcher').val()) {
                            // Solo el campo de fecha tiene valor
                            return eventoDate === $('#dateSearcher').val();
                        } else if ($('#locationSearcher').val()) {
                            // Solo el campo de ubicación tiene valor
                            return evento.fecha && evento.loc === $('#locationSearcher').val();
                        } else {
                            // Ningún campo tiene valor, no aplicar filtro
                            return true;
                        }
                    });

                    $('#tourCount').text('Disponible ' + data.length + ' resultados');

                    $.each(data, function (index, elemento) {
                        const clonedTemplate = $(template).clone();

                        const suffix = Math.floor(index / 10) + 1;
                        clonedTemplate.addClass('clonedTemplate-' + suffix).addClass('clonedTemplate').attr('data-loc', elemento.loc).attr('data-fec', moment(elemento.fecha.date).format('DD/MM/YY'));

                        // Actualiza el contenido de los elementos en la plantilla clonada
                        clonedTemplate.find('#titulo').text(elemento.titulo);
                        clonedTemplate.find('#fecha').text(moment(elemento.fecha.date).format('DD/MM/YYYY'));
                        clonedTemplate.find('#hora').text(elemento.hora);
                        clonedTemplate.find('#apuntados').text(elemento.apuntados);

                        if (window.location.pathname === '/searchPanel') {
                            clonedTemplate.find('#cancel').remove()
                            clonedTemplate.find('.main-btn').text('Info y reservas').addClass('ml-auto moreInfo').attr('data-id', elemento.id).attr('onclick', 'redirectToTour(this)')
                            clonedTemplate.find('#descripcion').text(elemento.desc)
                        }

                        if (suffix > 1) {
                            clonedTemplate.hide()
                        }

                        if (index % 10 === 0) {
                            const newPage = $('<li class="page-item page-inner" onclick=changePage(' + suffix + ')><a class="page-link" href="#">' + suffix + '</a></li>');
                            newPage.insertBefore($('#next'))
                        }
                        // Agrega la plantilla clonada al contenedor '#zona-tours'
                        clonedTemplate.insertBefore($('#pagination'))
                    })

                    if (data == '') {
                        $("#empty").show()
                        $('#listaPage').hide()
                    } else {
                        $('#listaPage').show()
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Maneja los errores de la llamada AJAX
                    console.error('Error en la solicitud: ', textStatus, errorThrown);
                }
            });
            if (window.location.pathname == '/rutas') {
                // Itera sobre los datos y crea eventos para cada fecha
                data.forEach(function (elemento) {
                    var partes = elemento.hora.split(":");
                    var fecha = new Date(elemento.fecha.date)
                    fecha.setHours(parseInt(partes[0], 10))

                    eventos.push({
                        title: elemento.guia,
                        start: fecha,
                        color: 'blue',        // Fondo del evento
                        borderColor: 'darkblue',  // Borde del evento
                        textColor: 'white',
                        id: elemento.id
                        // Puedes agregar más propiedades según tus necesidades
                    });
                });

                // Inicializar el calendario dentro de la función success
                inicializarCalendario();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la llamada AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

mostrarTours()

function changePage(index) {
    $(".clonedTemplate").each(function () {
        $(this).hide()
    })
    $(".clonedTemplate-" + index).each(function () {
        $(this).show()
    })
}

function inicializarCalendario() {
    $(document).ready(function () {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            initialView: 'dayGridMonth',
            locale: 'es',
            events: eventos,
            editable: true,
            droppable: true,
            eventClick: function (info) {
                alert(info.event.title)
            },
        });
        calendar.render();
    });
}

$("#locationSearcher").on("blur", function (ev) {
    // actualizarVisibilidadTours();
    mostrarTours()
});

$("#dateSearcher").on("change", function (ev) {
    // actualizarVisibilidadTours();
    mostrarTours()
});

function actualizarVisibilidadTours() {
    var selectedLocation = $("#locationSearcher").val();
    var selectedDate = moment($("#dateSearcher").val());

    $(".tours").each(function () {
        var tourLocation = $(this).data('loc');
        var tourFec = $(this).data('fec');
        var tourFecMoment = moment(tourFec, 'DD-MM-YYYY');

        var mostrar = (tourLocation === selectedLocation || selectedLocation === '') &&
            (selectedDate.isSame(tourFecMoment, 'day') || !selectedDate.isValid());

        if (mostrar) {
            $("#empty").hide()
            $('#listaPage').show()
            $(this).show();
        } else {
            $(this).hide();
            if ($(".tours:visible").length == 0) {

            }
        }
    });

    var cantidadVisible = $(".tours:visible").length;
    $('#tourCount').text('Disponible ' + cantidadVisible + ' resultados');
}


$("#clean").on("click", function (ev) {
    ev.preventDefault()
    $(this).closest('form')[0].reset();
    mostrarTours()
})

$('#searchBtn-Lnd').on("click", function (ev) {
    ev.preventDefault()
    window.location.href = "/searchPanel?ciudad=" + $('#ciudad').val() + '&fecha=' + $('#fecha').val();
})

function redirectToTour(button) {
    var dataId = $(button).data('id');
    window.location.href = "/searchPanel/tour?id=" + dataId;
}

if (window.location.pathname == '/searchPanel/tour') {
    $('#titPage').text()

    $('#newReserva').on('click',function(){
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
                // Manejar la respuesta del servidor en caso de éxito
                alert("Reserva creado con éxito");
                $('#ticket')[0].reset();
                window.location.href="/"
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                // Manejar errores de la solicitud
                console.error('Error en la solicitud: ', textStatus, errorThrown);
            });
    })
}











