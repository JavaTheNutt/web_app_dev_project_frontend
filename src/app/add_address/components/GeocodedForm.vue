<template>
  <div>
    <form novalidate @submit.stop.prevent="submitForm">
      <md-input-container :class="{'md-input-invalid': errors.has('address1')}" required>
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
        <md-select name="country" id="country" v-model="sendableAddress.country" required>
          <md-option v-for="currentCountry in getCountryNames" :key="currentCountry"
                     :value="JSON.stringify(currentCountry)">
            {{currentCountry}}
          </md-option>
        </md-select>
      </md-input-container>
      <div class="form-flex-container--button">
        <md-button class="md-raised md-primary md-icon-button" type="button" @click.native="submitData"
                   :disabled="!checkAddressButtonEnabled"><!--Check Address--><md-icon>search</md-icon>
        </md-button>
        <md-button class="md-raised md-accent md-icon-button" type="button" @click.native="resetForm" :disabled="!formHasValues"><!--Reset--><md-icon>refresh</md-icon></md-button>
      </div>
    </form>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import * as Logger from 'loglevel';
  import _ from 'lodash';
  import types from '../vuex/types';
  import countryTypes from '@/app/store/countries/types';
  import addAddressBus from '@/app/add_address/service/bus';
  import MdIcon from '../../../../node_modules/vue-material/src/components/mdIcon/mdIcon.vue';

  export default {
    components: {MdIcon},
    name: 'geocoded_form',
    computed: {
      ...mapGetters({getCountryNames: countryTypes.getters.getCountryNames, getRoutePrefix: types.getters.getRoutePrefix}),
      checkAddressButtonEnabled() { //this function will watch to see if the check address button should be enabled
        if (this.sendableAddress.address1.length < 1) {
          Logger.info(`address1 does not exist`);
          return false;
        }
        if (this.sendableAddress.country.length < 1) {
          Logger.info(`country does not exist`);
          return false;
        }
        return true;
      },
      formHasValues(){
        Logger.info(`recalculating form values`);
        const hasValues = this.sendableAddress.address1.length > 1 || this.sendableAddress.address2.length > 1 || this.sendableAddress.address3.length > 1 || this.sendableAddress.country.length > 1;
        Logger.info(`form hasvaleus result is: ${hasValues}`);
        return hasValues;
      }
    },
    data() {
      return {
        sendableAddress: {
          address1: '',
          address2: '',
          address3: '',
          country: ''
        }
      }
    },
    methods: {
      submitData() {
        Logger.info(`submit clicked on add address form`);
        Logger.info(`data to be submitted: ${JSON.stringify(this.sendableAddress)}`);
        //this.$store.dispatch(types.actions.a_setFormValues, this.sendableAddress);
        this.$emit('addressSelected', JSON.stringify(this.sendableAddress));
        this.$store.dispatch(types.actions.a_fetchResults, this.sendableAddress);
        //this.$router.push(`${this.getRoutePrefix}/add_address/select_details`); //fixme this should emit the event to the parent and the parent should handle routing
      },

      resetForm() {
        //found at: https://stackoverflow.com/a/40856312/4108556 resets data object to initial
        this.$store.dispatch(types.actions.a_resetFormValues);
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
      }
    },
    mounted() {
      //need to set local state to the last state of the form
      //https://stackoverflow.com/a/44834961/4108556
      let initalAddressValues = this.$store.getters[types.getters.getValues];
      Logger.info(`initial values retrieved from the store are: ${JSON.stringify(initalAddressValues)}`);
      if (!initalAddressValues || _.isEmpty(initalAddressValues)) {
        Logger.info(`no initial values found, fallback to default  values`);
        return;
      }
      Logger.info(`initial values found, setting values to data`);
      this.sendableAddress.address1 = initalAddressValues.address1;
      this.sendableAddress.address2 = initalAddressValues.address2;
      this.sendableAddress.address3 = initalAddressValues.address3;
      this.sendableAddress.country  = initalAddressValues.country;

      addAddressBus.$on('multipleAddressesFound', ()=>{
        Logger.info(`multiple address event caught in form, redirecting to table`);
        this.$router.push(`${this.getRoutePrefix}/add_address/select_details`);
      });
      addAddressBus.$on('noAddressesFound', ()=>{
        Logger.info(`form caught no address event`);
      })
      //fixme: the way this is currently being done is awful. needs refactoring
/*
      this.$store.subscribe((mutation, state) => {
        Logger.info(`subscribe called`);
        if(!mutation.payload || _.isEmpty(mutation.payload)){
          Logger.info(`empty request mutation detected`);
          return;
        }
        if(mutation.payload.selectedAddress || !_.isEmpty(mutation.payload.selectedAddress)){
          Logger.info(`selected address payload detected`);
          return;
        }
        if(mutation.payload.possibleAddresses || !_.isEmpty(mutation.payload.possibleAddresses)){
          Logger.info(`possible address payload detected`);
          return;
        }
        Logger.info(`payload: ${JSON.stringify(mutation.payload)}`);
        Logger.info(`selected address properties: ${Object.keys(mutation.payload.selectedAddress).length}`);
        Logger.info(`possible address properties: ${Object.keys(mutation.payload.data).length}`);
        if (mutation.type === types.mutations.m_setSelectedAddress && Object.keys(mutation.payload.selectedAddress).length < 1) {
          Logger.info(`mutation is to set a single address and is not empty`);
        }
        if(mutation.type === types.mutations.m_setResults && Object.keys(mutation.payload.data).length < 1){
          Logger.info(`mutation is to set multiple addresses and is not empty`);
          this.$router.push(`${this.getRoutePrefix}/add_address/select_details`);
        }
      })
*/
    }
  }
</script>
