async function searchAnime(query) {
    const url = `${BASE_URL}/anime?q=${query}`;

    // Mostramos el mensaje de carga mientras obtenemos los resultados
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = `<p>Cargando resultados...</p>`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('No se pudieron obtener los animes');
        }

        // Obtener los datos de la respuesta
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            displaySearchResults(data.data);  // Función para mostrar los resultados
        } else {
            searchResultsContainer.innerHTML = '<p>No hay resultados.</p>';
        }
    } catch (error) {
        searchResultsContainer.innerHTML = `<p>Error al obtener los resultados: ${error.message}</p>`;
    }
}


// Función para mostrar los resultados de la búsqueda
function displaySearchResults(animes) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';  // Limpiar los resultados anteriores

    // Configuración del contenedor
    searchResultsContainer.style.display = 'flex';
    searchResultsContainer.style.flexWrap = 'wrap';
    searchResultsContainer.style.justifyContent = 'center';  // Centra los items en el contenedor
    searchResultsContainer.style.alignItems = 'stretch';  // Alineación superior para los items
    searchResultsContainer.style.gap = '10px';  // Espaciado entre los elementos
    searchResultsContainer.style.padding = '10px';  // Ajuste de padding

    // Iteración sobre los animes para mostrarlos
    animes.forEach(anime => {
        const animeItem = document.createElement('div');
        animeItem.classList.add('anime-item');  // Aplica estilos a cada item
        animeItem.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <div class="anime-title">${anime.title}</div>
        `;

        // Ajustes directos a los estilos del item
        animeItem.style.flex = '1 0 150px';  // Tamaño flexible pero no menor a 150px
        animeItem.style.maxWidth = '180px';  // Ancho máximo de 180px para no ser demasiado anchos
        animeItem.style.minWidth = '150px';  // Ancho mínimo de 150px
        animeItem.style.marginBottom = '15px';  // Espacio debajo de cada item
        animeItem.style.textAlign = 'center';  // Centrar el texto dentro del item

        // Ajustes directos a las imágenes para que no sean demasiado grandes
        const img = animeItem.querySelector('img');
        img.style.width = '100%';  // La imagen ocupa todo el ancho del item
        img.style.minHeight = 'automáticamente';  // Limita la altura de la imagen para no ser demasiado grande
        img.style.objectFit = 'cover';  // Hace que la imagen se ajuste al contenedor sin distorsionarse

        // Ajustar el tamaño del título para hacerlo más visible
        const title = animeItem.querySelector('.anime-title');
        title.style.fontSize = '14px';  // Aumentar el tamaño de la fuente
        title.style.fontWeight = 'bold';  // Hacer el título en negrita
        title.style.color = '#333';  // Color oscuro para el texto

        animeItem.onclick = () => openModal(anime);

        // Añadir el item al contenedor de resultados
        searchResultsContainer.appendChild(animeItem);
    });
}

// Detectar cuando el usuario escriba en el campo de búsqueda
document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.trim();

    // Si el campo de búsqueda está vacío, ocultamos los resultados
    if (query === '') {
        document.getElementById('searchResults').style.display = 'none';
    } else {
        document.getElementById('searchResults').style.display = 'block';
        searchAnime(query);
    }
});
