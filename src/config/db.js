import Firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyAxeuoso9QajvbhBR-PHp1QBGtDntgurZs",
    authDomain: "calendar-15a12.firebaseapp.com",
    databaseURL: "https://calendar-15a12.firebaseio.com",
    projectId: "calendar-15a12",
    storageBucket: "calendar-15a12.appspot.com",
    messagingSenderId: "889081469130",
    appId: "1:889081469130:web:ff70bed09c52f3d3"
};
let app = Firebase.initializeApp(firebaseConfig)
export const db = app.database()
