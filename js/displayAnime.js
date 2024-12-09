// Función para manejar la visualización de los animes
function displayAnimeList(animeData, page, listId, loadingId, paginationId, lastPage, type, hasNextPage) {
    const listElement = document.getElementById(listId);
    const loadingElement = document.getElementById(loadingId);
    const paginationElement = document.getElementById(paginationId);

    listElement.innerHTML = '';  // Limpiar lista
    paginationElement.innerHTML = '';  // Limpiar paginación

    loadingElement.style.display = 'block';  // Mostrar carga

    if (animeData.data && animeData.data.length > 0) {
        animeData.data.forEach(anime => {
            const animeItem = document.createElement('div');
            animeItem.classList.add('anime-item');
            animeItem.style.flex = '1 0 150px';  // Establecer tamaño flexible
            animeItem.style.maxWidth = '180px';  // Ancho máximo
            animeItem.style.minWidth = '150px';  // Ancho mínimo
            animeItem.style.marginBottom = '15px';  // Espaciado entre los elementos
            animeItem.style.textAlign = 'center';  // Centrar el texto

            // Añadir la imagen
            const img = document.createElement('img');
            img.src = anime.images.jpg.image_url;
            img.alt = anime.title;
            img.style.width = '100%';  // Imagen en 100% de ancho
            img.style.minHeight = 'auto';  // Mantener altura proporcional
            img.style.objectFit = 'cover';  // Ajuste de la imagen sin distorsión

            // Añadir el título
            const title = document.createElement('div');
            title.classList.add('anime-title');
            title.textContent = anime.title;
            title.style.fontSize = '14px';  // Tamaño del título
            title.style.fontWeight = 'bold';  // Negrita
            title.style.color = '#333';  // Color del texto

            animeItem.appendChild(img);
            animeItem.appendChild(title);

            animeItem.onclick = () => openModal(anime);  // Función para abrir el modal (defínelo si es necesario)

            listElement.appendChild(animeItem);
        });

        // Información de la página actual
        const pageInfo = document.createElement('div');
        pageInfo.textContent = `Página ${page} de ${lastPage}`;
        paginationElement.appendChild(pageInfo);

        createPagination(paginationElement, page, lastPage, type, hasNextPage);  // Crear paginación
    } else {
        // Si no hay animes, mostrar el mensaje "No hay animes en esta página"
        const noAnimeMessage = document.createElement('div');
        noAnimeMessage.classList.add('no-anime-message');
        noAnimeMessage.innerHTML = ` 
            <div class="anime-item">
                <img src="https://via.placeholder.com/150x225.png?text=No+Anime" alt="No hay animes">
                <div class="anime-title">No hay animes en esta página.</div>
            </div>
        `;
        listElement.appendChild(noAnimeMessage);

        createPagination(paginationElement, page, lastPage, type, hasNextPage);  // Crear paginación
    }

    loadingElement.style.display = 'none';  // Ocultar el indicador de carga
}

// Función para crear la paginación
function createPagination(paginationElement, currentPage, lastPage, type, hasNextPage) {
    paginationElement.innerHTML = '';  // Limpiar los botones previos

    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination-container');  // Añadir clase CSS

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            loadNextPage(currentPage - 1, type);
        }
    };
    paginationContainer.appendChild(prevButton);

    const pageInfo = document.createElement('div');
    pageInfo.textContent = `Página ${currentPage} de ${lastPage}`;
    paginationContainer.appendChild(pageInfo);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = !hasNextPage;
    nextButton.onclick = () => {
        if (hasNextPage) {
            loadNextPage(currentPage + 1, type);
        }
    };
    paginationContainer.appendChild(nextButton);

    paginationElement.appendChild(paginationContainer);
}

// Función para cargar la siguiente página
function loadNextPage(nextPage, type) {
    if (type == "recomm") {
        obtenerAnimesEnEmision(recommGenreFilterElement.value, nextPage);
    } else if (type == "top") {
        obtenerAnimesMasVistos(topGenreFilterElement.value, nextPage);
    } else if (type == "tempo") {
        obtenerAnimesPorFiltro(tempoYearFilterElement.value, tempoSeasonFilterElement.value, nextPage);
    }
}