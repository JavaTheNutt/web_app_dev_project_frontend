import * as components from './components';

export default [{
  name: 'add_address',
  path: '/add_address',
  component: components.AddAddress,
  redirect: '/add_address/enter_details',
  children:[{
    path:'enter_details',
    component: components.GeocodedForm
  }, {
    path: 'select_details',
    component: components.SelectAddressTable
  }]
}]
