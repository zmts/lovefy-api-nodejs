<template>
    <div class="posts-item">
        <h1>item {{ post_id }} </h1>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                post_id: this.$route.params.id
            }
        },

        mounted () {
            console.log(this.$route.params.id)
            // get item by $route.params.id
        }
    }
</script>

<style scoped>
    .posts-item{
        z-index: 1;
    }
</style>
