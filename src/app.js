import { Auth } from 'aws-amplify'
import Amplify, * as  AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import { AmplifyEventBus } from 'aws-amplify-vue'
import aws_auth_config from './config/aws-auth-exports.js'

import Vue from 'vue'
import './plugins/vuetify.js'

import App from './App.vue'

import { createRouter } from './router/index.js'

Auth.configure(aws_auth_config)

Vue.use(AmplifyPlugin, AmplifyModules)

// Vuex (store)
import store from './store/index.js'
store.dispatch('refreshLoggedInState')

// Vue Router
var router = createRouter()

// Listen to Amplify's Authentication events
// Trigger a refresh of state
AmplifyEventBus.$on('authState', state => {
    console.log(`Here is the auth event that was just emitted by an Amplify component: ${state}`)
    if (state === 'signedIn' || state === 'signedOut') {
         store.dispatch('refreshLoggedInState')
    }
    if (state === 'signUp') {
        window.location.href = "./signup.html";
   } 
})

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
