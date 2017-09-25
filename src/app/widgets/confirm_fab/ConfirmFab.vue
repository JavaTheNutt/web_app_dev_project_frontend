<template>
  <div class="button-container">
    <md-button md-theme="secondary" class="md-raised md-accent md-icon-button accept-button" @click.native="accept"
               type="button">
      <md-icon >done</md-icon>
    </md-button>
    <md-button class="md-raised md-warn md-icon-button" type="button" @click.native="reject">
      <md-icon>clear</md-icon>
    </md-button>
  </div>
</template>
<script>
  export default {
    name: 'confirm_fab',
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
