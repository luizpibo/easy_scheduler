import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "../config/firebaseconfig";

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export default app;