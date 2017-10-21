<script>
    export default {
        name: 'CurentUserMixin',
        computed: {
            $curentUser () {
                return {
                    id: this.$store.state.userData.id,
                    name: this.$store.state.userData.name,
                    role: this.$store.state.userData.role,
                    email: this.$store.state.userData.email
                }
            }
        }
    }
</script>
