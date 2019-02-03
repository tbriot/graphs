<template>
	<div class="app">
		<amplify-sign-up v-if="!isSignedUp" v-bind:signUpConfig="signUpConfig"></amplify-sign-up>
		<div v-else class="signedUpMsg">Please check your mailbox. You will receive a confirmation code.</div>
	</div>
</template>

<script>
import { SignUp } from 'aws-amplify-vue'
import { AmplifyEventBus } from 'aws-amplify-vue'

export default {
	components: { SignUp },
	data: function () {
		return {
			isSignedUp: false,
			signUpConfig: {
				header: 'Sign Up',
				/*			
				signUpFields: [
					{ label: 'Age', key: 'age', required: false, displayOrder: 20, type: 'number', custom: true }
				],
				*/
				defaultCountryCode: '33',
				hideAllDefaults: false,
				hiddenDefaults: ['phone_number',]
		  	}
		}
	},
	created: function () {
		AmplifyEventBus.$on('authState', state => {
			console.log(`Here is the auth event that was just emitted by an Amplify component: ${state}`)
			if (state === 'confirmSignUp') {
				console.log('Confirm sign up !')
				this.isSignedUp = true
			}
		})
	}
}
</script>

<style lang="scss">
.app {
  	text-align: center;
	color:red;
	background-color:  #31465f;	
}
.signedUpMsg {
	line-height: 50px;
	margin: 10px 10px 0px 0px;
	font-size: 20px;
	text-align: center;
	color:white;
}
</style>