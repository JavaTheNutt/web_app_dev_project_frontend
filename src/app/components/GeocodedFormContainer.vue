<template>
  <div>
    <!--<form novalidate @submit.stop.prevent="submitForm" v-if="showAddressForm">
      <md-input-container :class="{'md-input-invalid': errors.has('address1')}">
        <label>Address Line One</label>
        <md-input type="text" v-model="sendableAddress.address1" data-vv-name="address1" v-validate="'required'"
                  name="address1"
        ></md-input>
        <span
          class="md-error">Address Line One is mandatory</span>
      </md-input-container>
      <md-input-container>
        <label>Address Line Two</label>
        <md-input type="text" v-model="sendableAddress.address2"
                  name="address2"
        ></md-input>
      </md-input-container>
      <md-input-container>
        <label>Address Line Three</label>
        <md-input type="text" v-model="sendableAddress.address3"
                  name="address3"
        ></md-input>
      </md-input-container>
      <md-input-container>
        <label for="country">Select Country</label>
        <md-select name="country" id="country" v-model="sendableAddress.country">
          <md-option v-for="currentCountry in getCountryNames" :key="currentCountry"
                     :value="JSON.stringify(currentCountry)">
            {{currentCountry}}
          </md-option>
        </md-select>
      </md-input-container>
      <div class="form-flex-container&#45;&#45;button">
        <md-button class="md-raised md-accent" type="button" v-if="!formattedAddressShown" @click.native="checkAddress"
                   :disabled="!checkAddressButtonEnabled">Check Address
        </md-button>
        <md-button class="md-raised md-warn" type="button" @click.native="resetForm">Reset</md-button>
      </div>
    </form>-->
    <div v-if="showAddressForm">
      <geocoded-form @addressSelected="checkAddress"></geocoded-form>
    </div>
    <div v-if="addressTableShown">
      <select-address-table :possibleAddresses="possibleAddresses" @addressSelectedFromTable="itemSelected" @returnToForm="returnToForm"></select-address-table>
    </div>
    <div v-if="formattedAddressShown">
      <p class="md-subtitle">Is this the address you would like to add?</p>
      <p class="md-subtitle">{{googleFormattedAddress}}</p>
      <md-button md-theme="buttons" class="md-raised md-accent md-icon-button" @click.native="acceptSelectedAddress"
                 type="button">
        <md-icon>done</md-icon>
      </md-button>
      <md-button class="md-raised md-accent md-icon-button" type="button" @click.native="rejectSelectedAddress">
        <md-icon>clear</md-icon>
      </md-button>
    </div>

  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  import bus from '../services/bus';
  import {geocodeAddress} from '@/app/services/geocoding';
  import SelectAddressTable from './SelectAddressTable.vue';
  import GeocodedForm from './GeocodedForm';


  export default {
    components: {
      SelectAddressTable,
      GeocodedForm
    },
    name: 'geocoded_form_container',

    data() {
      return {
        showAddressForm: true,
        formattedAddressShown: false,
        sendableAddress: {
          country: '',
          address1: '',
          address2: '',
          address3: ''
        },
        chosenAddress: {
          googleDetails: {},
          formattedDetails: {
            googlePlaceId: '',
            formattedName: '',
            geometry: {
              lat: 0.0,
              lng: 0.0
            }
          }
        },
        possibleAddresses: [],
        googleFormattedAddress: '',
        addressTableShown: false,
        recievedDetails: {
          country: '',
          address1: '',
          address2: '',
          address3: ''
        }
      }
    },
    computed: {
      ...mapGetters(['getCountryNames']), //fetch country names from the store.
      checkAddressButtonEnabled() { //this function will watch to see if the check address button should be enabled
        if(this.sendableAddress.address1.length < 1){
          Logger.info(`address1 does not exist`);
          return false;
        }
        if(this.sendableAddress.country.length < 1){
          Logger.info(`country does not exist`);
          return false;
        }
        return true;
      }
    },
    methods: {
      returnToForm(){
        Logger.info(`returnin to form, data to be passed as props: ${JSON.stringify(this.recievedDetails)}`);
        this.showAddressForm = true;
        this.addressTableShown = false;
        this.formattedAddressShown = false;

      },
      itemSelected(item){
        item = JSON.parse(item);
        Logger.info(`selected address is: ${item.formatted_address}`);
        this.chosenAddress.googleDetails = item;
        this.googleFormattedAddress      = item.formatted_address;
        this.formattedAddressShown       = true;
      },
      async checkAddress(addressDetails) {
        Logger.info(`check address request recieved`);
        Logger.info(`details to be checked in form container`);
        Logger.info(`details recieved by form container: ${JSON.stringify(addressDetails)}`);
        addressDetails = JSON.parse(addressDetails);
        this.recievedDetails = addressDetails;
        try {
          const fetchedResults = await geocodeAddress(this.recievedDetails);
          Logger.info(`results fetched from geocode without error.`);
          Logger.info(`results: ${JSON.stringify(fetchedResults)}`);
          Logger.info(`attempting to handle the results of the fetch operation`);
          this.handleAddress(fetchedResults.data.results)
        } catch (err) {
          Logger.warn(`there was an error thrown in the on click handler for checking an address`);
          Logger.error(`error details: ${JSON.stringify(err)}`);
        }
      },
      handleAddress(addressList) {
        Logger.info(`handling results of query`);
        if (addressList.length === 1) {
          Logger.info(`there was exactly one result returned`);
          bus.$emit('showSnack', 'exactly one address found');
          this.possibleAddresses           = [];
          this.chosenAddress.googleDetails = addressList[0];
          this.googleFormattedAddress      = addressList[0].formatted_address;
          this.formattedAddressShown       = true;
        }
        if (addressList.length > 1) {
          bus.$emit('showSnack', 'multiple addresses found');
          this.googleFormattedAddress = null;
          this.possibleAddresses      = addressList;
          this.addressTableShown = true;
          this.showAddressForm = false;
        }
      },
      resetForm() {
        //found at: https://stackoverflow.com/a/40856312/4108556 resets data object to initial
        this.showAddressForm = true;
        Object.assign(this.$data, this.$options.data.call(this));
        //found at: https://github.com/baianat/vee-validate/issues/285 iterate through all fields that have validators attached and find the
        this.$nextTick(function () {
          const self = this;
          Object.keys(this.fields).some(function (key) {
            self.$validator.flag(key, {
              untouched: true
            })
          });
          this.errors.clear();
        });
      },
      acceptSelectedAddress() {
        Logger.info(`accept selected address clicked`);
        Logger.info(`currently selected address: ${JSON.stringify(this.chosenAddress.googleDetails)}`);
        this.chosenAddress.formattedDetails = {
          googlePlaceId: this.chosenAddress.googleDetails.place_id,
          formattedAddress: this.chosenAddress.googleDetails.formatted_address,
          geometry: {
            lat: this.chosenAddress.googleDetails.geometry.location.lat,
            lng: this.chosenAddress.googleDetails.geometry.location.lng,
          }
        };
        Logger.info(`now formatted details are ${JSON.stringify(this.chosenAddress.formattedDetails)}`);
        //possibly becuase the form data gets cleared, and thus the reference to the data?
        //try this:https://forum.vuejs.org/t/passing-data-back-to-parent/1201/2
        //possibly try constructuing a new object from the properties of the old.
        //object needed to be stringified first
        this.$emit('addressSet', JSON.stringify(this.chosenAddress.formattedDetails));//using this.$emit to emit back up component hierarchy, instead of along a bus
        this.resetForm();

      },
      rejectSelectedAddress() {
        this.chosenAddress         = {};
        this.formattedAddressShown = false;
        bus.$emit('showSnack', 'please adjust your search parameters and try again')
      }
    }/*,
    beforeDestroy(){
      Logger.info(`form container being removed from the view. Resetting current form state`);
      this.$store.dispatch('a_resetFormToInitial');
    }*/
  }
</script>
<style scoped lang="scss">

</style>
