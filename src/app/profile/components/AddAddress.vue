<template>
  <div>
    <h1 class="md-title">This is the add address view</h1>
    <geocoded-form @addressSet="setCheckedAddress" v-if="formShown"></geocoded-form>
    <gmap-map :center="{lat:chosenAddress.geometry.lat, lng:chosenAddress.geometry.lng}" :zoom="20" map-type-id="terrain" class="custom-view-map" v-if="mapShown">
      <gmap-marker :position="chosenAddress.geometry"></gmap-marker>
    </gmap-map>
  </div>
</template>
<script>
  import bus from '../../services/bus';
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  import GeocodedForm from '@/app/components/GeocodedForm';

  const mapAPIKey = require('../../../../config/private').mapsApiKey;
  export default {
    components: {
      GeocodedForm
    },
    name: 'add_address',
    data() {
      return {
        mapShown: false,
        formShown: true,
        mapMarkerShown: false,
        selectedAddressMarker: {
          position: {
            lat: 10,
            lng: 10
          }
        },
        chosenAddress: {}
      }
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
      mapButtonText() {
        return this.mapShown ? 'Hide Map' : 'Show Map'
      },
      ...mapGetters(['getCountryNames'])
    },
    methods: {
      setCheckedAddress(addressDetails){
        const details = JSON.parse(addressDetails);
        Logger.info(`address event recived from child component`);
        Logger.info(`details passed: ${JSON.stringify(addressDetails)}`);
        this.chosenAddress = details;
        this.formShown = false;
        this.mapShown = true;
      }
    }
  }

</script>
<style scoped lang="scss">
  .map-container {
    display: flex;
  }

  .custom-view-map {
    width: 100%;
    height: 500px;
  }
</style>
