<template>
    <div class="feed">
        <div class="post-input">
            <md-input-container>
                <label>What's here ...</label>
                <md-textarea maxlength="1000"></md-textarea>
            </md-input-container>
        </div>

        <div class="posts-list">
            <div class="item">
                <div class="item-header">
                    <div class="info">
                        <div class="title">
                            Title lorem ipsum dolor
                        </div>

                        <div class="date-time">
                            {{ dateTime }}
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
                    Content Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, blanditiis cupiditate dolor eaque eum fugit id nobis provident quae quasi soluta tempore! Ab, ad asperiores, atque deleniti dolorum error explicabo facere id impedit laboriosam nam nesciunt porro provident quas sapiente sunt temporibus vero! Commodi corporis laborum natus officiis temporibus ut.
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

    export default {
        data () {
            return {
                dateTime: `${moment().format('MMM DD YYYY ')} at ${moment().format('hh:mm')}`

            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/style";

    .feed {
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
