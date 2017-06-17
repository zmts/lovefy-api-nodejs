<template>
    <div class="wrapper">
        <h2>profile of user >> {{ userName }}</h2>
    </div>
</template>

<script>
    import userService from '../services/user.service'

    export default {
        data () {
            return {
                userName: ''
            }
        },

        mounted () {
            userService.getUser(200)
                .then(response => {
//                    console.log(response.data)
                    this.userName = response.data.data.name
                }).catch(error => {
                    console.log(error)
                })
        }
    }
</script>

<style lang="scss" scoped>

</style>
