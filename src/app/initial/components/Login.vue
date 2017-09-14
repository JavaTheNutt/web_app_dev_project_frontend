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
  import MdInputContainer from '../../../../node_modules/vue-material/src/components/mdInputContainer/mdInputContainer.vue';
  import MdInput from '../../../../node_modules/vue-material/src/components/mdInputContainer/mdInput.vue';
  import MdLayout from '../../../../node_modules/vue-material/src/components/mdLayout/mdLayout.vue';
  import MdButton from '../../../../node_modules/vue-material/src/components/mdButton/mdButton.vue';
  import * as firebase from '../service/firebase';
  import bus from '../../services/bus';
  import * as Logger from 'loglevel';
  import {mapActions} from 'vuex';

  export default {
    components: {
      MdButton,
      MdLayout,
      MdInput,
      MdInputContainer
    },
    name: 'login',
    data() {
      return {
        userEmail: '',
        userPassword: ''
      }
    },
    methods: {
      mapActions(){
        'a_logInUser'
      },
      async submitForm() {
        Logger.info('submit form clicked');
        // noinspection JSCheckFunctionSignatures
        if (!await this.$validator.validateAll()) {
          Logger.info(`form not valid`);
          bus.$emit('showSnack', 'form is not valid');
          return;
        }
        Logger.info(`form is valid`);
        const firebaseError = await firebase.login(this.userEmail, this.userPassword);
        if (firebaseError) {
          Logger.info(`login failed in component while communicating with the auth server`);
          bus.$emit('showSnack', firebaseError);
          return;
        }
        this.$store.dispatch('a_logInUser', {email: this.userEmail,password: this.userPassword});
        /*Logger.info('auth server login successfull');
        let userGroup;
        try {
          //fixme better error display
          userGroup = await this.$http.get('http://localhost:3000/login/firebase', {
            headers: {
              authProvider: 'firebase',
              token: await firebase.getToken()
            }
          });
        } catch (err) {
          Logger.error(`error fetching data, ${JSON.stringify(err)}`);
          return;
        }
        Logger.info(`success!! ${JSON.stringify(userGroup)}`);*/
        this.$router.push('/');
      }
    },
    mounted(){
      if(!navigator.onLine){
        bus.$emit('connection_lost');
        Logger.info(`no internet connection`);
      }
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
