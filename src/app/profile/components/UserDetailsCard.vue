<template>
  <md-card>
    <md-card-header><h1 class="md-title">User Details</h1></md-card-header>
    <md-card-content>
    <p>Email Address: {{email}}</p>
    </md-card-content>
    <md-card-actions>
      <md-button class="md-raised md-primary md-icon-button" @click.native="addAddress">
        <md-icon>edit</md-icon>
      </md-button>
    </md-card-actions>
  </md-card>
</template>
<script>
  export default {
    name: 'user-details-card',
    props:['email']
  }
</script>
