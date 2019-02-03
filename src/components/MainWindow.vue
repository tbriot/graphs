<template>
	<div>
        <LeftNavMenu/>
		<router-view class="main-view"></router-view>
	</div>
</template>

<script>
import LeftNavMenu from './LeftNavMenu.vue'

export default {
	components: { LeftNavMenu }
}
</script>

<style lang="scss">
.main-view {
 	float: right;
    height: 800px;
	width: calc(100% - 100px);
	margin: 0px 0px 0px 0px;
	font-family: "Amazon Ember";
	font-size: 24px;
	background-color: #e1e4ea;
}
</style>