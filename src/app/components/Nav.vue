<template>
  <div>
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <h2 class="md-title" style="flex:1">Finance Tracker</h2>
      <md-menu v-if="loggedIn">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon md-iconset="fa fa-ellipsis-v"></md-icon>
        </md-button>
        <md-menu-content>
          <md-menu-item @click.native="triggerLogOut">Logout</md-menu-item>
        </md-menu-content>
      </md-menu>
      <md-avatar @click.native="redirect('/profile')" class="nav-avatar" v-if="loggedIn">
        <img :src="picSrc" alt="Profile Picture">
      </md-avatar>
    </md-toolbar>
    <md-card></md-card>
    <md-sidenav class="md-left" ref="leftSidenav" @open="open('Left')" @close="close('Left')">
      <md-toolbar class="md-small">
        <div class="md-toolbar-container">
          <h3 class="md-subtitle">Navigation</h3>
        </div>
      </md-toolbar>
      <md-list>
        <md-list-item @click.native="$refs.leftSidenav.close();redirect('/')" class="side-nav--list-item">
          <p class="side-nav--link">Home</p>
        </md-list-item>
      </md-list>
    </md-sidenav>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  import {mapGetters} from 'vuex';
  import authTypes from '@/app/store/auth/types';
  import MdIcon from '../../../node_modules/vue-material/src/components/mdIcon/mdIcon.vue';
  import MdMenu from '../../../node_modules/vue-material/src/components/mdMenu/mdMenu.vue';
  import MdMenuContent from '../../../node_modules/vue-material/src/components/mdMenu/mdMenuContent.vue';
  import MdMenuItem from '../../../node_modules/vue-material/src/components/mdMenu/mdMenuItem.vue';
  import defaultProfilePic from '@/assets/defaultProf.png';
  //fixme need to fix link styling in side nav bar
  export default {
    data(){
      return {
        picSrc: defaultProfilePic
      }
    },
    components: {
      MdMenuItem,
      MdMenuContent,
      MdMenu,
      MdIcon
    },
    name: 'navigation',
    computed: {
      ...mapGetters({
        loggedIn: authTypes.getters.loggedIn
      })
    },
    methods: {
      toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle();
      },
      open(ref) {
        Logger.info(`Opened: ${ref}`);
      },
      close(ref) {
        Logger.info(`Closed: ${ref}`);
      },
      redirect(ref) {
        Logger.info(`redirecting to ${ref}`);
        this.$router.push(ref);
      },
      goLogin() {
        this.$router.push('/login')
      },
      triggerLogOut() {
        Logger.info(`log out ui triggered, dispatching logout event`);
        this.$store.dispatch(authTypes.actions.a_logOutUser);
      }
    }
  }
</script>
<style scoped lang="scss">
  .side-nav--link {
    cursor: default;
  }

  .side-nav--list-item {
    cursor: pointer;
  }
  .nav-avatar{
    cursor: pointer;
  }
</style>
