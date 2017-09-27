<template>
  <div  class="map-container">
    <marked-map :markers="[selectedAddress]"></marked-map>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  import MarkedMap from '@/app/widgets/marked_map/MarkedMap'
  import {mapGetters} from 'vuex';
  import types from '@/app/add_address/vuex/types';
  export default{
    name: 'geocoded-map',
    components: {MarkedMap},
    computed:{
      ...mapGetters({selectedAddress: types.getters.getSelectedAddress})
    }
  }
</script>
