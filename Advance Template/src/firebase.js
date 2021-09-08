// Firebase v8 imports
// import firebase from 'firebase/app'
// import 'firebase/auth'

// Firebase v9 imports
// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'


const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
})

export const auth = app.auth()

export const facebookAuthProvider = firebase.auth.FacebookAuthProvider
export const googleAuthProvider = firebase.auth.GoogleAuthProvider
export const githubAuthProvider = firebase.auth.GithubAuthProvider


export const emailAuthProvider = firebase.auth.EmailAuthProvider;
export default app