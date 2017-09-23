import * as Logger from 'loglevel';
import types from './types';
import bus from '@/app/services/bus';

export default{
  [types.actions.a_attachOnlineStateListeners]: ({dispatch})=>{
    Logger.info(`action to attach network state listeners recieved`);
    window.addEventListener('online', ()=>{
      Logger.info(`online listener called`);
      dispatch(types.actions.a_commitNetworkState, true);
      bus.$emit('showSnack', 'you have been reconnected to the internet');
    });
    window.addEventListener('offline', ()=>{
      Logger.info(`offline listener added`);
      dispatch(types.actions.a_commitNetworkState, false);
      bus.$emit('showSnack', 'You have been disconnected from the internet, some functionality may be unavailable');
    });
    dispatch(types.actions.a_testNetworkConnection);
  },
  [types.actions.a_testNetworkConnection]: ({dispatch}) =>{
    Logger.info(`test network connection called`);
    dispatch(types.actions.a_commitNetworkState, navigator.onLine)
  },
  [types.actions.a_commitNetworkState]: ({commit}, data) =>{
    Logger.info(`commit network connection action called`);
    Logger.info(`current connection status is: ${data ? 'online': 'offline'}`);
    commit(types.mutations.m_changeOnlineStatus, {data})
  }
}

