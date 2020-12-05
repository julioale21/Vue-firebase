<template>
    <nav class="navbar" role="navigation" aria-label="main navigation"> 
        <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io">
                <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
            </a>

            <a 
                @click.prevent="toggleNavBar"
                role="button" 
                class="navbar-burger burger" 
                aria-label="menu" 
                aria-expanded="false" 
                data-target="navBar"
                ref="burger"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navBar" class="navbar-menu" ref="navBar">
            <div class="navbar-start">
                <router-link class="navbar-item" to="/">
                    Home
                </router-link>

                <router-link class="navbar-item" to="/">
                    Create Room
                </router-link>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <template v-if="user">
                            <router-link class="button is-primary" to="/">
                                <strong>Profile</strong>
                            </router-link>

                            <a @click="doLogout" class="button is-light">
                                Log out
                            </a>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    name: 'NavBarComponent',
    mounted() {
        this.burger = this.$refs.burger;
        this.navBar = this.$refs.navBar;
    },
    data() {
        return {
            burger: null,
            navBar: null
        }
    },
    computed: {
        ...mapState('user', ['user'])
    },
    methods: {
        ...mapActions('user', ['doLogoutAction']),
        toggleNavBar() {
            this.burger.classList.toggle('is-active');
            this.navBar.classList.toggle('is-active')
        },
        async doLogout() {
            try {
                await this.doLogoutAction();
                this.$toast.success('Logged out');
                this.$router.push({ name: 'auth' });
            } catch (error) {
                this.$toast.error(error.message);
                console.log(error);
            }
        }
    }
    
}
</script>

