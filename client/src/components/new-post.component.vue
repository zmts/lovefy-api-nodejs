<template>
    <div class="new-post">
        <div>New post</div>
        <div class="post-input">
            <md-input-container>
                <label>Title</label>
                <md-input maxlength="150" required></md-input>
            </md-input-container>

            <md-input-container>
                <label>Description</label>
                <md-textarea maxlength="500" required></md-textarea>
            </md-input-container>

            <md-input-container>
                <label>Picture</label>
                <md-file v-model="postPicture" accept="image/*" required></md-file>
            </md-input-container>

            <md-chips v-model="tagsList" md-input-placeholder="Add a tag"></md-chips>

            <md-input-container>
                <label>Content</label>
                <md-textarea maxlength="5000" required></md-textarea>
            </md-input-container>

            <md-switch v-model="postPrivate" name="my-test1" class="md-primary">Private</md-switch>

            <div class="buttons">
                <md-button class="md-raised">Post/Save</md-button>
                <router-link tag="md-button" :to="{ path: '/profile/posts' }" class="md-raised">Cancel</router-link>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                currentYear: new Date().getFullYear(),
                postPicture: '',
                tagsList: ['news'],
                postPrivate: false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .new-post{
        min-height: 500px;
        width: 100%;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 20px;
        z-index: 1;

        .post-input {
            font-size: 14px;
            border-radius: 5px;

            textarea {
                font-size: 14px;
            }
        }

        .buttons{
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
