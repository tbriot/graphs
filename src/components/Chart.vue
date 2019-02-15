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
    console.debug('CREATED')
  },
  mounted: function() {
    console.debug('MOUNTED - start')
    if (this.isLoggedIn) {
        console.debug('MOUNTED - isLoggedIn')
        this.initChart('chart')
        this.update_historical_stock_earnings()
        this.update_historical_stock_price()
    }
  },
  updated: function() {
    console.debug('UPDATED- start')
    if (this.isLoggedIn) {
        console.debug('UPDATED - isLoggedIn')
        if (this.chart) {            
            this.chart.destroy()
            console.debug('UPDATED - destroyed previous chart')
        }
        this.initChart('chart')        
        this.update_historical_stock_earnings()
        this.update_historical_stock_price()
    }
  },
  methods: {
    initChart: function(chartDiv) {
        var ctx = this.$refs.canvas.getContext('2d')

        var priceDs = {
            label: this.ticker + ' stock price',
            xAxisID: 'PriceXAxis',
            data: [],
            borderColor: 'black',
            fill: false,
            // cubicInterpolationMode: 'monotone',
            lineTension: 0
        }

        var price15PeDs = {
            label: 'P/E of 15',
            xAxisID: 'EarningXAxis',
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
                lables: [],
                datasets: [priceDs, price15PeDs]
            },
            options: {
                animation: { duration: 0 },
                responsive: true,
                maintainAspectRatio: true,
                scaleOverride : true,

                scales: {
                    xAxes: [{
                        id: 'EarningXAxis',
                        type: 'time',
                        display: true,
                        time: {
                            //min: "2009-09-01",
                            //max: "2016-09-01",
                            unit: 'year',
                            displayFormats: { year: 'MM/YY' }
                         },
                        ticks: {
                            source: 'labels'
                        }
                    },
                    {
                        id: 'PriceXAxis',
                        type: 'time',
                        time: {
                            //min: "2009-09-01",
                            //max: "2016-09-01",
                         },
                        display: false
                    }
                    ]
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
        console.debug("API call to fetch stock earnings.")
        let apiName = 'StockAPI'
        let path = `/test/historical/stock/${this.ticker}`
        let myInit = {
            headers: {},
            response: true,
            queryStringParameters: {
                from: '2007-01-01'
            }
         }
        API.get(apiName, path, myInit)
        .then(response => {
            //console.debug('API call response:' + JSON.stringify(response))
            this.display_earning(response.data.results, 15)
            //console.debug("Earnings data refreshed")
            })
        .catch(error => {console.debug('error' + error)})
    },
    update_historical_stock_price: function () {
        console.debug("API call to fetch stock prices.")
        let apiName = 'StockAPI'
        let path = `/test/historical/stock/${this.ticker}/closing-price`
        let myInit = {
            headers: {},
            response: true,
            queryStringParameters: {
                from: '2007-01-01'
            }
        }
        API.get(apiName, path, myInit)
        .then(response => {
            //console.debug('API call response:' + JSON.stringify(response))
            this.display_price(response.data.results)
            //console.debug("Prices data refreshed")
            })
        .catch(error => {console.debug('error' + error)})
    },
    display_earning: function (new_datapoints, multiple) {
        var chart_earnings_ds = this.chart.data.datasets[1]
        chart_earnings_ds.data=[]
        new_datapoints.forEach((dp) => {
            chart_earnings_ds.data.push(
                {x: new Date(dp.dt), y: dp.e * multiple}
            )
            // Add FY earnings date to labels[] collection
            // so that it is displayed on the X-axis
            this.chart.data.labels.push(new Date(dp.dt))
        })
        var scales = this.chart.options.scales
        var labels = this.chart.data.labels
        scales.xAxes[0].time.min=labels[0]
        scales.xAxes[1].time.min=llabels[0]
        scales.xAxes[0].time.max=labels[labels.length-1]
        scales.xAxes[1].time.max=labels[labels.length-1]
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