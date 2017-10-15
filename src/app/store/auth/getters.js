import types from './types';
export default {
  [types.getters.loggedIn]: state => {return state.loggedIn},
  [types.getters.getUserEmail]: state => {return state.userDetails.userEmail},
  [types.getters.getFirebaseId]: state => {return state.userDetails.firebaseUid},
  [types.getters.getUserDetails]: state => {return state.userDetails},
  [types.getters.initialLogin]: state => {return state.initialLogin}
}
