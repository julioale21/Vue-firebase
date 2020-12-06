<template>
  <article class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
                <!-- Login form -->
                <template v-if="action === 'login'">
                    <h1 class="title has-text-centered">Login</h1>
                    <form @submit.prevent="doLogin">
                        <div class="field">
                            <label class="label">Email</label>
                            <p class="control has-icons-left has-icons-right">
                                <input 
                                    v-model="userData.email"
                                    class="input" 
                                    type="email" 
                                    placeholder="E.g. correo@correo.com"
                                    required
                                    >
                                <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                </span>
                            </p>
                        </div>

                        <div class="field">
                            <label class="label">Password</label>
                            <p class="control has-icons-left">
                                <input 
                                    v-model="userData.password"
                                    class="input" 
                                    type="password" 
                                    placeholder="Password"
                                    required
                                >
                                <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                                </span>
                            </p>
                        </div>

                        <div class="field has-text-right">
                            <div class="control">
                                <button 
                                    type="submit"
                                    class="button is-primary"
                                    :class="{ 'is-loading': isLoading }"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                        <a href="#" @click="action = 'register'" class="is-block">Don't have an account?</a>
                        <a href="#" @click="action = 'reset'">Forgot your password?</a>
                    </form>
                </template>  

                <!-- Register form -->
                <template v-if="action === 'register'">
                    <h1 class="title has-text-centered">Register</h1>
                    <form @submit.prevent="doRegister">
                        <div class="field">
                            <label class="label">Name</label>
                            <p class="control has-icons-left">
                                <input
                                    v-model="userData.name" 
                                    class="input"
                                    type="text"
                                    placeholder="Nombre"
                                    required
                                >
                                <span class="icon is-small is-left">
                                    <i class="fas fa-user"></i>
                                </span>
                            </p>
                        </div>

                        <div class="field">
                            <label class="label">Email</label>
                            <p class="control has-icons-left">
                                <input 
                                    v-model="userData.email"
                                    class="input" 
                                    type="email" 
                                    placeholder="E.g. correo@correo.com"
                                    required
                                >
                                <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                </span>
                            </p>
                        </div>

                        <div class="field">
                            <label class="label">Password</label>
                            <p class="control has-icons-left">
                                <input 
                                    v-model="userData.password"
                                    class="input" 
                                    type="password" 
                                    placeholder="Password"
                                    required
                                >
                                <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                                </span>
                            </p>
                        </div>

                        <div class="field has-text-right">
                            <div class="control">
                                <button 
                                    type="submit"
                                    class="button is-primary"
                                    :class="{ 'is-loading': isLoading }"
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        <a href="#" @click="action = 'login'">Want to login?</a>
                    </form>
                </template> 

                <!-- Reset password form --> 
                <template v-if="action === 'reset'">
                    <h1 class="title has-text-centered">Reset Password</h1>
                    <form @submit.prevent="doReset">
                        <div class="field">
                            <label class="label">Email</label>
                            <p class="control has-icons-left has-icons-right">
                                <input 
                                    v-model="userData.email"
                                    class="input" 
                                    type="email" 
                                    placeholder="E.g. correo@correo.com"
                                    required
                                    >
                                <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                </span>
                            </p>
                        </div>

                        <div class="field has-text-right">
                            <div class="control">
                                <button 
                                    type="submit"
                                    class="button is-primary"
                                    :class="{ 'is-loading': isLoading }"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                        <a href="#" @click="action = 'register'">Don't have an account?</a>
                    </form>
                </template> 
            </div>
        </div>
    </div>
  </article>
</template>

<script>
import { mapActions } from "vuex";
export default {
    name: 'AuthView',
    data() {
        return {
            action: 'login',
            isLoading: false,
            userData: {
                name: '',
                email: '',
                password: '' 
            }
        };
    },
    methods: {
        ...mapActions('user', ['doLoginAction', 'doRegisterAction', 'doResetAction']),
        resData() {
            this.userData.name = '',
            this.userData.email = '',
            this.userData.password = ''
        },
        redirect() {
            this.$router.push({ name: 'rooms' });
        },
        async doRegister() {
            this.isLoading = true;
            try {
                await this.doRegisterAction({
                    name: this.userData.name,
                    email: this.userData.email,
                    password: this.userData.password
                });
                this.$toast.success('New Account created');
                this.resData();
                this.redirect();
            } catch (error) {
                this.$toast.error(error.message);
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        },
        async doLogin() {
            this.isLoading = true;
            try {
                await this.doLoginAction({
                    email: this.userData.email,
                    password: this.userData.password
                });
                this.$toast.success('Logged in');
                this.resData();
                this.redirect();
            } catch (error) {
                this.$toast.error(error.message);
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        },
        async doReset() {
            this.isLoading = true;

            try {
                await this.doResetAction(this.userData.email);
                this.$toast.success(
                    `Check ${this.userData.email} for further instructions`
                );
                this.resData();
            } catch (error) {
                console.log(error.message);
                this.$toast.error(error.message);
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>
