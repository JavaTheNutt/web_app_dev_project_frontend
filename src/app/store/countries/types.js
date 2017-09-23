import namespace from '@/app/services/namespace';

export default namespace('countries', {
  getters:['getCountryNames'],
  actions: ['a_setCountryNames'],
  mutations:['m_setCountryNames']
})
