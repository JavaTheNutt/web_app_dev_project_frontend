<template>
  <div><md-button class="md-raised md-accent" @click.native="returnToForm">Re-enter address</md-button>
  <md-table-card>
    <md-toolbar>
      <h1 class="md-title">Possible Addresses</h1>
      <md-button class="md-icon-button">
        <md-icon>filter_list</md-icon>
      </md-button>
    </md-toolbar>
    <md-table>
      <md-table-body>
        <md-table-row v-for="(address, index) in possibleAddresses" :key="index" :md-item="address" v-if="rowShown(index)" @click.native="itemSelected(address)">
          <md-table-cell :md-numeric="false" ><md-ink-ripple ></md-ink-ripple>{{address.formatted_address}}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
    <md-table-pagination
      :md-size="currentPageSize"
      md-label="Rows"
      md-seperator="of"
      :mdPage="currentTablePage"
      :mdTotal="possibleAddresses.length"
      :md-page-options="[5, 10, 25, 50]"
      @pagination="onPagination"
    ></md-table-pagination>
  </md-table-card></div>
</template>
<script>
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  import types from '@/app/add_address/vuex/types'
  export default {
    components:{},
    name: 'select-address-table',
    //props:['possibleAddresses'],
    data(){
      return{
        currentPageSize: 5,
        currentTablePage: 1
      }
    },
    methods:{
      returnToForm(){
        Logger.info(`return to form clicked`);
        this.$router.go(-1);
        //this.$emit('returnToForm');
      },
      itemSelected(item){
        Logger.info(`selected address is: ${item.formatted_address}`);
        this.$emit('addressSelectedFromTable', JSON.stringify(item))
      },
      rowShown(index){
        Logger.info(`attempting to see if row with index ${index} should be shown`);
        Logger.info(`row shown: ${index >= this.tableBounds.lower && index <= this.tableBounds.upper}`);
        return index >= this.tableBounds.lower && index <= this.tableBounds.upper
      },
      onPagination(data){
        Logger.info(`table pagination event recieved`);
        Logger.info(`data recieved: ${JSON.stringify(data)}`);
        this.currentTablePage = data.page;
        this.currentPageSize = data.size;
      }
    },
    computed:{
      tableBounds(){
        Logger.info(`testing the current view bounds for table`);
        Logger.info(`any item with index between ${((this.currentPageSize * this.currentTablePage)) - this.currentPageSize} and ${(this.currentPageSize * this.currentTablePage) -1} should be shown`);
        return {upper: (this.currentPageSize * this.currentTablePage) -1, lower: ((this.currentPageSize * this.currentTablePage)) - this.currentPageSize};
      },
      ...mapGetters({
        possibleAddresses: types.getters.getPossibleAddresses
      })
    }
  }
</script>
<style scoped lang="scss">

</style>
