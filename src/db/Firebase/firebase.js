import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, update, get, query, orderByChild, startAt, endAt } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6eQwgwwxU9-ixDUKEZgC78h6ZhZ1H44g",
  authDomain: "brocode-71f16.firebaseapp.com",
  projectId: "brocode-71f16",
  storageBucket: "brocode-71f16.firebasestorage.app",
  messagingSenderId: "1031946313429",
  appId: "1:1031946313429:web:3c9e341b9a2ee493388c5c",
  databaseURL: "https://brocode-71f16-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, set, onValue, update, get, query, orderByChild, startAt, endAt };