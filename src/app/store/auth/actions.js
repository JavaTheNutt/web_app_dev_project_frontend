// noinspection JSUnusedGlobalSymbols
import * as Logger from 'loglevel';
import firebase from 'firebase';
import bus from '../../services/bus';
import types from './types';
import router from '@/router';
import axios from 'axios';
export default {
  [types.actions.a_logInUser]: async ({dispatch}, user) => {
    Logger.info(`login user action attempting to sign in`);
    Logger.info(`user: ${JSON.stringify(user)}`);
    dispatch(types.actions.a_unsetIsInitial);
    try {
      let currentUser = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
      Logger.info(`user signed into firebase without error`);
    } catch (err) {
      Logger.error(`error while using firebase auth`);
      bus.$emit(handleFirebaseError(err.code));
    }
    dispatch(types.actions.a_testCurrentAuthState);
  },
  [types.actions.a_createServerUser]: async () => {
    Logger.info(`action called to create new server user`);
    const accessToken = await firebase.auth().currentUser.getIdToken(true);
    Logger.info(`posting token: ${JSON.stringify(accessToken.toString())}`);
    const headers  = {token: accessToken};
    const serverResponse = await axios.post('http://localhost:3000/user', null, {headers});
    Logger.info(`response from server: ${JSON.stringify(serverResponse)}`);

  },
  [types.actions.a_testCurrentAuthState]: ({commit, getters, dispatch}) => {
    Logger.info(`testing current login state`);
    const currentUser = firebase.auth().currentUser;
    Logger.info(`current user: ${JSON.stringify(currentUser)}`);
    if (currentUser) {
      //Logger.info(`getters: ${JSON.stringify(getters)}`);

      if(getters[types.getters.initialLogin]){
        Logger.info(`auth handler detected initial login`);
        dispatch(types.actions.a_createServerUser);
      }
      Logger.info(`user logged in`);
      commit(types.mutations.m_setUserDetails, {
        userDetails: {
          userEmail: currentUser.email,
          firebaseUid: currentUser.uid
        }
      });
      return commit(types.mutations.m_logInUser);
    }
    Logger.info(`user not logged in`);
    router.push('/');
    return commit(types.mutations.m_logOutUser);
  },
  [types.actions.a_setIsInitial]: ({commit}) => {
    Logger.info(`action called to set is initial to true`);
    commit(types.mutations.m_setIsInitial, {isInitial: true})
  },
  [types.actions.a_unsetIsInitial]: ({commit}) => {
    Logger.info(`action called to set is initial to false`);
    commit(types.mutations.m_setIsInitial, {isInitial: false})
  },
  [types.actions.a_createNewUser]: async ({commit, dispatch}, details) => {
    dispatch(types.actions.a_setIsInitial);
    try {
      Logger.info(`sign up function called in Firebase service`);
      await firebase.auth().createUserWithEmailAndPassword(details.email, details.password);
      Logger.info(`user appears correctly created`);
      /*router.push({
        name: 'profile',
        query: {isEdit: true}
      });*/
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
  [types.actions.a_logOutUser]: async ({dispatch}) => {
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
