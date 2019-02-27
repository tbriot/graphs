<template>
  <nav>
    <v-toolbar app dense class="blue-grey darken-4" dark>
	  <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
		  
		<router-link to="/home">
			<img src="/img/graph-logo.svg" height="40"/>
		</router-link>
        <span class="blue-grey--text text--lighten-3">Graphs</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

	  <v-toolbar-items v-if="isLoggedIn">
	    <ToolbarUserMenu></ToolbarUserMenu>	
	  </v-toolbar-items>
	  
	  <v-toolbar-items v-else>
			<SignInFormMenu/>
	    <v-btn href="./signup.html" round small color="success">Sign Up</v-btn>
	  </v-toolbar-items>

    </v-toolbar>

	<v-navigation-drawer v-model="drawer" app dark temporary>
		<NavDrawerContent v-on:drawerToggle="drawer = !drawer"/>
	</v-navigation-drawer>
	
  </nav>
</template>

<script>

import NavDrawerContent from './NavDrawerContent.vue'
import ToolbarUserMenu from './ToolbarUserMenu.vue'
import SignInFormMenu from './SignInFormMenu.vue'

export default {
  components: { ToolbarUserMenu, NavDrawerContent, SignInFormMenu},
  computed: {
	  isLoggedIn: function () {
		  return this.$store.getters.isLoggedIn
	  },
	  username: function () {
		  return this.$store.getters.user.username
	  }
  },
  data: function() {
	  return {
		  drawer: false
	  }
  }
}
</script>

<style>
div.v-btn__content {
  padding: 5px;
	border-top-left-radius: 0;
}

div.card__actions .btn {
  min-width: 0;
}
</style>
