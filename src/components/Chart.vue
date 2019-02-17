<template>
	<div align="center">
        <div v-if="isLoggedIn" :class="{ blurredChart: anyPendingTask }">
            <div id="stockInfo">
                Stock info<br/>
                <img v-if="stockLogo" :src="stockLogo" alt="Stock Logo" height="75" width="75"/>
            </div>
            <div class="chart-container">
                <div>Display chart for {{ ticker }} stock</div>
                <img v-if="anyPendingTask" id="loading-image" src="img/loading-spinner.gif" alt="Loading..." />
                <canvas ref="canvas"></canvas>
            </div>
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
      },
      anyPendingTask: function() {
        //return true
        return this.tasks.length > 0
      }
  },
  data: function() {
       return {           
           chart: null,
           stockLogo: null,
           tasks: []
       }
  },
  watch: {
    '$route' (to, from) {
        console.debug('Route watcher')
        if (this.isLoggedIn) {
            console.debug('Route watcher - isLoggedIn')
            if (!this.chart) {            
                console.debug('Route watcher - init chart')
                this.initChart('chart')
            } 
            this.resetChart() 
            this.update_historical_stock_earnings()
            this.update_historical_stock_price()
            this.update_realtime_stock_price()
            this.get_stock_logo()
        }        
    },
    'isLoggedIn' (to, from) {
        console.debug('isLoggedIn watcher')
        /* setTimeout() allows the component to be mounted
            before the chart is drawn
        */
        setTimeout(() => {
            if (to && this.$refs.canvas) {
                console.debug('isLoggedIn watcher - setTimeout - display chart')
                if (this.chart) {         
                    console.debug('isLoggedIn watcher - destroy previous chart')
                    // need to destroy previous chart because it is tied to an old context
                    // (v-if directive re-creates html blocks during toggle)                     
                    this.chart.destroy()
                } 
                this.initChart('chart')
                this.update_historical_stock_earnings()
                this.update_historical_stock_price()
                this.update_realtime_stock_price()
                this.get_stock_logo()
            }
        }, 0)
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
        this.update_realtime_stock_price()
        this.get_stock_logo()
    }
  },
  updated: function() {
    console.debug('UPDATED- start')
  },
  methods: {
    initChart: function(chartDiv) {
        var ctx = this.$refs.canvas.getContext('2d')

        var priceDs = {
            data: [],
            label: this.ticker + ' stock price',
            xAxisID: 'PriceXAxis',
            borderColor: 'black',
            lineTension: 0,
            pointRadius: 0,
            fill: false
        }

        var price15PeDs = {
            label: 'P/E of 15',
            xAxisID: 'EarningXAxis',
            pointStyle: 'triangle',
            pointRadius: 4,
            pointBackgroundColor: 'white',
            pointBorderColor: 'black',
            data: [],
            borderColor: 'orange',
            backgroundColor: 'rgb(51, 153, 102, 0.8)',
            fill: true,
            cubicInterpolationMode: 'monotone',
            lineTension: 0
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [priceDs, price15PeDs]
            },
            options: {
                animation: { duration: 750 },
                responsive: true,
                maintainAspectRatio: true,
                scaleOverride : true,

                scales: {
                    xAxes: [{
                        id: 'EarningXAxis',
                        type: 'time',
                        display: true,
                        time: {
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
    resetChart: function () {
        this.chart.data.labels=[]
        // Remove all prices datapoints
        var chart_price_ds = this.chart.data.datasets[0]
        chart_price_ds.data=[]
    },
    update_historical_stock_earnings: function () {
        console.debug("API call to fetch stock earnings.")
        this.addTask("update_earnings")
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
            this.completeTask("update_earnings")
            })
        .catch(error => {console.debug('error' + error)})
    },
    update_historical_stock_price: function () {
        console.debug("API call to fetch stock prices.")
        this.addTask("update_prices")
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
            this.completeTask("update_prices")
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
        scales.xAxes[1].time.min=labels[0]
        scales.xAxes[0].time.max=labels[labels.length-1]
        scales.xAxes[1].time.max=labels[labels.length-1]
        this.chart.update()      
    },
    display_price: function(new_datapoints) {
        var chart_price_ds = this.chart.data.datasets[0]
        new_datapoints.forEach((dp) => {
            chart_price_ds.data.push(
                {x: new Date(dp.dt), y: dp.p}
            )
        })
        this.chart.update()
    },
    addTask: function(taskname) {
        this.tasks.push({
            name: taskname
        })
    },
    completeTask: function(taskname) {
        this.tasks = this.tasks.filter(function( obj ) {
            return obj.name !== taskname;
        });
    },
    update_realtime_stock_price: function () {
        console.debug("API call to fetch realtime stock price")
        this.addTask('realtime_stock_price')
        let apiName = 'StockAPI'
        let path = `/test/realtime/stock/${this.ticker}/price`
        let myInit = {
            headers: {},
            response: true,
            queryStringParameters: {}
         }
        API.get(apiName, path, myInit)
        .then(response => {
            //console.debug('API call response:' + JSON.stringify(response))
            this.display_realtime_stock_price(response.data)
            this.completeTask('realtime_stock_price')
            })
        .catch(error => {console.debug('error' + error)})
    },
    display_realtime_stock_price: function(lastPrice) {
        var chart_price_ds = this.chart.data.datasets[0]
        chart_price_ds.data.push(
                {x: new Date(), y: lastPrice}
        )
        this.chart.update()
    },
    get_stock_logo: function () {
        console.debug("API call to fetch stock logo")
        this.addTask('realtime_stock_logo')
        let apiName = 'StockAPI'
        let path = `/test/realtime/stock/${this.ticker}/logo`
        let myInit = {
            headers: {},
            response: true,
            queryStringParameters: {}
         }
        API.get(apiName, path, myInit)
        .then(response => {
            //console.debug('API call response:' + JSON.stringify(response))
            this.stockLogo=response.data.url
            this.completeTask('realtime_stock_logo')
            })
        .catch(error => {console.debug('error' + error)})
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
#loading-image {
  position: absolute;
  top: calc(50% - 212px);
  left: calc(50% - 212px + 100px);
  z-index: 100;
}
.blurredChart {
    opacity: 0.5;
}
#stockInfo {
    float: right;
	margin: 2px 20px 0px 10px;
}
</style>