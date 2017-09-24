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

  },
  [types.mutations.m_setNewUser](state){
    Logger.info(`mutation called to determine new user`);
    state.isNewUser = true;
  },
  [types.mutations.m_setReturningUser](state){
    Logger.info(`mutation called to set returning user`);
    state.isNewUser = false;
  }
}
