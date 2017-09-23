import * as Logger from 'loglevel';
export default{
  m_setAddAddressFormValues(state, {values}) {
    Logger.info(`request to mutate state for add address form recieved, form data: ${JSON.stringify(values)}`);
    state.address1 = values.address1 || '';
    state.address2 = values.address2 || '';
    state.address3 = values.address3 || '';
    state.country = values.country || '';
  }
}
