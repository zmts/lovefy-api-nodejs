<template>
    <div class="settings">
        settings
        <div>{{ role }}</div>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: 'Settings',
        data () {
            return {
                dateTime: `${moment().format('MM DD YYYY ')} at ${moment().format('hh:mm')}`
            }
        },

        computed: {
            role () {
                return this.$store.state.userData.userRole
            }
        },

        mounted () {
            console.log(this.$store.state.userData)
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/style";
    .settings {
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 20px;
        z-index: 1;
        flex-grow: 1;
    }
</style>
