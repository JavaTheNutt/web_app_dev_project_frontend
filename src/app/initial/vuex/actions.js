// noinspection JSUnusedGlobalSymbols
const Logger = require('loglevel');
const firebase = require('firebase');

export const a_logInUser = ({state, dispatch}, user) =>{
  Logger.info(`login user action attempting to sign in`);
  Logger.info(`user: ${JSON.stringify(user)}`);
  firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(err =>{
    Logger.warn('firebase sign in failed');
    Logger.error(`Error signing in with firebase: ${err}`);
    state.errorMessage = err;
  });
  dispatch('a_authStateChangedObserver');
};
export const a_authStateChangedObserver = ({commit}) =>{
  Logger.info(`add observer called`);
  firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      Logger.info(`user logged in`);
      Logger.info(`attempting to commit logged in user`);
      Logger.info(`user to be committed: ${JSON.stringify(user)}`);
      return commit('m_logInUser', {data:user});
    }
    Logger.info(`user logged out`);
    Logger.info(`attempting to commit 'logOutUser'`);
    return commit('m_logOutUser');
  })
};
