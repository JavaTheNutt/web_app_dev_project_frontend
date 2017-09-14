// noinspection JSUnusedGlobalSymbols
import * as Logger from 'loglevel';
import firebase from 'firebase';
import bus from '../../services/bus';

export const a_logInUser            =  async ({dispatch}, user) => {
  Logger.info(`login user action attempting to sign in`);
  Logger.info(`user: ${JSON.stringify(user)}`);
  try {
    let currentUser = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    Logger.info(`user signed into firebase without error`);
  } catch (err) {
    Logger.error(`error while using firebase auth`);
    bus.$emit(handleFirebaseError(err.code))
  }
  dispatch('a_testCurrentAuthState');
};
export const a_testCurrentAuthState = ({commit}) => {
  Logger.info(`testing current login state`);
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    Logger.info(`user logged in`);
    return commit('m_logInUser');
  }
  Logger.info(`user not logged in`);
  return commit('m_logOutUser');
};

export const a_logOutUser           = async ({dispatch}) => {
  Logger.info(`request received to log out user`);
  try {
    await firebase.auth().signOut(); //here is where the error occurs
    Logger.info(`user assumed signed out, dispatching auth change event`);
  } catch (err) {
    Logger.warn(`there was an error while signing out of firebase: ${err}`);
    bus.$emit('showSnack', handleFirebaseError(err.code))
  }
  return dispatch('a_testCurrentAuthState');
};

function handleFirebaseError(errCode) {
  switch (errCode) {
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
