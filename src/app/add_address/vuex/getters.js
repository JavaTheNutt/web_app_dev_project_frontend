import types from './types';

export default {
  [types.getters.getValues](state) {
    return state.formValues;
  },
  [types.getters.getPossibleAddresses](state) {
    return state.possibleAddresses.map((address) => {
      return {
        geo: address.geometry.location,
        text: address.formatted_address
      }
    });
  },
  [types.getters.getSelectedAddress](state) {
    return state.selectedAddress;
  },
  [types.getters.getRoutePrefix](state) {
    return state.routePrefix;
  },
  [types.getters.getHasMultipleAddresses](state){
    return state.possibleAddresses.length > 1;
  },
  [types.getters.getSelectedAddressText](state){
    return state.selectedAddress.text
  }
}
