<template>
  <div>
    <h1 class="md-title">This is the add address view</h1>
    <router-view></router-view>
    <confirm-text @accept="acceptAddress" @reject="rejectAddress" :messages="messages" v-if="messages"></confirm-text>
    <!--<div v-if="mapShown">
      <confirm_fab @accept="acceptAddress" @reject="rejectAddress"></confirm_fab>
    </div>
    <div v-if="mapShown" class="map-container">
      <gmap-map :center="{lat:chosenAddress.geometry.lat, lng:chosenAddress.geometry.lng}" :zoom="20"
                map-type-id="terrain" class="custom-view-map">
        <gmap-marker :position="chosenAddress.geometry"></gmap-marker>
      </gmap-map>
    </div>-->
  </div>
</template>
<script>
  import bus from '@/app/services/bus';
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  import GeocodedForm from './GeocodedFormContainer';
  import types from '../vuex/types';
  import ConfirmText from '@/app/widgets/confirm_text/ConfirmText';

  export default {
    components: {
      ConfirmText,
      GeocodedForm
    },
    name: 'add_address',
    data() {
      return {}
    },
    created() {
      Logger.info(`checking if user has geolocation`);
      //fixme move to store
      if (navigator.geolocation) {
        Logger.info(`user has geo`);
        return;
      }
      Logger.info(`user does not have geo`);
    },
    computed: {
      messages() {
        return Object.keys(this.selectedAddress).length > 0 ?
          ['Is this the address that you would like to choose?', this.selectedAddressText] : false;
      }, ...mapGetters({
        selectedAddress: types.getters.getSelectedAddress,
        possibleAddresses: types.getters.getPossibleAddresses,
        selectedAddressText: types.getters.getSelectedAddressText,
        refPath: types.getters.getRoutePrefix
      }),
      currentLocation(){
        return this.$route.path.substring(this.$route.path.indexOf('/add_address') + '/add_address'.length)
      }
    },
    mounted() {
      Logger.info(`current path: ${this.$route.path}`);
      Logger.info(`${this.$route.path.substring(0, this.$route.path.indexOf('/add_address'))}`);
      this.$store.dispatch(types.actions.a_setRoutePrefix, this.$route.path.substring(0, this.$route.path.indexOf('/add_address')));
    },
    beforeDestroy() {
      Logger.info(`form container being removed from the view. Resetting current form state`);
      this.$store.dispatch(types.actions.a_resetFormValues);
    },
    methods: {
      acceptAddress() {
        Logger.info(`accept address clicked`);
        if(this.currentLocation === '/enter_details' || this.currentLocation === '/select_details'){
          Logger.info(`address selected while in either form or map, switching to map`);
          this.$router.push(`${this.refPath}/add_address/view_address`);
        }
        //here is where i will check the current route and if the form or the table is shown, move to the map. If the map is shown, return to the caller
      },
      rejectAddress() {
        Logger.info(`reject address clicked`);
        //const currentLocation = this.$route.path.substring(this.$route.path.indexOf('/add_address') + '/add_address'.length);
        Logger.info(`current location: ${this.currentLocation}`);
        if (this.currentLocation === '/enter_details') {
          Logger.info(`location is form, hiding choice`);
          this.$store.dispatch(types.actions.a_resetSelectedAddress);
          return;
        }
        if (this.currentLocation === '/select_details' || this.currentLocation === '/view_address') {
          Logger.info(`location is table, returning to form`);
          this.$store.dispatch(types.actions.a_resetSelectedAddress);
          this.$router.go(-1);
        }

      }
    }
  }

</script>
<style scoped lang="scss">
  .map-container {
    margin: 30px 0;
  }

  .custom-view-map {
    width: 100%;
    height: 500px;
  }
</style>
