import * as Logger from 'loglevel';

export default {
  m_setCountryNames(state, {data}){
    Logger.info(`set country names called`);
    Logger.info(`data: ${JSON.stringify(data)}`);
    //fixme data is undefined
    state.countryNames = data;
  }
}