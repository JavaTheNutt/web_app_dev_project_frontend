import namespace from '@/app/services/namespace';

export default namespace('add_address', {
  getters: ['getValues', 'getPossibleAddresses'],
  actions: ['a_setFormValues', 'a_resetFormValues', 'a_fetchResults', 'a_resetResults'],
  mutations: ['m_setFormValues', 'm_resetFormValues', 'm_setResults', 'm_resetResults']
})
