<template>
  <div class="modal-mask">
    <div class="modal-wrapper" align="center">
      <div class="modal-container">  
        <div class="close-btn" align="right" v-on:click="pubSignInCloseNotif">&times;</div>
        <amplify-sign-in v-bind:signInConfig="signInConfig" class="amp-sign-in"></amplify-sign-in>
      </div>
    </div>
	</div>
</template>

<script>
import { SignIn, AmplifyEventBus } from 'aws-amplify-vue'
import { Hub } from 'aws-amplify';

export default {
  components: { SignIn },
  data: function() {
	  return {
		  signInConfig: {
			header: 'Sign In',
		  username: null
		  } 
	  }
  },
  methods: {
    pubSignInCloseNotif: function() {
      Hub.dispatch('modal', { event: 'signInClose', data: {} }, 'SignInModal')
      console.log("published 'signInClose' notification")
    }
  }
}
</script>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width:460px;
  margin: 0px 0px;
  padding: 2px 3px;
  background-color: #fff;
  border-radius: 0px;
  box-shadow: 0 0px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.close-btn {
  color: grey;
  font-size: 48px;
  height: 48px;
  margin: 2px 2px 2px 2px;
  opacity: 0.5;
  transition: all .3s ease-out;
  cursor: pointer;
}

.close-btn:hover {
  opacity: 1;
}

.amp-sign-in {
  color: red;
  text-align: left;
  margin-bottom: 0px;
  padding: 10px
}
</style>