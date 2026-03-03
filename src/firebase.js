import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1SFPcV5LBbXsAfudv2_HgDBpxms0c95s",
    authDomain: "cachy-5edef.firebaseapp.com",
    projectId: "cachy-5edef",
    storageBucket: "cachy-5edef.firebasestorage.app",
    messagingSenderId: "1067901621037",
    appId: "1:1067901621037:web:f2b36355a44f69168839a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
