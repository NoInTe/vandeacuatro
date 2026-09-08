let mapaInicializado = false;


/* =========================================
   INICIALIZAR MAPA
========================================= */

async function inicializarMapa() {

    if (mapaInicializado) {
        return;
    }


    const mapElement =
        document.getElementById("map");


    if (!mapElement) {
        return;
    }


    /* =====================================
       CREAR MAPA
    ===================================== */

    const map = L.map("map", {

        /*
         * La rueda del mouse NO hace zoom
         * automáticamente.
         */
        scrollWheelZoom: false,

        /*
         * Quitamos los botones + y -
         */
        zoomControl: false

    }).setView(
        [-34.6037, -58.3816],
        4
    );


    /* =====================================
       OPEN STREET MAP
    ===================================== */

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        }
    ).addTo(map);



    /* =====================================
       LEYENDA / INSTRUCCIÓN
    ===================================== */

    const zoomHint =
        document.createElement("div");

    zoomHint.className =
        "map-zoom-hint";

    zoomHint.innerHTML = `
        
        <strong>
            🔍 Para hacer zoom
        </strong>

        <span>
            Mantené presionado <b>Ctrl</b>
            y utilizá la rueda del mouse
        </span>

    `;


    mapElement.appendChild(
        zoomHint
    );



    /* =====================================
       CONTROL CTRL + RUEDA
    ===================================== */

    mapElement.addEventListener(
        "wheel",
        function(event) {


            /*
             * Si NO está presionado Ctrl:
             *
             * no hacemos absolutamente nada.
             *
             * El navegador continúa haciendo
             * scroll normalmente.
             */

            if (!event.ctrlKey) {

                return;

            }


            /*
             * Evitamos que el navegador
             * interprete Ctrl + rueda como
             * zoom de la página.
             */

            event.preventDefault();

            event.stopPropagation();


            /*
             * Determinar dirección
             * de la rueda.
             */

            if (event.deltaY < 0) {

                /*
                 * Rueda hacia arriba
                 * = acercar
                 */

                map.zoomIn();

            } else {

                /*
                 * Rueda hacia abajo
                 * = alejar
                 */

                map.zoomOut();

            }

        },
        {
            passive: false
        }
    );



    /* =====================================
       MARKER PERSONALIZADO
    ===================================== */

    const customIcon =
        L.divIcon({

            className: "",

            html:
                '<div class="custom-marker"></div>',

            iconSize:
                [28, 28],

            iconAnchor:
                [14, 28],

            popupAnchor:
                [0, -28]

        });



    /* =====================================
       CARGAR DATOS DEL MAPA
    ===================================== */

    try {


        const respuesta =
            await fetch(
                "data/mapa.json"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar mapa.json"
            );

        }


        const lugares =
            await respuesta.json();



        /* =================================
           CREAR MARCADORES
        ================================= */

        lugares.forEach(
            function(lugar) {


                const marker =
                    L.marker(

                        [
                            lugar.latitud,
                            lugar.longitud
                        ],

                        {
                            icon:
                                customIcon
                        }

                    ).addTo(map);



                /* =============================
                   POPUP
                ============================= */

                const popupHTML = `

                    <div class="map-popup-card">

                        <div class="map-popup-content">

                            <h3>
                                ${lugar.nombre}
                            </h3>

                            <p>
                                ${lugar.provincia},
                                ${lugar.pais}
                            </p>

                            <a
                                href="#articulo"
                                class="map-popup-button"
                                data-articulo="${lugar.articulo}"
                            >
                                Ver artículo
                            </a>

                        </div>

                    </div>

                `;


                marker.bindPopup(
                    popupHTML
                );



                /* =============================
                   HOVER
                ============================= */

                marker.on(
                    "mouseover",
                    function() {

                        this.openPopup();

                    }
                );

            }
        );


        mapaInicializado = true;


    }

    catch (error) {

        console.error(
            "No se pudo cargar mapa.json:",
            error
        );

    }

}