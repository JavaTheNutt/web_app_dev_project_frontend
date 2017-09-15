import * as Logger from 'loglevel';
export default {
  m_changeOnlineStatus(state, {data}){
    Logger.info(`mutation to change application state called`);
    Logger.info(`data: ${JSON.stringify(data)}`);
    state.hasConnection = data;
  }
}
