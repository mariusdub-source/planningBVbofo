// src/firebase.js
// ⚠️  REMPLACEZ les valeurs ci-dessous par celles de votre projet Firebase
// (voir étape 2 du guide d'installation)

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBH3p4qpET6coqgIM5e2X3MzUoyC7RAKC8",
  authDomain: "teamplannerbv.firebaseapp.com",
  databaseURL: "https://teamplannerbv-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "teamplannerbv",
  storageBucket: "bvplan.firebasestorage.app",
  messagingSenderId: "20354418536",
  appId: "1:20354418536:web:cd903554ca4b686afa38dd"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
