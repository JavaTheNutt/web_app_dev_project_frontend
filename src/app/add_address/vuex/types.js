import namespace from '@/app/services/namespace';

export default namespace('add_address', {
  getters: ['getValues', 'getPossibleAddresses', 'getSelectedAddress', 'getRoutePrefix'],
  actions: ['a_setFormValues', 'a_resetFormValues', 'a_fetchResults', 'a_resetResults', 'a_setSelectedAddress', 'a_resetSelectedAddress', 'a_setRoutePrefix', 'a_resetRoutePrefix'],
  mutations: ['m_setFormValues', 'm_resetFormValues', 'm_setResults', 'm_resetResults', 'm_setSelectedAddress', 'm_setRoutePrefix', ]
})
