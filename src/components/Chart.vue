<template>
	<div align="center">
        <div>Display chart for {{ ticker }} stock</div>
        <div v-if="isLoggedIn" class="chart-container">
            <canvas ref="canvas"></canvas>
        </div>
        <div v-else class="error">Please log in</div>
    </div>
</template>

<script>
import { API } from 'aws-amplify'
import aws_api_config from '../config/aws-api-exports.js'

API.configure(aws_api_config)

export default {
  props: ['ticker'],
  computed: {
	  isLoggedIn: function () {
		  return this.$store.getters.isLoggedIn
	  }
  },
  data: function() {
       return {
           chart: null
       }
  },
  created: function() {
      this.$store.dispatch('refreshLoggedInState')
  },
  mounted: function() {
    if (this.isLoggedIn) {
        this.initChart('chart')
        this.refresh_historical_stock_prices()
    }
  },
  updated: function() {
    if (this.isLoggedIn) {
        this.initChart('chart')
        this.refresh_historical_stock_prices()
    }
  },
  methods: {
    initChart: function(chartDiv) {
        console.log('init chart')
        var ctx = this.$refs.canvas.getContext('2d')

        var priceDs = {
            label: 'AAPL stock price',
            data: [],
            borderColor: 'black',
            fill: false,
            // cubicInterpolationMode: 'monotone',
            lineTension: 0
        }

        var price15PeDs = {
            label: 'P/E of 15',
            data: [],
            borderColor: 'orange',
            backgroundColor: 'rgb(51, 153, 102)',
            fill: true,
            cubicInterpolationMode: 'monotone',
            lineTension: 0
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [priceDs, price15PeDs]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    xAxes: [{
                        type: 'time'
                    }]
                },
                elements: {
                    point: {
                        radius: 2
                    }
                }
            }
        })
        console.log('init chart - end')  
    },
    refresh_historical_stock_prices: function () {
        console.log("Fetching stock prices. HTTP GET request")
        let apiName = 'MyAPIGatewayAPI';
        let path = '/test/historical/stock/AAPL'; 
        let myInit = { // OPTIONAL
            headers: {}, // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {  // OPTIONAL
                name: 'param'
            }
        }

        API.get(apiName, path, myInit)
        .then(response => {
            this.replace_stock_price_data(response.data.stock_price)
            console.log("Historical stock prices refreshed")
            this.replace_pe_data(response.data.stock_earnings, 15)
            console.log("Historical pe refreshed")})
        .catch(error => {console.log(error.response)})
    },
    replace_stock_price_data: function(new_datapoints) {
        var chart_price_ds = this.chart.data.datasets[0]
        chart_price_ds.data=[]
        new_datapoints.forEach((dp) => {
            chart_price_ds.data.push(
                {x: new Date(dp.date), y: dp.price}
            )
        })
        this.chart.update()
    },
    replace_pe_data: function (new_datapoints, multiple) {
        var chart_price_ds = this.chart.data.datasets[1]
        chart_price_ds.data=[]
        new_datapoints.forEach((dp) => {
            chart_price_ds.data.push(
                {x: new Date(dp.date), y: dp.earnings * multiple}
            )
        })
        this.chart.update()
    }
  }
}
</script>

<style lang="scss">
.chart-container {
    width: 75%;
}
.error {
    color: red;
}
</style>