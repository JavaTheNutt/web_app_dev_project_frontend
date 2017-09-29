<template>
  <md-card>
    <md-card-header><h1 class="md-title">Addresses</h1></md-card-header>
    <md-card-content>
      <p v-for="(address, index) in addressesToDisplay" :key="index">{{address.text}}</p>
    </md-card-content>
    <md-card-actions>
      <md-button class="md-raised md-accent md-icon-button" @click.native="addAddress">
        <md-icon>add</md-icon>
      </md-button>
    </md-card-actions>
  </md-card>
</template>
<script>
  import * as Logger from 'loglevel';
  import firebase from 'firebase';
  import MdCardContent from '../../../../node_modules/vue-material/src/components/mdCard/mdCardContent.vue';

  export default {
    components: {MdCardContent},
    name: 'address-details-card',
    props: ['uid'],
    data() {
      return {
        addressesToDisplay: []
      }
    },
    methods: {
      addAddress() {
        Logger.info(`add address button clicked from view address component`);
        this.$router.push('/profile/add_address');
      }
    },
    mounted() {
      Logger.info(`display addresses card created`);
      Logger.info(`current user id: ${this.uid}`);
      firebase.database().ref(`users/${this.uid}/addresses`).once('value').then((snapshot) => {
        Logger.info(`firebase reference updated`);
        const res = Object.assign({}, snapshot.val());
        Logger.info(`result: ${JSON.stringify(res)}`);
        const resAry = Object.keys(res).map((key) => {
          return res[key];
        });
        Logger.info(`result array: ${JSON.stringify(resAry)}`);
        this.addressesToDisplay = resAry;
      })

    }
  }
</script>
