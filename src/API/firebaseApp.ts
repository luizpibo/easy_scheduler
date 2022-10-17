import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../config/firebaseconfig";

const app = getApps()[0]

if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const fireStoreApp = getFirestore(app);
export default app;
