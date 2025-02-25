import {initializeApp} from "firebase/app";
import {collection, getFirestore} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const messagesCollection = collection(db, "loveMessages");
