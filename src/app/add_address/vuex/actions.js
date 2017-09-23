import * as Logger from 'loglevel';
import types from './types';
export default {
  [types.actions.a_setFormValues]: ({commit}, addressDetails) =>{
    Logger.info(`action called to update add address form values, data: ${JSON.stringify(addressDetails)}`);
    commit(types.mutations.m_setFormValues, {data: addressDetails});
  },
  [types.actions.a_resetFormValues] : ({commit})=>{
    Logger.info(`action called to reset form state back to initial`);
    commit(types.mutations.m_resetFormValues)
  }
}

