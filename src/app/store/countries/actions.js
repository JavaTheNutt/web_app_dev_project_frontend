import * as Logger from 'loglevel';
import countryListModule from 'country-list';

export const a_setCountryNames = ({commit}) =>{
  Logger.info(`request to set countries recieved`);
  const countries = countryListModule().getNames();
  Logger.info(`countries: ${JSON.stringify(countries)}`);
  commit('m_setCountryNames', {data: countries});
};
