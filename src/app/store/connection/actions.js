import * as Logger from 'loglevel';
export const a_attachOnlineStateListeners = ({dispatch})=>{
  Logger.info(`action to attach network state listeners recieved`);
  window.addEventListener('online', ()=>{
    Logger.info(`online listener added`);
    dispatch('a_testNetworkConnection');
  });
  window.addEventListener('offline', ()=>{
    Logger.info(`offline listener added`);
    dispatch('a_testNetworkConnection');
  });
  dispatch('a_testNetworkConnection');
};
export const a_testNetworkConnection = ({commit}) =>{
  Logger.info(`test network connection called`);
  commit('m_changeOnlineStatus', {data: navigator.onLine})
};
