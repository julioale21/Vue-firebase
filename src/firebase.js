import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCNENlQ8dU_6bZf2YPjvp-1Hdltsj8dZwA",
  authDomain: "vuetalk-27530.firebaseapp.com",
  projectId: "vuetalk-27530",
  storageBucket: "vuetalk-27530.appspot.com",
  messagingSenderId: "860432275730",
  appId: "1:860432275730:web:381df4abf2ea28b7fc3bcb"
};

firebase.initializeApp(firebaseConfig);

export const fb = firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();