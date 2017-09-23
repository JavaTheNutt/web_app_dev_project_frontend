import types from './types';
export default {
  [types.getters.getConnection](state){
    return state.hasConnection;
  }
}
