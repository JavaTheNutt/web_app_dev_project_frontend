<template>
  <div>
    <h1 class="md-title">Signup for Home Resource Planner</h1>
    <div class="signUpForm">
      <form novalidate @submit.stop.prevent="submitForm">
        <md-input-container :class="{'md-input-invalid': errors.has('groupName')}">
          <label>Group Name</label>
          <md-input type="text" v-model="groupName" data-vv-name="groupName" v-validate="'required|alpha|min:3'"
                    name="groupName"
          ></md-input>
          <span
            class="md-error">Group name must be more than three characters. Numbers and special symbols not allowed</span>
        </md-input-container>
        <md-input-container :class="{'md-input-invalid': errors.has('email')}">
          <label>Email</label>
          <md-input type="email" v-model="email" data-vv-name="email" v-validate="'required|email'" name="email"
          ></md-input>
          <span class="md-error">A valid email address is required</span>
        </md-input-container>
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
        <md-input-container :class="{'md-input-invalid': errors.has('password')}" mdHasPassword>
          <label>Password</label>
          <md-input type="password" v-model="password" data-vv-name="password" name="password" v-validate="'required|min:6'"
          ></md-input>
          <span class="md-error">Password must be at least 6 characters</span>
        </md-input-container>
        <md-input-container :class="{'md-input-invalid': errors.has('confirmPassword')}" mdHasPassword>
          <label>Confirm Password</label>
          <md-input type="password" v-model="confirmPassword" data-vv-name="confirmPassword" name="confirmPassword"
                    v-validate="'required|confirmed:password'"
          ></md-input>
          <span class="md-error">Passwords must match</span>
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
  import * as firebase from '../service/firebase';

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
        let firebaseErrorMessge = await firebase.signUp(this.email, this.password);
        if(firebaseErrorMessge){
          bus.$emit('showSnack', firebaseErrorMessge);
          return;
        }
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
