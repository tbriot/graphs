import { Auth } from 'aws-amplify'
import Amplify, * as  AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import { AmplifyEventBus } from 'aws-amplify-vue'
import aws_auth_config from './config/aws-auth-exports.js'
import VueRouter from 'vue-router'
import { createRouter } from './router/index.js'

import Vue from 'vue'
import App from './App.vue'

Auth.configure(aws_auth_config)

//Vue.use(AmplifyPlugin, AmplifyModules)
//Vue.use(VueRouter)

Vue.use(AmplifyPlugin, AmplifyModules, VueRouter)

import store from './store/index.js'

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

var router = createRouter()

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })


  /*
  Auth.currentAuthenticatedUser({bypassCache: false})
  .then(user => console.log(user))
  .catch(err => console.log(err))
  */


/*
var username = "tbriottbrioT1982$"
var password = "tbrioT1982$
--------------------------------------
Auth.currentSession()
  .then(session => {
    console.log('User is logged in')
    console.log('session:' + JSON.stringify(session))
    renderGraph()
  })
  .catch(err => {
      console.log('User is logged out !')    
  })


function renderGraph() {
    console.log('render graph')
    const graphDiv = document.getElementById('graph')
    graphDiv.innerHTML = `      
    <table>
        <tr>
            <td>
                <h1>AAPL</h1>
                <canvas id="myChart" width=750 height=500></canvas>
            </td>
        </tr>
    </table>`
    var chart = initChart('myChart')
    refresh_historical_stock_prices(chart)
}

Auth.currentCredentials()
  .then(credentials => {
    console.log('current_cred:' + JSON.stringify(credentials))
    console.log('essentialCred: ' + JSON.stringify(Auth.essentialCredentials(credentials)))
    }).catch(err => console.log(err));
*/