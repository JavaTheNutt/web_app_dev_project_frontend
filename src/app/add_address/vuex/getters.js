import types from './types';
export default {
  [types.getters.getValues](state){
    return state.formValues;
  }
}
