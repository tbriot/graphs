<template>
	<div class="UserProfile">
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

<style lang="scss">
.UserProfile {
	background-color: #e1e4ea;
	float: right;
    width: calc(100% - 100px);
    height: 100%;
	margin: 0px 0px 0px 0px;
	font-family: "Amazon Ember";
	font-size: 28px
}

.profile {
	margin: 10px 10px 10px 50px
}
</style>