import * as Logger from 'loglevel';
export const a_setAddAddressFormValues = ({commit}, addressDetails) =>{
  Logger.info(`action called to update add address form values, data: ${JSON.stringify(addressDetails)}`);
  commit('m_setAddAddressFormValues', {data: addressDetails});
};
export const a_resetFormToInitial = ({commit})=>{
  Logger.info(`action called to reset form state back to initial`);
  commit('m_resetAddressFormValues')
};
