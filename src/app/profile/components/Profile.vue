<template>
  <div>
    <h1 class="md-title">This is the profile page</h1>
    <div class="card-container--flex">
      <div class="card-container-inner--flex">
        <address-details-card :uid="firebaseId"></address-details-card>
      </div>
      <div class="card-container-inner--flex">
        <user-details-card :email="emailAddress"></user-details-card>
      </div>
    </div>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  import MdAvatar from '../../../../node_modules/vue-material/src/components/mdAvatar/mdAvatar.vue';
  import MdButton from '../../../../node_modules/vue-material/src/components/mdButton/mdButton.vue';
  import MdCard from '../../../../node_modules/vue-material/src/components/mdCard/mdCard.vue';
  import MdCardHeader from '../../../../node_modules/vue-material/src/components/mdCard/mdCardHeader.vue';
  import UserDetailsCard from './UserDetailsCard.vue';
  import AddressDetailsCard from './AddressDetailsCard.vue';
  import {mapGetters} from 'vuex';
  import types from '../vuex/types';
  import authTypes from '@/app/store/auth/types';
  import addAddressTypes from  '@/app/add_address/vuex/types';
  import firebase from 'firebase';
  import {addPersonalAddress} from '../service/profileService';

  export default {
    data(){
     return{ firebaseId : ''}
    },
    components: {
      AddressDetailsCard,
      UserDetailsCard,
      MdCardHeader,
      MdCard,
      MdButton,
      MdAvatar
    },
    computed:{
      ...mapGetters({emailAddress: authTypes.getters.getUserEmail})
    },
    name: 'profile',
    methods: {
    },
    created(){
      Logger.info(`profile page mounted. is there a new address to fetch? ${this.$route.query.isNewAddress ? 'yes':'no'}`);
      this.firebaseId = this.$store.getters[authTypes.getters.getFirebaseId];
      Logger.info(`firebase uid is ${this.firebaseId}`);
      if(this.$route.query.isNewAddress){
        Logger.info(`fetching address`);
        const selectedAddress = Object.assign({}, this.$store.getters[addAddressTypes.getters.getSelectedAddress]);
        Logger.info(`fetched address is: ${JSON.stringify(selectedAddress)}`);
        //firebase.database().ref(`/users/${this.firebaseId}/addresses`).push(selectedAddress);
        addPersonalAddress(selectedAddress);
        this.$store.dispatch(addAddressTypes.actions.a_resetComponent);
      }
    },
    mounted(){
      //this wasn't working when in the created hook. I will have to look more closely into the lifecycle to see why this component
      //was created before the router was instantiated.
      if(this.$route.query.isNewAddress) this.$router.replace(this.$route.path); //remove isNewAddress flag if present
    }
  }
</script>
<style scoped lang="scss">
  .card-container--flex {
    display: flex;
  }

  .card-container-inner--flex {
    margin: 10px;
    width: 100%;
  }

  @media all and (max-width: 500px) {
    .card-container--flex {
      flex-direction: column;
    }
  }

  @media all and (min-width: 500px) {
    .card-container--flex {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

  }
</style>
