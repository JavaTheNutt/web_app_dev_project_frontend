<template>
  <div  class="map-container">
    <gmap-map :center="{lat:chosenAddress.geometry.lat, lng:chosenAddress.geometry.lng}" :zoom="20"
              map-type-id="terrain" class="custom-view-map">
      <gmap-marker :position="chosenAddress.geometry"></gmap-marker>
    </gmap-map>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';

</script>
