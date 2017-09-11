import firebase from 'firebase';
import * as Logger from 'loglevel';
export const login = async function (username, email) {
  try {
    Logger.info('login service called');
    await firebase.auth().signInWithEmailAndPassword(username, email);
    return false;
  } catch (e) {
    Logger.warn(`there was an error while authenticating: ${e}`);
    switch(e.code){
      case 'auth/user-not-found':
        return 'Email is not registered on the system';
        break;
      case 'auth/wrong-password':
        return 'Password is incorrect';
        break;
      default:
        return 'An unknown error has occurred '
    }
    //return false;
  }
};

export const getToken = async function(){
  if(!firebase.auth().currentUser){
    throw new Error('no user logged in');
  }
  return await firebase.auth().currentUser.getIdToken();
};


