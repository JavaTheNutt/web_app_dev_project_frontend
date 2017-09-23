import * as Logger from 'loglevel';
import countryListModule from 'country-list';
import types from './types';

export default {
  [types.actions.a_setCountryNames]: ({commit}) =>{
    Logger.info(`request to set countries recieved`);
    const countries = countryListModule().getNames();
    Logger.info(`countries: ${JSON.stringify(countries)}`);
    commit(types.mutations.m_setCountryNames, {data: countries});
  }
}

