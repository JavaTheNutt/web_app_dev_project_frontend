<template>
  <div><h1 class="md-title">This is the profile page</h1>
    <md-avatar class="md-large" ></md-avatar>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  import MdAvatar from '../../../../node_modules/vue-material/src/components/mdAvatar/mdAvatar.vue';

  export default {
    components: {MdAvatar},
    name: 'profile',
    mounted() {

    }
  }
</script>
