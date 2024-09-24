document.addEventListener('DOMContentLoaded', async () => {
    const searchQuery = localStorage.getItem('searchQuery');
    const selectedGenre = localStorage.getItem('selectedGenre');
    const animeDetailContainer = document.getElementById('anime-detail-container');

    if (searchQuery) {
        const animeList = await fetchAnime(searchQuery);
        displayAnime(animeList);
    } else if (selectedGenre) {
        const animeList = await fetchAnimeByGenre(selectedGenre);
        displayAnime(animeList);
    } else {
        animeDetailContainer.innerHTML = '<p>No anime selected.</p>';
    }

    document.getElementById('back-button').addEventListener('click', () => {
        window.history.back();
    });
});

async function fetchAnime(query) {
    const aniListResults = await fetchAniListAnime(query);
    const jikanResults = await fetchJikanAnime(query);
    return mergeResults(aniListResults, jikanResults);
}

async function fetchAnimeByGenre(genre) {
    const aniListResults = await fetchAniListAnimeByGenre(genre);
    const jikanResults = await fetchJikanAnimeByGenre(genre);
    return mergeResults(aniListResults, jikanResults);
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

function displayAnime(animeList) {
    const animeDetailContainer = document.getElementById('anime-detail-container');
    animeDetailContainer.innerHTML = ''; // Clear previous content
    animeList.forEach(anime => {
        if (anime.type!=='ANIME') {
            return;
        }
        const item = document.createElement('div');
        item.className = 'anime-item';
        item.innerHTML = `
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            <h3>${anime.title.romaji} (${anime.title.english})</h3>
            <p>${anime.type} *${anime.episodes}</p>
            <div class="tooltip">${anime.title.romaji} (${anime.title.english})</div>
        `;
        animeDetailContainer.appendChild(item);
    });
}



async function fetchAniListAnimeByGenre(genre) {
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
                    }
                }
            }`,
            variables: { genre: genre }
        })
    });
    const json = await response.json();
    return json.data.Page.media;
}

async function fetchJikanAnime(query) {
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
}

async function fetchJikanAnimeByGenre(genre) {
    const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genre}`);
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


