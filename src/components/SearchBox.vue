<template>
    <v-autocomplete
		v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        @change="change"
        label="Search Ticker or Company"
        solo
        flat
        return-object>
	</v-autocomplete>
</template>

<script>
export default {
    data: function () {
        return {
            select: null,
            search: null,
            loading: false,
            items: [],
            apiResponse: [
                {text: "Apple", value: "AAPL"},
                {text: "Amazon", value: "AMZN"},
                {text: "Facebook", value: "FB"},
                {text: "Disney", value: "DIS"},
            ] 
        }
    },
    watch: {
      search (val) {
        val && val !== this.select && this.querySelections(val)
      }
    },
    methods: {
        change: function (selection_obj) {
            var ticker = selection_obj.value
            this.$router.push({ name: 'chart', params: { ticker: ticker } })
        },
        querySelections(val) {
            this.loading = true
            // Simulated ajax query
            setTimeout(() => {
            this.items = this.apiResponse.filter(e => {
                return (e.text || '').toLowerCase().indexOf((val || '').toLowerCase()) > -1
            })
            this.loading = false
            }, 500)
        }
    }
}
</script>
