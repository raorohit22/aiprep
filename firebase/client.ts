import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCjcu7x8MuTJCoFT76alSvyF88AJ8p567s",
	authDomain: "aiprep-31f59.firebaseapp.com",
	projectId: "aiprep-31f59",
	storageBucket: "aiprep-31f59.firebasestorage.app",
	messagingSenderId: "956167153208",
	appId: "1:956167153208:web:9dcbdde6f93c65870a28cd",
	measurementId: "G-T243KRDS11",
};

// Initialize Firebase
const app = getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
