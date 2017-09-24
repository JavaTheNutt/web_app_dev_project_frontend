// noinspection JSUnusedGlobalSymbols
import * as Logger from 'loglevel';
import firebase from 'firebase';
import bus from '../../services/bus';
import types from './types';

export default {
  [types.actions.a_logInUser]: async ({dispatch, commit}, user) => {
    Logger.info(`login user action attempting to sign in`);
    Logger.info(`user: ${JSON.stringify(user)}`);
    try {
      let currentUser = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
      commit(types.mutations.m_isReturningUser);
      Logger.info(`user signed into firebase without error`);
    } catch (err) {
      Logger.error(`error while using firebase auth`);
      bus.$emit(handleFirebaseError(err.code))
    }
    dispatch(types.actions.a_testCurrentAuthState);
  },
  [types.actions.a_testCurrentAuthState]: ({commit}) => {
    Logger.info(`testing current login state`);
    const currentUser = firebase.auth().currentUser;
    Logger.info(`current user: ${JSON.stringify(currentUser)}`);
    if (currentUser) {
      Logger.info(`user logged in`);
      return commit(types.mutations.m_logInUser); //fixme bring in mutations
    }
    Logger.info(`user not logged in`);
    commit(types.mutations.m_setReturningUser);
    return commit(types.mutations.m_logOutUser);
  },
  [types.actions.a_createNewUser]: async ({commit}, details) => {
    try {
      Logger.info(`sign up function called in Firebase service`);
      await firebase.auth().createUserWithEmailAndPassword(details.email, details.password);
      Logger.info(`user appears correctly created`);
      commit(types.mutations.m_setNewUser);
    } catch (err) {
      Logger.warn(`error creating firebase account`);
      bus.$emit('showSnack', handleFirebaseError(err.code))
    }
  },
  [types.actions.a_setAuthStateListener]: ({dispatch}) => {
    Logger.info(`attempting to set auth state listener`);
    firebase.auth().onAuthStateChanged((user) => {
      Logger.info(`auth state change triggered`);
      dispatch(types.actions.a_testCurrentAuthState)
    })

  },
  [types.actions.a_logOutUser]           :async ({dispatch}) => {
    Logger.info(`request received to log out user`);
    try {
      await firebase.auth().signOut(); //here is where the error occurs
      Logger.info(`user assumed signed out, dispatching auth change event`);
    } catch (err) {
      Logger.warn(`there was an error while signing out of firebase: ${err}`);
      bus.$emit('showSnack', handleFirebaseError(err.code))
    }
    return dispatch(types.actions.a_testCurrentAuthState);
  }
}


function handleFirebaseError(errCode) {
  switch (errCode) {
    case 'auth/user-not-found':
      return 'Email is not registered on the system';
      break;
    case 'auth/wrong-password':
      return 'Password is incorrect';
      break;
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
      return 'An unknown error has occurred '
  }
}
