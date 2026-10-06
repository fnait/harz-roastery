import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDhD7qKlWbxlurmrGx-txlwg97LCyti2g",
  authDomain: "harz-rostery.firebaseapp.com",
  projectId: "harz-rostery",
  storageBucket: "harz-rostery.firebasestorage.app",
  messagingSenderId: "530946455753",
  appId: "1:530946455753:web:75d2fe33a2dc269e49b518",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
