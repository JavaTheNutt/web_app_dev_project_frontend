<template>
  <div  class="map-container">
    <gmap-map :center="{lat:shownMarker.geo.lat, lng:shownMarker.geo.lng}" :zoom="20"
              map-type-id="terrain" class="custom-view-map">
      <gmap-marker :position="shownMarker.geo"></gmap-marker>
    </gmap-map>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  export default {
    name: 'marked-map',
    props:['markers'],
    data(){
      return{
        currentMarkerIndex: 0
      }
    },
    computed:{
      shownMarker(){return this.markers[this.currentMarkerIndex]},
      notFirstElement(){return this.currentMarkerIndex !== 0},
      notLastElement(){return this.currentMarkerIndex !== this.markers.length -1}
    },
    methods:{
      incrementMarkerIndex() {
        Logger.info(`attempting to increment marker index`);
        if (!this.notLastElement()) {
          Logger.info(`marker is last in group`);
          return;
        }
        Logger.info(`increment successful`);
        this.currentMarkerIndex++;
      },
      decrementMarkerIndex(){
        Logger.info(`attempting to decrement marker index`);
        if (!this.notFirstElement()) {
          Logger.info(`marker is first in group`);
          return;
        }
        Logger.info(`decrement successful`);
        this.currentMarkerIndex--;
      }
    }
  }
</script>
<style scoped lang="scss">
  .map-container {
    margin: 30px 0;
  }

  .custom-view-map {
    width: 100%;
    height: 500px;
  }
</style>
