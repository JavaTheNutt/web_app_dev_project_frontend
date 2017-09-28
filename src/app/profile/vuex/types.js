import namespace from '@/app/services/namespace';
export default namespace('profile', {
  getters:['getUserDetails', 'getCurrentAddresses', 'getUserEmail'],
  actions:['a_createFirebaseConnection', 'a_onDataChanged', 'a_setUserDetails', 'a_addCurrentAddress', 'a_removeFirebaseReference', 'a_initializeProfileStore'],
  mutations: ['a_createFirebaseConnection', 'a_onDataChanged', 'a_setUserDetails', 'a_addCurrentAddress']
})
