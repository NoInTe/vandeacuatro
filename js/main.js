/* =========================================
   NAVEGACIÓN PRINCIPAL
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        /*
         * Mostrar Inicio al cargar
         */

        mostrarSeccion("inicio");


        /*
         * Preparar navegación
         */

        prepararNavegacion();


        /*
         * Cargar últimos artículos
         */

        cargarUltimosArticulos();


        /*
         * Inicializar mapa
         */

        inicializarMapa();

    }
);



/* =========================================
   MOSTRAR SECCIÓN
========================================= */

function mostrarSeccion(
    nombre
) {


    /*
     * Buscar todas las secciones
     */

    const secciones =
        document.querySelectorAll(
            ".page-section"
        );


    /*
     * Ocultar todas
     */

    secciones.forEach(
        function(seccion) {

            seccion.classList.remove(
                "active"
            );

        }
    );



    /*
     * Buscar la sección
     * solicitada.
     */

    const seccionActiva =
        document.getElementById(
            `section-${nombre}`
        );


    if (!seccionActiva) {

        console.error(
            `No existe la sección: ${nombre}`
        );

        return;

    }



    /*
     * Activarla
     */

    seccionActiva.classList.add(
        "active"
    );



    /*
     * Volver al comienzo
     */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });



    /*
     * Si estamos entrando
     * a Artículos, inicializar
     * su sistema.
     */

    if (
        nombre === "articulos"
    ) {

        prepararPaginaArticulos();

    }

}



/* =========================================
   PREPARAR MENÚ
========================================= */

function prepararNavegacion() {


    const enlaces =
        document.querySelectorAll(
            "[data-section]"
        );


    enlaces.forEach(
        function(enlace) {


            enlace.addEventListener(
                "click",
                function(event) {


                    event.preventDefault();


                    const seccion =
                        enlace.dataset.section;


                    mostrarSeccion(
                        seccion
                    );


                    /*
                     * Actualizar URL
                     * mediante hash.
                     */

                    history.pushState(
                        null,
                        "",
                        `#${seccion}`
                    );

                }
            );

        }
    );



    /*
     * Botón atrás / adelante
     * del navegador.
     */

    window.addEventListener(
        "popstate",
        function() {

            const nombre =
                obtenerSeccionDesdeURL();


            mostrarSeccion(
                nombre
            );

        }
    );

}



/* =========================================
   OBTENER SECCIÓN DESDE URL
========================================= */

function obtenerSeccionDesdeURL() {


    const hash =
        window.location.hash
            .replace("#", "");


    /*
     * Si no hay hash,
     * mostrar inicio.
     */

    if (!hash) {

        return "inicio";

    }


    /*
     * Secciones permitidas.
     */

    const seccionesPermitidas = [

        "inicio",

        "quienes-somos",

        "afiliados",

        "articulos",

        "redes",

        "contacto"

    ];


    if (
        seccionesPermitidas
            .includes(hash)
    ) {

        return hash;

    }


    return "inicio";

}