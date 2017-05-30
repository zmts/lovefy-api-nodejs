<template>

<div id="app">
    <app-header></app-header>
        <router-view></router-view>
    <app-footer></app-footer>
</div>

</template>

<script>

import AppHeader from '@/components/header.component'
import AppFooter from '@/components/footer.component'

export default {
    components: {
        AppHeader,
        AppFooter
    }
}

</script>

<style>

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.is-active{
    border-radius: 5px;
    border: 3px solid #bebebe;
    padding: 5px 15px;
}

</style>
