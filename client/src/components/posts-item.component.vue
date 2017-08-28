<template>
    <div class="posts-item">
        <div>item title: {{ postItem.title }} </div>
        <div>item id: {{ postItem.id }} </div>
        <div>item content: {{ postItem.content }} </div>
        <div v-if="postItem.tags && postItem.tags.length">item tags: {{ postItem.tags }} </div>
        <div v-if="postItem.comments && postItem.comments.length">item comments: {{ postItem.comments }} </div>
    </div>
</template>

<script>
    import postsService from '@/services/posts.service'
    export default {
        data () {
            return {
                postItem: {}
            }
        },

        created () {
            postsService.getPostById(this.$route.params.id)
                .then(post => {
                    this.postItem = post.data.data
                    console.log(this.postItem.comments.length)
                }).catch(error => {
                    console.log(error)
                })
        }
    }
</script>

<style scoped>
    .posts-item{
        min-height: 500px;
        width: 100%;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 20px;
        z-index: 1;
    }
</style>
