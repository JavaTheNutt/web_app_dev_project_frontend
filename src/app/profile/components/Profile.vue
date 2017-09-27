<template>
  <div>
    <h1 class="md-title">This is the profile page</h1>
    <!--fixme update to icon buttons-->
    <div class="card-container--flex">
      <div class="card-container-inner--flex">
        <md-card>
          <md-card-header><h1 class="md-title">Addresses</h1></md-card-header>
          <md-card-actions>
            <md-button class="md-raised md-accent md-icon-button" @click.native="addAddress">
              <md-icon>add</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
      </div>
      <div class="card-container-inner--flex">
        <md-card>
          <md-card-header><h1 class="md-title">Addresses</h1></md-card-header>
          <md-button class="md-raised md-accent md-icon-button" @click.native="addAddress">
            <md-icon>add</md-icon>
          </md-button>
        </md-card>
      </div>
      <div class="card-container-inner--flex">
        <md-card>
          <md-card-header><h1 class="md-title">Addresses</h1></md-card-header>
          <md-button class="md-raised md-accent md-icon-button" @click.native="addAddress">
            <md-icon>add</md-icon>
          </md-button>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  import MdAvatar from '../../../../node_modules/vue-material/src/components/mdAvatar/mdAvatar.vue';
  import MdButton from '../../../../node_modules/vue-material/src/components/mdButton/mdButton.vue';
  import MdCard from '../../../../node_modules/vue-material/src/components/mdCard/mdCard.vue';
  import MdCardHeader from '../../../../node_modules/vue-material/src/components/mdCard/mdCardHeader.vue';

  export default {
    components: {
      MdCardHeader,
      MdCard,
      MdButton,
      MdAvatar
    },
    name: 'profile',
    methods: {
      addAddress() {
        Logger.info(`add address button clicked from profile`);
        this.$router.push('/profile/add_address')
      }
    }
  }
</script>
<style scoped lang="scss">
  .card-container--flex {
    display: flex;
  }

  .card-container-inner--flex {
    margin: 10px;
    width: 100%;
  }

  @media all and (max-width: 500px) {
    .card-container--flex {
      flex-direction: column;
    }
  }

  @media all and (min-width: 500px) {
    .card-container--flex {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

  }
</style>
