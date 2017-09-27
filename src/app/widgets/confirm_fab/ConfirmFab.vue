<template>
  <div class="button-container">
    <md-button class="md-accent md-raised md-icon-button accept-button" @click.native="accept"
               type="button">
      <md-icon >done</md-icon>
    </md-button>
    <md-button class="md-primary md-icon-button md-raised" type="button" @click.native="reject">
      <md-icon>clear</md-icon>
    </md-button>
  </div>
</template>
<script>
  export default {
    name: 'confirm-fab',
    methods:{
      accept(){
        this.$emit('accept');
      },
      reject(){
        this.$emit('reject');
      }
    }
  }
</script>
<style scoped lang="scss">
  /*Overwrite theme settings for this component*/
  .md-theme-secondary.md-button:not([disabled]).md-accent.md-raised.accept-button{
    color: white;
  }
</style>
