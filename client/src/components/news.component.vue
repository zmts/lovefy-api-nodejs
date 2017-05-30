<template>
    <div class="news">
        <div>
            <h1>{{ newsText }}</h1>
        </div>
        <div class="news-list">
            <div class="item" v-for="item in news">
                {{item.title}}
            </div>
        </div>

    </div>
</template>

<script>
import newsService from '../services/news.service'

export default {
    data () {
        return {
            newsText: 'News Component !!!',
            news: []
        }
    },

    methods: {

    },

    beforeCreate () {
        this.news = newsService.getNews()
            .then(response => {
                this.news = response.data
            })
            .catch(error => error)
    }
}

</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
</style>
