import * as Logger from 'loglevel';
import types from './types';
export default {
  [types.mutations.m_setCountryNames](state, {data}){
    Logger.info(`set country names called`);
    Logger.info(`data: ${JSON.stringify(data)}`);
    state.countryNames = data;
  }
}
