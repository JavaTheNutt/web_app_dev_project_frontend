import Vue from 'vue';
import ConfirmFab from '@/app/widgets/confirm_fab/ConfirmFab';

describe('ConfirmFab.vue', ()=>{
  it('should render correct contents', ()=>{
    const Constructor = Vue.extend(ConfirmFab);
    const vm = new Constructor.$mount();
    expect(vm.$el.querySelector('.button-container')).to.exist;
  })
})
