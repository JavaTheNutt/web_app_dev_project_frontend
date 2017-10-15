import Logger from 'loglevel';
import types from './types';
export default {
  [types.mutations.m_logInUser](state){
    Logger.info(`log in mutation called`);
    state.loggedIn = true;
    /*I was passing the reference to the firebase object, which was being changed by firebase, causing errors. For an array, use state.something = something.slice()*/
    //state.user = Object.assign({}, data); //https://stackoverflow.com/a/44076328/4108556. I was
  },
  [types.mutations.m_logOutUser](state){
    Logger.info(`log out mutation called`);
    state.loggedIn = false;
    state.userDetails = {userEmail: '', firebaseUid: ''}
  },
  [types.mutations.m_setUserDetails](state, {userDetails}){
    Logger.info(`mutation called to add user details to state. User details: ${JSON.stringify(userDetails)}`);
    state.userDetails.userEmail = userDetails.userEmail;
    state.userDetails.firebaseUid = userDetails.firebaseUid;
  },
  [types.mutations.m_setIsInitial](state, {isInitial}){
    Logger.info(`mutattion called to set is initial to ${isInitial}`);
    state.initialLogin = isInitial;
  },
  [types.mutations.m_setPreferredHomepage](state, {preferredHomepage}){
    Logger.info(`mutation called to update preferred homepage`);
    state.preferredHomePage = preferredHomepage;
  }
}
