// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF3BwqxeDWfUmY6mDW3B6vvxRqS7d41Ks",
  authDomain: "spamdetectionapp-79bc4.firebaseapp.com",
  projectId: "spamdetectionapp-79bc4",
  storageBucket: "spamdetectionapp-79bc4.firebasestorage.app",
  messagingSenderId: "989120208153",
  appId: "1:989120208153:web:7cd80e16c48118e2633988"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
