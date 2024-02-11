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

var maps = {};

function initializeMaps(mapName) {
    if (window.location.pathname == '/rutas' || window.location.pathname == '/searchPanel/tour') {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitud = position.coords.latitude;
                var longitud = position.coords.longitude;

                if (window.location.pathname == '/rutas') {
                    setTimeout(function () {
                        var map = L.map(mapName).setView([latitud, longitud], 13);
                        initializeMap(map);
                        maps[mapName] = map;
                    }, 1000);
                } else if (window.location.pathname == '/searchPanel/tour') {
                    var map4 = L.map('map-encounter-pt').setView([$('#map-encounter-pt').attr('data-lat'), $('#map-encounter-pt').attr('data-long')], 13);
                    initializeMap(map4);

                    var customIcon = L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                        iconSize: [25, 41], // ajusta el tamaño del icono según sea necesario
                        iconAnchor: [12, 41], // ajusta el punto de anclaje del icono según sea necesario
                        popupAnchor: [0, -41], // ajusta la posición del popup relativa al icono según sea necesario
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                        shadowSize: [41, 41], // ajusta el tamaño de la sombra según sea necesario
                        shadowAnchor: [12, 41] // ajusta el punto de anclaje de la sombra según sea necesario
                    });

                    customIcon.options.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png';

                    L.marker([$('#map-encounter-pt').attr('data-lat'), $('#map-encounter-pt').attr('data-long')], { icon: customIcon }).addTo(map4)
                        .bindPopup('Punto de encuentro')
                        .openPopup();

                    $('#items li').each(function () {
                        var lat = $(this).data('lat');
                        var long = $(this).data('long');

                        L.marker([lat, long]).addTo(map4)
                            .bindPopup($(this).text())
                            .openPopup();
                    });
                }

                $("#findItem").click(function (ev) {
                    ev.preventDefault()
                    L.marker([$("#lat").val(), $("#long").val()]).addTo(maps['map'])
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
}

function initializeMap(map) {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
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

                L.marker([latitud, longitud]).addTo(maps['map-inicio'])
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
            nuevoMarcador = L.marker([latitud, longitud]).addTo(maps['map-items'])
                .bindPopup(titulo)
                .openPopup();

            marcadoresPorTitulo[titulo] = nuevoMarcador;
        } else {
            // Verificar si el marcador existe antes de intentar quitarlo
            if (marcadoresPorTitulo[titulo]) {
                maps['map-items'].removeLayer(marcadoresPorTitulo[titulo]);
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

var programacion = {
    fragmento: []
};

function addHour() {
    var datos = {
        dia: [],
        inicio: $('#fechaIniPrg').val(),
        fin: $('#fechaFinPrg').val(),
        hora: $('#horaDia').val(),
        guia: $("#sel-guia option:selected").val()
    };

    $(".dias input[type='checkbox']:checked").each(function () {
        datos.dia.push($(this).val())
    });

    programacion.fragmento.push(datos);

    $('#saco').empty()
    programacion.fragmento.forEach(element => {
        $('#saco').append('<div>' + element.dia + ' / ' + element.inicio + ' : ' + element.fin + ' / ' + element.guia + ' / ' + element.hora + '</div>');
    });

    console.log(programacion)
}

$("#crearRuta").click(function (ev) {
    var items = [];
    $("#sortable2 li").each(function () {
        items.push($(this).attr("id"));
    });

    // Realizar la solicitud AJAX
    $.ajax({
        url: 'https://localhost:8000/ruta/api/crear',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            titulo: $("#tituloRuta").val(),
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
    $('#overlay').show()
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
                        clonedTemplate.find('#foto').attr('src', elemento.foto)

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
                    $('#overlay').hide()
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
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la llamada AJAX
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

if (window.location.pathname == '/rutas' || window.location.pathname == '/searchPanel') {
    mostrarTours()
}

function changePage(index) {
    $(".clonedTemplate").each(function () {
        $(this).hide()
    })
    $(".clonedTemplate-" + index).each(function () {
        $(this).show()
    })
}

function inicializarCalendario() {
    setTimeout(function () {
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
    }, 1000);
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
    initializeMaps()
    $('#titPage').text()

    $('#newReserva').on('click', function () {
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
                window.location.href = "/"
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                // Manejar errores de la solicitud
                console.error('Error en la solicitud: ', textStatus, errorThrown);
            });
    })
}

function rellenarReservas() {
    $('#overlay').show();
    if ($('#wlc-user').attr('data-roles').includes('ROLE_GUIA')) {
        url = 'https://localhost:8000/tour/api/' + $('#wlc-user').attr('data-id')
    } else {
        url = 'https://localhost:8000/reservas/api/' + $('#wlc-user').attr('data-id')
    }
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json', // Puedes cambiarlo según el tipo de datos que esperas
        success: function (data) {

            $.each($('.clonedTemplate'), function () {
                $(this).remove();
            });
            $.each($('.page-inner'), function () {
                $(this).remove();
            });
            $('#empty').hide()

            $.ajax({
                url: 'https://localhost:8000/plantillaReservas',
                type: 'GET',
                dataType: 'html',
                success: function (template) {

                    data = $.grep(data, function (evento) {
                        // Verificar si la propiedad 'fecha' existe antes de intentar acceder a 'date'
                        var eventoDate = evento.fecha && moment(evento.fecha.date).format('YYYY-MM-DD');
                        var fechaSistema = moment().format('YYYY-MM-DD');

                        if ($('#prox').is('[active]')) {
                            // Verificar si el eventoDate es mayor que la fecha del sistema
                            return eventoDate && eventoDate >= fechaSistema;
                        } else {
                            return eventoDate && eventoDate < fechaSistema;
                        }
                    });

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

                        if ($('#wlc-user').attr('data-roles').includes('ROLE_GUIA')) {
                            clonedTemplate.find('#cancel').hide();
                            if (elemento.reservas != '') {
                                clonedTemplate.find('#edit').text('Pasar lista').attr('href', '#lista').attr('data-res', elemento.reservas).attr('onclick', 'saveId(this)');
                            } else {
                                clonedTemplate.find('#edit').text('Pasar lista').attr('disabled', 'true')
                            }

                            // if (elemento.reservas && elemento.reservas.length > 0) {

                            //     elemento.reservas.forEach(reserva => {
                            //         console.log(reserva)
                            //         var newCheckboxDiv = $('<div class="form-check">');
                            //         var newCheckbox = $('<input class="form-check-input" type="checkbox" value= id="flexCheckDefault">');
                            //         var newLabel = $('<label class="form-check-label" for="flexCheckDefault">').text(reserva);

                            //         // Agregar el checkbox y la etiqueta al div
                            //         newCheckboxDiv.append(newCheckbox);
                            //         newCheckboxDiv.append(newLabel);
                            //         $('#body-reserva').append(newCheckboxDiv);
                            //     });
                            // } else {
                            //     // Si no hay reservas, puedes mostrar un mensaje o realizar otra acción aquí
                            //     console.log("No hay reservas disponibles");
                            // }

                        } else {
                            clonedTemplate.find('#cancel').attr('data-id', elemento.id);
                            clonedTemplate.find('#edit').attr('data-id', elemento.id);
                        }

                        if ($('#before').is('[active]')) {
                            if ($('#wlc-user').attr('data-roles').includes('ROLE_GUIA')) {
                                clonedTemplate.find('#cancel').hide();
                                clonedTemplate.find('#edit').text('Informe').attr('href', '#informe').attr('data-id', elemento.id);
                            } else {
                                clonedTemplate.find('#cancel').hide()
                                clonedTemplate.find('#edit').text('Valorar')
                                clonedTemplate.find('#edit').attr('data-bs-target', '#valorarReserva').removeAttr('href').attr('data-id', elemento.id).attr('data-ruta', elemento.ruta).attr('onclick', 'saveId(this)')
                            }
                        }

                        // if (window.location.pathname === '/searchPanel') {
                        //     clonedTemplate.find('#cancel').remove()
                        //     clonedTemplate.find('.main-btn').text('Info y reservas').addClass('ml-auto moreInfo').attr('data-id', elemento.id).attr('onclick', 'redirectToTour(this)')
                        //     clonedTemplate.find('#descripcion').text(elemento.desc)
                        // }

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


if (window.location.pathname == '/perfil') {
    rellenarReservas()
}

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
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

var fotoGrupo = "";

function encodefotoGrupo(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        fotoGrupo = reader.result;
    }
    reader.readAsDataURL(file);
}

function addInf() {
    $.ajax({
        url: 'https://localhost:8000/informe/api/crear',
        type: 'POST',
        contentType: 'application/json', // Especifica el tipo de contenido como JSON
        data: JSON.stringify({
            tour: localStorage.getItem('tourId'),
            foto: fotoGrupo,
            ingresos: $('#importeRecibido').val()
        }),
        success: function (respuesta) {
            alert("Valoración creada con éxito");
            location.reload(true);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error en la solicitud: ', textStatus, errorThrown);
        }
    });
}

function changeActive(btn) {
    // Eliminar la clase 'active' de todos los elementos con la clase 'nav-link'
    $('.nav-link').removeClass('active').removeAttr('active');

    // Agregar la clase 'active' al elemento clicado
    $(btn).addClass('active').attr('active', 'true');

    rellenarReservas();
}

function saveId(btn) {
    localStorage.removeItem('rutaId');
    localStorage.removeItem('reservaId');
    localStorage.removeItem('reservas');

    localStorage.setItem('reservaId', $(btn).data('id'));
    localStorage.setItem('reservas', $(btn).data('res'));

    if (window.location.pathname == '/perfil') {
        localStorage.setItem('rutaId', $(btn).data('ruta'));
    }

    if (localStorage.getItem('reservas') != '') {
        rellenarModal()
    }
}

function deleteReserva() {
    $.ajax({
        url: 'https://localhost:8000/reserva/api/eliminar/' + localStorage.getItem('reservaId'),
        type: 'DELETE',
        contentType: 'application/json', // Ajusta el tipo de contenido según tus necesidades
        success: function (data) {
            alert("Reserva eliminada con éxito");
            localStorage.removeItem('reservaId');
            $('#cancel').hide()
            rellenarReservas()
        },
        error: function (error) {
            alert("Ha ocurrido un error al intentar eliminar la reserva");
        }
    });
}

function rellenarModal() {
    $('#body-reserva').empty()
    var partes = localStorage.getItem('reservas').split(',');
    partes.forEach(reserva => {
        var newCheckboxDiv = $('<div class="form-check">');
        var newCheckbox = $('<input class="form-check-input" type="checkbox" value= id="flexCheckDefault">');
        var newLabel = $('<label class="form-check-label" for="flexCheckDefault">').text(reserva);

        newCheckboxDiv.append(newCheckbox);
        newCheckboxDiv.append(newLabel);
        $('#body-reserva').append(newCheckboxDiv);
    });
};


$('#valoracionFieldset').change(function () {
    mostrarTours()
    var valoracion = $('input[name="estrellas"]:checked').val();
    console.log("La valoración seleccionada es: " + valoracion);
    // Aquí puedes realizar otras acciones con la valoración seleccionada
});











