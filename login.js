// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRJoiH_8nogGEl6MYVYeT-cbOOz-Sqyag",
    authDomain: "animelist-94508.firebaseapp.com",
    projectId: "animelist-94508",
    storageBucket: "animelist-94508.appspot.com",
    messagingSenderId: "442264457475",
    appId: "1:442264457475:web:aa3b7db3a45702523e1936",
    measurementId: "G-D3B25KY78J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Add login event
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in successfully
            console.log('Login successful:', userCredential);
            
            // Set login state in localStorage
            localStorage.setItem('isLoggedIn', 'true'); 

            // Redirect to index.html
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing in:', error);
            alert('Login failed');
        });
});
