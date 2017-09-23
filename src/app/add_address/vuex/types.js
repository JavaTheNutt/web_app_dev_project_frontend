import namespace from '@/app/services/namespace';

export default namespace('add_address', {
  getters: ['getValues'],
  actions: ['a_setFormValues', 'a_resetFormValues'],
  mutations: ['m_setFormValues', 'm_resetFormValues']
})
