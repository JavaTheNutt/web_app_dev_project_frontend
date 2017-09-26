import types from './types';
export default {
  [types.getters.getValues](state){
    return state.formValues;
  },
  [types.getters.getPossibleAddresses](state){
    return state.possibleAddresses;
  }
}
