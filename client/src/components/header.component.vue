<template>
    <div>
        <h1>Menu</h1>
        <router-link :to="{ name: 'index' }" exact>Home</router-link>
        <router-link :to="{ name: 'news' }">News</router-link>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                someVar: ''
            }
        }
    }
</script>

<style scoped>

</style>
