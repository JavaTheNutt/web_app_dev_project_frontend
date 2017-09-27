import * as Logger from 'loglevel';
import types from './types';
import {geocodeAddress} from '@/app/services/geocoding';

export default {
  [types.actions.a_setFormValues]: ({commit}, addressDetails) => {
    Logger.info(`action called to update add address form values, data: ${JSON.stringify(addressDetails)}`);
    commit(types.mutations.m_setFormValues, {data: addressDetails});
  },
  [types.actions.a_resetFormValues]: ({commit}) => {
    Logger.info(`action called to reset form state back to initial`);
    commit(types.mutations.m_resetFormValues)
  },
  [types.actions.a_fetchResults]: async ({commit, dispatch}, address) => {
    dispatch(types.actions.a_setFormValues, address);
    Logger.info(`action called to fetch geocoded results`);
    try {
      const geocodeResults = await geocodeAddress(address);
      Logger.info(`results assumed fetched`);
      if(geocodeResults.data.results.length === 1){
        Logger.info(`exactly one result returned from geocode operation`);
        const formattedResults = geocodeResults.data.results.map((address) => {
          return {
            geo: address.geometry.location,
            text: address.formatted_address
          }
        });
        commit(types.mutations.m_setSelectedAddress, {selectedAddress: formattedResults});
        commit(types.mutations.setResults, {data:[]});
        return;
      }
      commit(types.mutations.m_setResults, {data: geocodeResults.data.results});
      commit(types.mutations.m_setSelectedAddress, {selectedAddress: {}});
    } catch (e) {
      Logger.error(`error fetching results`);
    }
  },
  [types.actions.a_setSelectedAddress]: ({commit}, selectedAddress) => {
    Logger.info(`action called to set requested address`);
    commit(types.mutations.m_setSelectedAddress, {selectedAddress})
  },
  [types.actions.a_resetSelectedAddress]:({commit}) =>{
    Logger.info(`action called to reset selected address`);
    commit(types.mutations.m_setSelectedAddress, {selectedAddress: {}})
  },
  [types.actions.a_setRoutePrefix]:({commit}, prefix)=>{
    Logger.info(`action called to set the route prefix`);
    commit(types.mutations.m_setRoutePrefix, {prefix});
  },
  [types.actions.a_resetRoutePrefix]:({commit})=>{
    Logger.info(`action called to set the route prefix`);
    commit(types.mutations.m_setRoutePrefix, {prefix: ''});
  }
}

