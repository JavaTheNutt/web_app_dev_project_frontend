import Logger from 'loglevel';
export default {
  m_logInUser(state){
    Logger.info(`log in mutation called`);
    state.loggedIn = true;
    /*I was passing the reference to the firebase object, which was being changed by firebase, causing errors. For an array, use state.something = something.slice()*/
    //state.user = Object.assign({}, data); //https://stackoverflow.com/a/44076328/4108556. I was
  },
  m_logOutUser(state){
    Logger.info(`log out mutation called`);
    state.loggedIn = false;

  }
}
