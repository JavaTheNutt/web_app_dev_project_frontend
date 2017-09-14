import Logger from 'loglevel';
export default {
  m_logInUser(state, {data}){
    Logger.info(`log in mutation called`);
    Logger.info(`data passed to mutation: ${JSON.stringify(data)}`);
    state.loggedIn = true;
    state.user = data.user;
  },
  m_logOutUser(state){
    Logger.info(`log out mutation called`);
    state.loggedIn = false;
    state.user = null; //fixme throws type execption for undefined
  }
}
