import firebase from 'firebase';
require('@firebase/firestore');
var firebaseConfig = {
  apiKey: "AIzaSyBlfTkWaVTb59oU59fbFpP-PE368ogYKCw",
  authDomain: "barter-2a340.firebaseapp.com",
  databaseURL: "https://barter-2a340.firebaseio.com",
  projectId: "barter-2a340",
  storageBucket: "barter-2a340.appspot.com",
  messagingSenderId: "717300177416",
  appId: "1:717300177416:web:ee2ccad7bd098d58e54fbd",
  measurementId: "G-520NGP7JD7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
export default firebase.firestore();