// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsoZA5FU3GFcHqcPb9nL1-zdnO2GoyYKc",
  authDomain: "geekathon-2024.firebaseapp.com",
  projectId: "geekathon-2024",
  storageBucket: "geekathon-2024.appspot.com",
  messagingSenderId: "926008022176",
  appId: "1:926008022176:web:9b1e0039995e26add4e5c5",
  measurementId: "G-T6TZCSDZ52"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
