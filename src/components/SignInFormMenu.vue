<template>
    <v-menu offset-y :close-on-content-click="false" :nudge-bottom="5">

		  <div slot=activator align-self-center class="pa-3 blue-grey--text text--lighten-3">Already have an account ? Sign In▼</div>
        <v-layout column align-center class="blue-grey darken-4 white--text ma-0 pa-0">
          <v-flex class="mt-2 white--text">
            <v-text-field v-model="username" label="Username" outline hide-details dark/>
          </v-flex>
          <v-flex class="mt-2" height="150">
            <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'" outline hide-details dark />
          </v-flex>
          <v-flex class="mt-1">
            <v-btn round dark class="primary" @click="signIn">Sign In</v-btn>
          </v-flex>
          <v-flex v-if="error">
            <p class="red--text">Error: {{ error }}</p>
          </v-flex>  
        </v-layout>

		</v-menu>
</template>

<script>
import { Auth } from 'aws-amplify'
import { AmplifyEventBus } from 'aws-amplify-vue'

export default {
  data: function() {
	  return {
			username: null,
			password: null,
			showPassword: false,
			error: null
	  }
	},
	methods: {
    signIn: function(event) {
      const that = this
      this.$Amplify.Auth.signIn(this.username, this.password)
        .then(data => {
          console.info('sign in success');
          if (data.challengeName === 'SMS_MFA' || data.challengeName === 'SOFTWARE_TOKEN_MFA') {
            AmplifyEventBus.$emit('localUser', data);
            return AmplifyEventBus.$emit('authState', 'confirmSignIn')
          } else if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
            AmplifyEventBus.$emit('localUser', data);
            return AmplifyEventBus.$emit('authState', 'requireNewPassword');
          } else if (data.challengeName === 'MFA_SETUP') {
            AmplifyEventBus.$emit('localUser', data);
            return AmplifyEventBus.$emit('authState', 'setMfa');
          } else {
						return AmplifyEventBus.$emit('authState', 'signedIn')
          }
        })
        .catch(e => this.setError(e));
    },
    forgot: function() {
      AmplifyEventBus.$emit('authState', 'forgotPassword')
    },
    signUp: function() {
      AmplifyEventBus.$emit('authState', 'signUp')
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      console.error(this.error)
    }
  }
}
</script>

<style>
#styled-input {
  height: 80px;
  font-size: 30pt;
}
.styled-input label[for] {
  height: 80px;
  font-size: 30pt;
}
</style>
