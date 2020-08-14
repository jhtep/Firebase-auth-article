import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { functions } from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBPbQDoRUGzRg9fvCoLCAeXrqJxFZqUP8I',
  authDomain: 'fire-project-661ba.firebaseapp.com',
  databaseURL: 'https://fire-project-661ba.firebaseio.com',
  projectId: 'fire-project-661ba',
  storageBucket: 'fire-project-661ba.appspot.com',
  messagingSenderId: '258780333028',
  appId: '1:258780333028:web:6398be3ad1d3c7aae0fdf1',
  measurementId: 'G-DJ80M765YL',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();

    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error('Error fetching user', error);
  }
};
