import * as Logger from 'loglevel';
import bus from '@/app/services/bus';

//fixme needs a better system to notify the user of network state
export const a_attachOnlineStateListeners = ({dispatch})=>{
  Logger.info(`action to attach network state listeners recieved`);
  window.addEventListener('online', ()=>{
    Logger.info(`online listener called`);
    dispatch('a_commitNetworkState', true);
    bus.$emit('showSnack', 'you have been reconnected to the internet');
  });
  window.addEventListener('offline', ()=>{
    Logger.info(`offline listener added`);
    dispatch('a_commitNetworkState', false);
    bus.$emit('showSnack', 'You have been disconnected from the internet, some functionality may be unavailable');
  });
  dispatch('a_testNetworkConnection');
};
export const a_testNetworkConnection = ({dispatch}) =>{
  Logger.info(`test network connection called`);
  dispatch('a_commitNetworkState', navigator.onLine)
};
export const a_commitNetworkState = ({commit}, data) =>{
  Logger.info(`commit network connection action called`);
  Logger.info(`current connection status is: ${data ? 'online': 'offline'}`);
  commit('m_changeOnlineStatus', {data})
};
