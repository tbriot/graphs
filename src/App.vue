<template>
  <v-app>

    <Toolbar/>

    <v-content class="grey darken-4 blue-grey--text text--lighten-3">
      <router-view class="mt-3"></router-view>
    </v-content>

  </v-app>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

import Toolbar from "./components/Toolbar.vue";

export default {
  name: 'App',
  components: { Toolbar }
};
</script>