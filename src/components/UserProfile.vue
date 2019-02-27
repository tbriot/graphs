<template>
	<div>
		<div  align="center">User profile</div>
		<br>
		<div v-if="isLoggedIn" class="profile">
			Username: <b>{{ user.username }}</b><br/>
			Sub: {{ user.attributes.sub }}<br/>
			Email: {{ user.attributes.email }}<br/>
		</div>
	</div>	
</template>

<script>
export default {
  computed: {
	  isLoggedIn: function () {
		  return this.$store.getters.isLoggedIn
	  },
	  user: function () {
		  return this.$store.getters.user
	  }
  }
}
</script>