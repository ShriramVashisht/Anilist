const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-btn');
const genreSelect = document.getElementById('genre-select');
const animeContainer = document.getElementById('anime-container');

// Populate genre dropdown
const genres = [
    'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 'Fantasy', 'Game',
    'Historical', 'Horror', 'Josei', 'Kids', 'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 
    'Parody', 'Police', 'Psychological', 'Romance', 'Samurai', 'School', 'Sci-Fi', 'Seinen', 'Shoujo', 'Shoujo Ai', 
    'Shounen', 'Shounen Ai', 'Slice of Life', 'Space', 'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'
];

genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
});


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

async function fetchAnime(query) {
    const response = await fetch(`https://graphql.anilist.co`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
            query ($search: String) {
                Page {
                    media(search: $search, type: ANIME) {
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
            variables: { search: query }
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

async function fetchTrendingAnime() {
    const response = await fetch(`https://api.jikan.moe/v4/top/anime`);
    const json = await response.json();
    return json.data.slice(0, 10); // Get top 10 trending anime
}

function displayTrendingAnime(animeList) {
    const trendingContainer = document.getElementById('trending-container');
    trendingContainer.innerHTML = ''; // Clear previous content
    animeList.forEach((anime, index) => {
        const item = document.createElement('div');
        item.className = 'trending-item';
        item.innerHTML = `
            <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
            <h3>${index + 1}. ${anime.title}</h3>
        `;
        trendingContainer.appendChild(item);
    });
}

// Horizontal scrolling
document.getElementById('trending-next-btn').addEventListener('click', () => {
    const trendingContainer = document.getElementById('trending-container');
    trendingContainer.scrollBy({ left: 200, behavior: 'smooth' });
});

document.getElementById('trending-prev-btn').addEventListener('click', () => {
    const trendingContainer = document.getElementById('trending-container');
    trendingContainer.scrollBy({ left: -200, behavior: 'smooth' });
});

// Fetch and display trending anime on page load
fetchTrendingAnime().then(displayTrendingAnime);
