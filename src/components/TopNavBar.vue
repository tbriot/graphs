<template>
	<div class="TopNavBar">
		<div  v-if="isLoggedIn" style="float:right; height:60px;"> 
			<ul id="top-right-list">
				<li><router-link to="/user/profile">{{ username }}</router-link></li>
				<li><amplify-sign-out class="signedOut"></amplify-sign-out></li>
			</ul>
		</div>
		<div v-else>
			 <div class="signin-link" v-on:click="showSignInModal = true">Sign In</div>
			 <div><a class="signup-link" href="./signup.html">Sign up</a></div>
		</div>
		
		<div align="left">
			<router-link to="/home">
				<img src="/img/graph-logo.svg" height="50"/>
			</router-link>
		</div>
		<SignInModal v-show="showSignInModal"/>		
	</div>
</template>

<script>
import SignInModal from './SignInModal.vue'
import { SignIn, SignOut, AmplifyEventBus } from 'aws-amplify-vue'
import { Hub, Logger } from 'aws-amplify';

const logger = new Logger('ModalEventListener');

export default {
  components: {SignInModal},
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

<style lang="scss">
.TopNavBar {
	height: 60px;
	color: #e6e6e6;
	background-color:  #31465f;	
	font-family: "Amazon Ember Light";
	font-size: 28px
}

.signin-link {
	margin: 0px 10px 0px 0px;
	font-size: 20px;
	float: right;
	color: #e6e6e6
}

.signin-link:hover {
   	text-decoration: underline;
	text-decoration-color: #ffac31;
	cursor:pointer;
}

.signup-link {
	margin: 0px 10px 0px 0px;
	font-size: 20px;
	float: right;
	color: #e6e6e6
}

.signup-link:hover {
   	text-decoration: underline;
	text-decoration-color: #ffac31;
	cursor:pointer;
}

.signedOut {
	height: 35px;
	margin: 2px 10px 0px 10px;
	float: right;
	color: #ffac31;
}

ul#top-right-list {
  margin: 0px 0px 0px 0px;
}

ul#top-right-list li {
  display:inline;
  margin: auto;
}
</style>