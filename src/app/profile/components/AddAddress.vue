<template>
  <div>
    <h1 class="md-title">This is the add address view</h1>
    <geocoded-form @addressSet="setCheckedAddress" v-if="formShown"></geocoded-form>
    <div v-if="mapShown">
      <md-button class="md-raised md-accent" @click.native="acceptAddress">Accept</md-button>
      <md-button class="md-raised md-warn" @click.native="rejectAddress">Reject</md-button>
    </div>
    <gmap-map :center="{lat:chosenAddress.geometry.lat, lng:chosenAddress.geometry.lng}" :zoom="20" map-type-id="terrain" class="custom-view-map" v-if="mapShown">
      <gmap-marker :position="chosenAddress.geometry"></gmap-marker>
    </gmap-map>
  </div>
</template>
<script>
  import bus from '../../services/bus';
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  import GeocodedForm from '@/app/components/GeocodedFormContainer';

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
      }
    },
    methods: {
      setCheckedAddress(addressDetails){
        const details = JSON.parse(addressDetails);
        Logger.info(`address event recived from child component`);
        Logger.info(`details passed: ${JSON.stringify(addressDetails)}`);
        this.chosenAddress = details;
        this.formShown = false;
        this.mapShown = true;
      },
      acceptAddress(){
        Logger.info(`accept address clicked`);
        //here i will probably move the selected address to the store, as I now have its context.
        //this should also return to its calling function, or emit this address if the component is to be embedded
      },
      rejectAddress(){
        Logger.info(`reject address clicked`);
        this.chosenAddress = null;
        this.mapShown = false;
        this.formShown = true;
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
