const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-btn');
const genreSelect = document.getElementById('genre-select');
const animeContainer = document.getElementById('anime-container');

// Populate genre dropdown
const genres = [
    'Action', 'Adventure','Cars','Comedy','Dementia','Demons','Drama','Fantasy','Game','Historical','Horror','Josei','Kids',
    'Magic','Martial Arts','Mecha','Military','Music','Mystery','Parody','Police','Psychological','Romance','Samurai','School',
    'Sci-Fi','Seinen','Shoujo','Shoujo Ai','Shounen','Shounen Ai','Slice of Life','Space','Sports','Super Power','Supernatural',
    'Thriller','Vampire',
];

// Populate the dropdown with genres
genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
});

// Add hover and bold effect using CSS
genreSelect.addEventListener('mouseover', (event) => {
    if (event.target.tagName === 'OPTION') {
        event.target.style.fontWeight = 'bold';
    }
});

genreSelect.addEventListener('mouseout', (event) => {
    if (event.target.tagName === 'OPTION') {
        event.target.style.fontWeight = 'normal';
    }
});

// Handle genre selection
// genreSelect.addEventListener('change', async () => {
//     const genre = genreSelect.value;
//     if (genre) {
//         localStorage.removeItem('searchQuery'); // Clear previous search query
//         localStorage.setItem('selectedGenre', genre);
//         window.location.href = 'anime-detail.html';
//         const animeList = await fetchAnime(genre);
//         displayAnime(animeList);
//     }
// });

// Handle genre selection
genreSelect.addEventListener('change', async () => {
    const genre = genreSelect.value;
    if (genre) {
        localStorage.removeItem('searchQuery'); // Clear previous search query
        localStorage.setItem('selectedGenre', genre);
        window.location.href = 'anime-detail.html';
    }
});

async function fetchAnime(genre) {
    const response = await fetch(`https://graphql.anilist.co`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
            query ($genre: String) {
                Page {
                    media(genre: $genre, type: ANIME) {
                        id
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            large
                        }
                    }
                }
            }`,
            variables: { genre: genre }
        })
    });
    const json = await response.json();
    return json.data.Page.media;
}

function displayAnime(animeList) {
    animeContainer.innerHTML = ''; // Clear previous content
    animeList.forEach(anime => {
        const item = document.createElement('div');
        item.className = 'anime-item';
        item.innerHTML = `
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            <h3>${anime.title.romaji} (${anime.title.english})</h3>
        `;
        animeContainer.appendChild(item);
    });
}

let debounceTimeout;
searchInput.addEventListener('keyup', (event) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        if (event.key === 'Enter') {
            const query = searchInput.value;
            if (query) {
                localStorage.removeItem('selectedGenre'); // Clear previous genre selection
                localStorage.setItem('searchQuery', query);
                window.location.href = 'anime-detail.html';
            }
        }
    }, 300); // Adjust the debounce delay as needed
});

// Handle search button click
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        localStorage.removeItem('selectedGenre'); // Clear previous genre selection
        localStorage.setItem('searchQuery', query);
        window.location.href = 'anime-detail.html';
    }
});

// Handle Enter key press in search input
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value;
        if (query) {
            localStorage.removeItem('selectedGenre'); // Clear previous genre selection
            localStorage.setItem('searchQuery', query);
            window.location.href = 'anime-detail.html';
        }
    }
});

// Handle genre selection
genreSelect.addEventListener('change', () => {
    const genre = genreSelect.value;
    if (genre) {
        localStorage.removeItem('searchQuery'); // Clear previous search query
        localStorage.setItem('selectedGenre', genre);
        window.location.href = 'anime-detail.html';
    }
});
