
tempoYearFilterElement.addEventListener('change', async (event) => {
    const selectedYear = event.target.value;
    const selectedSeason = tempoSeasonFilterElement.value;
    await obtenerAnimesPorFiltro(selectedYear, selectedSeason, 1);
});

tempoSeasonFilterElement.addEventListener('change', async (event) => {
    const selectedYear = tempoYearFilterElement.value;
    const selectedSeason = event.target.value;
    await obtenerAnimesPorFiltro(selectedYear, selectedSeason, 1);
});

async function obtenerAnimesPorFiltro(year, season, page) {
    try {
        let url = `${BASE_URL}/seasons/`;

        // Construir la URL base según los filtros de año y temporada
        if (year && season) {
            url += `${year}/${season}`;
        } else if (year) {
            url += `${year}`;
        } else if (season) {
            url += `${season}`;
        } else {
            url += 'now'; // Si no hay filtros, obtener los animes en emisión
        }

        // Añadir el parámetro de página a la URL
        url += `?page=${page}`;

        // Hacer la solicitud a la API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudieron obtener los animes.');
        }

        // Obtener los datos de la respuesta
        const data = await response.json();
        const lastPage = data.pagination.last_visible_page || 1;
        const hasNextPage = data.pagination.has_next_page;
        console.log(url);

        // Mostrar la lista de animes
        displayAnimeList({ data: data.data, pagination: data.pagination }, page, 'tempoAnimeList', 'tempoLoading', 'tempoPagination', lastPage, 'tempo', hasNextPage);
    } catch (error) {
        console.error('Error al obtener animes:', error);
    }
}

