<template>
  <div>
    <h1 class="md-title">Signup for Home Resource Planner</h1>
    <div class="signUpForm">
      <form novalidate @submit.stop.prevent="submitForm">
        <md-input-container :class="{'md-input-invalid': errors.has('firstName')}">
          <label>First Name</label>
          <md-input type="text" v-model="firstName" data-vv-name="firstName" v-validate="'required|min:2'"
                    name="firstName"
          ></md-input>
          <span class="md-error">First name is required</span>
        </md-input-container>
        <md-input-container :class="{'md-input-invalid': errors.has('surname')}">
          <label>Surname</label>
          <md-input type="text" v-model="surname" data-vv-name="surname" v-validate="'required|min:2'" name="surname"
          ></md-input>
          <span class="md-error">Surname is required</span>
        </md-input-container>
        <div class="form-flex-container--button">
          <md-button class="md-raised md-accent" type="submit">Submit</md-button>
          <md-button class="md-raised md-primary" type="button" @click.native="resetForm">Reset</md-button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  import {Validator} from 'vee-validate';
  import bus from '../../services/bus';
  import types from '@/app/store/auth/types'
  export default {
    components: {},
    name: 'signup',
    data() {
      return {
        groupName: '',
        email: '',
        firstName: '',
        surname: '',
        password: '',
        confirmPassword: ''
      }
    },
    methods: {
      async submitForm() {
        if(!await this.$validator.validateAll()){
          bus.$emit('showSnack', 'Please ensure the form is correctly filled in');
          return;
        }
        this.$store.dispatch(types.actions.a_createNewUser, {email: this.email, password: this.password})
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
      }
    }
  }
</script>
<style scoped lang="scss">

  @media all and (max-width: 500px) {

  }

  @media all and (min-width: 500px) {
    .signUpForm {
      margin: 10px 30px;
    }
  }
</style>
