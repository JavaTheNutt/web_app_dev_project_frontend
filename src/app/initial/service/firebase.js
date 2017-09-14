import firebase from 'firebase';
import * as Logger from 'loglevel';
export const login = async function (username, password) {
  try {
    Logger.info('login service called');
    await firebase.auth().signInWithEmailAndPassword(username, password);
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
  }
};

export const getToken = async function(){
  if(!firebase.auth().currentUser){
    throw new Error('no user logged in');
  }
  return await firebase.auth().currentUser.getIdToken();
};

export const signUp = async function(username, password){
  try{
    Logger.info(`sign up function called in Firebase service`);
    await firebase.auth().createUserWithEmailAndPassword(username, password);
    return false;
  }catch(err){
    Logger.warn(`error creating firebase account`);
    switch(err.code){
      case 'auth/email-already-in-use':
        return 'The specified email address is already in use';
        break;
      case 'auth/invalid-email':
        return "The specified email address is invalid";
        break;
      case 'auth/weak-password':
        return 'The specified password is too weak';
      break;
      default:
        return 'An unknown error has occurred'
    }
  }
};


