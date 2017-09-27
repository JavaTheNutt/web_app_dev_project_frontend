import * as components from './components';
const possiblePrefixes = ['/profile'];
const routes = possiblePrefixes.map((prefix) => {
  return {
    name: `${prefix}_add_address`,
    path: `${prefix}/add_address`,
    component: components.AddAddress,
    redirect: `${prefix}/add_address/enter_details`,
    meta:{requiresAuth: true},
    children:[{
      path:'enter_details',
      component: components.GeocodedForm,
    }, {
      path: 'select_details',
      component: components.SelectAddressTable
    }]
  }
});
export default routes;
