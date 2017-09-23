import types from './types';
export default {
  [types.getters.getCountryNames](state){
    return state.countryNames;
  }
}
