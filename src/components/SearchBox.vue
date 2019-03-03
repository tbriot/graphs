<template>
    <v-autocomplete
		v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        @change="change"
        label="Search by Ticker or Company"
        solo
        flat
        return-object
        clearable
        :menu-props="{ dark: true}"
        prepend-inner-icon="search"
        full-width>
	</v-autocomplete>
</template>

<script>
import { API } from 'aws-amplify'
import aws_api_config from '../config/aws-api-exports.js'

API.configure(aws_api_config)

export default {
    data: function () {
        return {
            select: null,
            search: null,
            loading: false,
            items: [] 
        }
    },
    watch: {
      search (val) {
        val && val !== this.select && this.asynch_search(val)
      }
    },
    methods: {
        change: function (selection_obj) {
            var ticker = selection_obj.value
            this.$router.push({ name: 'chart', params: { ticker: ticker } })
        },
        asynch_search: function (term) {
            this.loading = true

            let apiName = 'StockAPI'
            let path = "/test/search"
            let myInit = {
                headers: {},
                response: true,
                queryStringParameters: {"term": term}
             }
            API.get(apiName, path, myInit)
            .then(response => {
                console.debug('API call response:' + JSON.stringify(response))
                this.items = []
                response.data.results.forEach((e) => {
                    this.items.push(
                        {text: `${e.ticker} - ${e.company}`, value: e.ticker}
                    )
                })
                this.loading = false
                })
            .catch(error => {console.debug('error' + error)})
        }
    }
}
</script>
