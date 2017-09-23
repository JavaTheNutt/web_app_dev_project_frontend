import namespace from '@/app/services/namespace';

export default namespace('connection', {
  getters:['getConnection'],
  actions:['a_attachOnlineStateListeners', 'a_testNetworkConnection', 'a_commitNetworkState'],
  mutations: ['m_changeOnlineStatus']
})
