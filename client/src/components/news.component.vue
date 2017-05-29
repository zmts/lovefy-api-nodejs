<template>
    <div>
        <h1>{{ newsText }}</h1>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                newsText: 'newsText Hello !!!'
            }
        }
    }
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
</style>
