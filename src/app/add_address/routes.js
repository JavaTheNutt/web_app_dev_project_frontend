import * as components from './components';
const possiblePrefixes = ['/profile'];
const routes = possiblePrefixes.map((prefix) => {
  return {
    name: `${prefix}_add_address`,
    path: `${prefix}/add_address`,
    component: components.AddAddress,
    redirect: `${prefix}/add_address/enter_details`,
    meta: {requiresAuth: true},
    children:[{
      path:'enter_details',
      component: components.GeocodedForm,
      meta: {requiresAuth: true}
    }, {
      path: 'select_details',
      component: components.SelectAddressTable,
      meta: {requiresAuth: true}
    },{
      path: 'view_address',
      components: {mapView: components.GeocodedMap,
      meta: {requiresAuth: true}}
    }]
  }
});
export default routes;
