// Función para obtener los géneros desde la API
async function obtenerGeneros() {
    try {
        const response = await fetch(`${BASE_URL}/genres/anime`);
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de géneros');
        }
        const data = await response.json();

        // Llamamos a la función para agregar los géneros a ambos selects
        agregarGenerosAlSelect(data.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para agregar los géneros al select
function agregarGenerosAlSelect(generos) {
    const topGenreFilterElement = document.getElementById('topGenreFilter'); // Para animes más vistos
    const recommGenreFilterElemente = document.getElementById('recommGenreFilter'); // Para animes recomendados en emisión

    // Limpiar las opciones actuales
    topGenreFilterElement.innerHTML = '';
    recommGenreFilterElemente.innerHTML = '';

    // Crear una opción "Todos los géneros" al principio
    const allOption = document.createElement('option');
    allOption.value = ''; // Sin género seleccionado
    allOption.textContent = 'Todos los géneros';

    // Añadir esta opción a ambos selectores
    topGenreFilterElement.appendChild(allOption);
    recommGenreFilterElemente.appendChild(allOption.cloneNode(true));  // Clonamos la opción para el segundo select

    // Crear una opción por cada género
    generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.mal_id; // El valor será el mal_id del género
        option.textContent = genero.name; // El texto de la opción será el nombre del género

        // Añadir la opción a ambos selectores
        topGenreFilterElement.appendChild(option);
        recommGenreFilterElemente.appendChild(option.cloneNode(true));  // Clonamos la opción para el segundo select
    });
}
