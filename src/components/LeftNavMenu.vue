<template>
	<div class="LeftNavMenu" align="center">Left Navigation Menu
		<router-link to="/stock/AAPL/chart">AAPL</router-link>
		<router-link to="/stock/DIS/chart">DIS</router-link>
	</div>
</template>

<style lang="scss">
.LeftNavMenu {
	background-color: #31465f;
	color: #e6e6e6;
	float: left;
    height: 800px;
	width: 100px;
	margin: 0px 0px 0px 0px;
	font-family: "Amazon Ember";
	font-size: 24px
}
</style>