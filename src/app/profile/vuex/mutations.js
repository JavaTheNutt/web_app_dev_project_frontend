import types from './types'
export default{
  [types.mutations.m_addCurrentAddress](state, {addresses}){
    if(!state.currentAddresses || !Array.isArray(state.currentAddresses)){
      state.currentAddresses = [];
    }
    state.currentAddresses.concat(addresses);
  }
}
