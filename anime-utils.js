// anime-utils.js
import { auth, database } from './wishlist.js'; 
import { ref, set, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

function displayAnime(animeList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content
    animeList.forEach(anime => {
        const item = document.createElement('div');
        item.className = 'anime-item';
        item.innerHTML = `
            <div class="anime-image-container">
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" class="anime-image">
                <div class="anime-hover-details" style="display: none;">
                    <p><strong>Title:</strong> ${anime.title.romaji}</p>
                    <p><strong>Release Date:</strong> ${anime.startDate ? anime.startDate.year : 'N/A'}</p>
                    <p><strong>Status:</strong> ${anime.status}</p>
                </div>
            </div>
            <h3 class="anime-title" title="${anime.title.romaji}">${anime.title.romaji} (${anime.title.english})</h3>
            <button class="wishlist-button" data-id="${anime.id}">Add to Wishlist</button>
        `;

        // Hover effect to display details
        const hoverDetails = item.querySelector('.anime-hover-details');
        item.addEventListener('mouseover', () => {
            hoverDetails.style.display = 'block';
        });
        item.addEventListener('mouseout', () => {
            hoverDetails.style.display = 'none';
        });

        addWishlistButtonListener(item.querySelector('.wishlist-button'), anime);
        container.appendChild(item);
    });
}

function displayTrendingAnime(animeList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content
    animeList.forEach((anime, index) => {
        const item = document.createElement('div');
        item.className = 'trending-item';
        item.innerHTML = `
            <div class="anime-image-container">
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="anime-image">
                <div class="anime-hover-details" style="display: none;">
                    <p><strong>Title:</strong> ${anime.title}</p>
                    <p><strong>Release Date:</strong> ${anime.aired ? anime.aired.prop.from.year : 'N/A'}</p>
                    <p><strong>Status:</strong> ${anime.status}</p>
                </div>
            </div>
            <h3 class="anime-title" title="${anime.title}">${index + 1}. ${anime.title}</h3>
            <button class="wishlist-button" data-id="${anime.id}">Add to Wishlist</button>
        `;

        // Hover effect to display details
        const hoverDetails = item.querySelector('.anime-hover-details');
        item.addEventListener('mouseover', () => {
            hoverDetails.style.display = 'block';
        });
        item.addEventListener('mouseout', () => {
            hoverDetails.style.display = 'none';
        });

        addWishlistButtonListener(item.querySelector('.wishlist-button'), anime);
        container.appendChild(item);
    });
}

function displayPopularSeasonAnime(animeList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content
    animeList.forEach((anime, index) => {
        const item = document.createElement('div');
        item.className = 'season-item';
        item.innerHTML = `
            <div class="anime-image-container">
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="anime-image">
                <div class="anime-hover-details" style="display: none;">
                    <p><strong>Title:</strong> ${anime.title}</p>
                    <p><strong>Release Date:</strong> ${anime.aired ? anime.aired.prop.from.year : 'N/A'}</p>
                    <p><strong>Status:</strong> ${anime.status}</p>
                </div>
            </div>
            <h3 class="anime-title" title="${anime.title}">${index + 1}. ${anime.title}</h3>
            <button class="wishlist-button" data-id="${anime.id}">Add to Wishlist</button>
        `;

        // Hover effect to display details
        const hoverDetails = item.querySelector('.anime-hover-details');
        item.addEventListener('mouseover', () => {
            hoverDetails.style.display = 'block';
        });
        item.addEventListener('mouseout', () => {
            hoverDetails.style.display = 'none';
        });

        addWishlistButtonListener(item.querySelector('.wishlist-button'), anime);
        container.appendChild(item);
    });
}

function displayUpcomingAnime(animeList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content
    animeList.forEach((anime, index) => {
        const item = document.createElement('div');
        item.className = 'upcoming-item';
        item.innerHTML = `
            <div class="anime-image-container">
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="anime-image">
                <div class="anime-hover-details" style="display: none;">
                    <p><strong>Title:</strong> ${anime.title}</p>
                    <p><strong>Release Date:</strong> ${anime.aired ? anime.aired.prop.from.year : 'N/A'}</p>
                    <p><strong>Status:</strong> ${anime.status}</p>
                </div>
            </div>
            <h3 class="anime-title" title="${anime.title}">${index + 1}. ${anime.title}</h3>
            <button class="wishlist-button" data-id="${anime.id}">Add to Wishlist</button>
        `;

        // Hover effect to display details
        const hoverDetails = item.querySelector('.anime-hover-details');
        item.addEventListener('mouseover', () => {
            hoverDetails.style.display = 'block';
        });
        item.addEventListener('mouseout', () => {
            hoverDetails.style.display = 'none';
        });

        addWishlistButtonListener(item.querySelector('.wishlist-button'), anime);
        container.appendChild(item);
    });
}

function addToWishlist(anime) {
    const user = auth.currentUser;

    if (user) {
        console.log('User is authenticated:', user.uid); // Log the authenticated user ID
        const userId = user.uid;
        const wishlistRef = ref(database, `wishlists/${userId}`);

        // Ensure anime has a mal_id
        if (!anime.mal_id ) {
            console.error("Anime object is missing required properties:", anime);
            return; // Handle the error as needed
        }

        // Create an entry for the new anime by storing only the anime mal_id
        const newAnimeRef = push(wishlistRef);
        set(newAnimeRef, {
            id: anime.mal_id // Use mal_id or the property you need
        }).catch((error) => {
            console.error('Error adding to wishlist:', error);
        });
    } else {
        console.error('User is not authenticated.'); // This should show up if user is null
    }
}

// Function to add event listener to the wishlist button
function addWishlistButtonListener(button, anime) {
    button.addEventListener('click', () => {
        addToWishlist(anime);
    });
}

export { displayAnime, displayTrendingAnime, displayPopularSeasonAnime, displayUpcomingAnime };
export {addToWishlist};
