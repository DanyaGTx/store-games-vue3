import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDejbB3Du5N_Q9_e9ldb2YR45LbZsEsZPs",
  authDomain: "gamesstorevue3.firebaseapp.com",
  projectId: "gamesstorevue3",
  storageBucket: "gamesstorevue3.appspot.com",
  messagingSenderId: "495024675538",
  appId: "1:495024675538:web:a7e55f3b44d2e19ae42b0b",
};

const initializeFirebase = () => {
  initializeApp(firebaseConfig);
};

const db = getFirestore(initializeApp(firebaseConfig));

export { initializeFirebase, db };
