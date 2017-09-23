import * as Logger from 'loglevel';
export const a_setAddAddressFormValues = ({commit}, data) =>{
  Logger.info(`action called to update add address form values, data: ${JSON.stringify(data)}`);
  commit('m_setAddAddressFormValues', {data});
};
