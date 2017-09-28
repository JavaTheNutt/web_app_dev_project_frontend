<template>
  <div>
    <h1 class="md-title">This is the profile page</h1>
    <div class="card-container--flex">
      <div class="card-container-inner--flex">
        <address-details-card></address-details-card>
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

  export default {
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
      addAddress() {
        Logger.info(`add address button clicked from profile`);
        this.$router.push('/profile/add_address')
      }
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
