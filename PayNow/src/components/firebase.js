import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCvGMHgNV4qOsoQydo1BzpsAjmzREk4pjU",
  authDomain: "micro-atm.firebaseapp.com",
  databaseURL: "https://micro-atm.firebaseio.com",
  projectId: "micro-atm",
  storageBucket: "micro-atm.appspot.com",
  messagingSenderId: "775752919402",
  appId: "1:775752919402:web:411824610d984516a1dd13",
  measurementId: "G-L7PZYSHHJN"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export { db };
