<template>
  <v-app>

    <Toolbar/>

    <v-content>
      <router-view></router-view>
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