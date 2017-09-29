<template>
  <md-card>
    <md-card-header><h1 class="md-title">Addresses</h1></md-card-header>
    <md-card-actions>
      <md-button class="md-raised md-accent md-icon-button" @click.native="addAddress">
        <md-icon>add</md-icon>
      </md-button>
    </md-card-actions>
  </md-card>
</template>
<script>
  import * as Logger from 'loglevel';
  export default{
    name: 'address-details-card',
    methods:{
      addAddress() {
        Logger.info(`add address button clicked from view address component`);
        this.$router.push('/profile/add_address')
      }
    }
  }
</script>
