<template>
    <div class="news page">
        <div>
            <h1>{{ newsText }}</h1>
        </div>
        <div class="news-list">
            <div class="loading" v-if="!news.length"><h1>loading...</h1></div>
            <div class="item" v-for="item in news">
                {{item.title}}
            </div>
        </div>
    </div>
</template>

<script>
import postsService from '../services/posts.service'

export default {
    data () {
        return {
            newsText: 'News Component !!!',
            news: []
        }
    },

    methods: {

    },

    mounted () {
        postsService.getPosts()
            .then(response => {
                this.news = response.data.data.results
            })
            .catch(error => console.log(error))
    }
}

</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
</style>
