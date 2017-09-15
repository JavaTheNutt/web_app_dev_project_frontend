import * as actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state'

//fixme move this to the app level store

export default {
  state,
  getters,
  actions,
  mutations
};
