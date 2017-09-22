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
      <div class="form-flex-container--button">
        <md-button class="md-raised md-accent" type="button" v-if="!formattedAddressShown" @click.native="checkAddress"
                   :disabled="!checkAddressButtonEnabled">Check Address
        </md-button>
        <md-button class="md-raised md-warn" type="button" @click.native="resetForm">Reset</md-button>
      </div>
    </form>
    <div v-if="addressTableShown">
      <!--<md-button class="md-raised md-warn" @click.native="returnToForm">Re-enter address</md-button>
      <md-table-card>
        <md-toolbar>
          <h1 class="md-title">Possible Addresses</h1>
          <md-button class="md-icon-button">
            <md-icon>filter_list</md-icon>
          </md-button>
        </md-toolbar>
        <md-table>
          <md-table-body>
            <md-table-row v-for="(address, index) in possibleAddresses" :key="index" :md-item="address" v-if="rowShown(index)" @click.native="itemSelected(address)">
              <md-table-cell :md-numeric="false" ><mdInkRipple ></mdInkRipple>{{address.formatted_address}}</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
        <custom-table-pagination
          :md-size="currentPageSize"
          md-label="Rows"
          md-seperator="of"
          :mdPage="currentTablePage"
          :mdTotal="possibleAddresses.length"
          :md-page-options="[5, 10, 25, 50]"
          @pagination="onPagination"
        ></custom-table-pagination>
      </md-table-card>-->
      <select-address-table :possibleAddresses="possibleAddresses" @addressSelectedFromTable="itemSelected"></select-address-table>
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
  import customTablePagination from './CustomTablePagination';
  import {geocodeAddress} from '@/app/services/geocoding';
  import MdInkRipple from '../../../node_modules/vue-material/src/core/components/mdInkRipple/mdInkRipple.vue';
  import MdButton from '../../../node_modules/vue-material/src/components/mdButton/mdButton.vue';
  import SelectAddressTable from './SelectAddressTable.vue';


  export default {
    components: {
      SelectAddressTable,
      MdButton,
      MdInkRipple,
      customTablePagination},
    name: 'geocoded_form',

    data() {
      return {
        currentTablePage: 1,
        currentPageSize: 5,
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
        addressTableShown: false,
        tableViewBound:{
          upper: 5,
          lower: 0
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
      },
      tableBounds(){
        Logger.info(`testing the current view bounds for table`);
        Logger.info(`any item with index between ${((this.currentPageSize * this.currentTablePage)) - this.currentPageSize} and ${(this.currentPageSize * this.currentTablePage) -1} should be shown`);
        return {upper: (this.currentPageSize * this.currentTablePage) -1, lower: ((this.currentPageSize * this.currentTablePage)) - this.currentPageSize};
      }
    },
    methods: {
      returnToForm(){
        this.showAddressForm = true;
        this.addressTableShown = false;
      },
      itemSelected(item){
        item = JSON.parse(item);
        Logger.info(`selected address is: ${item.formatted_address}`);
        this.chosenAddress.googleDetails = item;
        this.googleFormattedAddress      = item.formatted_address;
        this.formattedAddressShown       = true;
      },
      rowShown(index){
        Logger.info(`attempting to see if row with index ${index} should be shown`);
        Logger.info(`row shown: ${index >= this.tableBounds.lower && index <= this.tableBounds.upper}`);
        return index >= this.tableBounds.lower && index <= this.tableBounds.upper
      },
      onPagination(data){
        Logger.info(`table pagination event recieved`);
        Logger.info(`data recieved: ${JSON.stringify(data)}`);
        this.currentTablePage = data.page;
        this.currentPageSize = data.size;
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

    }
  }
</script>
<style scoped lang="scss">

</style>
