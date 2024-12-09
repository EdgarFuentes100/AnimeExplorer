
topGenreFilterElement.addEventListener('change', async (event) => {
    const selectedGenreId = event.target.value;
    await obtenerAnimesMasVistos(selectedGenreId, 1);
});

async function obtenerAnimesMasVistos(genreId, page) {
    try {
        const url = `${BASE_URL}/top/anime?page=${page}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudieron obtener los animes en emisión');
        }

        const data = await response.json();
        const lastPage = data.pagination.last_visible_page || 1;
        const hasNextPage = data.pagination.has_next_page;

        // Verificamos si hay un género seleccionado y filtramos los animes por género
        let filteredAnimes = data.data;

        if (genreId) {
            // Filtrar los animes por el mal_id del género
            filteredAnimes = data.data.filter(anime =>
                anime.genres.some(g => g.mal_id == genreId) // Verificar si el mal_id del género del anime coincide
            );
        }

        // Mostrar la lista de animes filtrados
        displayAnimeList({ data: filteredAnimes, pagination: data.pagination }, page, 'topAnimeList', 'topLoading', 'topPagination', lastPage, 'top', hasNextPage);
    } catch (error) {
        console.error('Error al obtener animes:', error);
    }
}

