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
      <div class="form-flex-container--button">
        <md-button class="md-raised md-accent" type="button" @click.native="submitData"
                   :disabled="!checkAddressButtonEnabled">Check Address
        </md-button>
        <md-button class="md-raised md-warn" type="button" @click.native="resetForm">Reset</md-button>
      </div>
    </form>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import * as Logger from 'loglevel';
  import _ from 'lodash';

  export default {
    name: 'geocoded_form',
    computed: {
      ...mapGetters(['getCountryNames', 'addAddressValues']),
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
      //fixme currently, if the user inputs an address, checks it and then returns to the form, the form is empty
      //      need to pass props down when component is added to the dom to ensure that the fields remain filled
      submitData() {
        Logger.info(`submit clicked on add address form`);
        Logger.info(`data to be submitted: ${JSON.stringify(this.sendableAddress)}`);
        this.$store.dispatch('a_setAddAddressFormValues', this.sendableAddress);
        this.$emit('addressSelected', JSON.stringify(this.sendableAddress));
      },

      resetForm() {
        //found at: https://stackoverflow.com/a/40856312/4108556 resets data object to initial
        this.$store.dispatch('a_resetFormToInitial');
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
      let initalAddressValues = this.$store.getters.getAddAddressValues;
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
    }
  }
</script>
