<template>
  <nav>
    <v-toolbar app dark dense>
	  <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
		  
		<router-link to="/home">
			<img src="/img/graph-logo.svg" height="40"/>
		</router-link>
        <span>Graphs</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

	  <v-toolbar-items v-if="isLoggedIn">
	    <ToolbarUserMenu></ToolbarUserMenu>	
	  </v-toolbar-items>
	  
	  <v-toolbar-items v-else>
	    <v-btn @click="showSignInModal = true" round small color="primary">Sign In</v-btn>
	    <v-btn href="./signup.html" round small color="success">Sign Up</v-btn>
	  </v-toolbar-items>

    </v-toolbar>

	<v-navigation-drawer v-model="drawer" app dark temporary>
		<NavDrawerContent v-on:drawerToggle="drawer = !drawer"/>
	</v-navigation-drawer>

	<SignInModal v-show="showSignInModal"/>

  </nav>
</template>

<script>

import NavDrawerContent from './NavDrawerContent.vue'
import ToolbarUserMenu from './ToolbarUserMenu.vue'
import SignInModal from './SignInModal.vue'
import { SignIn, SignOut, AmplifyEventBus } from 'aws-amplify-vue'
import { Hub, Logger } from 'aws-amplify';

const logger = new Logger('ModalEventListener');

export default {
  components: {SignInModal, ToolbarUserMenu, NavDrawerContent},
  computed: {
	  isLoggedIn: function () {
		  // if user is loggedIn, hide SignIn Modal
		  if (this.$store.getters.isLoggedIn === true) {
			  this.showSignInModal = false
		  }
		  return this.$store.getters.isLoggedIn
	  },
	  username: function () {
		  return this.$store.getters.user.username
	  }
  },
  data: function() {
	  return {
		  drawer: false,
		  showSignInModal: false
	  }
  },
  created: function() {
	let self = this
	logger.onHubCapsule = function(capsule) {
		const { channel, payload } = capsule
		if (payload.event === 'signInClose') {
			console.log('Closing SignIn modal')
			self.showSignInModal = false
		}
	}
	Hub.listen('modal', logger)
	}
}
</script>