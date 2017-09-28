import namespace from '@/app/services/namespace';

export default namespace('auth', {
  getters:['loggedIn', 'getUserEmail', 'getFirebaseId', 'getUserDetails'],
  actions: ['a_logInUser', 'a_testCurrentAuthState', 'a_createNewUser', 'a_logOutUser', 'a_setAuthStateListener'],
  mutations:['m_logInUser', 'm_logOutUser', 'm_setUserDetails']
})
