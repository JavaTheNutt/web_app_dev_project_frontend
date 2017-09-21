<template>
  <div>
    <form novalidate @submit.stop.prevent="submitForm" v-if="showAddressForm">
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
      <p v-if="selectAddressFromListShown">
        We found {{possibleAddresses.length}} possible addresses, please select one</p>
      <md-input-container v-if="selectAddressFromListShown">
        <label for="selectAddress">Select your address</label>
        <md-select name="selectAddress" id="selectAddress" v-model="chosenAddress">
          <md-option v-for="currentAddress in possibleAddresses" :key="currentAddress.formatted_address"
                     :value="JSON.stringify(currentAddress.formatted_address)">
            {{currentAddress.formatted_address}}
          </md-option>
        </md-select>
      </md-input-container>
      <div class="form-flex-container--button">
        <md-button class="md-raised md-accent" type="button" v-if="!formattedAddressShown" @click.native="checkAddress"
                   :disabled="!checkAddressButtonEnabled">Check Address
        </md-button>
        <md-button class="md-raised md-warn" type="button" @click.native="resetForm">Reset</md-button>
      </div>
    </form>
    <div v-if="formattedAddressShown">
      <p class="md-subtitle">We found one address matching what you sent. Use this?</p>
      <p class="md-subtitle">{{googleFormattedAddress}}</p>
      <md-button md-theme="buttons" class="md-raised md-accent md-icon-button" @click.native="acceptSelectedAddress"
                 type="button">
        <md-icon>done</md-icon>
      </md-button>
      <md-button class="md-raised md-accent md-icon-button" type="button" @click.native="rejectSelectedAddress">
        <md-icon>clear</md-icon>
      </md-button>
    </div>
    <div v-if="addressTableShown">
      <md-table-card>
        <md-toolbar>
          <h1 class="md-title">Possible Addresses</h1>
          <md-button class="md-icon-button">
            <md-icon>filter_list</md-icon>
          </md-button>
        </md-toolbar>
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>Address</md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="(address, index) in possibleAddresses" :key="index" :md-item="address">
              <md-table-cell :md-numeric="false">{{address.formatted_address}}</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
        <custom-table-pagination
          md-size="5"
          md-label="Rows"
          md-seperator="of"
          :mdPage="currentTablePage"
          :mdTotal="possibleAddresses.length"
          :md-page-options="[5, 10, 25, 50]"
          @pagination="onPagination"
        ></custom-table-pagination>
      </md-table-card>

    </div>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  import bus from '../services/bus';
  import customTablePagination from './CustomTablePagination';
  import {geocodeAddress} from '@/app/services/geocoding';


  export default {
    components: {customTablePagination},
    name: 'geocoded_form',
    data() {
      return {
        currentTablePage: 1,
        selectAddressFromListShown: false,
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
        addressTableShown: false
      }
    },
    computed: {
      ...mapGetters(['getCountryNames']), //fetch country names from the store.
      checkAddressButtonEnabled() { //this function will watch to see if the check address button should be enabled
        if(this.sendableAddress.address1.length < 1){
          Logger.info(`address1 does not exist`);
          return false;
        }
        Logger.info(`form is ${this.errors.items.length > 0 ? 'not' : ''} valid`);
        Logger.info(`country is ${this.sendableAddress.country.length > 0 ? '' : 'not' } selected`);
        /*Had to add this check as this function was being ran before the fields object was populated*/
        if (!this.fields || !this.fields.address1) {
          Logger.info(`fields not loaded`);
          return false;
        }
        let formTouched = this.fields && this.fields.address1 && this.fields.address1.pristine; //has the form rendered? and is it still pristine?
        Logger.info(`form touched: ${formTouched}`);
        Logger.info(` testing for address1: ${JSON.stringify(this.fields.address1)}`);
        return this.errors.items.length === 0 && !formTouched && this.sendableAddress.country.length > 0;
      }
    },
    methods: {
      onPagination(data){
        Logger.info(`table pagination event recieved`);
        Logger.info(`data recieved: ${JSON.stringify(data)}`);
      },
      async checkAddress() {
        Logger.info(`check address button clicked`);
        try {
          const fetchedResults = await geocodeAddress(this.sendableAddress);
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
        //fixme somewhere between the log statement above and the emit below, all properties of the object are lost
        //possibly becuase the form data gets cleared, and thus the reference to the data?
        //try this:https://forum.vuejs.org/t/passing-data-back-to-parent/1201/2
        //possibly try constructuing a new object from the properties of the old.
        //object needed to be stringified first
        this.$emit('addressSet', JSON.stringify(this.chosenAddress.formattedDetails));//using this.$emit to emit back up component hierarchy, instead of along a bus
        //fixme hide result and emit selected address to parent.
        this.resetForm();

      },
      rejectSelectedAddress() {
        this.chosenAddress         = {};
        this.formattedAddressShown = false;
        bus.$emit('showSnack', 'please adjust your search parameters and try again')
      }
      //fixme implement logic to handle multiple addresses being returned from the server

    }
  }
</script>
<style scoped lang="scss">

</style>
