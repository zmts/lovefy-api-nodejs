<template>
    <div class="new-post">
        <div>New post</div>
        <md-tabs md-fixed class="md-transparent">
            <md-tab md-label="Content">
                <div class="post-input">
                    <md-input-container>
                        <label>Title</label>
                        <md-input maxlength="150" v-model="title" required></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Description</label>
                        <md-textarea maxlength="500" v-model="description" required></md-textarea>
                    </md-input-container>

                    <md-switch v-model="postPrivate" name="my-test1" class="md-primary">Private</md-switch>

                    <div class="editor-container"></div>

                    <div class="buttons">
                        <md-button class="md-raised" @click="saveUpdate()">Post/Save</md-button>
                        <router-link tag="md-button" :to="{ path: '/profile/posts' }" class="md-raised">Cancel</router-link>
                    </div>
                </div>
            </md-tab>

            <md-tab md-label="Details">
                <md-chips v-model="tagsList"
                          md-input-placeholder="Add a tag"
                          :disabled="disabledEditStatus"
                ></md-chips>

                <md-input-container>
                    <label>Picture</label>
                    <md-file v-model="postPicture"
                             accept="image/*"
                             required
                             :disabled="disabledEditStatus"
                    ></md-file>
                </md-input-container>

                <div class="buttons">
                    <md-button class="md-raised" :disabled="disabledEditStatus">Upload</md-button>
                </div>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
    import Quill from 'quill'
    export default {
        data () {
            return {
                title: '',
                description: '',
                tagsList: ['news'],
                postPrivate: true,
                postPicture: '',
                disabledEditStatus: true
            }
        },

        computed: {
            postData () {
                return {
                    title: this.title,
                    content: JSON.stringify(this.editor.getContents()),
                    description: this.description,
                    private: this.postPrivate
                }
            }
        },

        mounted () {
            /* eslint-disable no-new */
            this.editor = new Quill('.editor-container', {
                modules: {
                    toolbar: [
                        [{header: [1, 2, false]}],
                        ['bold', 'italic', 'underline'],
                        ['image', 'video', 'code-block', 'blockquote', 'link']
                    ]
                },
                placeholder: 'Compose an epic...',
                theme: 'snow'  // 'snow' or 'bubble'
            })
        },

        methods: {
            saveUpdate () {
//                return console.log(this.editor.getContents())
                return console.log(this.postData)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .new-post{
        padding: 20px;
        /*min-height: 500px;*/
        width: 100%;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.5);
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
