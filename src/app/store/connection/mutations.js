import * as Logger from 'loglevel';
import types from './types';
export default {
  [types.mutations.m_changeOnlineStatus](state, {data}){
    Logger.info(`mutation to change application state called`);
    Logger.info(`data: ${JSON.stringify(data)}`);
    state.hasConnection = data;
  }
}
