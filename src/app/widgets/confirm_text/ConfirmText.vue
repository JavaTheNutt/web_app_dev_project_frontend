<template>
  <div>
    <p class="md-subtitle" v-for="message in messages">{{message}}</p>
    <confirm-fab @accept="$emit('accept')" @reject="$emit('reject')"></confirm-fab>
  </div>
</template>
<script>
  import ConfirmFab from '../confirm_fab/ConfirmFab'
  export default {
    name: 'confirm-text',
    props: ['messages'],
    components:{ConfirmFab}
  }
</script>
