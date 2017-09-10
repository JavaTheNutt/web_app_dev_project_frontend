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
                      data-vv-rules="required|email"></md-input>
            <span class="md-error">A valid email address is required</span>
          </md-input-container>
        </div>
        <div class="form-flex-container--field">
          <md-input-container :class="{'md-input-invalid': errors.has('password')}" mdHasPassword>
            <label>Password</label>
            <md-input type="password" v-model="userPassword" data-vv-name="password" v-validate name="password"
                      data-vv-rules="required"></md-input>
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
  import firebase from 'firebase';

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
      async submitForm() {
        this.$log.debug('submit form clicked');
        // noinspection JSCheckFunctionSignatures
        if (!await this.$validator.validateAll()) {
          this.$log.debug('form not valid');
          return;
        }
        this.$log.debug('form submitted');
        try {
          this.$log.debug('attempting to login with firebase');
          await firebase.auth().signInWithEmailAndPassword(this.userEmail, this.userPassword);
          this.$log.debug('login succeeded', JSON.stringify(firebase.auth().currentUser));
        } catch (err) {
          this.$log.error('login failed', err);
        }
      }
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
