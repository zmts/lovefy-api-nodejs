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

<style lang="scss">

</style>
