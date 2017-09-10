import firebase from 'firebase';
import * as Logger from 'loglevel';
export const login = async function (username, email) {
  try {
    Logger.info('login service called');
    await firebase.auth().signInWithEmailAndPassword(username, email);
    return true;
  } catch (e) {
    return false;
  }
};

export const getToken = async function(){
  if(!firebase.auth().currentUser){
    throw new Error('no user logged in');
  }
  return await firebase.auth().currentUser.getIdToken();
};


