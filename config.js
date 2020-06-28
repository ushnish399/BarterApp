import firebase from 'firebase';
require('@firebase/firestore');
var firebaseConfig = {
    apiKey: "AIzaSyDw2bBH6LJvH9AGMkJZjrHpWSR0Wi4vpPM",
    authDomain: "barter-app-4ea95.firebaseapp.com",
    databaseURL: "https://barter-app-4ea95.firebaseio.com",
    projectId: "barter-app-4ea95",
    storageBucket: "barter-app-4ea95.appspot.com",
    messagingSenderId: "46685752121",
    appId: "1:46685752121:web:f645b0b8ba541a2982b6e8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();