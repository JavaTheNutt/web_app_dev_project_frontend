<!--suppress JSUnusedGlobalSymbols -->

<template>
  <div>
    <h1 class="md-title">Please {{labelText}} to use this service</h1>
    <md-switch v-model="isSignUp" id="isSignUp" name="isSignUp">Sign up</md-switch>
    <form novalidate @submit.stop.prevent="submitForm">
      <div class="form-flex-container">
        <div class="form-flex-container--field">
          <md-input-container :class="{'md-input-invalid': errors.has('email')}">
            <label>Email</label>
            <md-input type="email" v-model="userEmail" data-vv-name="email" v-validate name="email"
                      data-vv-rules="required|email" ref="emailField"></md-input>
            <span class="md-error">A valid email address is required</span>
          </md-input-container>
        </div>
        <div class="form-flex-container--field">
          <md-input-container :class="{'md-input-invalid': errors.has('password')}" mdHasPassword>
            <label>Password</label>
            <md-input type="password" v-model="userPassword" data-vv-name="password" v-validate name="password"
                      data-vv-rules="required" ref="passwordField"></md-input>
            <span class="md-error">Password is required</span>
          </md-input-container>
        </div>
        <div class="form-flex-container--field" v-if="isSignUp">
          <md-input-container :class="{'md-input-invalid': errors.has('confirmPassword')}" mdHasPassword>
            <label>Confirm Password</label>
            <md-input type="password" v-model="confirmPassword" data-vv-name="confirmPassword" v-validate="'required|confirmed:password'" name="confirmPassword"
                       ref="confirmPasswordField"></md-input>
            <span class="md-error">Passwords must match</span>
          </md-input-container>
        </div>
        <div class="form-flex-container--button">
          <md-button class="md-raised md-accent" type="submit">Submit</md-button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  import bus from '../services/bus';
  import * as Logger from 'loglevel';
  import types from '@/app/store/auth/types';
  import MdSwitch from '../../../node_modules/vue-material/src/components/mdSwitch/mdSwitch.vue';

  export default {
    components: {MdSwitch},
    name: 'login',
    data() {
      return {
        userEmail: '',
        userPassword: '',
        confirmPassword: '',
        isSignUp: false
      }
    },
    methods: {
      async submitForm() {
        Logger.info('submit form clicked');
        // noinspection JSCheckFunctionSignatures
        if (!await this.$validator.validateAll()) {
          Logger.info(`form not valid`);
          bus.$emit('showSnack', 'form is not valid');
          return;
        }
        Logger.info(`form is valid`);
        const action = this.isSignUp ? types.actions.a_createNewUser : types.actions.a_logInUser;
        this.$store.dispatch(action, {email: this.userEmail,password: this.userPassword});
      }
    },
    computed:{
      labelText(){
        return this.isSignUp ? 'sign up': 'login';
      }
    },
    mounted(){
      Logger.info(`login mounted`);
    }
  }
</script>
<style scoped lang="scss">
  .form-flex-container {
    display: flex;
  }

  @media all and (max-width: 500px) {
    .form-flex-container {
      flex-direction: column;
    }
    .form-flex-container--field {
      width: 100%;
      flex-direction: column;
    }
  }

  @media all and (min-width: 500px) {
    .form-flex-container {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    .form-flex-container--field {
      margin: 10px;
      width: 40%;
    }
  }
</style>
