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
      console.log('CREATED - chart:' + this.chart)
      this.$store.dispatch('refreshLoggedInState')
  },
  mounted: function() {
    if (this.isLoggedIn) {
        console.log('is logged in')
        this.initChart('chart')
        this.update_historical_stock_earnings()
        this.update_historical_stock_price()
    }
    console.log('MOUNTED- chart:' + this.chart)
  },
  updated: function() {
    console.log('UPDATED- chart:' + this.chart)
    if (this.isLoggedIn) {
        if (!this.chart) {
            console.log('re init chart !!')
            this.initChart('chart')           
        }
        this.update_historical_stock_earnings()
        this.update_historical_stock_price()
    }
  },
  methods: {
    initChart: function(chartDiv) {
        var ctx = this.$refs.canvas.getContext('2d')

        var priceDs = {
            label: this.ticker + ' stock price',
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

    },
    update_historical_stock_earnings: function () {
        console.log("API call to fetch stock earnings.")
        let apiName = 'StockAPI'
        let path = `/test/historical/stock/${this.ticker}`
        let myInit = {
            headers: {},
            response: true,
            queryStringParameters: {
                from: '2007-01-01',
                to: '2020-01-01'
            }
         }
        API.get(apiName, path, myInit)
        .then(response => {
            //console.log('API call response:' + JSON.stringify(response))
            this.display_earning(response.data.results, 15)
            //console.log("Earnings data refreshed")
            })
        .catch(error => {console.log('error' + error)})
    },
    update_historical_stock_price: function () {
        console.log("API call to fetch stock prices.")
        let apiName = 'StockAPI'
        let path = `/test/historical/stock/${this.ticker}/closing-price`
        let myInit = {
            headers: {},
            response: true,
            queryStringParameters: {
                from: '2007-01-01',
                to: '2020-01-01'
            }
        }
        API.get(apiName, path, myInit)
        .then(response => {
            //console.log('API call response:' + JSON.stringify(response))
            this.display_price(response.data.results)
            //console.log("Prices data refreshed")
            })
        .catch(error => {console.log('error' + error)})
    },
    display_earning: function (new_datapoints, multiple) {
        var chart_earnings_ds = this.chart.data.datasets[1]
        chart_earnings_ds.data=[]
        new_datapoints.forEach((dp) => {
            chart_earnings_ds.data.push(
                {x: new Date(dp.dt), y: dp.e * multiple}
            )
        })
        this.chart.update()
    },
    display_price: function(new_datapoints) {
        var chart_price_ds = this.chart.data.datasets[0]
        chart_price_ds.data=[]
        new_datapoints.forEach((dp) => {
            chart_price_ds.data.push(
                {x: new Date(dp.dt), y: dp.p}
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