<template>
    <transition name="overlay-fade">
        <div class="login-modal" v-if="visible">
            <div class="main">
                <div class="header">Вход</div>
                <div class="content">
                    <v-text-field v-model="email" name="email" label="E-mail" required></v-text-field>
                    <v-text-field v-model="password" @keyup.enter.native="makeLogin()" type="password" name="password" label="Пароль" required></v-text-field>
                </div>
                <div class="buttons">
                    <v-btn outline @click.native="makeLogin()">вход</v-btn>
                    <v-btn outline @click.native="close()">отмена</v-btn>
                </div>

                <div class="error" v-if="error">
                    {{ error }}
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import authService from '../services/auth.service'

    export default {
        data () {
            return {
                email: '',
                password: '',
                visible: false,
                error: ''
            }
        },

        methods: {
            open () {
                this.visible = true
            },

            close () {
                this.visible = false
                this.email = ''
                this.password = ''
                this.error = ''
            },

            makeLogin () {
                authService.makeLogin({
                    email: this.email,
                    password: this.password
                }).then(res => {
//                    console.log(res)
                    this.error = ''
                    localStorage.setItem('refreshToken', res.data.refreshToken)
                    localStorage.setItem('accessToken', res.data.accessToken)
                    this.close()
                }).catch((error) => {
//                    console.log(error.response)
                    this.error = error.response.data.description.status === 404 ? 'Пользователь с таким email не найден' : error.response.data.description.message
                })
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-modal {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, .5);
        z-index: 100;

        .main{
            padding: 30px 15px;
            background: #fff;
            width: 400px;
            border-radius: 2px;
            box-shadow: 0 11px 15px -7px rgba(0, 0, 0, .2),
                        0 24px 38px 3px rgba(0, 0, 0, .14),
                        0 9px 46px 8px rgba(0, 0, 0, .12);

            .header{
                text-align: center;
            }

            .buttons{
                display: flex;
                justify-content: flex-end;
            }

            .error {
                padding: 10px;
                font-size: 12px;
                opacity: 1;
                transition: all 0.5s;
            }
        }
    }

    .overlay-fade-enter-active, .overlay-fade-leave-active {
        transition: all .2s;
    }
    .overlay-fade-enter, .overlay-fade-leave-active {
        opacity: 0;
        padding-top: 20px;
    }

</style>
