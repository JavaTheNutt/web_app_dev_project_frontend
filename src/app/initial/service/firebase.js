import firebase from 'firebase';
import * as Logger from 'loglevel';

//todo possibly refactor this to move it to the auth store
export const signUp = async function(username, password){
  try{
    Logger.info(`sign up function called in Firebase service`);
    await firebase.auth().createUserWithEmailAndPassword(username, password);
    Logger.info(`user appears correctly created`);
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


