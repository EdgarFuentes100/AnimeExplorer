const BASE_URL = 'https://api.jikan.moe/v4';
const recommGenreFilterElement = document.getElementById('recommGenreFilter');
const topGenreFilterElement = document.getElementById('topGenreFilter');
// Asumimos que estos son los selectores para los filtros de Año y Temporada
const tempoYearFilterElement = document.getElementById('tempoYearFilter');
const tempoSeasonFilterElement = document.getElementById('tempoSeasonFilter');


document.addEventListener('DOMContentLoaded', function () {
    // Ejecutar la primera función inmediatamente
    obtenerGeneros();
    obtenerAnimesEnEmision(recommGenreFilterElement.value, 1);  // Página 1 por defecto
    // Ejecutar la tercera función después de 2 segundos (2000 ms)
    setTimeout(function() {
        obtenerAnimesMasVistos(topGenreFilterElement.value, 1);  // Página 1 por defecto
    }, 2000);  // 2000 milisegundos = 2 segundos

    // Ejecutar la cuarta función después de 3 segundos (3000 ms)
    setTimeout(function() {
        obtenerAnimesPorFiltro(tempoYearFilterElement.value, tempoSeasonFilterElement.value, 1);
    }, 3000);  // 3000 milisegundos = 3 segundos
});


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

document.querySelector('.close').onclick = () => {
    document.getElementById('animeModal').style.display = 'none';
};