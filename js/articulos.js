/* =========================================
   VARIABLES
========================================= */

let todosLosArticulos = [];

let articulosFiltrados = [];

let cantidadMostrada = 0;

/*
 * Cantidad de artículos que se muestran
 * en cada tanda.
 */
const ARTICULOS_POR_TANDA = 9;

/* =========================================
   NOMBRES DE LOS MESES
========================================= */

const nombresMeses = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

/* =========================================
   CARGAR ARTÍCULOS
========================================= */

async function prepararPaginaArticulos() {
  const contenedor = document.getElementById("articles-results");

  /*
   * Si no estamos en la página
   * de artículos, no hacemos nada.
   */

  if (!contenedor) {
    return;
  }

  try {
    /*
     * Descargar JSON
     */

    const respuesta = await fetch("data/articulos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar articulos.json");
    }

    todosLosArticulos = await respuesta.json();

    /*
     * =================================
     * ORDENAR POR FECHA
     * MÁS NUEVO → MÁS ANTIGUO
     * =================================
     */

    todosLosArticulos.sort(function (a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });

    /*
     * Inicialmente NO aplicamos filtros.
     */

    articulosFiltrados = [...todosLosArticulos];

    /*
     * Crear opciones de filtros
     */

    generarFiltroCiudades();

    generarFiltroAnios();

    /*
     * Mostrar primera tanda
     */

    cantidadMostrada = 0;

    mostrarSiguienteTanda();

    /*
         * Preparar eventos

         */

    prepararFiltros();

    /*
     * Preparar carga automática
     */

    prepararScrollInfinito();
  } catch (error) {
    console.error("Error cargando artículos:", error);

    contenedor.innerHTML = `

            <div class="articles-error">

                <h3>
                    No se pudieron cargar los artículos.
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;
  }
}

/* =========================================
   GENERAR FILTRO CIUDADES
========================================= */

function generarFiltroCiudades() {
  const select = document.getElementById("filter-city");

  if (!select) {
    return;
  }

  /*
   * Obtener ciudades únicas
   */

  const ciudades = [
    ...new Set(
      todosLosArticulos

        .map((articulo) => articulo.ciudad)

        .filter(Boolean)
    ),
  ];

  /*
   * Orden alfabético
   */

  ciudades.sort(function (a, b) {
    return a.localeCompare(b, "es");
  });

  /*
   * Agregar opciones
   */

  ciudades.forEach(function (ciudad) {
    const option = document.createElement("option");

    option.value = ciudad;

    option.textContent = ciudad;

    select.appendChild(option);
  });
}

/* =========================================
   GENERAR FILTRO AÑOS
========================================= */

function generarFiltroAnios() {
  const select = document.getElementById("filter-year");

  if (!select) {
    return;
  }

  /*
   * Obtener años únicos
   */

  const anios = [
    ...new Set(
      todosLosArticulos

        .map((articulo) => articulo.año)

        .filter(Boolean)
    ),
  ];

  /*
   * Más reciente primero
   */

  anios.sort(function (a, b) {
    return b - a;
  });

  /*
   * Agregar opciones
   */

  anios.forEach(function (anio) {
    const option = document.createElement("option");

    option.value = anio;

    option.textContent = anio;

    select.appendChild(option);
  });
}

/* =========================================
   PREPARAR FILTROS
========================================= */

function prepararFiltros() {
  const ciudad = document.getElementById("filter-city");

  const anio = document.getElementById("filter-year");

  const mes = document.getElementById("filter-month");

  const limpiar = document.getElementById("clear-filters");

  /*
   * Cada cambio vuelve a filtrar.
   */

  ciudad.addEventListener("change", aplicarFiltros);

  anio.addEventListener("change", aplicarFiltros);

  mes.addEventListener("change", aplicarFiltros);

  /*
   * Limpiar filtros
   */

  limpiar.addEventListener("click", function () {
    ciudad.value = "";

    anio.value = "";

    mes.value = "";

    aplicarFiltros();
  });
}

/* =========================================
   APLICAR FILTROS
========================================= */

function aplicarFiltros() {
  const ciudad = document.getElementById("filter-city").value;

  const anio = document.getElementById("filter-year").value;

  const mes = document.getElementById("filter-month").value;

  /*
   * Filtrar array original.
   */

  articulosFiltrados = todosLosArticulos.filter(function (articulo) {
    /*
     * Ciudad
     */

    const coincideCiudad = !ciudad || articulo.ciudad === ciudad;

    /*
     * Año
     */

    const coincideAnio = !anio || String(articulo.año) === String(anio);

    /*
     * Mes
     */

    const coincideMes = !mes || String(articulo.mes) === String(mes);

    return coincideCiudad && coincideAnio && coincideMes;
  });

  /*
   * Reiniciar listado.
   */

  const contenedor = document.getElementById("articles-results");

  contenedor.innerHTML = "";

  cantidadMostrada = 0;

  /*
   * Mostrar primera tanda.
   */

  mostrarSiguienteTanda();
}

/* =========================================
   MOSTRAR SIGUIENTE TANDA
========================================= */

function mostrarSiguienteTanda() {
  const contenedor = document.getElementById("articles-results");

  if (!contenedor) {
    return;
  }

  /*
   * Calcular desde dónde
   * hasta dónde mostrar.
   */

  const inicio = cantidadMostrada;

  const fin = inicio + ARTICULOS_POR_TANDA;

  const siguienteTanda = articulosFiltrados.slice(inicio, fin);

  /*
   * Agregar artículos
   */

  siguienteTanda.forEach(function (articulo) {
    const tarjeta = crearTarjetaArticulo(articulo);

    contenedor.appendChild(tarjeta);
  });

  /*
   * Actualizar cantidad.
   */

  cantidadMostrada = Math.min(fin, articulosFiltrados.length);

  actualizarEstadoCarga();
}

/* =========================================
   CREAR TARJETA
========================================= */

function crearTarjetaArticulo(articulo) {
  const tarjeta = document.createElement("article");

  tarjeta.className = "article-card";

  tarjeta.innerHTML = `

        <div class="article-image">

            <img
                src="${articulo.imagen}"
                alt="${articulo.titulo}"
                loading="lazy"
            >

        </div>


        <div class="article-content">

            <span class="article-category">

                ${articulo.categoria}

            </span>


            <h3>

                ${articulo.titulo}

            </h3>


            <p>

                ${articulo.descripcion}

            </p>


            <div class="article-meta">

                ${articulo.ciudad}
                ·
                ${articulo.año}

            </div>


            <a href="${articulo.articulo}" class="article-button">
                Leer artículo
            </a>

        </div>

    `;

  return tarjeta;
}

/* =========================================
   ESTADO DE CARGA
========================================= */

function actualizarEstadoCarga() {
  const loading = document.getElementById("articles-loading");

  if (!loading) {
    return;
  }

  /*
   * Todavía quedan artículos.
   */

  if (cantidadMostrada < articulosFiltrados.length) {
    loading.textContent = "Desplazate para ver más artículos.";

    loading.style.display = "block";

    return;
  }

  /*
   * No hay resultados.
   */

  if (articulosFiltrados.length === 0) {
    loading.textContent = "No encontramos artículos con esos filtros.";

    loading.style.display = "block";

    return;
  }

  /*
   * Terminamos.
   */

  loading.textContent = "No hay más artículos.";

  loading.style.display = "block";
}

/* =========================================
   SCROLL INFINITO
========================================= */

function prepararScrollInfinito() {
  const loading = document.getElementById("articles-loading");

  if (!loading) {
    return;
  }

  /*
   * IntersectionObserver detecta
   * cuando el usuario llega al final.
   */

  const observer = new IntersectionObserver(
    function (entries) {
      if (!entries[0].isIntersecting) {
        return;
      }

      /*
       * Si quedan artículos,
       * cargar otra tanda.
       */

      if (cantidadMostrada < articulosFiltrados.length) {
        mostrarSiguienteTanda();
      }
    },

    {
      /*
       * Empezar a cargar un poco
       * antes de llegar al final.
       */

      rootMargin: "400px",
    }
  );

  observer.observe(loading);
}

/* =========================================
   ÚLTIMOS ARTÍCULOS - INDEX
========================================= */

async function cargarUltimosArticulos() {
  const contenedor = document.getElementById("latest-articles");

  /*
   * Si no existe el contenedor,
   * significa que no estamos en el index.
   */

  if (!contenedor) {
    return;
  }

  try {
    /*
     * Cargar JSON
     */

    const respuesta = await fetch("data/articulos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar articulos.json");
    }

    const articulos = await respuesta.json();

    /*
     * Ordenar:
     * más reciente → más antiguo
     */

    articulos.sort(function (a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });

    /*
     * Tomar solamente
     * los últimos 6.
     */

    const ultimos = articulos.slice(0, 6);

    /*
     * Limpiar el contenedor
     */

    contenedor.innerHTML = "";

    /*
     * Crear las tarjetas
     */

    ultimos.forEach(function (articulo) {
      const tarjeta = crearTarjetaArticulo(articulo);

      contenedor.appendChild(tarjeta);
    });
  } catch (error) {
    console.error("Error cargando últimos artículos:", error);

    contenedor.innerHTML = `

            <p class="articles-error">

                No se pudieron cargar
                los últimos artículos.

            </p>

        `;
  }
}
