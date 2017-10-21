<template>

<div id="app">
    <app-header></app-header>
        <div class="wrapper">
            <router-view></router-view>
        </div>
    <app-footer></app-footer>
</div>

</template>

<script>

import AppHeader from '@/components/header.component'
import AppFooter from '@/components/footer.component'

export default {
    name: 'AppLayout',
    components: {
        AppHeader,
        AppFooter
    }
}

</script>

<style lang="scss">

</style>
