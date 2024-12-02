const BASE_URL = 'https://api.jikan.moe/v4';
let topPage = 1;
let recommPage = 1;

// Función para obtener los datos de animes
function fetchAnimeData(endpoint, page, genre, callback) {
    let url = `${BASE_URL}/${endpoint}?page=${page}`;
    if (genre) {
        url += `&genres=${genre}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => callback(data, page))
        .catch(error => {
            console.error('Error al obtener los animes:', error);
            document.getElementById('topAnimeSection').innerHTML = '<p class="error">No se pudo cargar la lista de animes.</p>';
        });
}
// Función para obtener los géneros desde la API
async function fetchGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genres/anime`);  // Realizamos la solicitud a la API.
        const data = await response.json();

        // Extraer los géneros de la respuesta
        const genres = data.data.map(genre => ({
            value: genre.mal_id,   // ID del género, por ejemplo, "1" para Action
            label: genre.name,     // Nombre del género, por ejemplo, "Action"
        }));

        // Llamar a la función para actualizar el select con los géneros
        updateGenreOptions(genres);
    } catch (error) {
        console.error('Error al obtener los géneros:', error);
    }
}

// Función para actualizar las opciones del select
// Función para actualizar las opciones del select
function updateGenreOptions(genres) {
    const selectElement = document.getElementById('topGenreFilter'); // Para animes más vistos
    const selectElement2 = document.getElementById('recommGenreFilter'); // Para animes recomendados en emisión

    // Limpiar las opciones actuales
    selectElement.innerHTML = '';
    selectElement2.innerHTML = '';

    // Crear una opción "Todos los géneros" al principio
    const allOption = document.createElement('option');
    allOption.value = ''; // Sin género seleccionado
    allOption.textContent = 'Todos los géneros';

    // Añadir esta opción a ambos selectores
    selectElement.appendChild(allOption);
    selectElement2.appendChild(allOption.cloneNode(true));  // Clonamos la opción para el segundo select

    // Crear una opción por cada género
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.value;
        option.textContent = genre.label;

        // Añadir la opción a ambos selectores
        selectElement.appendChild(option);
        selectElement2.appendChild(option.cloneNode(true));  // Clonamos la opción para el segundo select
    });
}

// Llamar a la función para obtener los géneros cuando la página esté cargada
document.addEventListener('DOMContentLoaded', fetchGenres);


// Función para actualizar la lista de animes
function updateAnimeList(animeData, page, listId, loadingId, paginationId, lastPage, type) {
    const listElement = document.getElementById(listId);
    const loadingElement = document.getElementById(loadingId);
    const paginationElement = document.getElementById(paginationId);

    listElement.innerHTML = ''; // Limpiar lista de animes antes de agregar los nuevos
    paginationElement.innerHTML = ''; // Limpiar paginación antes de agregar la nueva

    if (animeData && animeData.data.length > 0) {
        animeData.data.forEach(anime => {
            const animeItem = document.createElement('div');
            animeItem.classList.add('anime-item');
            animeItem.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <div class="anime-title">${anime.title}</div>
            `;
            animeItem.onclick = () => openModal(anime);

            listElement.appendChild(animeItem);
        });

        // Mostrar la cantidad total de páginas
        const pageInfo = document.createElement('div');
        pageInfo.textContent = `Página ${page} de ${lastPage}`;
        paginationElement.appendChild(pageInfo);

        // Llamada a la función que maneja la paginación
        createPagination(paginationElement, page, lastPage, type);
    } else {
        // Si no hay animes, mostrar un mensaje especial
        const noAnimeMessage = document.createElement('div');
        noAnimeMessage.classList.add('no-anime-message');
        noAnimeMessage.innerHTML = `
            <div class="anime-item">
                        <img src="https://via.placeholder.com/150x225.png?text=No+Anime" alt="No hay animes">
                <div class="anime-title">No hay animes en esta página.</div>
            </div>
        `;
        listElement.appendChild(noAnimeMessage);

        // Mostrar la paginación incluso si no hay animes, para que el usuario pueda navegar a otras páginas
        createPagination(paginationElement, page, lastPage, type);
    }

    loadingElement.style.display = 'none';
}


// Función para crear la paginación


function scrollToStart() {
    const listElement = document.querySelector('#topAnimeList');  // Asegúrate de que sea el contenedor correcto
    const listElement1 = document.querySelector('#recommAnimeList');  // Asegúrate de que sea el contenedor correcto

    listElement.scrollLeft = 0;  // Mueve el scroll horizontal al principio
    listElement1.scrollLeft = 0;  // Mueve el scroll horizontal al principio
}
// Función para mostrar el modal con detalles del anime
function openModal(anime) {
    document.getElementById('animeTitleModal').textContent = anime.title;
    document.getElementById('animeImageModal').src = anime.images.jpg.image_url;
    document.getElementById('animeSynopsis').textContent = anime.synopsis;
    document.getElementById('animeSeasons').textContent = anime.seasons || 'Desconocido';
    document.getElementById('animeEpisodes').textContent = anime.episodes || 'Desconocido';
    document.getElementById('animeRating').textContent = anime.rating || 'Desconocido';

    // Mostrar los géneros del anime
    const genres = anime.genres.map(genre => genre.name).join(', ') || 'Desconocido';
    document.getElementById('animeGenre').textContent = genres;

    document.getElementById('animeModal').style.display = 'block';
}


// Función para cerrar el modal
document.querySelector('.close').onclick = () => {
    document.getElementById('animeModal').style.display = 'none';
};

// Nueva función para cargar la siguiente página y manejar la paginación automáticamente
function loadNextPage(nextPage, type) {
    // Determinar si la página siguiente tiene datos
    if (type === 'top') {
        fetchTopAnime(nextPage);
    } else {
        fetchRecommAnime(nextPage);
    }
}
// Función para obtener los animes más vistos
function fetchTopAnime(page) {
    const genre = document.getElementById('topGenreFilter').value;  // Obtener el género seleccionado
    let url = `${BASE_URL}/top/anime?page=${page}`;

    // Realizamos la petición para obtener los animes más vistos
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const lastPage = data.pagination.last_visible_page; // Última página disponible
            const pageCurrent = data.pagination.current_page; // Página actual

            // Guardar la última página consultada
            lastPageTop = lastPage;

            // Si la respuesta no tiene datos, mostrar el mensaje "No hay animes en esta página"
            if (data.data && data.data.length === 0) {
                console.log('No hay animes en esta página');
                const listElement = document.getElementById('topAnimeList');
                const paginationElement = document.getElementById('topPagination');
                const loadingElement = document.getElementById('topLoading');

                // Limpiar los elementos de la página
                listElement.innerHTML = '';
                paginationElement.innerHTML = '';

                // Mostrar el mensaje de "No hay animes en esta página"
                const noAnimeMessage = document.createElement('div');
                noAnimeMessage.classList.add('no-anime-message');
                noAnimeMessage.innerHTML = `
                    <div class="anime-item">
                        <img src="https://via.placeholder.com/150x225.png?text=No+Anime" alt="No hay animes">
                        <div class="anime-title">No hay animes en esta página.</div>
                    </div>
                `;
                listElement.appendChild(noAnimeMessage);

                // Mostrar la paginación sin bloqueos
                createPagination(paginationElement, pageCurrent, lastPage, 'top');

                // Ocultar el indicador de carga
                loadingElement.style.display = 'none';
                return; // Salir de la función ya que no hay animes en esta página
            }

            // Filtramos los animes por género si se ha seleccionado uno
            let filteredData = data.data; // Todos los animes inicialmente

            if (genre) {
                // Filtrar los animes por el mal_id del género
                filteredData = data.data.filter(anime =>
                    anime.genres.some(g => g.mal_id == genre) // Verificar si el mal_id del género del anime coincide
                );
            }

            // Si no hay datos filtrados, mostramos el mensaje de "No hay animes"
            if (filteredData.length === 0) {
                console.log('No hay animes con el género seleccionado en esta página');
                const listElement = document.getElementById('topAnimeList');
                const paginationElement = document.getElementById('topPagination');
                const loadingElement = document.getElementById('topLoading');

                // Limpiar los elementos de la página
                listElement.innerHTML = '';
                paginationElement.innerHTML = '';

                // Mostrar el mensaje de "No hay animes"
                const noAnimeMessage = document.createElement('div');
                noAnimeMessage.classList.add('no-anime-message');
                noAnimeMessage.innerHTML = `
                    <div class="anime-item">
                        <img src="https://via.placeholder.com/150x225.png?text=No+Anime" alt="No hay animes">
                        <div class="anime-title">No hay animes en esta página.</div>
                    </div>
                `;
                listElement.appendChild(noAnimeMessage);

                // Mostrar la paginación sin bloqueos
                createPagination(paginationElement, page, lastPage, 'top');

                // Ocultar el indicador de carga
                loadingElement.style.display = 'none';
                return; // Salir de la función ya que no hay animes
            }

            // Actualizamos la lista con los animes filtrados
            updateAnimeList(
                { data: filteredData, pagination: data.pagination },
                pageCurrent,
                'topAnimeList',
                'topLoading',
                'topPagination',
                lastPage,
                'top'
            );
        })
        .catch(error => {
            console.error('Error al obtener los animes más vistos:', error);
            document.getElementById('topAnimeSection').innerHTML = '<p class="error">No se pudo cargar la lista de los animes más vistos.</p>';
        });
}

function fetchRecommAnime(page) {
    const genre = document.getElementById('recommGenreFilter').value; // Género seleccionado (mal_id)
    let url = `${BASE_URL}/seasons/now?page=${page}`;

    // Realizamos la petición para obtener los animes recomendados en emisión
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const lastPage = data.pagination.last_visible_page; // Última página disponible
            const pageCurrent = data.pagination.current_page; // Página actual

            // Guardar la última página consultada
            lastPageRecomm = lastPage;

            // Si la respuesta no tiene datos, mostrar el mensaje "No hay animes en esta página"
            if (data.data && data.data.length === 0) {
                console.log('No hay animes en esta página');
                const listElement = document.getElementById('recommAnimeList');
                const paginationElement = document.getElementById('recommPagination');
                const loadingElement = document.getElementById('recommLoading');

                // Limpiar los elementos de la página
                listElement.innerHTML = '';
                paginationElement.innerHTML = '';

                // Mostrar el mensaje de "No hay animes en esta página"
                const noAnimeMessage = document.createElement('div');
                noAnimeMessage.classList.add('no-anime-message');
                noAnimeMessage.innerHTML = `
                    <div class="anime-item">
                        <img src="https://via.placeholder.com/150x225.png?text=No+Anime" alt="No hay animes">
                        <div class="anime-title">No hay animes en esta página.</div>
                    </div>
                `;
                listElement.appendChild(noAnimeMessage);

                // Mostrar la paginación sin bloqueos
                createPagination(paginationElement, pageCurrent, lastPage, 'recomm');

                // Ocultar el indicador de carga
                loadingElement.style.display = 'none';
                return; // Salir de la función ya que no hay animes en esta página
            }

            // Filtramos los animes por género si se ha seleccionado uno
            let filteredData = data.data; // Todos los animes inicialmente

            if (genre) {
                // Filtrar los animes por el mal_id del género
                filteredData = data.data.filter(anime =>
                    anime.genres.some(g => g.mal_id == genre) // Verificar si el mal_id del género del anime coincide
                );
            }

            // Si no hay datos filtrados, simplemente mostramos el mensaje de "No hay animes"
            if (filteredData.length === 0) {
                console.log('No hay animes con el género seleccionado en esta página');
                const listElement = document.getElementById('recommAnimeList');
                const paginationElement = document.getElementById('recommPagination');
                const loadingElement = document.getElementById('recommLoading');

                // Limpiar los elementos de la página
                listElement.innerHTML = '';
                paginationElement.innerHTML = '';

                // Mostrar el mensaje de "No hay animes"
                const noAnimeMessage = document.createElement('div');
                noAnimeMessage.classList.add('no-anime-message');
                noAnimeMessage.innerHTML = `
                    <div class="anime-item">
                        <img src="https://via.placeholder.com/150x225.png?text=No+Anime" alt="No hay animes">
                        <div class="anime-title">No hay animes en esta página.</div>
                    </div>
                `;
                listElement.appendChild(noAnimeMessage);

                // Mostrar la paginación sin bloqueos
                createPagination(paginationElement, page, lastPage, 'recomm');

                // Ocultar el indicador de carga
                loadingElement.style.display = 'none';
                return; // Salir de la función ya que no hay animes
            }

            // Actualizamos la lista con los animes filtrados
            updateAnimeList(
                { data: filteredData, pagination: data.pagination },
                pageCurrent,
                'recommAnimeList',
                'recommLoading',
                'recommPagination',
                lastPage,
                'recomm'
            );
        })
        .catch(error => {
            console.error('Error al obtener los animes recomendados:', error);
            document.getElementById('recommAnimeSection').innerHTML = '<p class="error">No se pudo cargar la lista de los animes recomendados.</p>';
        });
}


function createPagination(paginationElement, currentPage, lastPage, type) {
    // Limpiar los botones previos de paginación antes de agregar los nuevos
    paginationElement.innerHTML = '';

    // Botón de "Anterior"
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1; // Deshabilitar si es la primera página
    prevButton.onclick = () => {
        if (currentPage > 1) {
            if (type === 'top') {
                fetchTopAnime(currentPage - 1);
            } else {
                fetchRecommAnime(currentPage - 1);
            }
        }
    };
    paginationElement.appendChild(prevButton);

    // Botón de "Siguiente"
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage === lastPage; // Deshabilitar si es la última página
    nextButton.onclick = () => {
        if (currentPage < lastPage) {
            loadNextPage(currentPage + 1, type);
        }
    };
    paginationElement.appendChild(nextButton);

    // Información de la página actual
    const pageInfo = document.createElement('div');
    pageInfo.textContent = `Página ${currentPage} de ${lastPage}`;
    paginationElement.appendChild(pageInfo);
}


// Cargar los animes más vistos y recomendados al inicio
fetchTopAnime(topPage);
fetchRecommAnime(recommPage);

// Detectar cambios en el filtro de género y volver a cargar las listas
document.getElementById('topGenreFilter').addEventListener('change', () => fetchTopAnime(topPage));
document.getElementById('recommGenreFilter').addEventListener('change', () => fetchRecommAnime(recommPage));