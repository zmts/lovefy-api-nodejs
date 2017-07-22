<template>
    <div class="feed">
        <div class="post-input">
            <md-input-container>
                <label>What's here ...</label>
                <md-textarea maxlength="1000"></md-textarea>
            </md-input-container>
        </div>

        <div class="posts-list">
            <div class="item" v-for="item in posts">
                <div class="item-header">
                    <div class="info">
                        <div class="title">
                            <router-link :to="{ path: '/profile/posts/' + item.id }">{{ item.title }}</router-link>
                        </div>

                        <div class="date-time">
                            {{ `${moment(item.created_at).format('MMM DD YYYY ')} at ${moment(item.created_at).format('hh:mm')}` }}
                            </div>
                        </div>

                        <md-menu md-direction="bottom left">
                            <md-button class="md-icon-button" md-menu-trigger>
                                <md-icon>more_vert</md-icon>
                            </md-button>
                            <md-menu-content>
                                <md-menu-item class="menux">Edit</md-menu-item>
                                <md-menu-item class="menux">Remove</md-menu-item>
                            </md-menu-content>
                        </md-menu>
                </div>
                <div class="item-content">
                    {{ item.content }}
                </div>
                <div class="item-footer">
                    Комментратии: 0
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import userService from '../services/user.service'

    export default {
        data () {
            return {
                moment,
                posts: []
            }
        },

        mounted () {
            userService.getPostsByUserId(this.$store.state.userData.id)
                .then(response => {
                    this.posts = response.data.data
                }).catch(error => {
                    console.log(error)
                })
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/style";

    .feed {
        min-height: 500px;
        width: 100%;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 20px;
        z-index: 1;

        .post-input {
            font-size: 14px;
            border-radius: 5px;
            padding-bottom: 10px;

            textarea {
                font-size: 14px;
                padding-top: 20px;
            }
        }

        .posts-list {
            .item {
                margin: 20px 0;
                background-color: #fff;
                border-radius: 5px;
                border: 1px solid $color-line;
                padding: 0 20px;

                &-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 0;
                    border-bottom: 1px solid $color-line;

                    .title {
                        font-size: 15px;
                        font-weight: 600;
                        padding-bottom: 10px;
                    }

                    .date-time {
                        font-size: 12px;
                        color: $color-font-dim;
                    }

                    .md-button {
                        color: $color-font-dim;
                    }
                }

                &-content {
                    padding: 20px 0;
                    line-height: 20px;
                    font-size: 15px;
                    color: $color-font-main;
                }

                &-footer {
                    padding: 20px 0;
                    border-top: 1px solid $color-line;
                    font-size: 12px;
                    color: $color-font-dim;
                }
            }
        }
    }
</style>
