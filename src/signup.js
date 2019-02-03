import { Auth } from 'aws-amplify'
import Amplify, * as  AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import aws_auth_config from './config/aws-auth-exports.js'

import Vue from 'vue'
import Signup from './components/Signup.vue'

Auth.configure(aws_auth_config)

Vue.use(AmplifyPlugin, AmplifyModules)

new Vue({
    el: '#app',
    template: '<Signup/>',
    components: { Signup }
  })