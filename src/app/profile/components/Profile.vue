<template>
  <div>
    <h1 class="md-title">This is the profile page</h1>
    <!--fixme update to icon buttons-->
    <md-button class="md-raised md-accent" @click.native="addAddress">Add Address</md-button>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  import MdAvatar from '../../../../node_modules/vue-material/src/components/mdAvatar/mdAvatar.vue';
  import MdButton from '../../../../node_modules/vue-material/src/components/mdButton/mdButton.vue';

  export default {
    components: {
      MdButton,
      MdAvatar},
    name: 'profile',
    methods:{
      addAddress(){
        Logger.info(`add address button clicked from profile`);
        this.$router.push('/profile/add_address')
      }
    }
  }
</script>
