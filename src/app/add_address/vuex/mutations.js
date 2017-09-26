import * as Logger from 'loglevel';
import types from './types';
export default{
  [types.mutations.m_setFormValues](state, {data}) {
    Logger.info(`request to mutate state for add address form recieved, form data: ${JSON.stringify(data)}`);
    state.formValues.address1 = data.address1 || '';
    state.formValues.address2 = data.address2 || '';
    state.formValues.address3 = data.address3 || '';
    state.formValues.country = data.country || '';
  },
  [types.mutations.m_setResults](state, {data}){
    Logger.info(`mutation recieved to add geocode results to state`);
    state.possibleAddresses = data;
  },
  [types.mutations.m_resetFormValues](state){
    Logger.info(`request to mutate form state back to  initial`);
    state.formValues  = {
      address1: '',
      address2: '',
      address3: '',
      country: ''
    }
  },
  [types.mutations.m_setSelectedAddress](state, {selectedAddress}){
    Logger.info(`request to set selected address`);
    state.selectedAddress = selectedAddress;
  }
}
