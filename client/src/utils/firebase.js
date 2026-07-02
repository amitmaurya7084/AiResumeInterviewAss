import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "interview-assistant-43d25.firebaseapp.com",
    projectId: "interview-assistant-43d25",
    storageBucket: "interview-assistant-43d25.firebasestorage.app",
    messagingSenderId: "928839257686",
    appId: "1:928839257686:web:f389f22e1735ffad43b5f7"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider } 