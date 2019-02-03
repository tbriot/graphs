<template>
	<div class="App">
		<TopNavBar/>
		<MainWindow/>
	</div>
</template>

<script>
import TopNavBar from './components/TopNavBar.vue'
import MainWindow from './components/MainWindow.vue'

export default {
	components: {TopNavBar, MainWindow},
	created: function () {
		this.$store.dispatch('refreshLoggedInState')
	}
}
</script>