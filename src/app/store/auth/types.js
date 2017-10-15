import namespace from '@/app/services/namespace';

export default namespace('auth', {
  getters: ['loggedIn', 'getUserEmail', 'getFirebaseId', 'getUserDetails', 'initialLogin', 'preferredHomepage'],
  actions: ['a_logInUser', 'a_testCurrentAuthState', 'a_createNewUser', 'a_logOutUser', 'a_setAuthStateListener',
    'a_setIsInitial', 'a_unsetIsInitial', 'a_createServerUser'],
  mutations: ['m_logInUser', 'm_logOutUser', 'm_setUserDetails', 'm_setIsInitial', 'm_setPreferredHomepage']
})
