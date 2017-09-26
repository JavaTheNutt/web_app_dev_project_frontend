import * as Logger from 'loglevel';
import types from './types';
import {geocodeAddress} from '@/app/services/geocoding';
export default {
  [types.actions.a_setFormValues]: ({commit}, addressDetails) =>{
    Logger.info(`action called to update add address form values, data: ${JSON.stringify(addressDetails)}`);
    commit(types.mutations.m_setFormValues, {data: addressDetails});
  },
  [types.actions.a_resetFormValues] : ({commit})=>{
    Logger.info(`action called to reset form state back to initial`);
    commit(types.mutations.m_resetFormValues)
  },
  [types.actions.a_fetchResults] : async ({commit, dispatch}, address) => {
    Logger.info(`action called to fetch geocoded results`);
    try {
      const geocodeResults = await geocodeAddress(address);
      Logger.info(`results assumed fetched`);
      commit(types.mutations.m_setResults, {data: geocodeResults})
    } catch (e) {
      Logger.error(`error fetching results`);
    }
  }
}

