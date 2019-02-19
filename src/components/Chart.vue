<template>
	<div align="center">
        <div v-if="isLoggedIn" :class="{ blurredChart: anyPendingTask }">
            <div id="stockInfo">
                <ul id="stockInfoList">
				    <li>{{ stockInfo.companyName }}</li>
				    <li><img v-if="stockInfo.logoUrl" :src="stockInfo.logoUrl" alt="logo" height="75" width="75"/></li>
                    <li>{{ currentDate }}</li>
                    <li><b>Price: {{ stockInfo.lastPrice }} USD</b></li>
                    <li><b>P/E ttm: {{ peRatioTtm }}</b></li>
                    <li>Div Yield: {{ stockInfo.dividendYield }} %</li>
                    <li>-</li>
                    <li>MarketCap: {{ stockInfo.marketcap }}</li>
			    </ul>  
            </div>
            <div class="chart-container">
                <div>Display chart for {{ ticker }} stock</div>
                <img v-if="anyPendingTask" id="loading-image" src="img/loading-spinner.gif" alt="Loading..." />
                <canvas ref="canvas"></canvas>
                <div v-bind:class="{ chartBtnActive: isActiveCustomPe, chartBtnInactive: !isActiveCustomPe }">
                    <div v-on:click="isActiveCustomPe=!isActiveCustomPe">Custom p/e ratio</div>
                    <input type="number" style="width: 30px;" v-model.number="customPeRatio"/>
                    <input type="button" value="ok" v-on:click="drawCustomPe()"/>
                </div>
            </div>
        </div>
        <div v-else class="error">Please log in</div>
    </div>
</template>

<script>
import { API } from 'aws-amplify'
import aws_api_config from '../config/aws-api-exports.js'
import abbrNum from '../utils/formatNumber.js'

API.configure(aws_api_config)

export default {
  props: ['ticker'],
  computed: {
	  isLoggedIn: function () {
		  return this.$store.getters.isLoggedIn
      },
      anyPendingTask: function() {
        return this.tasks.length > 0
      },
      peRatioTtm: function () {
          return (this.stockInfo.lastPrice / this.stockInfo.ttmEPS).toFixed(1)
      }
  },
  data: function() {
       return {           
           chart: null,
           currentDate: new Date(Date.now()).toLocaleDateString(),
           isActiveCustomPe: false,
           customPeRatio: 20,
           stockInfo: {
               companyName: null,
               logoUrl: null,
               ttmEPS: null,
               dividendYield: null,
               marketcap: null,
               lastPrice: null,
           },
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
            this.get_stock_stats()
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
                this.get_stock_stats()
            }
        }, 0)
    },
    'isActiveCustomPe' (to, from) {
        console.debug('isActiveCustomPe watcher, to=' + to)
        this.chart.data.datasets[2].hidden = !to
        this.chart.update()
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
        this.get_stock_stats()
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
            lineTension: 0
        }

        var CustomPeDs = {
            hidden: true,
            data: [],
            label: 'Custom P/E',
            xAxisID: 'PriceXAxis',
            borderColor: 'red',
            lineTension: 0,
            pointRadius: 2,
            fill: false
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [priceDs, price15PeDs, CustomPeDs]
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
        // Remove custom PE datapoints
        var chart_customPe_ds = this.chart.data.datasets[2]
        chart_customPe_ds.data=[]
        // Remove 15 PE datapoints
        var chart_15Pe_ds = this.chart.data.datasets[1]
        chart_15Pe_ds.data=[]
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
        this.stockInfo.lastPrice=lastPrice
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
            this.stockInfo.logoUrl=response.data.url
            this.completeTask('realtime_stock_logo')
            })
        .catch(error => {console.debug('error' + error)})
    },
    get_stock_stats: function () {
        console.debug("API call to fetch stock key stats")
        this.addTask('realtime_stock_stats')
        let apiName = 'StockAPI'
        let path = `/test/realtime/stock/${this.ticker}/stats`
        let myInit = {
            headers: {},
            response: true,
            queryStringParameters: {}
         }
        API.get(apiName, path, myInit)
        .then(response => {
            //console.debug('API call response:' + JSON.stringify(response))
            this.stockInfo.dividendYield=response.data.dividendYield.toFixed(2)
            this.stockInfo.companyName=response.data.companyName
            this.stockInfo.marketcap=abbrNum(response.data.marketcap,2) 
            this.stockInfo.ttmEPS=response.data.ttmEPS
            this.completeTask('realtime_stock_stats')
            })
        .catch(error => {console.debug('error' + error)})
    },
    drawCustomPe() {
        var ratio = this.customPeRatio
        console.debug("Draw custom PE. Ratio=" + ratio)
        var _15PeDs= this.chart.data.datasets[1]
        var customPeDs = this.chart.data.datasets[2]

        customPeDs.data = []
        _15PeDs.data.forEach((dp) => {
            customPeDs.data.push(
                {x: dp.x, y: (dp.y / 15) * ratio}
            )
        })
        console.debug("customPeDatas=" + customPeDs.data)
        this.chart.update()
    }
  }
}
</script>

<style lang="scss">
.chart-container {
    width: 60%;
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
ul#stockInfoList {
  display: table;
  text-align: left;
  list-style-type: none;
  padding: 0px;
}
.chartBtnActive {
    color: black;
    cursor: pointer;
}
.chartBtnInactive {
    opacity: 0.3;
    cursor: pointer;
}
</style>