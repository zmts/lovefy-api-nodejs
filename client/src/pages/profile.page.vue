<template>
    <div class="profile-container">
        <div class="profile">
            <div class="avatar">
                <img :src="profile._avatar" alt="">
            </div>

            <div class="user-info">
                <div class="name mixin">
                    {{ profile.name }}
                </div>
                <div class="description mixin">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto et ex, porro veritatis voluptas voluptatibus.
                </div>
            </div>

            <div class="user-menu">
                <ul>
                    <li v-if="profile.role === 'editor'">
                        <router-link :to="{ path: '/profile/posts' }">
                            <span>Мои посты</span>
                            <span class="add-item-button">
                                    <router-link :to="{ path: '/profile/posts/new' }">+</router-link>
                                </span>
                        </router-link>
                    </li>
                    <li v-if="profile.role === 'editor'">
                        <router-link :to="{ path: '/profile/albums' }">
                            <span>Мои альбомы</span>
                            <span class="add-item-button">
                                    <router-link :to="{ path: '/profile/albums/new' }">+</router-link>
                                </span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ path: '/profile/settings' }">Настройки</router-link>
                    </li>
                </ul>
            </div>
        </div>

        <!-- render router-view only if userData in store -->
        <router-view v-if="this.$store.state.userData.id"></router-view>

    </div>
</template>

<script>
    export default {
        data () {
            return {
                //
            }
        },

        computed: {
            profile () {
                return this.$store.state.userData
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/style";

    .is-active{
        background-color: #e8e8e8;
    }

    .profile-container {
        display: flex;
        padding-bottom: 25px;

        .profile {
            flex-basis: 300px;
            min-width: 300px;
            margin-right: 10px;

            .avatar {
                width: 800px;
                height: 400px;
                position: relative;

                img{
                    border-radius: 50%;
                    position: absolute;
                    top: -200px;
                    left: -250px;
                    width: 800px;
                    height: 800px;
                }
            }

            .user-info{
                position: relative;
                /*z-index: 10;*/

                .mixin{
                    margin: 5px 0;
                    border-radius: 5px;
                    padding: 10px;
                    background-color: rgba(255,255,255,0.5);
                }

                .name{
                    font-size: 25px;
                    text-transform: uppercase;
                }

                .description{
                    font-size: 14px;
                    line-height: 18px;
                }
            }

            .user-menu{
                position: relative;
                z-index: 1;
                border-radius: 5px;
                border: 1px solid $color-line;
                background-color: rgba(255,255,255,0.95);
                padding: 10px 0;

                ul > li{
                    font-size: 15px;
                    line-height: 30px;
                    position: relative;

                    a {
                        color: $color-font-main;
                        display: block;
                        text-decoration: none;
                        padding: 0 10px;

                        &:hover{
                            background-color: #e8e8e8;
                        }

                        .add-item-button{
                            position: absolute;
                            right: 5px;
                            transition: all 0.2s;

                            &:hover{
                                font-size: 25px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
