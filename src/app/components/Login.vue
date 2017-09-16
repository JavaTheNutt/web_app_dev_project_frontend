<!--suppress JSUnusedGlobalSymbols -->

<template>
  <div>
    <h1 class="md-title">Please login to use this service</h1>
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
        <div class="form-flex-container--button">
          <md-button class="md-raised md-accent" type="submit">Submit</md-button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  import * as firebase from '../initial/service/firebase';
  import bus from '../services/bus';
  import * as Logger from 'loglevel';

  export default {
    components: {},
    name: 'login',
    data() {
      return {
        userEmail: '',
        userPassword: ''
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
        this.$store.dispatch('a_logInUser', {email: this.userEmail,password: this.userPassword});
        this.$router.push('/');
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
