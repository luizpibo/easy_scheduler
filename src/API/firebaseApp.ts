import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../config/firebaseconfig";

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const auth = getAuth();

export default firebaseConfig;
