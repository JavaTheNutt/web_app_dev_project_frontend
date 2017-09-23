import namespace from '@/app/services/namespace';

export default namespace('add_address', {
  getters: ['getAddAddressValues'],
  actions: ['a_setAddAddressFormValues', 'a_resetFormToInitial'],
  mutations: ['m_setAddAddressFormValues', 'm_resetAddressFormValues']
})
