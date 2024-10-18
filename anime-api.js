// anime-api.js
const JIKAN_API_URL = 'https://api.jikan.moe/v4';

async function fetchAnime(query) {
    const response = await fetch(API_URL, {
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

async function fetchTrendingAnime() {
    try {
        const response = await fetch(`${JIKAN_API_URL}/top/anime`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (!json.data) {
            throw new Error('API response data is invalid or missing');
        }
        return json.data.slice(0, 10); // Get top 10 trending anime
    } catch (error) {
        console.error('Error fetching trending anime:', error);
        return []; // Return an empty array if the API request fails
    }
}

async function fetchPopularSeasonAnime() {
    try {
        const response = await fetch(`${JIKAN_API_URL}/top/anime?filter=airing`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (!json.data) {
            throw new Error('API response data is invalid or missing');
        }
        return json.data.slice(0, 10); // Get top 10 popular animes this season
    } catch (error) {
        console.error('Error fetching popular season anime:', error);
        return []; // Return an empty array if the API request fails
    }
}

async function fetchUpcomingAnime() {
    const response = await fetch(`${JIKAN_API_URL}/seasons/upcoming`);
    const json = await response.json();
    return json.data.slice(0, 10); // Get top 10 upcoming animes
}

export { fetchAnime, fetchTrendingAnime, fetchPopularSeasonAnime, fetchUpcomingAnime };