<template>
    <div class="wrapper">

        <div class="profile">
            <div>User name: {{ profile.name }}</div>
            <div><img class="avatar" :src="profile._avatar" alt=""></div>
        </div>

        <div class="feed">
            <div class="post-input">
                <input type="text" placeholder="text me...">
            </div>
            <div class="app-list">
                <div class="item">
                    posts list
                </div>
                <div class="item">
                    posts list
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import userService from '../services/user.service'

    export default {
        data () {
            return {
                profile: {}
            }
        },

        mounted () {
            userService.getCurrentUser()
                .then(response => {
                    this.profile = response.data.data
                }).catch(error => {
                    console.log(error)
                })
        }
    }
</script>

<style lang="scss" scoped>
    .wrapper {
        display: flex;
    }

    .profile {
        /*display: flex;*/
    }

    .feed {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        flex-direction: column;


        .post-input{
            text-align: center;

            input {
                width: 100%;
                margin: 0 25px;
                border: 1px solid #ccc;
                padding: 15px;
                outline: none;
            }
        }

        .app-list{
            .item{
                padding: 15px;
            }
        }
    }

    .avatar {
        width: 300px;
        height: 280px;
        padding: 30px;
        border: 1px solid #ccc;
        margin: 30px 0;
    }

</style>
