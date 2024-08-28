import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyB4XDRczkGQLUzCVB2EXtVx7HsP49asMts",
	authDomain: "library-app-62284.firebaseapp.com",
	projectId: "library-app-62284",
	storageBucket: "library-app-62284.appspot.com",
	messagingSenderId: "947994511381",
	appId: "1:947994511381:web:8506efcb72546b8b5ca61c",
};

const app = initializeApp(firebaseConfig);
let db = getFirestore(app);
let auth = getAuth(app); //for authentication
let storage = getStorage(app);

export { db, auth, storage };
