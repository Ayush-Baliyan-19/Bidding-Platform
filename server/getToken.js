const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getIdToken } = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyC61I3U21SaxdHKAVm6dmlie1YqbmP-Kcs",
    authDomain: "bidding-platform-8d5dd.firebaseapp.com",
    projectId: "bidding-platform-8d5dd",
    storageBucket: "bidding-platform-8d5dd.firebasestorage.app",
    messagingSenderId: "48698662352",
    appId: "1:48698662352:web:fccb1d9647ae6334d4add5",
    measurementId: "G-VCH4VMLZ0R"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();

signInWithEmailAndPassword(auth, "staff@example.com", "staff123")
    .then(async (userCredential) => {
        const token = await userCredential.user.getIdToken();
        console.log("🔐 Your Bearer Token:\n", token);
    })
    .catch(console.error);
