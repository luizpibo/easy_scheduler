import { getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firestore = getFirestore(getApp());

export default firestore