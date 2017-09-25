<template>
  <div>
    <h1 class="md-title">This is the add address view</h1>
    <geocoded-form @addressSet="setCheckedAddress" v-if="formShown"></geocoded-form>
    <div v-if="mapShown">
      <confirm_fab @accept="acceptAddress" @reject="rejectAddress"></confirm_fab>
      <!--
      <md-button md-theme="secondary" class="md-raised md-accent md-icon-button" @click.native="acceptAddress"
                 type="button">
        <md-icon>done</md-icon>
      </md-button>
      <md-button class="md-raised md-warn md-icon-button" type="button" @click.native="rejectAddress">
        <md-icon>clear</md-icon>
      </md-button>
&lt;!&ndash;      <md-button class="md-raised md-accent" @click.native="acceptAddress">Accept</md-button>
      <md-button class="md-raised md-warn" @click.native="rejectAddress">Reject</md-button>&ndash;&gt;
    --></div>
    <div v-if="mapShown" class="map-container"><gmap-map :center="{lat:chosenAddress.geometry.lat, lng:chosenAddress.geometry.lng}" :zoom="20" map-type-id="terrain" class="custom-view-map" >
      <gmap-marker :position="chosenAddress.geometry"></gmap-marker>
    </gmap-map></div>
  </div>
</template>
<script>
  import bus from '../../services/bus';
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  import GeocodedForm from './GeocodedFormContainer';
  import types from '../vuex/types';
  import Confirm_fab from '../../widgets/confirm_fab/ConfirmFab.vue';

  export default {
    components: {
      Confirm_fab,
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
    beforeDestroy(){
      Logger.info(`form container being removed from the view. Resetting current form state`);
      this.$store.dispatch(types.actions.a_resetFormValues);
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
    margin: 30px 0;
  }

  .custom-view-map {
    width: 100%;
    height: 500px;
  }
</style>
