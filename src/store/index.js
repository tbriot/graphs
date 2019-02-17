import Vue from 'vue'
import Vuex from 'vuex'
import { Auth } from 'aws-amplify'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      loggedIn: false,
      user: {
          username: null,
          attributes: {}
      }
    },
    getters: {
        isLoggedIn: function (state) {
            return state.loggedIn
        },
        user: function(state) {
            return state.user
        }
    },
    mutations: {
        setLoggedIn: function (state, bool) {
            state.loggedIn = bool
            console.log('loggedIn set to ' + bool)
        },
        setUser: function (state, user) {
            state.user.username = user.username
            state.user.attributes = user.attributes
        },       
    },
    actions: {
        refreshLoggedInState: function (context) {
            Auth.currentAuthenticatedUser({bypassCache: false})
            .then(user => {
                console.log(user)
                context.commit('setLoggedIn', true)
                context.commit('setUser', {username: user.username, attributes: user.attributes})
            })
            .catch(err => {console.log(err); context.commit('setLoggedIn', false);})
        }
    }
})