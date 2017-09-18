<template>
  <div>
    <h1 class="md-title">This is the add address view</h1>
    <form novalidate @submit.stop.prevent="submitForm">
      <md-input-container :class="{'md-input-invalid': errors.has('address1')}">
        <label>Address Line One</label>
        <md-input type="text" v-model="address1" data-vv-name="address1" v-validate="'required|min:3'"
                  name="address1"
        ></md-input>
        <span
          class="md-error">Address Line One is mandatory</span>
      </md-input-container>
      <md-input-container :class="{'md-input-invalid': errors.has('address2')}">
        <label>Address Line Two</label>
        <md-input type="text" v-model="address2" data-vv-name="address2" v-validate="'alpha_num'"
                  name="address2"
        ></md-input>
        <span
          class="md-error">Address Line Two may only contain alphanumeric characters</span>
      </md-input-container>
      <md-input-container :class="{'md-input-invalid': errors.has('addres3')}">
        <label>Address Line Three</label>
        <md-input type="text" v-model="address3" data-vv-name="address3" v-validate="'alpha_num'"
                  name="address3"
        ></md-input>
        <span
          class="md-error">Address Line Two may only contain alphanumeric characters</span>
      </md-input-container>
      <md-input-container>
        <label for="country">Select Country</label>
        <md-select name="country" id="country" v-model="country">
          <md-option v-for="currentCountry in countries" :key="currentCountry" :value="JSON.stringify(currentCountry)">
            {{currentCountry}}
          </md-option>
        </md-select>
      </md-input-container>
      <md-input-container v-if="selectAddressFromListShown">
        <label for="selectAddress">Select Country</label>
        <md-select name="selectAddress" id="selectAddress">
          <md-option v-for="currentAddress in possibleAddresses" :key="currentAddress.formatted_address" :value="JSON.stringify(currentAddress.formatted_address)">
            {{currentAddress.formatted_address}}
          </md-option>
        </md-select>
      </md-input-container>
      <div class="form-flex-container--button">
        <md-button class="md-raised md-accent" type="submit">Submit</md-button>
        <md-button class="md-raised md-primary" type="button" @click.native="resetForm">Reset</md-button>
        <md-button class="md-raised md-accent" type="button" @click.native="toggleMap">{{mapButtonText}}</md-button>
      </div>
    </form>
    <p class="md-subtitle" v-if="formattedAddressShown">{{googleFormattedAddress}}</p>
    <gmap-map :center="{lat:lat, lng:lng}" :zoom="20" map-type-id="terrain" class="custom-view-map" v-if="mapShown">
      <gmap-marker :position="selectedAddressMarker.position"></gmap-marker>
    </gmap-map>
    <!--<div class="map-container">

    </div>-->
  </div>
</template>
<script>
  import bus from '../../services/bus';
  import * as Logger from 'loglevel';
  import countryListModule from 'country-list';
  import MdSelect from '../../../../node_modules/vue-material/src/components/mdSelect/mdSelect.vue';
  import MdOption from '../../../../node_modules/vue-material/src/components/mdSelect/mdOption.vue';
  import MdInputContainer from '../../../../node_modules/vue-material/src/components/mdInputContainer/mdInputContainer.vue';

  const countryList = countryListModule();
  const countries   = countryList.getNames();
  import vSelect from 'vue-select';
  const mapAPIKey = require('../../../../config/private').mapsApiKey;
  export default {
    components: {
      MdInputContainer,
      MdOption,
      MdSelect,
      vSelect
    },
    name: 'add_address',
    data() {
      return {
        lat: 10,
        lng: 10,
        mapShown: false,
        mapMarkerShown: false,
        country: '',
        countries,
        address1: '',
        address2: '',
        address3: '',
        mapButtonText: 'Show Map',
        formattedAddressShown: false,
        googleFormattedAddress: '',
        selectedAddressMarker: {
          position:{
            lat: 10,
            lng:10
          }
        },
        possibleAddresses:[],
        selectAddressFromListShown: false
      }
    },
    created() {
      Logger.info(`checking if user has geolocation`);
      Logger.info(`${JSON.stringify(countries)}`);
      if (navigator.geolocation) {
        Logger.info(`user has geo`);
        return;
      }
      Logger.info(`user does not have geo`);
    },
    methods: {
      async submitForm() {
        Logger.info(`submit form clicked`);
        if (!await this.$validator.validateAll()) {
          Logger.warn(`form is not valid`);
          bus.$emit('showSnack', 'Please ensure the form is correctly filled in');
          return;
        }
        Logger.info(`selected country: ${this.country}`);
        if (!this.country) {
          Logger.warn(`no country selected`);
          bus.$emit('showSnack', 'You must select a country')
        }
        const formattedAddress = formatAddress(this.address1, this.address2, this.address3, this.country);
        Logger.info(`formatted address retrieved, ${formattedAddress}`);
        //fixme add a show on map button to show user the location that they have selected
        const res = await this.$http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${mapAPIKey}`);
        Logger.info(`response status: ${res.status}`);
        if(res.status !== 200){
          Logger.info(`request returned with erorr response`);
          return;
        }
        Logger.info(`data returned form geocode request is: ${JSON.stringify(res)}`);
        const parsedResults = JSON.parse(JSON.stringify(res.body.results));
        Logger.info(`parsed data is: ${JSON.stringify(parsedResults)}`);
        Logger.info(`formatted address: ${parsedResults[0].formatted_address}`);
        if(parsedResults.length > 1){
          Logger.info(`more than one possible result returned, presenting user with a choice`);
          this.possibleAddresses = parsedResults;
          this.selectAddressFromListShown = true;
          return;
        }
        this.googleFormattedAddress = parsedResults[0].formatted_address;
        this.formattedAddressShown = true;
        this.lat = parsedResults[0].geometry.location.lat;
        this.lng = parsedResults[0].geometry.location.lng;
        this.selectedAddressMarker.position.lng = parsedResults[0].geometry.location.lng;
        this.selectedAddressMarker.position.lat = parsedResults[0].geometry.location.lat;
        this.mapMarkerShown = true;
        this.mapShown = true;
        Logger.info(`form is valid`);
      },
      resetForm() {
        //found at: https://stackoverflow.com/a/40856312/4108556
        Object.assign(this.$data, this.$options.data.call(this));
        //found at: https://github.com/baianat/vee-validate/issues/285
        this.$nextTick(function () {
          const self = this;
          Object.keys(this.fields).some(function (key) {
            self.$validator.flag(key, {
              untouched: true
            })
          });
          this.errors.clear();
        })
      },
      toggleMap(){
        this.mapShown = !this.mapShown;
        this.mapButtonText = this.mapShown ? 'Hide Map': 'Show Map'
      }
    }
  }
  function formatAddress(address1, address2, address3, country) {
    Logger.info('attempting to format address');
    Logger.info(`first line: ${address1}`);
    let address = address1 + ', ';
    if(address2 && address2.length > 0){
      Logger.info(`second line found. Second line: ${address2}`);
      address += address2 + ', ';
      if(address3 && address2.length > 0){
        Logger.info(`Third line found. Third line: ${address3}`);
        address += address3 + ', ';
      }
    }
    Logger.info(`returning ${address + country}`);
    return address + country;
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
