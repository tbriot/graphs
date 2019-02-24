<template>
  <div class="text-xs-center" >
    <v-menu offset-y>
      <v-avatar slot="activator" size="35" color="primary">
        <v-icon medium>account_circle</v-icon>
      </v-avatar>
      
      <v-list dark>
        <v-list-tile router to="/user/profile">
          <v-list-tile-avatar>
            <v-icon medium>account_circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ user.username }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ user.attributes.email }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-for="(item, index) in items" :key="index" router :to="item.route">          
          <v-list-tile-avatar>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="signOut">          
          <v-list-tile-avatar>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue'

export default {
  data: () => ({
    items: [
      { title: 'Help', icon: 'help', route: '/help' },
      { title: 'Send feedback', icon: 'info', route: '/feedback' }
    ]
  }),
  computed: {
    user: function () {
      return this.$store.getters.user
    }
  },
  methods: {
    signOut: function(event) {
      this.$Amplify.Auth.signOut()
        .then(() => {
          console.info('signout success')
          return AmplifyEventBus.$emit('authState', 'signedOut')
        })
        .catch(e => this.setError(e));
    },
    setError: function(e) {
      error = this.$Amplify.I18n.get(e.message || e)
      console.error(error)
    }
  }
}
</script>