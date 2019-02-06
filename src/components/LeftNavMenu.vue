<template>
	<div class="LeftNavMenu" align="left">
		<ul id="tickers-list">
			<li v-for="(t, index) in tickers" :key="index">
				<router-link  :to="{ name: 'chart', params: { ticker: t }}">{{ t }}</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
  data: function() {
       return {
           tickers: [
			   'AAPL',
			   'SBUX',
			   'V',
			   'MCD',
			   'GOOG',
			   'BRK.B',
			   'JNJ',
			   'VZ',
			   'XOM',
			   'KO',
			   'HD',
			   'ORCL',
			   'DIS',
			   'PEP',
			   'NFLX',
			   'NKE',
			   'MSFT',
			   'AMZN',
			   'FB'
		   ]
       }
  }
}
</script>

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

ul#tickers-list {
  margin: 0px 0px 0px 0px;
  list-style-type: circle;
}

ul#tickers-list li {
  margin: auto;
  font-size: 16px
}
</style>