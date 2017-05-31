<template>
    <div class="header">
        <div class="wrapper">
            <ul class="menu sub">
                <li>login</li>
                <li>profile</li>
            </ul>
            <ul class="menu">
                <li><router-link :to="{ name: 'index' }" exact>Home</router-link></li>
                <li><router-link :to="{ name: 'news' }">News</router-link></li>
            </ul>
        </div>

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
