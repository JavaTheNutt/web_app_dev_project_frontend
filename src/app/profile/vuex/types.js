import namespace from '@/app/services/namespace';
export default namespace('profile', {
  getters:['getUserDetails', 'getCurrentAddresses', 'getUserEmail'],
  actions:['a_createFirebaseConnection', 'a_onDataChanged', 'a_setUserDetails', 'a_addCurrentAddress', 'a_removeFirebaseReference', 'a_initializeProfileStore'],
  mutations: ['m_createFirebaseConnection', 'm_onDataChanged', 'm_setUserDetails', 'm_addCurrentAddress']
})
