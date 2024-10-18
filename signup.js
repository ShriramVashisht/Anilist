// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            alert("Sign up successful!");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("signup failed");
        });
});
