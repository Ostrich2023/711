// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu-dZKDSBXCdnL97Lq1uxTbhRu7R1UIvo",
  authDomain: "digital-skill-wallet.firebaseapp.com",
  projectId: "digital-skill-wallet",
  storageBucket: "digital-skill-wallet.firebasestorage.app",
  messagingSenderId: "731407952694",
  appId: "1:731407952694:web:f21d4c9c88ac3cdf22a197",
  measurementId: "G-Y92RXB0L0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);