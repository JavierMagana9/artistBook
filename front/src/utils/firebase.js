// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHF5Fx-KsYZSFnSW8yylUEGx_O2N7puIo",
  authDomain: "artistbook-df38f.firebaseapp.com",
  projectId: "artistbook-df38f",
  storageBucket: "artistbook-df38f.firebasestorage.app",
  messagingSenderId: "880183471031",
  appId: "1:880183471031:web:75ac6b824013c332cb9632",
  measurementId: "G-WLTJB5YTYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;