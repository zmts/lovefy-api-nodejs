<template>
    <div class="new-post">
        <div>{{ sectionTitle }}</div>
        <md-tabs md-fixed class="md-transparent">
            <md-tab md-label="Content">
                <div class="post-input">
                    <md-input-container>
                        <label>Title</label>
                        <md-input maxlength="150" v-model="model.title" required></md-input>
                    </md-input-container>

                    <md-input-container>
                        <label>Description</label>
                        <md-textarea maxlength="500" v-model="model.description" required></md-textarea>
                    </md-input-container>

                    <md-switch v-model="model.private" name="my-test1" class="md-primary">Private</md-switch>

                    <quill
                        v-model="content"
                        :config="editorConfig"
                    ></quill>


                    <div class="buttons">
                        <md-button class="md-raised" @click="getContent()">log content</md-button>
                        <md-button class="md-raised" @click="createUpdatePost()">{{ buttonTitle }}</md-button>
                        <router-link tag="md-button" :to="{ path: '/profile/posts' }" class="md-raised">Cancel</router-link>
                    </div>
                    <div>{{model.test.lol}}</div>
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
                    <md-button class="md-raised" :enabled="disabledEditStatus">Upload</md-button>
                </div>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
    import postsService from '../services/posts.service'
    export default {
        data () {
            return {
                content: [],
                model: {
                    id: null,
                    user_id: this.$store.state.userData.id,
                    title: '',
                    description: '',
                    private: true
                },
                tagsList: ['news'],
                postPicture: '',

                editorConfig: {
                    modules: {
                        toolbar: [
                            ['bold', 'underline', 'italic'],
                            [{header: [1, 2, false]}],
                            ['image', 'video', 'code-block', 'blockquote', 'link']
                        ]
                    },
                    placeholder: 'Whats here...',
                    theme: 'snow'  // 'snow' or 'bubble'
                }
            }
        },

        computed: {

            updateModel () {
                return {
                    user_id: this.model.user_id,
                    title: this.model.title,
                    description: this.model.description,
                    private: this.model.private,
                    content: this.model.content
                }
            },

            sectionTitle () {
                return this.model.id ? 'Edit item' : 'New post'
            },

            buttonTitle () {
                return this.model.id ? 'Update' : 'Post new'
            },

            /**
             * if new item return true, else false
             */
            disabledEditStatus () {
                return !this.model.id
            }
        },

        created () {
            if (this.$route.params.id) {
                this.getPostById()
                console.log('created', this.model)
            }
        },

        methods: {
            getContent () {
                console.log(this.content)
            },

            getPostById () {
                return postsService.getPostById(this.$route.params.id)
                    .then(post => {
                        this.model = post.data.data
                        this.model.id = post.data.data.id
                        this.content = JSON.parse(post.data.data.content)
                        console.log('test!!!!', this.model.test = {lol: 'aaaaa'})
                    }).catch(error => {
                        console.log(error)
                    })
            },

            createUpdatePost () {
                this.model.id ? this.updatePost() : this.createPost()
            },

            createPost () {
                postsService.createPost({...this.model, content: JSON.stringify(this.model.content.ops)})
                    .then(response => {
                        // update current model/data TODO
                        this.model.id = response.data.data.id
                    })
                    .catch(error => {
                        // show error message(popup/toast/alert) TODO
                        console.log(error)
                    })
            },

            updatePost () {
                postsService.updatePost(this.model.id, {...this.model, content: JSON.stringify(this.model.content)})
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => {
                        // show error message(popup/toast/alert) TODO
                        console.log(error)
                    })
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
