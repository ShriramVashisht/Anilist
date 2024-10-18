
// Constants
const animeDetailContainer = document.getElementById('anime-detail-container');
const backButton = document.getElementById('back-button');
const searchCriteria = document.getElementById('search-criteria'); // Add this constant

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    const searchQuery = localStorage.getItem('searchQuery');
    const selectedGenre = localStorage.getItem('selectedGenre');

    // Update the search criteria display
    if (searchQuery) {
        searchCriteria.textContent = `Search Results for: "${searchQuery}"`; // Display search query
        const animeList = await fetchAnime(searchQuery);
        displayAnime(animeList);
    } else if (selectedGenre) {
        searchCriteria.textContent = `Search Results for: Genre "${selectedGenre}"`; // Display selected genre
        const animeList = await fetchAnimeByGenre(selectedGenre);
        displayAnime(animeList);
    } else {
        searchCriteria.textContent = 'No search criteria provided.';
        animeDetailContainer.innerHTML = '<p>No anime selected.</p>';
    }

    backButton.addEventListener('click', () => {
        window.history.back();
    });
});

// Remaining functions (fetching and displaying anime) stay the same


// Functions
async function fetchAnime(query) {
    try {
        const aniListResults = await fetchAniListAnime(query);
        const jikanResults = await fetchJikanAnime(query);
        return mergeResults(aniListResults, jikanResults);
    } catch (error) {
        console.error('Error fetching anime:', error);
        return [];
    }
}

async function fetchAnimeByGenre(genre) {
    try {
        const aniListResults = await fetchAniListAnimeByGenre(genre);
        const jikanResults = await fetchJikanAnimeByGenre(genre);
        return mergeResults(aniListResults, jikanResults);
    } catch (error) {
        console.error('Error fetching anime by genre:', error);
        return [];
    }
}

async function fetchAniListAnime(query) {
    try {
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
                            type
                            episodes
                        }
                    }
                }`,
                variables: { search: query }
            })
        });
        const json = await response.json();
        return json.data.Page.media;
    } catch (error) {
        console.error('Error fetching AniList data:', error);
        return [];
    }
}

async function fetchAniListAnimeByGenre(genre) {
    try {
        const response = await fetch(`https://graphql.anilist.co`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                query ($genre: String) {
                    Page {
                        media(genre_in: [$genre], type: ANIME, sort: POPULARITY_DESC) {
                            id
                            title {
                                romaji
                                english
                            }
                            coverImage {
                                large
                            }
                            type
                            episodes
                        }
                    }
                }`,
                variables: { genre: genre }
            })
        });
        const json = await response.json();
        return json.data.Page.media;
    } catch (error) {
        console.error('Error fetching AniList data by genre:', error);
        return [];
    }
}

async function fetchJikanAnime(query) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
        const json = await response.json();
        return json.data.map(anime => ({
            id: anime.mal_id,
            title: {
                romaji: anime.title,
                english: anime.title_english
            },
            coverImage: {
                large: anime.images.jpg.large_image_url
            }
        }));
    } catch (error) {
        console.error('Error fetching Jikan data:', error);
        return [];
    }
}

async function fetchJikanAnimeByGenre(genre) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genre}&order_by=popularity&sort=desc`);
        const json = await response.json();
        return json.data.map(anime => ({
            id: anime.mal_id,
            title: {
                romaji: anime.title,
                english: anime.title_english
            },
            coverImage: {
                large: anime.images.jpg.large_image_url
            }
        }));
    } catch (error) {
        console.error('Error fetching Jikan data by genre:', error);
        return [];
    }
}

function mergeResults(aniListResults, jikanResults) {
    const mergedResults = [...aniListResults];
    const aniListIds = new Set(aniListResults.map(anime => anime.id));
    jikanResults.forEach(anime => {
        if (!aniListIds.has(anime.id)) {
            mergedResults.push(anime);
        }
    });
    return mergedResults;
}
function displayAnime(animeList) {
    const animeDetailContainer = document.getElementById('anime-detail-container');
    if (!animeDetailContainer) {
        console.error('Error: animeDetailContainer not found');
        return;
    }

    animeDetailContainer.innerHTML = '';
    animeList.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-detail-card'; // Class for styling
        
        // Truncate the anime title if it's too long
        const truncatedTitle = anime.title.romaji.length > 20 
            ? anime.title.romaji.slice(0, 20) + '...' 
            : anime.title.romaji;

        animeCard.innerHTML = `
            <div class="anime-image-container">
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" class="anime-image">
                <div class="anime-hover-details" style="display: none;">
                    <p><strong>Title:</strong> ${anime.title.romaji}</p>
                    <p><strong>Episodes:</strong> ${anime.episodes}</p>
                    <p><strong>Release Date:</strong> ${anime.startDate ? anime.startDate.year : 'N/A'}</p>
                    <p><strong>Status:</strong> ${anime.status ? anime.status : 'Unknown'}</p>
                </div>
            </div>
            <h2 class="anime-title" title="${anime.title.romaji}">${truncatedTitle}</h2>
            <button class="wishlist-button">Add to Wishlist</button>
        `;

        // Hover effect for showing details
        const hoverDetails = animeCard.querySelector('.anime-hover-details');
        animeCard.addEventListener('mouseover', () => {
            hoverDetails.style.display = 'block';
        });

        animeCard.addEventListener('mouseout', () => {
            hoverDetails.style.display = 'none';
        });

        // Add event listener for the "Add to Wishlist" button
        const wishlistButton = animeCard.querySelector('.wishlist-button');
        wishlistButton.addEventListener('click', () => {
            addToWishlist(anime); // Call the function to add the anime to the wishlist
        });

        animeDetailContainer.appendChild(animeCard);
    });
}