import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRJoiH_8nogGEl6MYVYeT-cbOOz-Sqyag",
    authDomain: "animelist-94508.firebaseapp.com",
    projectId: "animelist-94508",
    storageBucket: "animelist-94508.appspot.com",
    messagingSenderId: "442264457475",
    appId: "1:442264457475:web:aa3b7db3a45702523e1936",
    measurementId: "G-D3B25KY78J",
    databaseURL: "https://animelist-94508-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(); // Make sure you're exporting this
export const database = getDatabase();

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const wishlistContainer = document.getElementById('wishlist-container');
    console.log('Wishlist container:', wishlistContainer); // Log the container
    if (!wishlistContainer) {
        console.error('Wishlist container not found!');
        return;
    }


    // Listen to authentication state changes and fetch wishlist if user is logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchAnimeDetails(); // Fetch the wishlist when user is logged in
        } else {
            console.log('User is not logged in');
            displayErrorMessage('You are not logged in. Please log in to view your wishlist.');
        }
    });
});


async function fetchAnimeDetails() {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid; // Get user's unique ID
        const wishlistRef = ref(database, `wishlists/${userId}`);

        // Show a loading message while fetching data
        displayLoadingMessage('Fetching your wishlist...');

        try {
            const snapshot = await get(wishlistRef);
            if (snapshot.exists()) {
                const wishlistItems = snapshot.val();
                const animeIds = Object.values(wishlistItems).map(item => item.id); // Extract anime IDs
                displayWishlist(animeIds); // Pass the anime IDs
            } else {
                displayNoItemsMessage(); // No items found
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            displayErrorMessage('Error fetching your wishlist. Please try again later.');
        }
    } else {
        displayErrorMessage('You need to log in to view your wishlist.');
    }
}

// Helper function to add a delay between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch anime details from Jikan API for a single anime ID
async function fetchAnimeDetailsFromJikan(animeId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        
        // Check for rate limiting
        if (response.status === 429) {
            console.warn(`Rate limit hit for anime ID ${animeId}. Retrying in 2 seconds...`);
            await delay(1000);             return await fetchAnimeDetailsFromJikan(animeId); // Retry request
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch details for anime ID: ${animeId}`);
        }

        const data = await response.json();
        return data.data; // Return the anime data object
    } catch (error) {
        console.error(`Error fetching details for anime ID ${animeId}:`, error);
        return null; // Return null if there’s an error
    }
}

// Function to display the wishlist by fetching anime details for each anime ID
async function displayWishlist(animeIds) {
    const wishlistContainer = document.getElementById('wishlist-container');
    wishlistContainer.innerHTML = ''; // Clear previous content

    // Fetch and display each anime detail one by one
    for (const animeId of animeIds) {
        const anime = await fetchAnimeDetailsFromJikan(animeId); // Fetch anime details
        await delay(1000); 

        if (anime && anime.title) {
            // Create a new div element for the anime
            const item = document.createElement('div');
            item.className = 'wishlist-item';
            item.innerHTML = `
                <div class="anime-image-container">
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="anime-image">
                    <div class="anime-hover-details" style="display: none;">
                        <p><strong>Title:</strong> ${anime.title}</p>
                        <p><strong>Release Date:</strong> ${anime.aired?.from?.substring(0, 10) || 'N/A'}</p>
                        <p><strong>Status:</strong> ${anime.status}</p>
                    </div>
                </div>
                <h3 class="anime-title" title="${anime.title}">${anime.title} (${anime.title_english || 'N/A'})</h3>
             
            `;
             // Hover effect to display details
        const hoverDetails = item.querySelector('.anime-hover-details');
        item.addEventListener('mouseover', () => {
            hoverDetails.style.display = 'block';
        });
        item.addEventListener('mouseout', () => {
            hoverDetails.style.display = 'none';
        });
            wishlistContainer.appendChild(item); // Add the item to the container
        } else {
            console.error('Anime object is missing title:', anime);
        }
    }
}


// Display a message when no wishlist items are found
function displayNoItemsMessage() {
    const wishlistContainer = document.getElementById('wishlist-container');
    wishlistContainer.innerHTML = `<p>No items in your wishlist yet. Add some anime to see them here!</p>`;
}

// Display an error message
function displayErrorMessage(message) {
    const wishlistContainer = document.getElementById('wishlist-container');
    wishlistContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

// Display a loading message
function displayLoadingMessage(message) {
    const wishlistContainer = document.getElementById('wishlist-container');
    wishlistContainer.innerHTML = `<p class="loading-message">${message}</p>`;
}

