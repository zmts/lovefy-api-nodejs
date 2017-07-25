<template>
    <div class="header wrapper">
        <div class="menu-wrapper">
            <ul class="menu">
                <li><router-link :to="{ path: '/' }" exact>Главная</router-link></li>
                <li><router-link :to="{ path: '/news' }">Новости</router-link></li>
                <li><router-link :to="{ path: '/photo' }">Фото</router-link></li>
                <li><router-link :to="{ path: '/video' }">Видео</router-link></li>
            </ul>
            <ul class="menu side">
                <li><router-link :to="{ path: '/login' }">login</router-link></li>
                <li><router-link :to="{ path: '/profile' }">profile</router-link></li>
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
        z-index: 1;
        padding: 20px 0;
        position: relative;

        .is-active{
            color: #e01b3c;
        }

        a {
            color: #000;
            text-decoration: none;
        }

        .menu-wrapper{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .menu {
            font-size: 25px;
            text-transform: uppercase;
            display: flex;
            justify-content: center;

            li{
                padding: 15px;

            }

            &.side{
                font-size: 15px;
            }
        }

    }

</style>
