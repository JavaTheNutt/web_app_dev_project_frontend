import * as Logger from 'loglevel';
import types from './types';
export default{
  [types.mutations.m_setAddAddressFormValues](state, {data}) {
    Logger.info(`request to mutate state for add address form recieved, form data: ${JSON.stringify(data)}`);
    state.addAddressValues.address1 = data.address1 || '';
    state.addAddressValues.address2 = data.address2 || '';
    state.addAddressValues.address3 = data.address3 || '';
    state.addAddressValues.country = data.country || '';
  },
  [types.mutations.m_resetAddressFormValues](state){
    Logger.info(`request to mutate form state back to  initial`);
    state.addAddressValues  = {
      address1: '',
      address2: '',
      address3: '',
      country: ''
    }
  }
}
