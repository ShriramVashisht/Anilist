// index.js
import { fetchAnime, fetchTrendingAnime, fetchPopularSeasonAnime, fetchUpcomingAnime } from './anime-api.js';
import { displayAnime, displayTrendingAnime, displayPopularSeasonAnime, displayUpcomingAnime } from './anime-utils.js';

// Fetch and display trending anime on page load
fetchTrendingAnime().then(animeList => displayTrendingAnime(animeList, 'trending-container'));

// Fetch and display popular animes this season on page load
fetchPopularSeasonAnime().then(animeList => displayPopularSeasonAnime(animeList, 'season-container'));

// Fetch and display upcoming animes on page load
fetchUpcomingAnime().then(animeList => displayUpcomingAnime(animeList, 'upcoming-container'));

// Handle search input
const searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value;
        if (query) {
            const animeList = await fetchAnime(query);
            displayAnime(animeList, 'anime-container');
        }
    }
});

// Handle search button click
const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        const animeList = await fetchAnime(query);
        displayAnime(animeList, 'anime-container');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const profileIcon = document.getElementById('profile-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const logoutButton = document.getElementById('logout-btn');

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
        authButtons.style.display = 'none'; // Hide the login/signup buttons
        userProfile.style.display = 'block'; // Show the user profile icon
    }

    // Toggle dropdown menu on profile icon click
    profileIcon.addEventListener('click', () => {
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block'; // Toggle dropdown visibility
    });

    // // Logout functionality
    // logoutButton.addEventListener('click', (e) => {
    //     e.preventDefault(); // Prevent default anchor behavior
    //     signOut(auth) // Use the signOut method from Firebase Auth
    //         .then(() => {
    //             console.log('User signed out successfully');
    //             localStorage.removeItem('isLoggedIn'); // Remove the login state
    //             authButtons.style.display = 'block'; // Show the login/signup buttons
    //             userProfile.style.display = 'none'; // Hide the user profile icon
    //             window.location.reload(); // Reload the page to update UI
    //         })
    //         .catch((error) => {
    //             console.error('Error signing out:', error);
    //         });
    // });

});



