<template>
    <div class="wrapper profile-container">
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
                    <li><router-link :to="{ path: '/profile/posts' }">Мои посты</router-link></li>
                    <li><router-link :to="{ path: '/profile/albums' }">Мои Альбомы</router-link></li>
                    <li><router-link :to="{ path: '/profile/settings' }">Настройки</router-link></li>
                </ul>
            </div>
        </div>

        <router-view></router-view>

    </div>
</template>

<script>
    import userService from '../services/user.service'

    export default {
        data () {
            return {
                profile: {},
                posts: []
            }
        },

        mounted () {
            userService.getCurrentUser()
                .then(response => {
                    this.profile = response.data.data
                    // add to $store.state.userData >> email, desc
                }).catch(error => {
                    console.log(error)
                })
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
                z-index: 10;

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

                    a {
                        color: $color-font-main;
                        display: block;
                        text-decoration: none;
                        padding: 0 10px;

                        &:hover{
                            background-color: #e8e8e8;
                        }

                    }
                }
            }
        }
    }
</style>
