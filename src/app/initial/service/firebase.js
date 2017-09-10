//const firebase = require('firebase');
import firebase from 'firebase';

export const login = async function (username, email) {
  try {
    await firebase.auth().signInWithEmailAndPassword(username, email);
    return true;
  } catch (e) {
    return false;
  }
};


