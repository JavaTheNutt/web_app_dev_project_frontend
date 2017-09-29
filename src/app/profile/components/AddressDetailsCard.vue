<template>
  <!--<md-card>
    <md-card-header><h1 class="md-title">Addresses</h1></md-card-header>
    &lt;!&ndash;<md-card-content>
      <p v-for="(address, index) in addressesToDisplay" :key="index">{{address.text}}</p>
    </md-card-content>&ndash;&gt;
    <md-whiteframe v-for="(address, index) in addressesToDisplay" :key="index" mdElevation="12" class="custom-whiteframe">
      <p>{{address.text}}</p>
    </md-whiteframe>
    <md-card-actions>
      <md-button class="md-raised md-accent md-icon-button" @click.native="addAddress">
        <md-icon>add</md-icon>
      </md-button>
    </md-card-actions>
  </md-card>-->
  <!--<md-whiteframe mdElevation="24">-->
    <md-table-card class="table-outer">
      <md-toolbar>
        <h1 class="md-title">Current Addresses</h1>
        <md-button class="md-icon-button">
          <md-icon>filter_list</md-icon>
        </md-button>
      </md-toolbar>
      <md-table>
        <md-table-body>
          <md-table-row v-for="(address, index) in addressesToDisplay" :key="index" :md-item="address">
            <md-table-cell :md-numeric="false">
              <md-ink-ripple></md-ink-ripple>
              {{address.text}}
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>
      <md-card-actions>
        <md-button class="md-raised md-accent md-icon-button" @click.native="addAddress">
          <md-icon>add</md-icon>
        </md-button>
      </md-card-actions>
    </md-table-card>
  <!--</md-whiteframe>-->
</template>
<script>
  import * as Logger from 'loglevel';
  import firebase from 'firebase';
  import MdCardContent from '../../../../node_modules/vue-material/src/components/mdCard/mdCardContent.vue';
  import MdCardHeader from '../../../../node_modules/vue-material/src/components/mdCard/mdCardHeader.vue';
  import MdWhiteframe from '../../../../node_modules/vue-material/src/components/mdWhiteframe/mdWhiteframe.vue';
  import MdCard from '../../../../node_modules/vue-material/src/components/mdCard/mdCard.vue';
  import MdTable from '../../../../node_modules/vue-material/src/components/mdTable/mdTable.vue';

  export default {
    components: {
      MdTable,
      MdCard,
      MdWhiteframe,
      MdCardHeader,
      MdCardContent},
    name: 'address-details-card',
    props: ['uid'],
    data() {
      return {
        addressesToDisplay: []
      }
    },
    methods: {
      addAddress() {
        Logger.info(`add address button clicked from view address component`);
        this.$router.push('/profile/add_address');
      }
    },
    mounted() {
      Logger.info(`display addresses card created`);
      Logger.info(`current user id: ${this.uid}`);
      firebase.database().ref(`users/${this.uid}/addresses`).once('value').then((snapshot) => {
        Logger.info(`firebase reference updated`);
        const res = Object.assign({}, snapshot.val());
        Logger.info(`result: ${JSON.stringify(res)}`);
        const resAry = Object.keys(res).map((key) => {
          return res[key];
        });
        Logger.info(`result array: ${JSON.stringify(resAry)}`);
        this.addressesToDisplay = resAry;
      })

    }
  }
</script>
<style scoped lang="scss">
  .custom-whiteframe{
    margin: 0 10px;
  }
</style>
