<template>
  <div>

        <v-list>            
						
						<v-list-tile>
              <v-list-tile-content>                    
                <v-toolbar app dark dense>
                  <v-toolbar-side-icon @click="$emit('drawerToggle')"></v-toolbar-side-icon>
                  <v-toolbar-title class="headline text-uppercase">Graphs</v-toolbar-title>
                </v-toolbar>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-for="(ticker, index) in tickers" :key="index" router :to="{ name: 'chart', params: { ticker: ticker }}">
              <v-list-tile-content>{{ ticker }}</v-list-tile-content>
            </v-list-tile>

        </v-list>


  </div>
</template>

<script>

export default {
  data: function() {
	  return {
          showSignInModal: false,
          tickers: [
			"AAPL",
			"AMZN",
			"BRK.B",
			"FB",
			"GOOG",
			"HD",
			"DIS",
			"JNJ",
			"KO",
			"MCD",
			"MSFT",
			"NFLX",
			"NKE",
			"ORCL",
			"PEP",
			"SBUX",
			"V",
			"VZ",
			"XOM"
		  ]
	  }
  }
}
</script>