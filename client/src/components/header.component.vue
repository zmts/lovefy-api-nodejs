<template>
    <div class="header">
        <app-login ref="appLoginModal"></app-login>

        <div class="wrapper">
            <ul class="menu sub">
                <li @click="$refs.appLoginModal.open()">login</li>
                <li><router-link :to="{ name: 'profile' }">profile</router-link></li>
            </ul>
            <ul class="menu">
                <li><router-link :to="{ name: 'index' }" exact>Home</router-link></li>
                <li><router-link :to="{ name: 'news' }">News</router-link></li>
            </ul>
        </div>

    </div>

</template>

<script>
    import AppLogin from '@/components/login.component'

    export default {
        components: {
            AppLogin
        },

        created () {
        //
        }
    }
</script>

<style lang="scss" scoped>

    .header {

        .menu {
            display: flex;
            justify-content: center;

            li{
                padding: 15px;

            }

            &.sub{
                justify-content: flex-end;

            }
        }
    }

</style>
