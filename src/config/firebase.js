import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBy3UqF_scQZwHSJsaNoEKjElK-aVdp5Fo",
  authDomain: "student-ai-portal-fb41d.firebaseapp.com",
  projectId: "student-ai-portal-fb41d",
  storageBucket: "student-ai-portal-fb41d.firebasestorage.app",
  messagingSenderId: "309157859971",
  appId: "1:309157859971:web:9df307ff823d52aae441b6",
  measurementId: "G-9V6NYE62TC"
};

// Initialize Firebase only if it hasn't been initialized yet (fixes Vite HMR duplicate app error)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
