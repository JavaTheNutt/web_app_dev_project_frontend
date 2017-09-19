<template>
  <div>
    <form novalidate @submit.stop.prevent="submitForm">
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
        <md-button class="md-raised md-accent" type="button" @click.native="checkAddress"
                   :disabled="!checkAddressButtonEnabled">Check Address
        </md-button>
        <md-button class="md-raised md-primary" type="button" @click.native="resetForm">Reset</md-button>
        <!--<md-button class="md-raised md-accent" type="button" @click.native="toggleMap">{{mapButtonText}}</md-button>-->
      </div>
    </form>

    <!--<p class="md-subtitle" v-if="formattedAddressShown">{{googleFormattedAddress}}</p>--></div>
</template>
<script>
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  //import bus from '@/app/services/bus';

  import {geocodeAddress} from '@/app/services/geocoding';
  const mapAPIKey = require('../../../config/private').mapsApiKey;
  //fixme make button disabled while form invalid
  export default {
    name: 'geocoded_form',
    data() {
      return {
        selectAddressFromListShown: false,
        sendableAddress: {
          country: '',
          address1: '',
          address2: '',
          address3: ''
        },
        possibleAddresses: []
      }
    },
    computed: {
      ...mapGetters(['getCountryNames']),
      checkAddressButtonEnabled() {
        Logger.info(`form is ${this.errors.items.length > 0 ? 'not' : ''} valid`);
        Logger.info(`country is ${this.sendableAddress.country.length > 0 ? '' : 'not' } selected`);
        /*Had to add this check as this function was being ran before the fields object was populated*/
        if (!this.fields || !this.fields.address1) {
          Logger.warn(`fields not loaded`);
          return false;
        }
        let formTouched = this.fields && this.fields.address1 && this.fields.address1.pristine;
        Logger.info(`form touched: ${formTouched}`);
        Logger.info(` testing for address1: ${JSON.stringify(this.fields.address1)}`); //fixme this works sporadically, appears that the first time this compueted value is calculated, the fields do not exist
        return this.errors.items.length === 0 && !formTouched && this.sendableAddress.country.length > 0;
      }
    },
    methods: {
      async checkAddress() {
        Logger.info(`check address button clicked`);
        try {
          //const fetchedResults = await fetchGeocodeResults(this.$http, this.sendableAddress);
          const fetchedResults = await geocodeAddress(this.sendableAddress);
          Logger.info(`results fetched from geocode without error.`);
          Logger.info(`results: ${JSON.stringify(fetchedResults)}`);
        } catch (err) {
          Logger.warn(`there was an error thrown in the on click handler for checking an address`);
          Logger.error(`error details: ${JSON.stringify(err)}`);
        }
      }
    }
  }

  async function fetchGeocodeResults(http, addressDetails) {
    Logger.info(`attempting to fetch geocode results`);
    //stringify and then parse result for logging readability, since google api's return JSONP to prevent CORS issues.
    let apiResponse;
    let addressString = formatAddress(addressDetails);
    Logger.info(`formatted address for geocoding: ${JSON.stringify(addressString)}`);
    try {
      apiResponse = await geocodeAddress(addressDetails);
      Logger.info(`results retrieved without error`);
    } catch (e) {
      Logger.warn(`error while fetching from google api.`);
      Logger.error(`${e}`);
      throw new Error(`error fetching from google api`, e);
    }
    Logger.info(`fetch from google api successful`);
    const res         = JSON.parse(JSON.stringify(apiResponse));
    Logger.info(`results retrieved ${JSON.stringify(res)}`);
    if (res.status === 200) {
      Logger.info(`result has status 'OK'`);
      return res.body.result;
    }
    const errMsg = res.body.error_text ? res.body.error_text : 'Unknown';
    Logger.warn(`there was an error fetching geocode results`);
    throw new Error(`add item failed for ${errMsg} reason`);
  }

  function formatAddress({address1, address2, address3, country}) {
    Logger.info('attempting to format address');
    Logger.info(`first line: ${address1}`);
    let address = address1 + ', ';
    if (address2 && address2.length > 0) {
      Logger.info(`second line found. Second line: ${address2}`);
      address += address2 + ', ';
      if (address3 && address2.length > 0) {
        Logger.info(`Third line found. Third line: ${address3}`);
        address += address3 + ', ';
      }
    }
    Logger.info(`returning ${address + country}`);
    return address + country;
  }
</script>
<style scoped lang="scss">

</style>
